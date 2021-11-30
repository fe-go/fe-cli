const puppeteer = require('puppeteer')
const config = require('./config.js')
const fs = require("fs");

const { ScriptManager, CssRemoveScript, CustomizeScript, RemoveHiddenElement } = require('./scriptType')
// if (env === 'local') {
//     return await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
// }
// return await puppeteer.launch({
//     args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
// });

class Prerender {
  constructor(url, config) {
    this.config = config;
    this.init(url);
  }
  async init(url) {
    this.browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    this.page = await this.browser.newPage()
    this.render(url)
  }
  setCookie() {
    config.cookies.forEach(async item => {
      await this.page.setCookie(item)
    })
  }
  async setLocalStorage(url) {
    await this.page.goto(url)
    await this.page.evaluate(() => {
      Object.keys(config.localStorage).forEach(key => {
        localStorage.setItem(key, config.localStorage[key])
      })
    });
    await this.page.goto(url)
  }
  /**
   * 获取页面预渲染内容与快照
   * @param  {String} url    [页面地址]
   * @return {Object}        [预渲染的Dom字符串、样式及其快照地址]
   */
  async render(url) {
    let realUrl = url;
    try {
      realUrl = decodeURIComponent(url);
    } catch (e) {
      console.error(`Puppeteer prerender decodeURIComponent url error: ${e.message}, ${ulr}`);
      await this.page.close();
      await this.browser.close();
    }

    let dom = '', style = '', remainingStyle = '', picture = '';
    try {
      // 设置cookies
      if (config.cookies.length > 0) this.setCookie();
      // 启动页面渲染模拟器
      await this.page.emulate(config.prerenderEmulate);
      // 设置页面localStorage
      if (JSON.stringify(config.localStorage) !== '{}') this.setLocalStorage(realUrl);
      // 设置请求过滤器
      // this.setRequestInterceptor(this);
      // 同时开启统计css使用率及请求过滤器

      const scriptManager = new ScriptManager()
      let cssRemoveScript, customizeScript, func = []
      if (config.selector.length > 0) {
        cssRemoveScript = new CssRemoveScript(this.page, config.selector);
        func.push(cssRemoveScript)
      }
      if (config.scripts.length > 0) {
        customizeScript = new CustomizeScript(this.page, config.scripts);
        func.push(customizeScript)
      }
      let removeHiddenElement = new RemoveHiddenElement(this.page)
      func.push(removeHiddenElement)
      if (func.length > 0) {
        scriptManager.add(func)
        scriptManager.run()
      }

      await Promise.all([
        this.page.coverage.startCSSCoverage()
        // this.page.setRequestInterception(true)
      ])
      // 页面跳转并等待页面onload
      await new Promise(async (resolve, reject) => {
        this.page.on('load', () => resolve())
        this.page.on('error', () => reject())
        await Promise.race([
          this.page.goto(realUrl), 
          new Promise((x) => setTimeout(x, 40000))
        ])
      })

      // 运行脚本
      // const scriptManager = new ScriptManager()
      // let cssRemoveScript, customizeScript, func = []
      // if (config.selector.length > 0) {
      //   cssRemoveScript = new CssRemoveScript(this.page, config.selector);
      //   func.push(cssRemoveScript)
      // }
      // if (config.scripts.length > 0) {
      //   customizeScript = new CustomizeScript(this.page, config.scripts);
      //   func.push(customizeScript)
      // }
      
      // if (func.length > 0) {
      //   scriptManager.add(func)
      //   scriptManager.run()
      // }
      
      // 获取首屏使用的css
      const cssCoverage = await this.page.coverage.stopCSSCoverage()
      const { usedStyle, unUsedStyle } = this.getUsedCss(cssCoverage)
      const keyframesStyle = this.collectKeyframes(unUsedStyle)
      style = usedStyle + keyframesStyle;
      remainingStyle = unUsedStyle
      // 截取首屏截图
      picture = await this.getScreenshot(this)
      // 获取首屏DOM
      dom = await this.page.$eval(config.rootCss, el => el.outerHTML);
    } catch (e) {
      console.error(`Puppeteer prerender goto page err: ${e.message} ${url} `)
      await this.page.close()
      await this.browser.close()
    }

    // 关闭页面及浏览器
    await this.page.close()
    await this.browser.close()
    // 检查DOM是否正确
    // const pass = await this.runLint(dom);
    // if (!pass) {
    //     ctx.logger.error('Prerender dom is not compliant', url);
    //     return app.end(3, { errorMsg: ['Prerender dom is not compliant:' + url] }, 'fail');
    // }

    const res = { dom: dom, style, remaining_style: remainingStyle, picture }
    // console.log(res)
    return res
  }

  /**
   * 根据覆盖率数据拼接css源码
   * @param {Object} coverage css覆盖率数据
   * @returns {String} CSS样式源码
   */
  getUsedCss(coverage) {
    let usedStyle = ''
    let unUsedStyle = ''
    for (const entry of coverage) {
      const styleText = entry.text
      let startFlag = 0
      let endIndex = entry.text.length
      for (const range of entry.ranges) {
        unUsedStyle += styleText.slice(startFlag, range.start)
        usedStyle += styleText.slice(range.start, range.end)
        startFlag = range.end
        endIndex = range.end
      }
      unUsedStyle += styleText.slice(endIndex, entry.text.length)
    }
    return {
      usedStyle,
      unUsedStyle
    }
  }

  /**
   * 获取页面首屏截屏图片
   * @param {Page} page 浏览器页面实例
   * @returns {String} 首屏截屏图片的cdn地址
   */
  async getScreenshot(page) {
    const clip = {
      x: 0,
      y: 0,
      width: config.prerenderEmulate.viewport.width,
      height: config.prerenderEmulate.viewport.height
    }
    const screenshotBuffer = await this.page.screenshot({ path: 'screenshot.jpeg', type: 'jpeg', quality: 100, clip })
    let screenshot = ''
    if (screenshotBuffer.length > 0) {
        screenshot = fs.writeFileSync("firstScreen.jpg", screenshotBuffer);
    }
    return screenshot
  }

  /**
   * 将keyframes从非首屏css中提取出来放入首屏css，解决最新ios系统后加载keyframes失去关键帧动画问题
   * @param {String} style 非首屏css
   * @returns keyframes样式
   */
  collectKeyframes(style) {
    const keyframesArr = style.match(/@keyframes([^{])*\{([^{}]|\{[^{}]*\})*\}/g)
    let keyframesStyle = ''
    if (keyframesArr) {
      keyframesArr.forEach((text) => {
        keyframesStyle += text
      })
    }
    return keyframesStyle
  }

  /**
   * 为页面设置请求拦截器
   * @param {Page} page 浏览器页面实例
   */
  setRequestInterceptor () {
    this.page.on('request', request => {
        const reqUrl = request.url();
        const hit = () => config.whiteList.findIndex(path => reqUrl.indexOf(path) > -1) > -1;
        if (reqUrl.indexOf('/topcube/api/toc/base/getLoginInfo') > -1) {
            // 绕过强制登录
            request.respond({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                  code: 0,
                  msg: '返回成功!',
                  data: userInfo
              })
            });
        } else if (reqUrl.indexOf('//cube.meituan.net/hfe/block/superagent') > -1) {
            // 使接口请求处于loading状态
            request.abort();
        } else if (hit()) {
            // 命中白名单
            request.continue();
        } else {
            request.abort();
        }
    });
  }
  
}

module.exports = Prerender
