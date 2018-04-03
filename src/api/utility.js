// 获取图片类型
export function typeofimg(file) {
  let name = file.name
  let index = name.indexOf('.')
  return name.slice(index + 1)
}
//去除前后空格
export function clearNull (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
//判断一个字符串中是否只有数字
export function allNumber (str) {
  let reg = /^[0-9]+$/
  return reg.test(str)
}