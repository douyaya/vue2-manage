<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
		  		<div class="manage_tip">
		  			<p>elm后台管理系统</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
// import {storage} from '@/storage'
	// import {login, getAdminInfo} from '@/api/getData'
	// import {mapActions, mapState} from 'vuex'
	import {setUser,getUser} from '@/api/utility.js'
	import {login} from '@/api/index.js'
	let sha256 = require("js-sha256").sha256
	export default {
	    data(){
			return {
				loginForm: {
					username: '',
					password: '',
				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				}
			}
		},
		created () {
			// setUser(JSON.stringify({username:'ffff',password:'dddd'}))
			// localStorage.removeItem('User')
			if (getUser() !== undefined) {
				this.loginForm = JSON.parse(getUser()).user
				// console.log(this.loginForm)
			} 
		},
		methods: {
			async submitForm(formName) {
				let _this = this
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let data = {
							account:this.loginForm.username,
							password:sha256('8nM6H7K15IWVXx5U48rZuR11KtuMjkM3c5RdpSW0J9QVXyceae1tj7xSGpXNTOvd' + sha256(this.loginForm.password))
						}
						login(data).then(res => {
							if (res.code === '0') {
								let data = {
									login:true
								}
								data.user = {
									username:_this.loginForm.username,
									password:_this.loginForm.password,
									id:res.data.id,
									userType:res.data.userType
								}
								console.log(data)
								setUser(JSON.stringify(data))
								this.$message({
									type:'success',
									message:'登陆成功'
								})
								this.$router.push('/manage')
							} else {
								this.$message({
									type:'info',
									message:'登陆失败'
								})
							}
						})
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入正确的用户名密码',
							offset: 100
						})
						return false
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page{
		background-color: #324057;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(320px, 210px);
		.ctp(320px, 210px);
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		.submit_btn{
			width: 100%;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
</style>
