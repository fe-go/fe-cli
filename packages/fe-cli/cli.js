#!/usr/bin/env node

const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('./package.json')
const qrCode = require('./lib/qrcode')
require('./lib/checkNodeVersion')

const notifier = updateNotifier({ pkg })

if (notifier.update) {
  console.log(`Update available: ${notifier.update.latest}`)
}

program
  .version(pkg.version, '-v, --version', 'version')
  // .option('--name <string>', '新生成组件的名称')
  // .option('-p, --packages [value]', '新生成monorepo组件')
  // .option('--type <string>', '编译类型 dev,build,prepub,publish,test')

program
  .command('hls <src> [dist]')
  .description('cube 编译')
  .action(async (src,dist) => {
    console.log(src,dist)
    // let { source } = program.opts()
      // require('./script/hls')(type)
  })

program
  .command('qr <url> [size]')
  .description('generate qrcode')
  .action((url, size) => {
    qrCode.genQrCode(url, size)
  })


program.on('--help', function() {
  console.log('')
  console.log('Examples:')
  console.log('  $ cube create')
  
})

try {
  program.parse(process.argv)
} catch (err) {
  program.outputHelp()
}

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
