const fs = require('fs-extra')
const path = require('path')
const { red, blue } = require('chalk')
const {ConfigOutputPath} = require('../qs.config')

function getConfig () {
  let config, currentModule
  if (fs.pathExistsSync(path.resolve(process.cwd(), ConfigOutputPath))) {
    config = fs.readJsonSync(path.resolve(process.cwd(), ConfigOutputPath))
    const { moduleStorePath, defaultDemo } = config
    currentModule = getCurrentModule(moduleStorePath, defaultDemo)
    return { ...config, currentModule }
  } else {
    console.info(red(`can not found ${ConfigOutputPath}`))
    console.info(blue('use: qs --init'))
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
