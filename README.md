# Yixuan He 个人网站

- 主站：`https://xavierhe0630.github.io/personalweb/`
- 独立简历（求职时发这个）：`https://xavierhe0630.github.io/personalweb/resume/`

网站是纯静态网页，放在 GitHub Pages 上；预约数据存在一张 Google 表格里，由 Google Apps Script 提供后台。

## 网站有哪些页面

| 页面 | 网址 | 内容 |
|---|---|---|
| 个人履历 | `/#resume` | 简历、教育经历、项目展示 |
| 易经问卜 | `/#yijing` | 标语、三种问卜方式（六爻 / 大六壬 / 梅花易数）、方法详解与对比、预约 |
| 塔罗梳理 | `/#tarot` | 翻牌首屏、适合的问题、三种牌阵（圣三角 / 问题解决 / 凯尔特十字）、预约 |
| 倾诉倾听 | `/#listen` | 呼吸练习、说明、可聊的话题、保密与危机求助 |
| 独立简历 | `/resume/` | 只有履历，右上角可切换语言、下载 PDF |
| 癌症预测看板 | `/projects/cancer-forecast/` | 项目展示 |
| 零售选址演示 | `/projects/site-selection/` | 项目展示（Huff 模型在浏览器里运行） |

所有页面都支持中英切换（右上角按钮）和深色模式。

## 文件结构

```
index.html                 主站（四个页面的文字都在这里）
resume/index.html          独立简历
resume.html                旧网址跳转到 resume/，不用改
css/site.css               全部样式
js/config.js               ← 预约后台网址、Zelle 信息（只有你的版本有后台网址，不要被覆盖）
js/resume-data.js          ← 简历内容（中英双语），主站和独立简历共用
js/resume.js               简历渲染
js/booking.js              预约组件
js/i18n.js                 中英切换
js/site.js                 页面切换、八卦图、翻牌、牌阵卡片、呼吸练习
assets/portrait.jpg        ← 简历顶部照片
assets/education.jpg       ← 教育经历照片
assets/card-*.jpg          五所学校的定位卡片
assets/Yixuan_CV.pdf       ← 「Download CV」下载的简历 PDF
assets/pay-wechat.png      ← 微信收款码（需要你放进来）
assets/pay-alipay.png      ← 支付宝收款码（需要你放进来）
projects/cancer-forecast/  癌症预测看板、缩略图 preview.jpg
projects/site-selection/   零售选址演示（数据已内嵌在网页里）、缩略图 preview.jpg
apps-script/Code.gs        预约后台代码（贴进 Google Apps Script，网站本身不使用）
```

`assets` 里的 `photo.jpg`、`schools.jpg`、`map-*.jpg` 已经不再使用，可以删掉。

## 一、更新网站

1. 在 GitHub 仓库里进入对应的文件夹，点 **Add file → Upload files**，把改好的文件拖进去，点 **Commit changes**。同名文件会被覆盖。
2. 等一两分钟，在仓库的 **Actions** 标签里看最上面一条：绿色对勾就是部署成功。
3. 打开网站按 **Cmd + Shift + R** 强制刷新。

注意事项：

- **文件一定要放进正确的文件夹**，例如 `site.css` 放 `css`，`booking.js` 放 `js`。放错位置网站不会读取。
- **`resume-data.js` 和 `resume.js` 要一起更新**，版本对不上会导致简历页面空白。
- **分几次上传时，前面几次显示「cancelled」是正常的**，新的部署会取消还没跑完的旧部署。只看最后一条是否成功。
- **不要用别人给你的 `config.js` 覆盖你自己的**，里面有你的预约后台网址。

## 二、修改简历

简历内容全部在 `js/resume-data.js`，改一次，主站和独立简历一起更新。每条内容写成 `L("英文", "中文")`。

| 想改什么 | 改哪里 |
|---|---|
| 中文名 | `nameZh: "何懿轩"` |
| LinkedIn | `linkedin: "..."` |
| 顶部照片 / 教育照片 | 直接替换 `assets/portrait.jpg` / `assets/education.jpg`，文件名不变 |
| 英文版的经历描述 | 每段经历的 `points`（要点列表） |
| 中文版的经历描述 | 每段经历的 `blocksZh` 和 `summaryZh`（见下） |
| 学校 | `education.schools`，每所学校一行，定位卡片是 `card` 图片 |
| 项目缩略图和按钮 | `project` 里的 `preview` 和 `links` |
| 证书、技能 | `certs`、`skills` |
| 下载的 PDF | 替换 `assets/Yixuan_CV.pdf`，文件名不变（网页内容不会自动同步到 PDF） |

**中文版的格式**

- `summaryZh`：职位下面的一句话概括（带左侧色条），可以不写。
- `blocksZh`：每个模块一项。
  - 工作经历和项目：`{"t": "小标题", "w": "工作内容", "o": "业务产出"}`，没有产出可以不写 `o`。
  - 领导力和社区服务：`{"t": "小标题", "p": "一段话"}`，显示为「小标题：一段话」。
- 中文句子用逗号和句号，不用分号。

**照片墙**：`gallery` 里只要有一张照片填了 `src`（例如 `"assets/work-1.jpg"`），「工作与活动照片」板块和目录按钮就会自动出现；全部留空则整个板块隐藏。

**添加新的项目展示**

1. 在 `projects` 下新建文件夹，例如 `projects/my-project/`，放入 `index.html` 和缩略图 `preview.jpg`（宽高比约 2:1）。
2. 在 `js/resume-data.js` 的 `project` 里照着已有的项目加一项，填上 `preview` 和 `links`。
3. 项目网页里的「返回简历」链接写 `../../resume/#project`。

## 三、修改易经、塔罗、倾诉页面

页面文字都在 `index.html`。用 GitHub 的编辑模式打开后按 Cmd + F 搜索：`第二页 易经`、`第三页 塔罗`、`第四页 倾诉`。

每段文字写成：

```html
<h2 data-en="Spreads">牌阵</h2>
```

尖括号中间是中文，`data-en="..."` 里是英文，两个要一起改。英文里需要引号时用弯引号 “ ”，不要用直引号 `"`。

塔罗牌阵卡片上的价格是从 Google 表格实时读取的（`data-price-for="tarot-sacred"` 这类位置），不用在网页里改。

## 四、预约后台（Google 表格）

表格在你的 Google Drive 里（文件名「预约」）。打开表格，菜单 **扩展程序 → Apps Script** 就能进入后台代码。

### 日常要改的四张表

改完表格刷新网页就能看到，不需要重新部署。

**Services（项目与价格）**

| 列 | 说明 |
|---|---|
| key | 项目代号，不要改：`yijing` 易经问卜；`tarot-sacred` / `tarot-problem` / `tarot-celtic` 三种塔罗牌阵 |
| name_zh / name_en | 网站上显示的名字 |
| mode | `session` 按次收费（现在都是这个） |
| minutes | 每次多长（分钟） |
| price_usd / price_cny | 价格。Zelle 收美元，微信和支付宝收人民币 |
| desc_zh / desc_en | 一句话说明（选填） |
| active | 填 `FALSE` 就暂时不显示这个项目 |
| group | 填 `tarot` 的项目会在网站上合并成「塔罗梳理」一张卡片，再让访客选牌阵 |

旧的 `tarot`（按时长）和 `both`（易经 + 塔罗）两行已经停用，保留着不影响。

**Weekly（每周固定时段）**：每行一条规则，网站自动开放未来 4 周。

| 列 | 说明 |
|---|---|
| weekday | 星期几，可写多天：`周二,周四`、`Mon,Wed`、`1,3,5`（周一 = 1，周日 = 7） |
| start | 开始时间，美东时间，24 小时制，如 `19:30` |
| minutes | 时段长度，要不短于访客所选项目的时长 |
| spots | 能约几位，一般填 1 |
| services | 留空 = 所有项目；只开放部分就写 `yijing` 或 `tarot`（`tarot` 代表全部牌阵） |
| from / until | 规则生效的起止日期（选填），如 `2026-12-31` |

**Availability（单独加开的时段）**：写法和 Weekly 一样，只是 `date` 写具体日期（`2026-11-20`）。和 Weekly 时间重复时，以这里为准。

**Closed（不开放的时间）**：只填 `date` 表示那天全天关闭；同时填 `start` 只关掉那一个时段。

**Bookings（预约记录）**：自动填写。

- 你只需要改 `status` 列：收到钱改「已确认」；取消改「已取消」，名额会自动恢复。
- `method` 列记录访客选的问卜方式（易经才有）。
- 已经有人约的时段，不要改它的日期或开始时间，否则预约就对不上了。

### 预约编号

易经问卜是 IC1000、IC1001……，塔罗是 TR1000、TR1001……，每类各自递增。测试完想从 1000 重新开始：先删掉 Bookings 里的测试行，再在 Apps Script 里运行一次 `resetIds`。

### 修改后台代码

只有在拿到新版 `Code.gs` 时才需要做：

1. 在 Apps Script 里全选 `Code.gs` 的旧代码，替换成新代码，按 Cmd + S 保存（第一行保留 `/** @OnlyCurrentDoc */`，它让脚本只能访问这一张表格）。
2. 如果说明里要求运行某个函数（例如 `setup`、`setupTarotSpreads`），在顶部函数下拉框里选它，点 **运行**。
3. 右上角 **部署 → 管理部署 → 铅笔图标 → 版本选「新版本」→ 部署**。网址不变，`config.js` 不用改。

可以在 `Code.gs` 顶部调整的设置：

| 设置 | 作用 | 现在的值 |
|---|---|---|
| `LEAD_HOURS` | 至少提前多少小时才能预约 | 12 |
| `WEEKS_AHEAD` | Weekly 规则自动开放未来几周 | 4 |
| `NOTIFY_EMAIL` | 新预约通知发到哪个邮箱（留空 = 你的 Google 账号） | 留空 |
| `ID_START` | 预约编号起始数字 | 1000 |

### 网站上的时间显示

所有时间都同时显示美国东部时间和北京时间（12 小时制，带年月日），你在表格里只需要按美东时间填写。

## 五、收款信息

- **微信**：微信 → 我 → 服务 → 收付款 → 二维码收款，保存收款码，命名为 `pay-wechat.png` 放进 `assets`。
- **支付宝**：首页 → 收钱，保存收款码，命名为 `pay-alipay.png` 放进 `assets`。
- **Zelle**：在 `js/config.js` 里填 `name`（收款人姓名）和 `id`（绑定的邮箱，建议不要公开手机号）。

访客提交预约后会看到预约编号、金额和收款方式，并被提示在付款备注里写上编号，方便你对账。

## 六、从头部署（备用）

如果以后要换仓库或重新部署：

1. 把这个文件夹里的所有文件上传到新仓库的根目录。
2. 仓库需要是公开的（免费账号的 GitHub Pages 只支持公开仓库）。
3. Settings → Pages → Source 选 **Deploy from a branch**，Branch 选 `main`，文件夹选 `/ (root)`，保存。
4. 预约后台：新建 Google 表格 → 扩展程序 → Apps Script → 粘贴 `Code.gs` → 依次运行 `setup` 和 `setupTarotSpreads` → 部署为 Web 应用（执行身份：我；谁可以访问：任何人）→ 把得到的网址填进 `js/config.js` 的 `bookingApi`。
5. 想用自己的域名：Settings → Pages → Custom domain 填域名，再按提示在域名服务商那里加一条 DNS 记录。
