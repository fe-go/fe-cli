const indexCreater = require("../index");

indexCreater([
  {
    root: "components",
    match: "**/!(*.*)", // 此处参数为glob类型
    separator: /(-|_)/g,
    exportPattern: `export { default as [name] , I[name]Props } from '[path]'`,
    suffix: ".ts",
    callback(template, items) {
      return template + "\n// test";
    }
  },
  {
    root: "components",
    match: "**/!(*.*)", // 此处参数为glob类型
    separator: /(-|_)/g,
    exportPattern: `export { default as [name] } from '[path]'`,
    suffix: ".jsx",
    callback(template, items) {
      return template + "\n// test ll";
    }
  }
]);
