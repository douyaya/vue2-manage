<template>
  <div class="systemuser">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-button @click="addDate" size="mini" type="primary"><i class="el-icon-plus"></i> 添加数据</el-button>
    </search>
    <div class="table_container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="编号">
            <template slot-scope="props">
              <span style="margin-left:20px;">{{props.row.rowNum}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="账户名"
          prop="account">
        </el-table-column>
        <el-table-column
          label="真实姓名"
          prop="realname">
        </el-table-column>
        <el-table-column
          label="联系方式" width="150px"
          prop="cellphone">
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="props">
            <span>{{props.row.gender === 0 ? '男' : '女'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
               <el-button
              size="small"
              type="primary"
              @click="setpassword(scope.$index, scope.row)">重置密码</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>  
    </div>
    <!-- 修改页面 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose('form')">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="80px">
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="form.realname"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="account">
          <el-input v-model="form.account" :readonly="form.id !== undefined"></el-input>
        </el-form-item>
        <div v-if="!form.id">
          <el-form-item label="密码" prop="passwordOne">
            <el-input type="password" v-model="form.passwordOne"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordTwo">
            <el-input type="password" v-model="form.passwordTwo"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="手机号" prop="cellphone">
          <el-input v-model="form.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" style="width:100%">
            <el-option v-for="item in options"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="footers">
        <el-button @click="handleClose('form')">取 消</el-button>
        <el-button type="primary" @click="confirmModify('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      :title="titles"
      :visible.sync="dialogVisibles"
      width="30%"
      @close="handleCloses('form1')">
        <el-form ref="form1" :model="form1" :rules="rules1" class="form1" label-width="80px">
          <el-form-item label="密码" prop="passwordsone">
            <el-input type="password" v-model="form1.passwordsone"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordstwo">
            <el-input type="password" v-model="form1.passwordstwo"></el-input>
          </el-form-item>
        </el-form>
        <div class="footers">
        <el-button @click="handleCloses('form1')">取 消</el-button>
        <el-button type="primary" @click="confirmModifys('form1')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="Pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import Search from '@/components/search'
import {getUserMsg,addUser,setPassword,deleteUser} from '@/api/index.js'
import {checkCellphone} from '@/api/utility.js'
let sha256 = require('js-sha256').sha256
export default {
  name:'SystemUser',
  components:{
    headTop,
    Search
  },
  data () {
    let validatePass = (rule,value,callback) => {
      if (value !== this.form.passwordOne) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    let validateCellphone = (rule,value,callback) => {
      if (!checkCellphone(value)) {
        callback(new Error('手机号格式不对'))
      } else {
        callback()
      }
    }
    let validatePassword = (rule,value,callback) => {
      if (value !==this.form1.passwordsone) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      text:'请输入真实姓名',
      currentPage:1,//当前页码
      count:0,//总条目数
      tableData:[],
      load_data:true, //是否在加载数据
      dialogVisible:false, //弹出修改窗口
      dialogVisibles:false, //修改密码窗口
      form:{              //修改数据
        realname:'', 
        account:'',    
        cellphone:'',  
        gender:0,
        passwordOne:'',
        passwordTwo:''
      },
      form1:{
        passwordsone:'',
        passwordstwo:''
      },
      pageSize:15,
      title:'添加系统用户',
      titles:'',
      options:[
        {key:0,value:'男'},
        {key:1,value:'女'}
      ],
      rules:{
        name:[{required:true,message:'必须填写真实姓名',trigger:'blur'}],
        account:[{required:true,message:'必须填写账户名',trigger:'blur'}],
        passwordOne:[{required:true,message:'必须填写密码',trigger:'blur'}],
        passwordTwo:[
          {required:true,message:'必须填写密码',trigger:'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        cellphone:[
          {required:true,message:'必须填写密码',trigger:'blur'},
          {validator: validateCellphone, trigger: 'blur'}
        ],
        gender:[{type:'number',required:true,message:'必须选择性别',trigger:'blur'}]
      },
      rules1:{
        passwordsone:[{required:true,message:'必须填写密码',trigger:'blur'}],
        passwordstwo:[{validator:validatePassword},
          {required:true,message:'必须填写密码',trigger:'blur'}]
      }
    }
  },
  created () {
    this.getComboData(1,'')
  },
  methods:{
    //添加数据
    addDate () {
      this.dialogVisible = true
      this.form = {              //修改数据
        realname:'', 
        account:'',    
        cellphone:'',  
        gender:0,
        passwordOne:'',
        passwordTwo:''
      }
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this._search()
    },
    //获取套餐数据
    getComboData (pageNo,name) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name
      }
      getUserMsg(data).then(res => {
        if (res.code === '0') {
          this.count = res.data.totalRecord
          this.tableData = res.data.results
          this.load_data = false
        }
      })
    },
    //删除数据
    handleDelete (index,val) {
      this.$confirm('确认删除该用户？',{
        confrimButtonText:'确认',
        cancelButtonText:'取消'
      }).then(() => {
        let data ={
          id:val.id
        }
        deleteUser(data).then(res => {
          if (res.code === '0') {
            this.getComboData(this.currentPage,this.$refs.search.searchText)
            this.$message({
              type:'success',
              message:'删除成功'
            })
          } else {
            this.$message({
              type:'info',
              message:'删除失败'
            })
          }
        })
      })
    },
    //重置密码
    setpassword (index,val) {
      this.titles = '修改用户'+val.account+'的密码'
      this.dialogVisibles = true
      this.form1.id = val.id
    },
    //修改数据
    handleEdit (index,val) {
      this.title = '修改用户信息'
      this.form = val
      this.dialogVisible = true
    },
    //刷新/搜索
    _search () {
      this.getComboData(this.currentPage,this.$refs.search.searchText)
    },
    //提交修改/添加
    confirmModify (formName) {
      this.title = '添加用户信息'
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认执行该操作？',{
            confrimButtonText:'确定',
            cancelButtonText:'取消'
          }).then(() => {
            let data 
            if (_this.form.id === undefined) {
              data = {
                name:_this.form.realname,
                account:_this.form.account,
                cellphone:_this.form.cellphone,
                gender:_this.form.gender,
                password:sha256(_this.form.passwordOne)
              }
            } else {
              data = {
                name:_this.form.realname,
                id:_this.form.id,
                cellphone:_this.form.cellphone,
                gender:_this.form.gender,
              }
            }
            addUser(data).then(res => {
              if (res.code === '0') {
                _this.$refs[formName].resetFields()
                _this.dialogVisible = false
                _this.getComboData(_this.currentPage,_this.$refs.search.searchText)
                this.$message({
                  type:'success',
                  message:'添加成功'
                })
              } else {
                this.$message({
                  type:'info',
                  message:'添加失败'
                })
              }
            })
          })
        } else {
          return false
        }
      })
    },
    //重置密码
    confirmModifys (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认重置密码？',{
            confrimButtonText:'确定',
            cancelButtonText:'取消'
          }).then(() => {
            let data = {
              id:_this.form1.id,
              password:sha256(_this.form1.passwordsone)
            }
            setPassword(data).then(res => {
              if (res.code === '0') {
                _this.dialogVisibles = false
                _this.getComboData(_this.currentPage,_this.$refs.search.searchText)
                _this.$message({
                  type:'success',
                  message:'重置成功'
                })
              } else {
                _this.$message({
                  type:'info',
                  message:'添加失败'
                })
              }
            })
          })
        }
      })
    },
    //取消
    handleClose (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    handleCloses (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisibles = false
    }
  }
}
</script>
<style lang="less" scoped>
  .systemuser{
    .table_container{
      padding:0 20px;
      min-height:660px;
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
    .form{
      padding:10px;
    }
    .footers{
      width:100%;
      padding-left: 35% !important;
    }
  }
</style>