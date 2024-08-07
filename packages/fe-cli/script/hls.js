const path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').execSync
const { blue, red, green } = require('../lib/color')
const Progressbar = require('../lib/progressbar')
const ora = require('ora')
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg')
/**
 * node 16
 */
const ffmpeg = createFFmpeg({
    log: true
})

module.exports = async (src, dist, time=2) => {
    fs.ensureDirSync(path.resolve(dist))
    const sourcePath = path.resolve(src)
    // 当文件名为中文是 s3 上传会失败，创建临时目录转移视频
    const memSourcePath = 'hls' + path.parse(src).ext
    // await fs.renameSync(sourcePath, memSourcePath)
    // const outputPath = path.resolve(dist, `${path.parse(memSourcePath).name}.m3u8`)
    const outputPath = path.resolve(dist)
    const spinner = ora('progress').start()
    const pb = new Progressbar()
    // ffmpeg -i output.mp4 -c:v libx264 -c:a aac -strict -2 -f hls -hls_list_size 0 -hls_time 5 output1.m3u8
    await ffmpeg.load()
    ffmpeg.FS('writeFile', memSourcePath, await fetchFile(path.resolve(src)))
    // await ffmpeg.run('-i,output.mp4,-c:v,libx264,-c:a,aac,-strict,-2,-f,hls,-hls_list_size,0,-hls_time,5,output1.m3u8')
    // ffmpeg.setProgress(({ ratio }) => {
    //     /*
    //      * ratio is a float number between 0 to 1.
    //      */
    //     spinner.color = 'yellow'
    //     const percent = ratio
    //     if (!percent) return
    //     spinner.text = pb.render(percent)
    // })
    const r = await ffmpeg.run(
        '-i',
        memSourcePath,
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-strict',
        '-2',
        '-f',
        'hls',
        '-hls_list_size',
        '0',
        '-hls_time',
        String(time),
        '-force_key_frames',
        'expr:gte(t,n_forced*1)',
        'output.m3u8' // mem target
    )

    await fs.promises.writeFile(
        path.join(outputPath, 'hls.m3u8'),
        ffmpeg.FS('readFile', 'output.m3u8')
    )

    ffmpeg
        .FS('readdir', '/')
        .filter((p) => p.endsWith('.ts'))
        .forEach(async (p) => {
            console.log(p)
            await fs.promises.writeFile(
                path.join(outputPath, p),
                ffmpeg.FS('readFile', p)
            )
            // await fs.writeFileSync(outputPath, ffmpeg.FS('readFile', p))
        })
    spinner.succeed(green(`${src} file has been converted succesfully`))
    // ora('uploding').start()
    // 恢复视频文件
    // await fs.renameSync(memSourcePath, sourcePath)
    process.exit(0)
}
