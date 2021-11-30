class ScriptManager {
  executePool = [];
  add(arr) {
    this.executePool = arr
  }
  run() {
    this.executePool.forEach(script => {
      // 执行脚本
      script.run()
    })
  }
}

class CssRemoveScript {
  constructor(page, config) {
    this.page = page
    this.config = config
  }
  async run() {
    await this.page.evaluate(params => {
      params.forEach(item => {
        document.querySelectorAll(item).forEach(el => el.remove())
      })
    }, this.config)
  }
}

class CustomizeScript {
  constructor(page, config) {
    this.page = page
    this.config = config
  }
  async run() {
    await this.page.evaluate(params => {
      params.forEach(item => {
        item()
      })
    }, this.config)
  }
}

class RemoveHiddenElement {
  constructor(page) {
    this.page = page
  }

  async run() {
    // const root = await this.page.$('body', el => el)
    // console.log(root)
    await this.page.evaluate(async () => {
      const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ALL,
        { acceptNode (node) {
            return node.nodeName === '#text' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
        } },
      );
      const nodeList = [];
      let currentNode = treeWalker.currentNode;
      while (currentNode) {
        nodeList.push(currentNode);
        currentNode = treeWalker.nextNode();
      }
      for (let node of nodeList) {
        if (node) {
          if (node.name === '#commnet') {
            node.remove();
            return true;
          }
          // display 为none
          const isDisplayNone = window.getComputedStyle(node).getPropertyValue('display') === 'none';
          if (isDisplayNone) {
              node.remove();
              return true;
          }
          // 宽度百分百或0 高度为0 并且没有子元素 并且不是picture或source元素
          const isNotHeight = () => {
            const viewWidth = window.innerWidth || document.documentElement.clientWidth;
            const width = node.clientWidth;
            const height = node.clientHeight;
            return (width === viewWidth || width === 0) && height === 0;
          };
          const isWebpPictureDom = () => {
            if (['PICTURE', 'SOURCE'].indexOf(node.nodeName) > -1) return true;
            if (node.nodeName === 'IMG' && node.parentNode.nodeName === 'PICTURE') return true;
            return false;
          };
          if (node.children.length === 0 && !isWebpPictureDom() && isNotHeight()) {
              node.remove();
              return true;
          }
          return false;
        }
      }
    })
  }
}

module.exports = {
  ScriptManager,
  CssRemoveScript,
  CustomizeScript,
  RemoveHiddenElement
}