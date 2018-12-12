const autoIndex = require("../index")

autoIndex("components", {
  match: "**/!(*.*)", // 此处参数为glob类型
  separator: /(-|_)/g,
  exportPattern: `export { default as [name] , I[name]Props } from '[path]'`,
  suffix: ".ts"
})
