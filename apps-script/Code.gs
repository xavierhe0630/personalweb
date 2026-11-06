/**
 * 预约后台（Google Apps Script + Google Sheets）
 * 用法见 README.md。首次使用：粘贴本文件 → 运行 setup → 部署为 Web App。
 */
const TZ = 'America/New_York';  // 你设置时间所用的时区
const LEAD_HOURS = 12;          // 至少提前多少小时才能预约
const NOTIFY_EMAIL = '';        // 新预约通知发到哪个邮箱；留空则发到你的 Google 账号邮箱
const SHEETS = { services: 'Services', avail: 'Availability', bookings: 'Bookings' };
const BOOKING_HEADERS = ['id', 'created', 'slot', 'start_boston', 'service', 'minutes', 'price_usd', 'price_cny',
  'name', 'contact_type', 'contact', 'question', 'pay_method', 'lang', 'visitor_tz', 'status'];

/* ---------- 首次运行：建表 ---------- */
function setup() {
  const ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(TZ);

  const sv = sheet_(ss, SHEETS.services, ['key', 'name_zh', 'name_en', 'mode', 'minutes', 'durations', 'price_usd', 'price_cny', 'desc_zh', 'desc_en', 'active']);
  if (sv.getLastRow() < 2) {
    sv.getRange(2, 1, 3, 11).setValues([
      ['yijing', '易经问卜', 'I Ching reading', 'session', 45, '', 40, 288, '一事一卦', 'One question, one hexagram', 'TRUE'],
      ['tarot', '塔罗梳理', 'Tarot planning', 'duration', 30, '30,60,90', 25, 168, '梳理思路与规划', 'Sort out your thinking and plan', 'TRUE'],
      ['both', '易经 + 塔罗', 'I Ching + Tarot', 'session', 90, '', 70, 488, '两种方式同时进行', 'Both in one session', 'TRUE']
    ]);
  }

  const av = sheet_(ss, SHEETS.avail, ['date', 'start', 'minutes', 'spots', 'services', 'note']);
  av.getRange('A:B').setNumberFormat('@'); // 日期和时间按纯文本保存，避免格式混乱
  if (av.getLastRow() < 2) {
    const d1 = new Date(Date.now() + 3 * 864e5), d2 = new Date(Date.now() + 4 * 864e5);
    av.getRange(2, 1, 3, 6).setValues([
      [Utilities.formatDate(d1, TZ, 'yyyy-MM-dd'), '19:30', 90, 1, '', '示例：可以删掉'],
      [Utilities.formatDate(d2, TZ, 'yyyy-MM-dd'), '10:00', 60, 1, 'yijing,tarot', '示例：这个时段只开放单项'],
      [Utilities.formatDate(d2, TZ, 'yyyy-MM-dd'), '20:00', 90, 2, '', '示例：可约 2 位']
    ]);
  }

  const bk = sheet_(ss, SHEETS.bookings, BOOKING_HEADERS);
  const statusCol = BOOKING_HEADERS.indexOf('status') + 1;
  bk.getRange(2, statusCol, 1000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['待付款', '已确认', '已完成', '已取消'], true).build());

  // 触发一次授权（发邮件需要）
  MailApp.getRemainingDailyQuota();
}

function sheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

/* ---------- 网站接口 ---------- */
function doGet() {
  try { return out_(publicData_()); }
  catch (err) { return out_({ ok: false, error: 'server' }); }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (req.website) return out_({ ok: true, id: 'OK' }); // 垃圾提交（机器人填了隐藏字段），直接忽略
    lock.waitLock(15000);
    return out_(book_(req));
  } catch (err) {
    return out_({ ok: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- 读取表格 ---------- */
function table_(name) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const vals = sh.getDataRange().getDisplayValues();
  const head = vals.shift().map(function (h) { return String(h).trim().toLowerCase(); });
  return vals
    .filter(function (r) { return r.some(function (c) { return String(c).trim() !== ''; }); })
    .map(function (r) { const o = {}; head.forEach(function (h, i) { o[h] = String(r[i]).trim(); }); return o; });
}

function num_(v) { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; }
function pad_(n) { return ('0' + n).slice(-2); }

function services_() {
  return table_(SHEETS.services)
    .filter(function (s) { return s.key && !/^(false|no|否|0)$/i.test(s.active || ''); })
    .map(function (s) {
      return {
        key: s.key, name_zh: s.name_zh, name_en: s.name_en, desc_zh: s.desc_zh || '', desc_en: s.desc_en || '',
        mode: /duration|时长/i.test(s.mode) ? 'duration' : 'session',
        minutes: num_(s.minutes) || 60,
        durations: String(s.durations || '').split(/[,，\s]+/).map(num_).filter(function (n) { return n > 0; }),
        price_usd: num_(s.price_usd), price_cny: num_(s.price_cny)
      };
    });
}

// 支持 2026-11-20 / 2026/11/20 / 11/20/2026；时间支持 19:30 / 7:30 PM / 下午7:30
function parseStart_(dateStr, timeStr) {
  let y, m, d, mt = String(dateStr).match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
  if (mt) { y = +mt[1]; m = +mt[2]; d = +mt[3]; }
  else { mt = String(dateStr).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); if (!mt) return null; m = +mt[1]; d = +mt[2]; y = +mt[3]; }
  const tm = String(timeStr).match(/(上午|下午)?\s*(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (!tm) return null;
  let h = +tm[2]; const mi = +tm[3]; const ap = ((tm[1] || '') + (tm[4] || '')).toLowerCase();
  if (/pm|下午/.test(ap) && h < 12) h += 12;
  if (/am|上午/.test(ap) && h === 12) h = 0;
  const label = y + '-' + pad_(m) + '-' + pad_(d) + ' ' + pad_(h) + ':' + pad_(mi);
  return { key: y + '-' + pad_(m) + '-' + pad_(d) + '_' + pad_(h) + pad_(mi), label: label, date: Utilities.parseDate(label, TZ, 'yyyy-MM-dd HH:mm') };
}

function slots_() {
  const used = {};
  table_(SHEETS.bookings).forEach(function (b) {
    if (b.slot && !/cancel|取消/i.test(b.status || '')) used[b.slot] = (used[b.slot] || 0) + 1;
  });
  const earliest = Date.now() + LEAD_HOURS * 3600e3;
  const list = [];
  table_(SHEETS.avail).forEach(function (a) {
    const p = parseStart_(a.date || '', a.start || '');
    if (!p || p.date.getTime() < earliest) return;
    const spots = num_(a.spots) || 1;
    list.push({
      id: p.key, start: p.date.getTime(), label: p.label, minutes: num_(a.minutes) || 60,
      left: Math.max(0, spots - (used[p.key] || 0)),
      services: String(a.services || '').split(/[,，\s]+/).filter(String)
    });
  });
  return list.sort(function (x, y) { return x.start - y.start; });
}

// 只返回可约时段，不包含任何预约人的信息
function publicData_() {
  return {
    ok: true, tz: TZ, services: services_(),
    slots: slots_().filter(function (s) { return s.left > 0; })
      .map(function (s) { return { id: s.id, start: s.start, minutes: s.minutes, left: s.left, services: s.services }; })
  };
}

/* ---------- 新预约 ---------- */
function clean_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // 防止被表格当作公式
  return s;
}
function round2_(n) { return Math.round(n * 100) / 100; }

function book_(r) {
  const svc = services_().filter(function (s) { return s.key === r.service; })[0];
  if (!svc) return { ok: false, error: 'service' };
  const slot = slots_().filter(function (s) { return s.id === r.slotId; })[0];
  if (!slot) return { ok: false, error: 'slot' };
  if (slot.left < 1) return { ok: false, error: 'full' };
  if (slot.services.length && slot.services.indexOf(svc.key) < 0) return { ok: false, error: 'service' };

  let minutes = svc.minutes, usd = svc.price_usd, cny = svc.price_cny;
  if (svc.mode === 'duration') {
    minutes = num_(r.duration);
    if (!minutes || (svc.durations.length && svc.durations.indexOf(minutes) < 0)) return { ok: false, error: 'duration' };
    const k = minutes / svc.minutes; usd = round2_(usd * k); cny = round2_(cny * k);
  }
  if (minutes > slot.minutes) return { ok: false, error: 'duration' };

  const name = clean_(r.name, 60), contact = clean_(r.contact, 120);
  if (!name || !contact) return { ok: false, error: 'invalid' };
  const pay = ['wechat', 'alipay', 'zelle'].indexOf(r.payMethod) >= 0 ? r.payMethod : '';

  const id = 'YX' + Utilities.formatDate(new Date(), TZ, 'MMdd') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  SpreadsheetApp.getActive().getSheetByName(SHEETS.bookings).appendRow([
    id, new Date(), slot.id, slot.label, svc.key, minutes, usd, cny,
    name, clean_(r.contactType, 20), contact, clean_(r.question, 1000), pay, clean_(r.lang, 5), clean_(r.tz, 60), '待付款'
  ]);

  try {
    MailApp.sendEmail(NOTIFY_EMAIL || Session.getEffectiveUser().getEmail(),
      '新预约 ' + id + '：' + svc.name_zh + ' ' + slot.label,
      ['编号：' + id, '项目：' + svc.name_zh + '（' + minutes + ' 分钟）', '时间（波士顿）：' + slot.label,
        '费用：$' + usd + ' / ¥' + cny + '，付款方式：' + pay,
        '称呼：' + name, '联系方式：' + r.contactType + ' ' + contact, '想问的事：' + (r.question || '（未填）')].join('\n'));
  } catch (_) {}

  return { ok: true, id: id, price_usd: usd, price_cny: cny, minutes: minutes, start: slot.start };
}
