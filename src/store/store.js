import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'
import { cookieStorage } from '@/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_info: cookieStorage.get('user_info')
  },
  getters: {
    [types.USER_INFO]: state => {
      return state.user_info
    }
  },
  mutations: {
    // 登录存储
    [types.SET_USER_INFO]: (state, data) => {
      state.user_info = data || {}
      if (data === null) {
        cookieStorage.remove('user_info')
      } else {
        cookieStorage.set('user_info', data)
      }
    }
  }
})
