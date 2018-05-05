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
  let reg = /^[0-9]+[.]?[0-9]*$/
  return reg.test(str)
}
//判断一个字符串中是否只有整数
export function allNumbertwo(str) {
  let reg = /^[0-9]+$/
  return reg.test(str)
}
//车牌号验证
export function checkvehicleCode (str) {
  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9]{1,2}$/
  return reg.test(str)
}
//验证手机号
export function checkCellphone(str) {
  let string = str.replace(/(^\s*)|(\s*$)/g, '')
  // let reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$/
  let reg = /^1(([3|4|5|8][0-9])|99|76|66)\d{8}$/
  return reg.test(string)
}
//验证身份证号
export function checkId (str) {
  let string = str.replace(/(^\s*)|(\s*$)/g, '')
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(string)
}
//将地址转换成字符串
export function addressStr (arr) {
  let str = ''
  for (let tmp of arr) {
    str += tmp.slice(tmp.indexOf('/')+1) + ' '
  }
  return str
}
let storage = window.sessionStorage
//本地存储用户名和密码
export function getUser () {
  return storage['User']
}
export function setUser (val) {
  storage.setItem('User',val)
}
//只获取套餐名称
export function getComboName (arr) {
  let arrs = []
  for (let tmp of arr) {
    arrs.push(tmp.comboName)
  }
  return arrs
}