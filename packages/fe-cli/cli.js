#!/usr/bin/env node

const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('./package.json')
require('./lib/checkNodeVersion')

const notifier = updateNotifier({ pkg })

if (notifier.update) {
  console.log(`Update available: ${notifier.update.latest}`)
}

program
  .version(pkg.version, '-v, --version', 'version')
  .option('--code', '使用 vscode 展示 diff')
// .option('-p, --packages [value]', '新生成monorepo组件')
// .option('--type <string>', '编译类型 dev,build,prepub,publish,test')

program
  .command('hls <src> <dist>')
  .description('视频切片')
  .action(async (src, dist) => {
    console.log(src, dist)
    require('./script/hls')(src, dist)
  })

program
  .command('diff <file1> <file2>')
  .description('展示文件 diff')
  .action(async (one, other) => {
    require('./script/diff')(one, other, program.opts())
  })

program.on('--help', function () {
  console.log('')
  console.log('Examples:')
  console.log('  $ fe diff file1 file2')
  console.log('  $ fe diff file1 file2 --code')
  console.log('  $ fe hls xxx.mp4 dist')
})

try {
  program.parse(process.argv)
} catch (err) {
  program.outputHelp()
}

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
