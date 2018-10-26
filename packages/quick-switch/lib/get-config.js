const fs = require('fs-extra')
const path = require('path')
const { red, blue, green, yellow } = require('chalk')
const args = require('yargs').argv
const findup = require('findup-sync')
const { ConfigOutputPath, ModuleStorePath } = require('../qs.config')
const debug = require('debug')('qs')

/**
 * 将命令行参数和默认的配置参数结合 命令行优先级  > 根目录配置
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

  const isInit = !!args.init
  const rootDir = path.parse(findup(ConfigOutputPath)).dir
  let config, currentModule, qsrcPath
  debug(green('isInit, rootDir'), isInit, rootDir)

  // init 模式直接返回
  if (isInit) {
    return options
  }
  // 获取离当前目录最近的 qsrc 目前子目录可以个性化 root,rename 配置
  if ((qsrcPath = findup(ConfigOutputPath))) {
    config = fs.readJsonSync(qsrcPath)
    let { defaultDemo, root: configRoot } = config
    let { root: cmdRoot } = options
    let relativeRoot = cmdRoot || configRoot
    // moduleStorePath 动态根据工作目录或者命令输入确定
    let moduleStorePath = path.join(
      rootDir,
      // relativeRoot,
      ModuleStorePath //  '.qsrc.json'
    )

    fs.ensureFileSync(moduleStorePath)
    currentModule = getCurrentModule(
      moduleStorePath,
      defaultDemo,
      path.join(rootDir, relativeRoot)
    )

    fs.outputJsonSync(moduleStorePath, {
      ...fs.readJsonSync(moduleStorePath),
      ...{ module: currentModule }
    })

    return {
      defaultDemo,
      qsrcPath,
      moduleStorePath,
      rootDir,
      currentModule,

      ...options,
      root: path.join(rootDir, relativeRoot) // 绝对路径之后的 switch new print 都依赖root 值
    }
  }

  console.info(red(`Can't found ${ConfigOutputPath}`))
  console.info(blue('Please use: qs --init'))
  process.exit(0)
}
function getCurrentModule (moduleStorePath, defaultDemo, currentRoot) {
  let currentModule
  try {
    currentModule = fs.readJsonSync(moduleStorePath).module
    if (!fs.existsSync(path.join(currentRoot, currentModule))) {
      console.info(
        yellow(`warning ${path.join(currentRoot, currentModule)} not exist!`)
      )
    }
  } catch (error) {
    // console.info(red(`can't found currentModule`))
    // console.info(blue('use: qs --init qs --switch <name>'))
  }

  return currentModule || defaultDemo
}
module.exports = getConfig
