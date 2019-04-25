#!/usr/bin/env node

const yargs = require('yargs')
const run = require('./run')

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
    list: {
      alias: 'l',
      describe: '列出所有模块',
      type: 'boolean'
    },
    init: {
      describe:
        '主要是初始化 qs 的默认配置目前有三个配置,生成的配置默认存在当前目录的 `.qsrc`文件中'
    }
  })
  .help()
  .alias(['h', 'help'], 'help').argv

run(args)
