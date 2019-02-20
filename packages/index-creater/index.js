const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const glob = require("glob");
/**
 * 自动生成索引文件
 * @param {String} root 要生成索引的根目录
 * @param {Object} options 下面的是options 的属性
 *        @prop {String} match 子模块的匹配规则
 *        @prop {Regex} separator 子模块目录(文件)命名分割符默认为 /(-|_)/g
 *        @prop {String} exportPattern 子模块导出模板
 *        @prop {String} suffix 生成index文件的后缀默认为 '.js'
 * @desc
 * 假设有目录结构如下自动生成componets的索引文件index.js
 * - componets
 *  + button
 *    - index.js
 *  + foo-bar
 *    - index.js
 *  + nest
 *    + child-nest
 *      - index.js
 *      + grandson-nest
 *        - index.js
 * 自动生成components/index.js
 *
 *  export { default as Button , IButtonProps } from './button'
 *  export { default as FooBar , IFooBarProps } from './foo-bar'
 *  export { default as Nest , INestProps } from './nest'
 *  export { default as ChildNest , IChildNestProps } from './nest/child-nest'
 *  export { default as GrandsonNest , IGrandsonNestProps } from './nest/child-nest/grandson-nest'
 * @example
 *  createIndex({
 *   root:'components'
 *   match: '*.js',// 此处参数为glob类型
 *   separator: /(-|_)/g,
 *   exportPattern: `export { default as [name] , I[name]Props } from '[path]'`
 * })
 * @todo
 *  [ ] custom getName function
 */

function createIndex(options = {}) {
  const {
    match,
    root,
    separator = /(-|_)/g,
    exportPattern,
    suffix = "js",
    ignore = false,
    callback = () => {}
  } = options;
  const rootPath = path.resolve(root);
  const  currentIgnore = ignore ? path.resolve(rootPath, ignore) : false;
  const dirs = glob.sync(path.resolve(rootPath, match), { ignore:currentIgnore });

  const items = dirs.map(filePath => {
    const name = getPascal(path.parse(filePath).name, separator);
    const relativePath = `./${path.relative(rootPath, filePath)}`;

    const exportTemplate = exportPattern
      .replace(/\[name\]/g, name)
      .replace(/\[path\]/g, relativePath);

    return { exportTemplate, name, relativePath, filePath };
  });

  const template = items.map(({ exportTemplate }) => exportTemplate).join("\n");
  const result = callback(template, items) || template;

  fs.writeFileSync(
    path.join(rootPath, `index.${suffix.replace(/\./g, "")}`),
    `${result}\n`
  );
  console.log(
    chalk.green(
      `${path.join(
        rootPath,
        `index.${suffix.replace(/\./g, "")}`
      )} update succeed!`
    )
  );
}

/**
 * 将传入的字符串的首字母转为大写
 */
function capitalize([first, ...rest]) {
  return first.toUpperCase() + rest.join("");
}
/**
 *
 * @param {String} x 传入字符串
 * @param {RegExp} separator 分割符号
 * @example
 * getPascal('action-sheet',/(-|_)/g)
 * => 'ActionSheet'
 * @example
 *  getPascal('action',/(-|_)/g)
 * => 'Action'
 */
function getPascal(x, separator) {
  const arr = x.split(separator);
  let str = capitalize(x);
  if (arr.length > 1) {
    str = arr.reduce((a, b) => capitalize(a) + capitalize(b));
  }
  // str.replace(separator, "") 是为了处理当
  return str.replace(separator, "");
}
/**
 * 整理参数传入 createIndex 的参数默认支持两种形式，倒不是因为接口支持的格式越多越牛B只是因为之前没考虑批处理为了兼容所以支持两种格式
 * @param {Object|Array} config
 */
module.exports = config => {
  let configs = [config];
  if (config.length) {
    configs = config;
  }
  configs.forEach(config => {
    createIndex(config);
  });
};
