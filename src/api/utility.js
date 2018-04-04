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
//车牌号验证
export function checkvehicleCode (str) {
  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9]{1,2}$/
  return reg.test(str)
}