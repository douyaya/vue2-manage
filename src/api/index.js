import http from './http.js'
//获取在售套餐列表
export function getComboData (data) {
  return http.post('/combo/getAllCombos.do',data)
}
//获取所有车型
export function getAllCar () {
  return http.post('/vmodel/getVModels.do')
}
//修改套餐信息
export function modifyCombo (data) {
  return http.post('/combo/modifyCombo.do',data)
}
//添加套餐信息
export function addCombo (data) {
  return http.post('/combo/addCombo.do',data)
}
//删除套餐
export function deleteCombo (data) {
  return http.post('/combo/deleteCombo.do',data)
}