#!/usr/bin/env node

const program = require('commander')
const { error } = require('qrcode-terminal')
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
  .option('-S, --small', 'small qrcode size')
// .option('-p, --packages [value]', '新生成monorepo组件')
// .option('--type <string>', '编译类型 dev,build,prepub,publish,test')

program
  .command('hls <src> <outdir>')
  .description('视频切片')
  .action(async (src, outdir) => {
    console.log(src, outdir)
    require('./script/hls')(src, outdir)
  })

program
  .command('diff <file1> <file2>')
  .description('展示文件 diff')
  .option('--code, --diff_mode <mode>', '通过 vscode 展示 DIFF', false)
  .action(async (one, other) => {
    require('./script/diff')(one, other, program.opts())
  })

program
  .command('qr <url>')
  .description('generate qrcode')
  .action((url) => {
    require('./script/qrcode')(url, program.opts())
  })

// get local public IP address
program
  .command('IP')
  .description('get local public IP address')
  .action(() => {
    console.log(require('./script/ipAddress')())
  })

program
  .command('iconfont <src> [dest]')
  .description(
    '去掉iconfont中冗余的引用资源,将需要引用的 .ttf 资源自动转化为 base64,简化 iconfont 引入方式。'
  )
  .action((src, dest = '.') => {
    require('./script/iconfont')(src, dest, program.opts())
  })

program
  .command('tinypng <src> [dest]')
  .description('压缩指定目录下的 .png .jpg .jpeg 文件')
  .action((src, dest = '.') => {
    require('./script/tinypng')(src, dest, program.opts())
  })

program.on('--help', function () {
  console.log('')
  console.log('Examples:')
  console.log('  $ fe diff file1 file2')
  console.log('  $ fe diff file1 file2 --code')
  console.log('  $ fe hls xxx.mp4 outdir')
  console.log('  $ fe qr URL')
  console.log('  $ fe qr URL -S/--small')
  console.log('  $ fe tinypng images outdir')
  console.log('  $ fe tinypng images')
  console.log('  $ fe tinypng xx.png outdir')
})

try {
  program.parse(process.argv)
} catch (err) {
  // 逻辑执行错误此处也会抛出
  console.log(err)
  // program.outputHelp()
}

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
