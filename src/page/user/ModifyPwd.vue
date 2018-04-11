<template>
  <div class="modifyPwd">
    <div class="title">{{`修改密码`}}</div> 
    <div class="form-container">
      <el-form style="width:50%" ref="form" :rules="rules" :model="form">
        <el-form-item label="旧密码" prop="oldPwd" label-width="100px"> 
          <el-input type="password" v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" label-width="100px"> 
          <el-input type="password" v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd" label-width="100px"> 
          <el-input type="password" v-model="form.confirmPwd"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="confirmModify('form')">确认</el-button>
    </div>
  </div>
</template>
<script>
import {getUser} from '@/api/utility.js'
import {modifyPwd} from '@/api/index.js'
let sha256 = require('js-sha256').sha256
export default {
  name:'ModifyPwd',
  data () {
    let valiDatePwd = (rules,value,callback) => {
      if (value !== this.form.newPwd) {
        callback(new Error('两次密码不一致'))
      }
      else {
        callback()
      }
    }
    return {
      userDate:{},
      form:{
        oldPwd:'',
        newPwd:'',
        confirmPwd:''
      },
      rules:{
        oldPwd:[{required:true,message:'密码不能为空',trigger:'blur'}],
        newPwd:[{required:true,message:'密码不能为空',trigger:'blur'}],
        confirmPwd:[{required:true,message:'密码不能为空',trigger:'blur'},
          {validator:valiDatePwd}
        ]
      }
    }
  },
  created () {
    this.userDate = JSON.parse(getUser()).user
  },
  methods:{
    confirmModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            id:this.userDate.id,
            password:sha256(this.form.oldPwd),
            newPassword:sha256(this.form.newPwd)
          }
          modifyPwd(data).then(res => {
            if (res.code === '0') {
              this.$message({
                type:'success',
                message:'修改成功'
              })
              setTimeout(() => {
                this.$router.push('/')
              }, 1000);
            } else {
              this.$message({
                type:'info',
                message:'修改失败'
              })
            }
          })
        } else {
          this.$message({
            type:'info',
            message:'信息填写不正确'
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .modifyPwd{
    text-align:center;
    .title{
      font-size:20px;
      height:200px;
      line-height:200px;
    }
    .form-container{
      display:flex;
      justify-content: space-around;
    }
    .btn{
      margin-top:100px;
    }
  }
</style>