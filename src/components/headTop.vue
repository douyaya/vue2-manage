<template>
    <div class="header_container">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta.title" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown @command="handleCommand" menu-align='start'>
			<img src="../assets/img/avator.jpg" class="avator">
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="modify">修改密码</el-dropdown-item>
				<el-dropdown-item command="singout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>
import {getUser,setUser} from '@/api/utility.js'
    export default {
			methods:{
				handleCommand (command) {
					if (command === 'singout') {
						this.$confirm('确认退出？',{
							confirmButtonText:'确定',
							cancelButtonText:'取消'
						}).then(() => {
							let data = JSON.parse(getUser())
							data.login = false 
							setUser(JSON.stringify(data))
							this.$router.push('/')
						})
					} else {
						this.$router.push('/modifyPwd')
					}
				}
			}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
        text-align: center;
    }
</style>
