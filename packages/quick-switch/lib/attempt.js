const debug = require('debug')('qs')
function attempt (func, ...args) {
  try {
    return func.apply(undefined, args)
  } catch (e) {
    debug(e)
    // return false
  }
}

module.exports = attempt
