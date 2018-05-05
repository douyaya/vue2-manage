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
//获取套餐分析数据
export function analyseCombo (data) {
  return http.post('/order/comboOrderDataStatistics.do',data)
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
//添加陪驾人
export function addDriver (data) {
  return http.post('/driver/addDriver.do',data)
}
//删除巡检
export function deleteDrive (data) {
  return http.post('/driver/deleteDriver.do',data)
}
//获取微信关注者信息
export function getWxUser (data) {
  return http.post('/user/getAllWxFollowers.do',data)
}
//获取用户信息列表
export function getUserMsg (data) {
  return http.post('/user/getAllUsers.do',data)
}
//添加用户
export function addUser (data) {
  return http.post('/user/saveUsers.do',data)
}
//删除用户
export function deleteUser (data) {
  return http.post('/user/deleteUsers.do',data)
}
//重置密码
export function setPassword (data) {
  return http.post('/pwd/reset.do',data)
}
//分页获取约车单
export function getSubscribeOrder (data) {
  return http.post('/order/getAllApply.do',data)
}
//获取可用陪驾人员
export function allotDriver (data) {
  return http.post('/driver/getDrivers.do',data)
}
//陪驾人id查询订单
export function getDriverOrder (data) {
  return http.post('/order/getOrderByDid.do',data)
}
//分配陪驾人
export function Allot (data) {
  return http.post('/allot/driver.do',data)
}
//登陆
export function login (data) {
  return http.post('/login/login.do',data)
}
//修改密码 
export function modifyPwd (data) {
  return http.post('/pwd/modify.do',data)
}
//获取陪驾师审核列表分页
export function getApplyList (data) {
  return http.post('/driver/getAllDriverApplys.do',data)
}
//获取申请图片
export function getApplyImg (data) {
  return http.post('/driver/getPic.do',data)
}
//操作申请陪驾单
export function operateApply (data) {
  return http.post('/driver/examineApply.do', data)
}