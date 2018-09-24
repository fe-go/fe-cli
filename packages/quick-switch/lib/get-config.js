const fs = require('fs-extra')
const path = require('path')
const { red, blue } = require('chalk')
const args = require('yargs').argv
const findup = require('findup-sync')
const { ConfigOutputPath } = require('../qs.config')
const debug = require('debug')('qs')

function getConfig (options) {
  /**
   * @var {planObject} config qs --init 命令生成的配置
   * @var {string} currentModule 当前选中模块
   * @var {string} qsrcPath qs --init 生成的 .qsrc.json  的 absolute path
   * @var {string} rootDir .qsrc.json 所在目录一般也就是项目根目录
   */
  let config, currentModule, qsrcPath, rootDir
  // init 模式直接返回
  if (args.init) return

  qsrcPath = findup(ConfigOutputPath)

  if (fs.pathExistsSync(qsrcPath)) {
    rootDir = path.dirname(qsrcPath)
    config = fs.readJsonSync(qsrcPath)
    let { moduleStorePath, defaultDemo, root: configRoot } = config
    let { root: cmdRoot } = options
    let root = cmdRoot || configRoot
    debug('root')
    debug(root)
    root = path.join(rootDir, root)
    moduleStorePath = path.join(rootDir, moduleStorePath)
    currentModule = getCurrentModule(moduleStorePath, defaultDemo)
    return {
      ...options,
      defaultDemo,
      qsrcPath,
      moduleStorePath,
      root,
      currentModule
    }
  } else {
    console.info(red(`Can't found ${ConfigOutputPath}`))
    console.info(blue('Please use: qs --init'))
    process.exit(0)
  }
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
