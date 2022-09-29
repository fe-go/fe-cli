const { green, blue, red } = require('../lib/color')
const fs = require('fs-extra')
const Diff = require('diff')
const exec = require('child_process').execSync
function diffFile(one, other) {
  const f1 = fs.readFileSync(one).toString()
  const f2 = fs.readFileSync(other).toString()
  const diff = Diff.diffLines(f1, f2)
  diff.forEach((part) => {
    // green for additions, red for deletions
    // grey for common parts
    let text = ''
    if (part.added) {
      text = green(`+ ${part.value}`)
    } else if (part.removed) {
      text = red(`- ${part.value}`)
    } else {
      text = `  ${part.value}`
    }
    process.stdout.write(text)
  })
}

module.exports = (one, other, opts) => {
  try {
    exec(`code --diff ${one} ${other}`)
    process.exit(0)
  } catch (error) {
    diffFile(one, other)
  }

  // console.log(blue('\n\nfe-cli tips\n'))
  // console.log(green('如果已经安装了 vscode 并且 code 命令已经添加到环境变量中可以添加 --code options'))
  // console.log(green('$ fe diff file1 file2 --code'))
}
