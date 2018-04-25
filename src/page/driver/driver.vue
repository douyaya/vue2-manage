<template>
  <div class="driver">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-button @click="addDate" size="mini" type="primary"><i class="el-icon-plus"></i> 添加数据</el-button>
    </search>
    <div class="table_container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="地址：" style="min-width:200px">
                <span>{{props.row.address}}</span>
              </el-form-item>
              <el-form-item label="出生日期：" style="min-width:200px">
                <span>{{props.row.birthday | clearZero}}</span>
              </el-form-item>
              <el-form-item label="身份证号：" style="min-width:200px">
                <span>{{props.row.idNo}}</span>
              </el-form-item>
              <el-form-item label="申请驾照日期：" style="min-width:200px">
                <span>{{props.row.licenseTime | clearZero}}</span>
              </el-form-item>
              <el-form-item label="驾照类型：" style="min-width:200px">
                <span>{{props.row.licenseType | belicenseType}}</span>
              </el-form-item>
              <el-form-item label="工作证号：" style="min-width:200px">
                <span>{{props.row.workNo}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          prop="rowNum">
          </el-table-column>
        <el-table-column
          label="陪驾师姓名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="联系方式" min-width="120px"
          prop="cellphone">
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <div>{{scope.row.gender |beGender}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>  
    </div>
    <!-- 修改页面 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="陪驾师姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="cellphone">
          <el-input v-model="form.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNo">
          <el-input v-model="form.idNo"></el-input>
        </el-form-item>
        <el-form-item label="工作证号" prop="workNo">
          <el-input v-model="form.workNo"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select style="width:100%;" v-model="form.gender" placeholder="请选择">
            <el-option
              v-for="item in genderList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家庭住址" prop="selectedOptions">
          <el-cascader style="width:100%;"
            :options="options"
            v-model="form.selectedOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker style="width:100%;"
            @change="dateChangebirthday1"
            type="date"
            value-format="yyyy-MM-dd"
            v-model="form.birthday"
            align="right"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请驾照日期" prop="licenseTime">
          <el-date-picker style="width:100%;"
            @change="dateChangebirthday2"
            type="date"
            value-format="timestamp"
            v-model="form.licenseTime"
            align="right"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾照类别" prop="licenseType">
          <el-select style="width:100%;" v-model="form.licenseType" placeholder="请选择">
            <el-option
              v-for="item in licenseList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="footers">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmModify('form')">确 定</el-button>
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
import {getDriver,addDriver,deleteDrive} from '@/api/index.js'
import * as address from '@/api/address'
import {checkId,checkCellphone,addressStr} from '@/api/utility.js'
const licenseData = [
        {key:0,value:'A1'},
        {key:1,value:'A2'},
        {key:2,value:'A3'},
        {key:3,value:'B1'},
        {key:4,value:'B2'},
        {key:5,value:'C1'},
        {key:6,value:'C2'},
        {key:7,value:'C3'},
        {key:8,value:'C4'},
        {key:9,value:'D'},
        {key:10,value:'E'},
        {key:11,value:'F'},
        {key:12,value:'M'},
        {key:13,value:'N'},
        {key:14,value:'P'}
      ]
const license = ['A1','A2','A3','B1','B2','C1','C2','C3','C4','D','E','F','M','N','P']
export default {
  name:'Driver',
  components:{
    headTop,
    Search
  },
  data () {
    let validatePhone = (rule,value,callback) => {
      if (checkCellphone(value)) {
        callback()
      } else {
        return callback(new Error('手机号格式错误'))
      }
    }
    let validateId = (rule,value,callback) => {
      if (checkId(value)) {
        callback()
      } else {
        return callback(new Error('身份证号格式错误'))
      }
    }
    // let validateAddress = (rule,value,callback) => {
    //   if (value.length === 0) {
    //     return callback(new Error('请选择家庭住址'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      text:'请输入姓名',
      currentPage:1,//当前页码
      count:50,//总条目数
      tableData:[],
      load_data:true, //是否在加载数据
      dialogVisible:false, //弹出修改窗口
      form:{              //修改数据
        name:'', 
        gender:0,    
        cellphone:'',
        birthday:'',
        licenseTime:'',
        selectedOptions:[],
        idNo:'',
        workNo:'',
        licenseType:0
      },
      rules:{
        name:[{required:true,message:'请输入姓名',trigger:'blur'}],
        cellphone:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {validator: validatePhone, trigger: 'blur'}
        ],
        idNo:[
          {required:true,message:'请输入身份证号',trigger:'blur'},
          {validator: validateId, trigger: 'blur'}
        ],
        gender:[{type:'number',required:true,message:'请选择性别',trigger:'blur'}],
        workNo:[{required:true,message:'请输入工作证',trigger:'blur'}],
        selectedOptions:[
          {type:'array',required:true,message:'请选择家庭地址',trigger:'blur'}
          // {validator: validateAddress, trigger: 'blur'}
        ],
        birthday:[{required:true,message:'请选择出生日期',trigger:'blur'}],
        licenseTime:[{required:true,message:'请选择申请驾照日期',trigger:'blur'}],
        licenseType:[{type:'number',required:true,message:'请选择驾照类别',trigger:'blur'}]
      },
      genderList:[
        {key:0,value:'男'},
        {key:1,value:'女'}
      ],
      pageSize:15,
      title:'',
      options:[],
      licenseList:licenseData
    }
  },
  filters:{
    beGender (val) {
      return val === 0 ? '男' : '女'
    },
    clearZero (val) {
      return val.slice(0,val.indexOf(' '))
    },
    belicenseType (val) {
      return license[val]
    }
  },
  created () {
    this.getComboData(1,'')
    this.options = address.address
  },
  methods:{
    dateChangebirthday1 (val) {
      this.form.birthday = val
    },
     dateChangebirthday2 (val) {
      this.form.licenseTime = val
    },
    //搜索
    _search () {
      this.getComboData(this.currentPage,this.$refs.search.searchText)
    },
    //添加数据
    addDate () {
      this.dialogVisible = true
      this.title = "添加陪驾师"
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this.getComboData(val,this.$refs.search.searchText)
    },
    //获取套餐数据
    getComboData (pageNo,name) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name
      }
      getDriver(data).then(res => {
        if (res.code === '0') {
          this.load_data = false
          this.count = res.data.totalRecord
          this.tableData = res.data.results
        }
      })
    },
    //删除数据
    handleDelete (val) {
      let _this = this
      this.$confirm('确认删除该陪驾？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() => {
        let data = {
          id:val
        }
        deleteDrive(data).then(res => {
          if (res.code === '0') {
            _this.dialogVisible = false
            _this._search()
            _this.$message({
              type:'success',
              message:'删除成功'
            })
          } else {
            _this.$message({
              type:'info',
              message:'删除失败'
            })
          }
        })
      })
    },
    //修改数据
    // handleEdit (index,val) {
    //   this.form = val
    //   this.dialogVisible = true
    // },
    //提交修改
    confirmModify (formName) {
      let _this = this
      this.$confirm('是否确认执行该操作？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() => {
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.form.address = addressStr(_this.form.selectedOptions)
            addDriver(_this.form).then(res => {
              if (res.code === '0') {
                _this.$refs['form'].resetFields()
                _this.getComboData(_this.currentPage,_this.$refs.search.searchText)
                this.dialogVisible = false
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
          } else {
            return false;
          }
        })
      })
    },
    //重置form
    handleClose () {
      this.form = {              //修改数据
        name:'', 
        gender:0,    
        cellphone:'',
        birthday:'',
        licenseTime:'',
        selectedOptions:[],
        idNo:'',
        workNo:'',
        licenseType:0
      },
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .driver{
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