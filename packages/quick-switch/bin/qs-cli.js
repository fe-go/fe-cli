#!/usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
const yargs = require('yargs')
const { red, blue, green } = require('chalk')
const inquirer = require('inquirer')
const getConfig = require('../lib/get-config')
const renameFiles = require('../lib/rename-files')
const attempt = require('../lib/attempt')
const debug = require('debug')('qs')
const { ConfigOutputPath } = require('../qs.config')

function main (options) {
  debug('options')
  debug(options)
  if (options.switch) {
    const { currentModule } = options
    switchModule(currentModule, options.switch)
  } else if (options.new) {
    const { defaultDemo } = options
    switchModule(defaultDemo, options.new)
  } else if (options.delete) {
    deleteModule(options.delete)
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
        return 'src'
      }
    },
    {
      type: 'input',
      name: 'defaultDemo',
      message: "What's your defaultDemo",
      default: function () {
        return '_demo'
      }
    },
    {
      type: 'confirm',
      name: 'rename',
      message: 'Create new module will reanme files,Is this OK?(default No)',
      default: false
    }
  ]

  inquirer.prompt(questions).then(answers => {
    // const { moduleStorePath, defaultDemo } = answers

    console.info(JSON.stringify(answers, null, '  '))

    fs.outputJSONSync(ConfigOutputPath, answers)
  })
}

function printModule (options) {
  const { currentModule, root } = options
  const allModules = fs.readdirSync(root)

  allModules.forEach(item => {
    let isFile = /\./g.test(item)
    if (item === currentModule) {
      !isFile && console.info(green(item))
    } else {
      !isFile && console.info(item)
    }
  })
}
function switchModule (currentModule, nextModule) {
  const { root } = options
  const allModules = fs.readdirSync(root)
  if (currentModule === nextModule) {
    console.info(
      red('The target module cannot be equal to the current module!')
    )
    return
  }
  if (allModules.indexOf(nextModule) > -1) {
    rewriteModule(nextModule)
    return
  }
  if (nextModule) {
    createModule(currentModule, nextModule)
    rewriteModule(nextModule)
  }
}
function rewriteModule (nextModule) {
  const { moduleStorePath } = options
  fs.outputJsonSync(moduleStorePath, { module: nextModule })
  console.info(
    green(`Successfully written ${nextModule} to ${moduleStorePath}`)
  )
}
function createModule (sourceModule, targetModule) {
  const { root, rename } = options

  if (!fs.pathExistsSync(path.join(root, sourceModule))) {
    console.info(red(`${sourceModule} directory not found`))
    process.exit(0)
  }
  if (sourceModule === targetModule) {
    console.info(
      red('The target module cannot be equal to the current module!')
    )
    process.exit(0)
  }

  debug('new')
  debug(path.join(root, sourceModule))
  debug(path.join(root, targetModule))

  fs.copySync(path.join(root, sourceModule), path.join(root, targetModule))
  debug('reanme', rename)
  rename && renameFiles(path.join(root, targetModule), targetModule)
  console.info(green(`create ${targetModule} from ${sourceModule}`))
}
function deleteModule (targetModule) {
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
const args = yargs
  .usage('Usage: $0 [options]')
  .options({
    new: {
      alias: 'n',
      describe: 'qs --new=<name> 跟默认模板创建新的模块<name>',
      type: 'string',
      conflicts: ['switch', 'delete']
    },
    switch: {
      alias: 's',
      describe:
        'qs --switch=<name> 将当前模块切换为<name>,如果<name> 不存在则以当前模块为模板创建新模块',
      type: 'string',
      conflicts: ['new', 'delete']
    },
    delete: {
      alias: 'd',
      describe: 'delete',
      type: 'string',
      conflicts: ['new', 'switch']
    },
    root: {
      alias: 'r',
      describe: 'root',
      type: 'string',
      conflicts: ['init']
    },
    reset: {
      alias: 'rs',
      describe: 'reset Root',
      type: 'boolean',
      conflicts: ['init']
    },
    list: {
      alias: 'l',
      describe: '列出所有模块',
      type: 'boolean'
    },
    rename: {
      alias: 'R',
      describe:
        'qs -s=<name> --rename  将新生产模块所有文件的名字改为跟模板目录相同,为了微信小程序那种形式',
      type: 'boolean'
    },
    init: {
      describe:
        '主要是初始化 qs 的默认配置目前有三个配置,生成的配置默认存在当前目录的 `.qsrc`文件中'
    }
  })
  .help()
  .alias(['h', 'help'], 'help').argv

const options = getConfig(args)

main(options)
