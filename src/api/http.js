/**
 * http配置
 */
import axios from 'axios'
import qs from 'qs'
// 超时时间
// axios.defaults.timeout = 5000
// axios.defaults.withCredentials = true
// http请求拦截器
// var loadinginstace
axios.interceptors.request.use(config => {
  // element ui Loading方法
  // loadinginstace = Loading.service({ fullscreen: true })
  return config
}, error => {
  // loadinginstace.close()
  // Message.error({
  //   message: '加载超时'
  // })
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {
  return data
}, error => {
  // alert('网络错误')
  return Promise.reject(error)
})

export default {
  post(url, data) {
    return axios({
      method: 'post',
      // baseURL: 'http://pjmgr.howelliot.com:8080/evdrive_wx',
      baseURL: 'http://192.168.1.106:8084',
      url,
      data: qs.stringify(data),
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((response) => {
      return (typeof response.data === 'string' ? JSON.parse(response.data) : response.data)
    })
  },
  get(url, params) {
    return axios({
      method: 'get',
      // baseURL: 'http://pjmgr.howelliot.com:8080/evdrive_wx',
      baseURL: 'http://192.168.1.106:8084',
      url,
      params, // get 请求时带的参数
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((response) => {
      return (typeof response.data === 'string' ? JSON.parse(response.data) : response.data)
    })
  }
}