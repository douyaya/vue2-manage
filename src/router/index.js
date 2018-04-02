import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const ComboList = r => require.ensure([], () => r(require('@/page/combo/ComboList')), 'ComboList');
const ComboOrder = r => require.ensure([], () => r(require('@/page/combo/ComboOrder')), 'ComboOrder');
const CarList = r => require.ensure([], () => r(require('@/page/car/CarList')), 'CarList');
const Driver = r => require.ensure([], () => r(require('@/page/driver/Driver')), 'Driver');
const SubscribeOrder = r => require.ensure([], () => r(require('@/page/subscribe/SubscribeOrder')), 'SubscribeOrder');
const AttentionUser = r => require.ensure([], () => r(require('@/page/attention/AttentionUser')), 'AttentionUser');
const SystemUser = r => require.ensure([], () => r(require('@/page/user/SystemUser')), 'SystemUser');
const OperateDriver = r => require.ensure([], () => r(require('@/page/driver/OperateDriver')), 'OperateDriver');
const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		children:[
			{
				path: '',
				component: OperateDriver,
				meta: ['分配陪驾人']
			},
			{
				path:'/combolist',
				component:ComboList,
				meta:['套餐管理','在售套餐列表']
			},
			{
				path: '/comboOrder',
				component: ComboOrder,
				meta: ['套餐管理', '已购套餐记录']
			},
			{
				path: '/carList',
				component: CarList,
				meta: ['车辆管理', '车辆列表']
			},
			{
				path: '/driver',
				component: Driver,
				meta: ['陪驾人员管理', '陪驾人列表']
			},
			{
				path: '/subscribeorder',
				component: SubscribeOrder,
				meta: ['预约订单管理', '订单列表']
			},
			{
				path: '/attention',
				component: AttentionUser,
				meta: ['公众号用户管理', '关注人列表']
			},
			{
				path: '/system',
				component: SystemUser,
				meta: ['系统用户管理', '用户列表']
			},
			{
				path: '/operateDriver',
				component: OperateDriver,
				meta: ['陪驾人员管理', '分配陪驾']
			}
		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
