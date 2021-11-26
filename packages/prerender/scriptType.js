class Script {
  constructor(page, config) {
    this.page = page;
    this.config = config
  }

  async runScript() {
    this.removeCSS()
    if (this.config.length !== 0) {
      this.customizeScript()
    }
  }
  
  async removeCSS() {
    await this.page.evaluate(() => {
      this.config.selector.forEach(item => {
        document.querySelectorAll(item)
          .forEach(el => el.remove())
      })
    })
  }

  async customizeScript() {
    thid.config.forEach( item => {
      await this.page.evaluate( () => {
        item()
      })
    })
  }

  // 删除隐藏元素
}