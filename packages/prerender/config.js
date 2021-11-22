module.exports = {
  cookies: [],
  localStorage: [],
  selector: [], // 要移除的 css 选择器
  scripts: [], // 要注入的脚步
  whiteList: [], // 请求白名单
  emulate: {
    name: 'iPhone 6 Plus landscape',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    viewport: {
      width: 736,
      height: 828,
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      isLandscape: true
    }
  },
  prerenderEmulate: {
    name: 'iPhone X',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    viewport: {
      // x3是为了提升首屏截图分辨率
      width: 375 * 3,
      height: 812 * 3,
      deviceScaleFactor: 0.333,
      isMobile: true,
      hasTouch: true,
      isLandscape: true
    }
  }
}
