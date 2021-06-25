const qrcode = require('qrcode-terminal')

function genQrCode(url, size, cb) {
  return qrcode.generate(url, {small: size ? true : false}, cb)
}
module.exports = genQrCode
