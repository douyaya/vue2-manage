<template>
  <div class="carList">
    <head-top></head-top>
    <search v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-button @click="addDate" size="mini" type="primary"><i class="el-icon-plus"></i> 添加数据</el-button>
    </search>
    <div class="table-container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="编号" width="100px"
          prop="rowNum">
        </el-table-column>
        <el-table-column
          label="车牌号"
          prop="vehicleCode">
        </el-table-column>
        <el-table-column
          label="车型"
          prop="vehicleModelName">
        </el-table-column>
         <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button 
              size="small" :type="scope.row.status === 0 ? 'danger' : 'info'"
              @click="_setUseStatus(scope.$index, scope.row)">
                {{scope.row.status === 0 ? '禁用' : '启用'}}
              </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="添加车辆"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="80px">
        <el-form-item label="车牌号" prop="vehicleCode">
          <el-input v-model="form.vehicleCode"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="vModelId">
          <el-select style="width:100%;" v-model="form.vModelId" placeholder="请选择">
            <el-option
              v-for="item in carList"
              :key="item.id"
              :label="item.vehicleModelName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="footers">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmModify('form')">确 定</el-button>
      </div>
    </el-dialog>
    <div class="Pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="15"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import Search from '@/components/search'
import {getCatData,getAllCar,addCar,setUseStatus} from '@/api/index.js'
import {checkvehicleCode} from '@/api/utility'
export default {
  name:'CarList',
  components:{
    headTop,
    Search
  },
  data () {
    let validatePass = (rule,value,callback) => {
      if (checkvehicleCode(value)) {
        callback()
      } else {
        callback(new Error('车牌号错误'))
      }
    }
    return {
      dialogVisible:false,
      load_data:false,
      tableData:[],
      currentPage:1,
      count:0,
      pageSize:15,
      carList:[],
      form:{
        vehicleCode:'',
        vModelId:null
      },
      rules:{
        vehicleCode:[{required: true, message: '请输入车牌号', trigger: 'blur'}],
        vehicleCode:[{validator:validatePass,trigger:'blur'}],
        vModelId:[{required: true,type:'number',message: '请输入车牌号', trigger: 'blur'}]
      }
    }
  },
  created () {
    this.getTableData(1,'')
    this._getAllCar()
  },
  methods:{
    //获取车型列表
    _getAllCar () {
      getAllCar().then(res => {
        if (res.code === '0') {
          this.carList = res.data
        }
      })
    },
    //获取列表信息
    getTableData (pageNo,vehicleCode) {
      let data = {
        pageNo:pageNo,
        vehicleCode:vehicleCode,
        pageSize:this.pageSize
      }
      getCatData (data).then(res => {
        if (res.code === '0') {
          this.count = res.data.totalRecord
          this.tableData = res.data.results
        }
      })
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData(val,this.$refs.search.searchText)
    },
    //刷新
    _search () {
      this.getTableData(this.currentPage,this.$refs.search.searchText)
    },
    //添加车辆信息
    addDate () {
      this.dialogVisible = true
    },
    //关闭弹框
    handleClose () {
      this.dialogVisible = false
      this.form = {
        vehicleCode:'',
        vModelId:null
      }
    },
    //确认添加
    confirmModify (formname) {
      let _this = this
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.$confirm('是否确添加该车辆？',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(() => {
            let data = _this.form
            console.log(data)
            addCar(data).then(res => {
              if (res.code === '0') {
                _this.dialogVisible = false
                 _this.getTableData(_this.currentPage,_this.$refs.search.searchText)
                 this.form = {
                  vehicleCode:'',
                  vModelId:null
                }
                _this.$message({
                  type:'success',
                  message:'添加成功'
                })
              } else {
                _this.$message({
                  type:'info',
                  message:'添加失败'
                })
              }
            })
          })
        } else {
          this.$message({
            type:'info',
            message:'信息填写错误'
          })
        }
      })
    },
    //禁用启用
    _setUseStatus (index,val) {
      let _this = this
      this.$confirm('确认执行该操作？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() => {
        let data = {id:val.id}
        data.operateType = val.status === 0 ? 1 : 0
        setUseStatus(data).then(res => {
          if (res.code === '0') {
            _this.getTableData(_this.currentPage,_this.$refs.search.searchText)
            this.$message({
              type:'success',
              message:'更改成功'
            })
          } else {
            this.$message({
              type:'info',
              message:'操作失败'
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .carList{
    .table-container{
      padding:0 40px;
      min-height:660px;
    }
    .form{
    }
    .footers{
      padding-left:30%;
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
  }
</style>