const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').execSync
const { blue, red, green } = require('../lib/color')
const Progressbar = require('../lib/progressbar')
const ora = require('ora')

module.exports = (src, outdir) => {
  // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/blob/master/examples/livertmp2hls.js
  // make sure you set the correct path to your video file
  try {
    // 没有 ffmpeg 直接抛错
    exec('which ffmpeg')
  } catch (error) {
    console.log('请确保已经安装 ffmpeg')
    console.log('mac 推荐通过 homebrew 安装')
    console.log('$ brew install ffmpeg ')
    // console.log(error.toString())
    process.exit(0)
  }

  const sourcePath = path.resolve(src)
  const outputPath = path.resolve(outdir, `${path.parse(src).name}.m3u8`)
  fs.ensureDirSync(path.resolve(outdir))
  const spinner = ora('fe hls').start()
  const pb = new Progressbar()
  ffmpeg(sourcePath, { timeout: 432000 })
    // set video bitrate
    .videoBitrate(1024)
    // set h264 preset
    // .addOption('preset', 'superfast')
    // set target codec
    .videoCodec('libx264')
    // set audio bitrate
    // .audioBitrate('128k')
    // set audio codec
    // .audioCodec('libfaac')
    // set number of audio channels
    .audioChannels(2)
    // set hls segments time
    .addOption('-hls_time', 10)
    // include all the segments in the list
    .addOption('-hls_list_size', 0)
    .on('progress', function (progress) {
      spinner.color = 'yellow'
      spinner.text = pb.render(progress.percent.toFixed(2))
    })
    // setup event handlers
    .on('end', function () {
      spinner.succeed(green(`${src} file has been converted succesfully`))
      process.exit(1)
    })
    .on('error', function (err) {
      spinner.fail(red('an error happened: ') + err.message)
    })
    // save to file
    .save(outputPath)
}
