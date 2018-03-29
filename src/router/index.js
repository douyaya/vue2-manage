import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const ComboList = r => require.ensure([], () => r(require('@/page/combo/ComboList')),'ComboList');
const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children:[
			{
				path:'',
				component:ComboList,
				meta:[]
			},
			{
				path:'/combolist',
				component:ComboList,
				meta:['套餐管理','套餐列表']
			}
		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
