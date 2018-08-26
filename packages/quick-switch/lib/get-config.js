const fs = require('fs-extra')
const path = require('path')
const { red, blue } = require('chalk')
const args = require('yargs').argv
const { ConfigOutputPath } = require('../qs.config')

function getConfig () {
  let config, currentModule
  // console.log(args)
  if (args.init) return
  if (fs.pathExistsSync(path.resolve(process.cwd(), ConfigOutputPath))) {
    config = fs.readJsonSync(path.resolve(process.cwd(), ConfigOutputPath))
    const { moduleStorePath, defaultDemo } = config
    currentModule = getCurrentModule(moduleStorePath, defaultDemo)
    return { ...config, currentModule }
  } else {
    console.info(red(`Can't found ${ConfigOutputPath} in PWD`))
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
