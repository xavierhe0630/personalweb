/** @OnlyCurrentDoc */
/**
 * 预约后台（Google Apps Script + Google Sheets）
 * 用法见 README.md。首次使用：粘贴本文件 → 运行 setup → 部署为 Web App。
 */
const TZ = 'America/New_York';  // 你设置时间所用的时区
const LEAD_HOURS = 12;          // 至少提前多少小时才能预约
const NOTIFY_EMAIL = '';        // 新预约通知发到哪个邮箱；留空则发到你的 Google 账号邮箱
const SHEETS = { services: 'Services', avail: 'Availability', weekly: 'Weekly', closed: 'Closed', bookings: 'Bookings' };
const WEEKS_AHEAD = 4;          // 每周固定时段：自动开放未来几周
// 预约编号：项目代号 → 编号前缀，从 ID_START 开始依次加 1（IC1000、IC1001…）
const ID_PREFIX = { yijing: 'IC', tarot: 'TR', both: 'TI' };
const ID_START = 1000;
// 易经类项目需要访客选择问卜方式（价格不变）；表格里记录中文名称
const METHOD_SERVICES = ['yijing', 'both'];
const METHOD_LABELS = { liuyao: '六爻卜卦', daliuren: '大六壬', meihua: '梅花易数', any: '未指定（由我推荐）' };
const BOOKING_HEADERS = ['id', 'created', 'slot', 'start_boston', 'service', 'method', 'minutes', 'price_usd', 'price_cny',
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

  // 每周固定时段：weekday 写 周一 / Mon / 1（周一=1 … 周日=7），可写多天如「周一,周三,周五」
  const wk = sheet_(ss, SHEETS.weekly, ['weekday', 'start', 'minutes', 'spots', 'services', 'from', 'until', 'note']);
  wk.getRange('A:B').setNumberFormat('@');
  wk.getRange('F:G').setNumberFormat('@');
  // 不开放的时间：只填 date 表示整天不开放；同时填 start 只关掉那一个时段
  const cl = sheet_(ss, SHEETS.closed, ['date', 'start', 'note']);
  cl.getRange('A:B').setNumberFormat('@');

  const bk = sheet_(ss, SHEETS.bookings, BOOKING_HEADERS);
  const bkHead = bk.getRange(1, 1, 1, Math.max(bk.getLastColumn(), 1)).getValues()[0].map(function (h) { return String(h).trim().toLowerCase(); });
  const statusCol = (bkHead.indexOf('status') + 1) || (BOOKING_HEADERS.indexOf('status') + 1);
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
        price_usd: num_(s.price_usd), price_cny: num_(s.price_cny),
        group: s.group || ''   // 同组项目（如三种塔罗牌阵）在网站上合并显示
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

/* ---------- 可预约时段 ---------- */
// 星期解析：周一/星期一/Mon/Monday/1 → 1 … 周日/星期日/星期天/Sun/Sunday/7 → 7
const WEEKDAY_ = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7, '天': 7,
  mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
function weekdays_(v) {
  const out = [];
  String(v || '').split(/[,，、\s]+/).forEach(function (w) {
    w = w.trim().toLowerCase(); if (!w) return;
    let n = /^[1-7]$/.test(w) ? +w : 0;
    if (!n) { const m = w.match(/^(?:周|星期|礼拜)?([一二三四五六日天])$/); if (m) n = WEEKDAY_[m[1]]; }
    if (!n) n = WEEKDAY_[w.slice(0, 3)] || 0;
    if (n && out.indexOf(n) < 0) out.push(n);
  });
  return out;
}
function dayStr_(v) { // 把 from / until 统一成 yyyy-MM-dd 方便比较
  const m = String(v || '').match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
  return m ? m[1] + '-' + pad_(+m[2]) + '-' + pad_(+m[3]) : '';
}
function hhmm_(v) { // 统一成 HH:mm，用于比对 Closed 表
  const p = parseStart_('2000-01-01', v); return p ? p.label.slice(11) : '';
}

// 汇总所有时段来源：Weekly 自动生成未来几周 + Availability 单独添加，再去掉 Closed 里的日期或时段
function rawSlots_() {
  const closedDay = {}, closedSlot = {};
  table_(SHEETS.closed).forEach(function (c) {
    const d = dayStr_(c.date); if (!d) return;
    if (c.start) { const h = hhmm_(c.start); if (h) closedSlot[d + ' ' + h] = true; } else closedDay[d] = true;
  });
  const rows = {};
  const add = function (date, r) {
    const p = parseStart_(date, r.start || ''); if (!p) return;
    const d = p.label.slice(0, 10);
    if (closedDay[d] || closedSlot[p.label]) return;
    rows[p.key] = { p: p, minutes: r.minutes, spots: r.spots, services: r.services };
  };
  // 每周固定：从今天起往后 WEEKS_AHEAD 周
  const weekly = table_(SHEETS.weekly).map(function (w) { w._days = weekdays_(w.weekday); w._from = dayStr_(w.from); w._until = dayStr_(w.until); return w; })
    .filter(function (w) { return w._days.length && w.start; });
  if (weekly.length) {
    const noon = Utilities.parseDate(Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd') + ' 12:00', TZ, 'yyyy-MM-dd HH:mm').getTime();
    for (let i = 0; i < WEEKS_AHEAD * 7; i++) {
      const dt = new Date(noon + i * 864e5);
      const d = Utilities.formatDate(dt, TZ, 'yyyy-MM-dd'), wd = Number(Utilities.formatDate(dt, TZ, 'u'));
      weekly.forEach(function (w) {
        if (w._days.indexOf(wd) < 0) return;
        if (w._from && d < w._from) return;
        if (w._until && d > w._until) return;
        add(d, w);
      });
    }
  }
  // 单独添加的时段（同一时间如果 Weekly 里也有，以这里为准）
  table_(SHEETS.avail).forEach(function (a) { add(a.date || '', a); });
  return Object.keys(rows).map(function (k) { return rows[k]; });
}

function slots_() {
  const used = {};
  table_(SHEETS.bookings).forEach(function (b) {
    if (b.slot && !/cancel|取消/i.test(b.status || '')) used[b.slot] = (used[b.slot] || 0) + 1;
  });
  const earliest = Date.now() + LEAD_HOURS * 3600e3;
  const list = [];
  rawSlots_().forEach(function (r) {
    const p = r.p;
    if (p.date.getTime() < earliest) return;
    const spots = num_(r.spots) || 1;
    list.push({
      id: p.key, start: p.date.getTime(), label: p.label, minutes: num_(r.minutes) || 60,
      left: Math.max(0, spots - (used[p.key] || 0)),
      services: String(r.services || '').split(/[,，\s]+/).filter(String)
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

/* ---------- 预约编号 ---------- */
// 每个前缀单独计数，计数器存在脚本属性里，删掉表格里的行也不会重复使用编号。
// 在预约锁内调用，同时有两个人提交也不会拿到同一个编号。
function nextId_(svcKey) {
  const prefix = ID_PREFIX[svcKey] || 'BK';
  const props = PropertiesService.getScriptProperties();
  const key = 'next_' + prefix;
  let n = Number(props.getProperty(key));
  if (!n) {
    // 第一次使用：从 ID_START 开始，如果表格里已有更大的编号就接着往后排
    n = ID_START;
    const re = new RegExp('^' + prefix + '(\\d+)$');
    table_(SHEETS.bookings).forEach(function (b) {
      const m = String(b.id || '').match(re);
      if (m) n = Math.max(n, Number(m[1]) + 1);
    });
  }
  props.setProperty(key, String(n + 1));
  return prefix + n;
}

// 测试结束后想从头编号：先删掉 Bookings 表里的测试行，再手动运行一次这个函数
function resetIds() {
  const props = PropertiesService.getScriptProperties();
  props.getKeys().forEach(function (k) { if (k.indexOf('next_') === 0) props.deleteProperty(k); });
}

/* ---------- 新预约 ---------- */
// 按表头名称写入一行：旧表格缺少的列（比如新增的 method）会自动加在最右边
function appendBooking_(obj) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.bookings);
  const lastCol = Math.max(sh.getLastColumn(), 1);
  const head = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim().toLowerCase(); });
  Object.keys(obj).forEach(function (k) {
    if (head.indexOf(k) < 0) { head.push(k); sh.getRange(1, head.length).setValue(k).setFontWeight('bold'); }
  });
  sh.appendRow(head.map(function (h) { return obj.hasOwnProperty(h) ? obj[h] : ''; }));
}
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
  if (slot.services.length && slot.services.indexOf(svc.key) < 0 && !(svc.group && slot.services.indexOf(svc.group) >= 0)) return { ok: false, error: 'service' };

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

  let method = '';
  if (METHOD_SERVICES.indexOf(svc.key) >= 0) {
    if (!METHOD_LABELS[r.method]) return { ok: false, error: 'method' };
    method = METHOD_LABELS[r.method];
  }

  const id = nextId_(svc.group || svc.key);
  appendBooking_({
    id: id, created: new Date(), slot: slot.id, start_boston: slot.label, service: svc.key, method: method,
    minutes: minutes, price_usd: usd, price_cny: cny, name: name, contact_type: clean_(r.contactType, 20), contact: contact,
    question: clean_(r.question, 1000), pay_method: pay, lang: clean_(r.lang, 5), visitor_tz: clean_(r.tz, 60), status: '待付款'
  });

  try {
    MailApp.sendEmail(NOTIFY_EMAIL || Session.getEffectiveUser().getEmail(),
      '新预约 ' + id + '：' + svc.name_zh + ' ' + slot.label,
      ['编号：' + id, '项目：' + (svc.group === 'tarot' ? '塔罗梳理，' : '') + svc.name_zh + (method ? '，' + method : '') + '（' + minutes + ' 分钟）', '美国东部时间：' + Utilities.formatDate(new Date(slot.start), TZ, 'EEE, MMM d, yyyy  h:mm a'),
        '北京时间：' + Utilities.formatDate(new Date(slot.start), 'Asia/Shanghai', 'EEE, MMM d, yyyy  h:mm a'),
        '费用：$' + usd + ' / ¥' + cny + '，付款方式：' + pay,
        '称呼：' + name, '联系方式：' + r.contactType + ' ' + contact, '想问的事：' + (r.question || '（未填）')].join('\n'));
  } catch (_) {}

  return { ok: true, id: id, price_usd: usd, price_cny: cny, minutes: minutes, start: slot.start };
}


/* ---------- 一次性设置：塔罗改为按牌阵收费 ----------
   在 Apps Script 里选这个函数运行一次：
   1. Services 表加上 group 列；
   2. 停用旧的「塔罗梳理（按时长）」和「易经 + 塔罗」；
   3. 新增三种牌阵（价格和时长之后可以直接在表格里改）。
   重复运行不会产生重复的行。 */
function setupTarotSpreads() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.services);
  let head = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(function (h) { return String(h).trim().toLowerCase(); });
  if (head.indexOf('group') < 0) { head.push('group'); sh.getRange(1, head.length).setValue('group').setFontWeight('bold'); }
  const col = function (name) { return head.indexOf(name) + 1; };
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, head.length).getValues() : [];
  const have = {};
  rows.forEach(function (r, i) {
    const key = String(r[col('key') - 1]).trim();
    have[key] = true;
    if ((key === 'tarot' || key === 'both') && col('active')) sh.getRange(i + 2, col('active')).setValue('FALSE');
  });
  const spreads = [
    { key: 'tarot-sacred', name_zh: '圣三角牌阵', name_en: 'Sacred Triangle', minutes: 30, price_usd: 15, price_cny: 88, desc_zh: '3 张牌，过去、现在、未来', desc_en: '3 cards: past, present, future' },
    { key: 'tarot-problem', name_zh: '问题解决牌阵', name_en: 'Problem-Solving Spread', minutes: 45, price_usd: 20, price_cny: 133, desc_zh: '5 张牌，找到卡点和下一步', desc_en: '5 cards: the sticking point and the next step' },
    { key: 'tarot-celtic', name_zh: '凯尔特十字阵', name_en: 'Celtic Cross', minutes: 60, price_usd: 30, price_cny: 211, desc_zh: '10 张牌，全面深入分析', desc_en: '10 cards: a full, in-depth reading' }
  ];
  spreads.forEach(function (s) {
    if (have[s.key]) return;
    const obj = { key: s.key, name_zh: s.name_zh, name_en: s.name_en, mode: 'session', minutes: s.minutes, durations: '',
      price_usd: s.price_usd, price_cny: s.price_cny, desc_zh: s.desc_zh, desc_en: s.desc_en, active: 'TRUE', group: 'tarot' };
    sh.appendRow(head.map(function (h) { return obj.hasOwnProperty(h) ? obj[h] : ''; }));
  });
}
