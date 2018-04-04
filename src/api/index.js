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
//套餐订单记录列表
export function comboPayList (data) {
  return http.post('/order/getAllComboOrder.do',data)
}
//获取车辆信息
export function getCatData (data) {
  return http.post('/vehicle/getAllVehicle.do',data)
}
//添加车辆信息
export function addCar (data) {
  return http.post('/vehicle/addVehilce.do',data)
}
//操作车辆的状态
export function setUseStatus (data) {
  return http.post('/vehicle/modifyVehicle.do',data)
}
//获取陪驾人信息
export function getDriver (data) {
  return http.post('/driver/getAllDriver.do',data)
}