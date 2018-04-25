<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  	<el-col :span="3" style="min-height:100%;background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="iconfont">&#xe650;</i>套餐管理</template>
						<el-menu-item index="comboList">在售套餐</el-menu-item>
						<el-menu-item index="comboOrder">套餐订单</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="iconfont">&#xe607;</i>预约订单管理</template>
						<el-menu-item index="subscribeorder">订单列表</el-menu-item>
					</el-submenu>
					 <el-submenu index="4">
						<template slot="title"><i class="iconfont">&#xe62b;</i>车辆管理</template>
						<el-menu-item index="carList">车辆列表</el-menu-item>
					</el-submenu>
					<el-submenu index="5">
						<template slot="title"><i class="iconfont">&#xe619;</i>陪驾管理</template>
						<el-menu-item index="driver">陪驾师列表</el-menu-item>
						<el-menu-item index="applyDriver">陪驾师申请</el-menu-item>
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="iconfont">&#xe786;</i>关注用户管理</template>
						<el-menu-item index="attention">关注人列表</el-menu-item>
					</el-submenu>
					<el-submenu index="7" v-show="userType === 1">
						<template slot="title"><i class="iconfont">&#xe619;</i>系统用户管理</template>
						<el-menu-item index="system">用户列表</el-menu-item>
					</el-submenu> 
				</el-menu>
			</el-col>
			<el-col :span="21" style="height: 100%;overflow: auto;">
				<!-- <keep-alive> -->
				    <router-view></router-view>
				<!-- </keep-alive> -->
			</el-col>
		</el-row>
  	</div>
</template>
<script>
import {getUser,setUser} from '@/api/utility.js'
	export default {
		data () {
			return {
				userType:null
			}
		},
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '')
			}
		},
		created () {
			let data = getUser()
			if (data === undefined) {
				this.$router.push('/')
			} else {
				this.userType = JSON.parse(data).user.userType
			}
		}
	}
</script>


<style lang="less">
	@import '../style/mixin';
	.manage_page{
		.el-menu-item{
			min-width:150px !important;
		}
	}
</style>
