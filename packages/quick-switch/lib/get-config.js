const fs = require('fs-extra')
const path = require('path')
const { red, blue, green } = require('chalk')
const args = require('yargs').argv
const findup = require('findup-sync')
const { ConfigOutputPath } = require('../qs.config')
const debug = require('debug')('qs')
// 如果向父级遍历找不到 qsrc 就认为当前为root
const isRoot = !findup(ConfigOutputPath, { cwd: '..' })
const isInit = args.init
const rootDir = isRoot
  ? process.cwd()
  : path.parse(findup(ConfigOutputPath, { cwd: '..' })).dir
/**
 * 将命令行参数和默认的配置参数结合
 * @param {planObject} options 传入的命令行参数
 * @returns {planObject} options 返回组合后的参数
 * @example
 * getConfig({root:'demo'})
 */
function getConfig (options = {}) {
  /**
   * @var {planObject} config qs --init 命令生成的配置
   * @var {string} currentModule 当前选中模块
   * @var {string} qsrcPath qs --init 生成的 .qsrc.json  的 absolute path
   * @var {string} rootDir .qsrc.json 所在目录一般也就是项目根目录
   */
  let config, currentModule, qsrcPath
  // init 模式直接返回
  if (isInit) {
    return options
  }
  // 获取离当前目录最近的 qsrc 目前子目录可以个性化 root,rename 配置
  if ((qsrcPath = findup(ConfigOutputPath))) {
    config = fs.readJsonSync(qsrcPath)
    let { moduleStorePath, defaultDemo, root: configRoot } = config
    let { root: cmdRoot } = options
    let relativeRoot = cmdRoot || configRoot

    moduleStorePath = path.join(
      rootDir,
      moduleStorePath,
      relativeRoot,
      '.qsrc.json'
    )
    // moduleStorePath 依赖 rootDir 和 relativeRoot
    fs.ensureFileSync(moduleStorePath)
    currentModule = getCurrentModule(moduleStorePath, defaultDemo)
    fs.outputJsonSync(moduleStorePath, { module: currentModule })
    return {
      ...options,
      defaultDemo,
      qsrcPath,
      moduleStorePath,
      root: path.join(rootDir, relativeRoot),
      relativeRoot,
      rootDir,
      currentModule,
      isRoot
    }
  }

  console.info(red(`Can't found ${ConfigOutputPath}`))
  console.info(blue('Please use: qs --init'))
  process.exit(0)
}
function getCurrentModule (moduleStorePath, defaultDemo) {
  let currentModule
  try {
    currentModule = fs.readJsonSync(moduleStorePath).module
  } catch (error) {
    // console.info(red(`can't found currentModule`))
    // console.info(blue('use: qs --init qs --switch <name>'))
  }

  return currentModule || defaultDemo
}
module.exports = getConfig
