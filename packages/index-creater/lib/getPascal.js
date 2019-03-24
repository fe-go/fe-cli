/**
 * 将传入的字符串的首字母转为大写
 */
function capitalize([first, ...rest]) {
    return first.toUpperCase() + rest.join('')
}
/**
 *
 * @param {String} x 传入字符串
 * @param {RegExp} separator 分割符号
 * @example
 * getPascal('action-sheet',/(-|_)/g)
 * => 'ActionSheet'
 * @example
 *  getPascal('action',/(-|_)/g)
 * => 'Action'
 */
function getPascal(x, separator) {
    const arr = x.split(separator)
    let str = capitalize(x)
    if (arr.length > 1) {
        str = arr.reduce((a, b) => capitalize(a) + capitalize(b))
    }
    // str.replace(separator, "") 是为了处理当
    return str.replace(separator, '')
}
module.exports = getPascal
