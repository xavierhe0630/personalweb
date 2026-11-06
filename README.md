# Yixuan He 个人网站

两个页面：

- `index.html`：主站，四个页面（个人履历 / 易经问卜 / 塔罗梳理 / 倾诉倾听），带中英切换和预约系统
- `resume/index.html`：独立简历页，网址是 `https://xavierhe0630.github.io/resume/`，只有履历，右上角可以切换语言、点「Download CV」下载 `assets/Yixuan_CV.pdf`
- `resume.html`：只用来把旧网址自动跳转到 `resume/`

两个页面的简历内容都来自同一个文件 `js/resume-data.js`，改一次两边一起更新。

## 文件结构

```
index.html            主站
resume/index.html     独立简历（网址 /resume/）
resume.html           旧网址跳转
css/site.css          全部样式
js/config.js          ← 预约后台地址、Zelle 信息（上线前要填）
js/resume-data.js     ← 简历内容（中英双语）
js/resume.js          简历渲染
js/booking.js         预约组件
js/i18n.js            中英切换
js/site.js            页面切换、八卦图、翻牌、呼吸练习
assets/photo.jpg      ← 你的照片（直接替换同名文件）
assets/schools.jpg    学校定位截图
assets/Yixuan_CV.pdf  ← 简历 PDF（更新简历时替换同名文件）
assets/pay-wechat.png ← 微信收款码（需要你放进来）
assets/pay-alipay.png ← 支付宝收款码（需要你放进来）
apps-script/Code.gs   预约后台代码（贴到 Google Apps Script，不需要放进网站）
```

## 一、部署到 GitHub Pages

1. 在 GitHub 新建一个仓库。想用 `你的用户名.github.io` 当网址的话，仓库名就叫这个。
2. 把这个文件夹里的所有文件上传到仓库根目录（网页上点 Add file → Upload files，拖进去即可）。
3. 仓库 Settings → Pages → Source 选 `Deploy from a branch`，Branch 选 `main`、文件夹选 `/ (root)`，保存。
4. 等一两分钟，网站就会出现在 `https://你的用户名.github.io/`（或 `https://你的用户名.github.io/仓库名/`）。
5. 独立简历的地址是在后面加 `resume/`，求职时发这个链接。

想用自己的域名：Settings → Pages → Custom domain 填域名，再按提示在域名服务商那里加一条 DNS 记录。

## 二、设置预约后台（Google 表格）

预约数据存在一张只有你能看到的 Google 表格里。你在表格里填可预约时间，网站自动显示；有人预约，表格自动多一行，并发邮件通知你。

1. 打开 Google 表格，新建一个空白表格，起个名字，比如「预约后台」。
2. 菜单 扩展程序 → Apps Script。
3. 把 `apps-script/Code.gs` 的全部内容粘贴进去，替换原有代码，保存。
4. 上方函数下拉框选 `setup`，点「运行」。第一次会要求授权，按提示允许（会提示“Google 尚未验证此应用”，点「高级」→「转至…」即可，这是你自己的脚本）。
5. 回到表格，会多出三张表：`Services`、`Availability`、`Bookings`。
6. 回到 Apps Script，右上角 部署 → 新建部署 → 类型选「Web 应用」：
   - 执行身份：我
   - 谁可以访问：任何人
7. 点部署，复制得到的网址（以 `https://script.google.com/macros/s/` 开头）。
8. 打开 `js/config.js`，把网址填进 `bookingApi: ""` 的引号里，保存并上传到 GitHub。

之后改了 `Code.gs` 的话，要在 部署 → 管理部署 → 编辑 → 版本选「新版本」再部署一次，网址不变。

### 三张表怎么用

**Services（项目与价格）**

| 列 | 说明 |
|---|---|
| key | 项目代号，`yijing` / `tarot` / `both`，不要改 |
| name_zh / name_en | 网站上显示的名字 |
| mode | `session` = 按次收费；`duration` = 按时长收费 |
| minutes | 按次：每次多长；按时长：每个计价单位多长（比如 30） |
| durations | 只有按时长才填，访客可选的时长，比如 `30,60,90` |
| price_usd / price_cny | 按次：每次价格；按时长：每个单位的价格。Zelle 收美元，微信和支付宝收人民币 |
| desc_zh / desc_en | 一句话说明（选填） |
| active | 填 `FALSE` 就暂时不显示这个项目 |

想把「倾诉倾听」也加进预约，再加一行 key 为 `listen` 的项目即可。

**Availability（你的可预约时间）**——每一行是一个时段：

| 列 | 说明 |
|---|---|
| date | 日期，写成 `2026-11-20` |
| start | 开始时间，写成 `19:30`（波士顿时间） |
| minutes | 这个时段有多长，访客选的时长不能超过它 |
| spots | 这个时段能约几位，一般填 1 |
| services | 留空 = 所有项目都能约；只开放部分就写 `yijing,tarot` |
| note | 给自己看的备注 |

访客看到的时间会自动换算成他们当地的时区。已经约满或少于 12 小时后开始的时段不会显示（在 `Code.gs` 顶部的 `LEAD_HOURS` 改）。

**Bookings（预约记录）**——自动填写，你只需要改最后一列 `status`：收到钱改成「已确认」；取消改成「已取消」，那个名额会自动重新开放。

## 三、收款信息

- 微信：微信 → 我 → 服务 → 收付款 → 二维码收款，保存收款码图片，命名为 `pay-wechat.png` 放进 `assets` 文件夹。
- 支付宝：首页 → 收钱，保存收款码，命名为 `pay-alipay.png` 放进 `assets`。
- Zelle：在 `js/config.js` 里填 `name`（Zelle 上显示的收款人姓名）和 `id`（绑定 Zelle 的邮箱或手机号，建议用邮箱，避免在网站公开电话）。

访客提交预约后，会看到预约编号、金额和收款方式，并被提示在付款备注里写上编号，方便你对账。

## 四、常见修改

- 换照片：用新照片替换 `assets/photo.jpg`，文件名不变。
- 写个人简介：在 `js/resume-data.js` 找到 `about: L("", "")`，第一个引号写英文，第二个写中文。
- 加工作照：照片放进 `assets`，在 `js/resume-data.js` 最后的 `gallery` 里把对应的 `src: ""` 改成 `src: "assets/文件名.jpg"`。
- 填 LinkedIn：`js/resume-data.js` 里的 `linkedin: ""`。
- 其他页面的文字：在 `index.html` 里改。每段中文旁边的 `data-en="..."` 是对应的英文。
