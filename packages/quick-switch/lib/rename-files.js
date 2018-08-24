const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')
function renameFiles (dir, target) {
  let files = glob.sync(path.join(dir, '**', '*.*'))
  files.forEach(filePath => {
    let name = path.parse(filePath).base // 带上文件后缀防止目录名和文件名字一样
    let ext = path.parse(filePath).ext
    let targetPath = filePath.replace(name, `${target}${ext}`)
    fs.renameSync(filePath, targetPath)
  })
}
module.exports = renameFiles
