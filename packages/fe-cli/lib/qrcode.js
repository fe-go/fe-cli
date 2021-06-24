const qrcode = require('qrcode-terminal')

function genQrCode(url, size, cb) {
  return qrcode.generate(url, {small: size === 'small' ? true : false}, cb)
}

// genQrCode('www.google.com')

// module.exports = (url, size, cb) => {
//   qrcode.generate(url, {small: size === 'small' ? true : false}, cb)
// }

module.exports = {
  genQrCode
}
