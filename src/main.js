import Vue from 'vue'
import App from './App'
import router from './router'
// import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import echarts from 'echarts'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts
new Vue({
	el: '#app',
	router,
	// store,
	template: '<App/>',
	components: { App }
})
