const fs = require('fs')
const path = require('path')
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg')

const ffmpeg = createFFmpeg({
    log: true
})

// ffmpeg -i output.mp4 -c:v libx264 -c:a aac -strict -2 -f hls -hls_list_size 0 -hls_time 5 output1.m3u8

;(async (src, dist, time) => {
    await ffmpeg.load()
    ffmpeg.FS('writeFile', 'flame.avi', await fetchFile(path.resolve(src)))
    // await ffmpeg.run('-i,output.mp4,-c:v,libx264,-c:a,aac,-strict,-2,-f,hls,-hls_list_size,0,-hls_time,5,output1.m3u8')
    ffmpeg.setProgress(({ ratio }) => {
        console.log('进度', ratio)
        /*
         * ratio is a float number between 0 to 1.
         */
    })
    const r = await ffmpeg.run(
        '-i',
        'flame.avi',
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
        'output.m3u8'
    )

    console.log(r)

    await fs.promises.writeFile(
        'output.m3u8',
        ffmpeg.FS('readFile', 'output.m3u8')
    )

    ffmpeg
        .FS('readdir', '/')
        .filter((p) => p.endsWith('.ts'))
        .forEach(async (p) => {
            fs.writeFileSync(p, ffmpeg.FS('readFile', p))
        })

    process.exit(0)
})()
