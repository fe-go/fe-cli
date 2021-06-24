const shell = require('shelljs')
const fs = require('fs-extra')
const path = require('path')
const downloadTemplate = function(cwd, target, branch) {
  shell.exec('git init', { cwd })
  shell.exec(
    'git remote add -f origin ssh://git@git.xxxx.com/xxx/xxx.git',
    {
      cwd
    }
  )
  shell.exec('git config core.sparsecheckout true', { cwd })
  shell.exec(`echo packages/${target}-template >> .git/info/sparse-checkout`, {
    cwd
  })
  console.log(`git pull origin ${branch}`)
  shell.exec(`git pull origin ${branch}`, { cwd })
}
/**
 *
 * @param {*} name
 * @param {*} target
 */
module.exports = async (name, target, branch) => {
  const tempPath = path.resolve('temp')
  fs.ensureDirSync(tempPath)
  downloadTemplate(tempPath, target, branch)
  fs.copySync(tempPath + `/packages/${target}-template`, path.resolve(name))
  fs.removeSync(tempPath)
}
