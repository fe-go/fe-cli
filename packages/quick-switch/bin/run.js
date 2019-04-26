#!/usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
const { red, blue, green } = require('chalk')
const inquirer = require('inquirer')
const { createNewModule } = require('quickly-template/lib/createTemplate')
const getConfig = require('../lib/get-config')
const attempt = require('../lib/attempt')
const debug = require('debug')('qs')
const { ConfigOutputPath } = require('../qs.config')

function main (options) {
  debug('options')
  debug(options)
  if (options.switch) {
    const { currentModule } = options
    switchModule(currentModule, options.switch, options)
  } else if (options.new) {
    const { defaultDemo } = options
    switchModule(defaultDemo, options.new, options)
  } else if (options.delete) {
    deleteModule(options.delete, options)
  } else if (options.list) {
    attempt(printModule, options)
  } else if (options.init) {
    init()
  } else {
    // const { root } = options
    // console.info(green('root:'), blue(root))
    console.info(green('❤️ For more info use help:'), blue('qs -h'))
    attempt(printModule, options)
  }
}

function init () {
  const questions = [
    {
      type: 'input',
      name: 'root',
      message: "What's your root",
      default: function () {
        return '.'
      }
    },
    {
      type: 'input',
      name: 'defaultDemo',
      message: "What's your defaultDemo",
      default: function () {
        return '_demo'
      }
    }
    // {
    //   type: 'confirm',
    //   name: 'rename',
    //   message: 'Create new module will reanme files,Is this OK?(default No)',
    //   default: false
    // }
  ]

  inquirer.prompt(questions).then(answers => {
    // const { moduleStorePath, defaultDemo } = answers

    console.info(blue(JSON.stringify(answers, null, ' ')))

    fs.outputJSONSync(ConfigOutputPath, answers)
  })
}

function printModule (options) {
  const { currentModule, root } = options
  const allModules = fs.readdirSync(root)

  allModules.forEach(item => {
    let isFilter = /(\.|node_modules)/g.test(item)
    if (item === currentModule) {
      !isFilter && console.info(green(item))
    } else {
      !isFilter && console.info(item)
    }
  })
}
function switchModule (currentModule, nextModule, options) {
  const { root, new: isNew } = options
  const allModules = fs.readdirSync(root)
  if (currentModule === nextModule) {
    console.info(
      red('The target module cannot be equal to the current module!')
    )
    return
  }
  // 如果next模块存在直接重写.qsrc.json,如果调用的是new 提示然后退出
  if (allModules.indexOf(nextModule) > -1) {
    isNew
      ? console.log(red(`${nextModule} alread exist `))
      : rewriteModule(nextModule, options)

    return
  }
  // 如果是切换判断一下是否创建新模块
  if (nextModule) {
    if (isNew) {
      createModule(currentModule, nextModule, options)
      rewriteModule(nextModule, options)
      return
    }
    inquirer
      .prompt({
        type: 'confirm',
        name: 'createNew',
        message: blue(
          `The current module ${green(
            nextModule
          )} does not exist whether to create a new module (default no)`
        ),
        default: false
      })
      .then(answers => {
        const { createNew } = answers
        if (createNew) {
          createModule(currentModule, nextModule, options)
          rewriteModule(nextModule, options)
        }
      })
  }
}
function rewriteModule (nextModule, options) {
  const { moduleStorePath } = options
  const config = fs.readJsonSync(moduleStorePath)
  fs.outputJsonSync(moduleStorePath, { ...config, ...{ module: nextModule } })
  console.info(
    green(`Successfully written ${nextModule} to ${moduleStorePath}`)
  )
}
function createModule (sourceModule, targetModule, options = {}) {
  const { root } = options
  if (!fs.pathExistsSync(path.join(root, sourceModule))) {
    console.info(red(`${sourceModule} directory not found`))
    process.exit(0)
  }
  if (sourceModule === targetModule) {
    console.info(
      red('The target module cannot be equal to the current module!')
    )
    return
  }

  const globPattern = path.join(root, sourceModule, '**', '*.*')
  const target = root
  const renderOptions = { name: targetModule }
  const name = targetModule
  const argv = options
  createNewModule({ globPattern, target, argv, renderOptions, name })
  console.info(green(`create ${targetModule} from ${sourceModule}`))
}
function deleteModule (targetModule, options) {
  const { root, defaultDemo, currentModule } = options
  if (targetModule === defaultDemo) {
    console.info(red('The demo directory should not be removed!'))
    return
  }
  fs.removeSync(path.join(root, targetModule))

  console.info(green(`${targetModule} successfully deleted`))
  if (targetModule === currentModule) {
    console.info(
      blue('currentModule is deleted so change currentModule to default')
    )
    rewriteModule(defaultDemo)
  }
}

module.exports = args => {
  const options = getConfig(args)
  main(options)
}
