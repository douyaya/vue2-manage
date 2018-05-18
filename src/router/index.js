import Vue from 'vue'
import Router from 'vue-router'
import {getUser} from '@/api/utility.js'
Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const ComboList = r => require.ensure([], () => r(require('@/page/combo/ComboList')), 'ComboList');
const ComboOrder = r => require.ensure([], () => r(require('@/page/combo/ComboOrder')), 'ComboOrder');
const CarList = r => require.ensure([], () => r(require('@/page/car/CarList')), 'CarList');
const Driver = r => require.ensure([], () => r(require('@/page/driver/Driver')), 'Driver');
const ApplyDriver = r => require.ensure([], () => r(require('@/page/driver/applyDriver')), 'ApplyDriver');
const SubscribeOrder = r => require.ensure([], () => r(require('@/page/subscribe/SubscribeOrder')), 'SubscribeOrder');
const AttentionUser = r => require.ensure([], () => r(require('@/page/attention/AttentionUser')), 'AttentionUser');
const Recommend = r => require.ensure([], () => r(require('@/page/attention/Recommend')), 'Recommend');
const SystemUser = r => require.ensure([], () => r(require('@/page/user/SystemUser')), 'SystemUser');
const OperateDriver = r => require.ensure([], () => r(require('@/page/subscribe/OperateDriver')), 'OperateDriver');
const ModifyPwd = r => require.ensure([], () => r(require('@/page/user/ModifyPwd')), 'ModifyPwd');
const router = new Router({
	routes : [
	{
		path: '/',
		component: login,
		meta: {
			title: ['登陆'],
			requiresAuth: false
		}
	},
	{
		path: '/manage',
		component: manage,
		children:[
			{
				path: '/',
				component: SubscribeOrder,
				meta:{
					title: ['订单列表'],
					requiresAuth:true
				}
			},
			{
				path:'/combolist',
				component:ComboList,
				meta: {
					title: ['套餐管理', '在售套餐列表'],
					requiresAuth: true
				}
			},
			{
				path: '/comboOrder',
				component: ComboOrder,
				meta: {
					title: ['套餐管理', '已购套餐记录'],
					requiresAuth: true
				}
			},
			{
				path: '/carList',
				component: CarList,
				meta: {
					title: ['车辆管理', '车辆列表'],
					requiresAuth: true
				}
			},
			{
				path: '/driver',
				component: Driver,
				meta: {
					title: ['陪驾师员管理', '陪驾师列表'],
					requiresAuth: true
				}
			},
			{
				path: '/applyDriver',
				component: ApplyDriver,
				meta: {
					title: ['陪驾师管理', '陪驾师申请'],
					requiresAuth: true
				}
			},
			{
				path: '/subscribeorder',
				component: SubscribeOrder,
				meta: {
					title: ['预约订单管理', '订单列表'],
					requiresAuth: true
				}
			},
			{
				path: '/attention',
				component: AttentionUser,
				meta: {
					title: ['公众号用户管理', '关注人列表'],
					requiresAuth: true
				}
			},
			{
				path: '/recommend',
				component: Recommend,
				meta: {
					title: ['公众号用户管理', '推荐信息管理'],
					requiresAuth: true
				}
			},
			{
				path: '/system',
				component: SystemUser,
				meta: {
					title: ['系统用户管理', '用户列表'],
					requiresAuth: true
				}
			},
			{
				path: '/operateDriver',
				component: OperateDriver,
				meta: {
					title: ['分配陪驾师'],
					requiresAuth: true
				}
			},
			{
				path: '/modifyPwd',
				component: ModifyPwd,
				meta: {
					title: ['修改密码'],
					requiresAuth: true
				}
			}
		]
	}
]
	// strict: process.env.NODE_ENV !== 'production',
})
// router.beforeEach((to,from,next) => {
//  	if (to.meta.requiresAuth) {
// 		if (getUser() !== undefined) {
// 			let data = JSON.parse(getUser())
// 			if (data.login) {
// 				next()
// 			} else {
// 				next({ path: '/'})
// 			}
// 		} else {
// 			next({ path: '/'})
// 		}
//  	} else {
// 		 next()
// 	 }
// })
export default router
