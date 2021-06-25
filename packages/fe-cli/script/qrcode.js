const qrcode = require('qrcode-terminal')

function genQrCode(url, opts, cb) {
  let size = false
  if (opts) {
    size = opts['small']
  }
  return qrcode.generate(url, {small: size ? true : false}, cb)
}
module.exports = genQrCode

