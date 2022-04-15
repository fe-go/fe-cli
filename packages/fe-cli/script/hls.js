const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').execSync
const { blue, red, green } = require('../lib/color')
const Progressbar = require('../lib/progressbar')
const ora = require('ora')

module.exports = async (src, dist, time) => {
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

  fs.ensureDirSync(path.resolve(dist))
  const sourcePath = path.resolve(src)
  // 当文件名为中文是 s3 上传会失败，创建临时目录转移视频
  const tempPath = path.resolve(dist, 'hls' + path.parse(src).ext)
  await fs.renameSync(sourcePath, tempPath)
  const outputPath = path.resolve(dist, `${path.parse(tempPath).name}.m3u8`)

  const spinner = ora('progress').start()
  const pb = new Progressbar()
  // ffmpeg -i output.mp4 -c:v libx264 -c:a aac -strict -2 -f hls -hls_list_size 0 -hls_time 5 output1.m3u8
  ffmpeg(tempPath, { timeout: 432000 })
    // set video bitrate
    .videoBitrate(1024)
    // set h264 preset
    // .addOption('preset', 'superfast')
    // set target codec
    .videoCodec('libx264')
    // set audio bitrate
    // .audioBitrate('128k')
    // set audio codec
    .audioCodec('aac')
    // set number of audio channels
    .audioChannels(2)
    // 强制一秒一个关键帧
    .addOption('-force_key_frames', 'expr:gte(t,n_forced*1)')
    // set hls segments time

    .addOption('-hls_time', Number(time))
    // include all the segments in the list
    .addOption('-hls_list_size', 0)
    .on('progress', function (progress) {
      spinner.color = 'yellow'
      const percent = progress.percent
      if (!percent) return
      spinner.text = pb.render(percent)
    })
    // setup event handlers
    .on('end', async function () {
      spinner.succeed(green(`${src} file has been converted succesfully`))
      // ora('uploding').start()
      // 恢复视频文件
      await fs.renameSync(tempPath, sourcePath)
      process.exit(0)
      // spinner.succeed(green('upload done'))
    
    })
    .on('error', async function (err) {
      await fs.renameSync(tempPath, sourcePath)
      spinner.fail(red('an error happened: ') + err.message)
    })
    // save to file
    .save(outputPath)
}
