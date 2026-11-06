/* =========================================================
   网站设置：上线前把下面几项填好
   ========================================================= */
window.SITE_CONFIG = {
  // 预约后台地址：部署 Google Apps Script 后得到的 Web App 网址（见 README）
  // 留空时预约系统以「演示模式」运行，用示例时间，不会真正提交
  bookingApi: "",

  // 你设置可预约时间时使用的时区（访客会看到换算成他们当地的时间）
  ownerTimezone: "America/New_York",

  payment: {
    // 把收款码图片放进 assets 文件夹，文件名保持一致即可
    wechat: { qr: "assets/pay-wechat.png" },
    alipay: { qr: "assets/pay-alipay.png" },
    // Zelle：绑定 Zelle 的邮箱或手机号，以及 Zelle 上显示的收款人姓名
    zelle: { name: "", id: "" }
  },

  // 付款后的确认说明（可改成你自己的话）
  confirmNote: {
    zh: "付款后，我会在 24 小时内通过你留下的联系方式确认预约。",
    en: "After you pay, I’ll confirm your booking within 24 hours using the contact you left."
  }
};
