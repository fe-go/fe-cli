//  console.log('\033[42;30m heee') \033[背景色编号;字色编号m
//  字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
//  背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色
//  033 x1B等效而且还不区分大小写
//https://www.jianshu.com/p/cca3e72c3ba7
const ColorMap = {
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  purple: 5,
  darkGreen: 6,
  white: 7
}
/**
 *
 * @param {string} x 文字颜色
 * @param {string} y 背景颜色
 */
function color(x = 7, y) {
  const fontColor = `3${x}m`
  const backgroundColor = y !== undefined ? `4${y};` : ''
  return message => {
    return '\033' + `[${backgroundColor}${fontColor}${message}` + '\033[0m'
  }
}

const blue = color(ColorMap.blue)
const red = color(ColorMap.red)
const green = color(ColorMap.green)

// console.log(blue('reerer'))
// console.log(red('reerer'))
// console.log(green('reerer'))
// console.log(color(ColorMap.red, ColorMap.green)('reerer'))
// console.log(green('reerer'))

module.exports = {
  blue,
  green,
  red,
  color
}
