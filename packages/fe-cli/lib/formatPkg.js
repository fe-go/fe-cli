const fs = require('fs-extra')
const path = require('path')
module.exports = (name, author, config) => {
  const monoScope = config && config.monoScope
  const pkgPath = monoScope ? path.resolve(`./${monoScope}/${name}/package.json`) : path.resolve(`./${name}/package.json`)
  let pkg = require(pkgPath)
  pkg.name = `@hfe/block-component-${name}`
  pkg.author = author
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}
