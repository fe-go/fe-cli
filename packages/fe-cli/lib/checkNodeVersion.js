const path = require('path')
const fs = require('fs')
const semver = require('semver')
const { red } = require('./color')

function checkNodeVersion() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return
  }

  const packageJson = require(packageJsonPath)
  if (!packageJson.engines || !packageJson.engines.node) {
    return
  }

  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(
      red(
        'You are running Node %s.\n' +
          'cube-cli requires Node %s or higher. \n' +
          'Please update your version of Node.'
      ),
      process.version,
      packageJson.engines.node
    )
    process.exit(1)
  }
}
checkNodeVersion()
