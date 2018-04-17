<template>
  <div class="comboList">
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
            <el-form label-position="top" inline>
              <el-form-item label="套餐图片" style="width:40%">
                <img style="width:100px;height:100px;" :src="props.row.picUrl" alt="">
              </el-form-item>
              <el-form-item label="套餐详情" style="width:50%">
                <span>{{ props.row.description}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          prop="rowNum">
        </el-table-column>
        <el-table-column
          label="套餐名称"
          prop="comboName">
        </el-table-column>
        <el-table-column
          label="陪驾次数">
          <template slot-scope="prop">
            <span>{{`${prop.row.times}次`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="套餐价格">
          <template slot-scope="prop">
            <span>{{`￥${prop.row.price}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单次时间">
        <template slot-scope="prop">
            <span>{{`${prop.row.everyTime}小时`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车型"
          prop="vehicleModelName">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="small"
              :type="scope.row.status === 0 ? 'danger' : 'primary'"
              @click="handleDelete(scope.$index, scope.row)">
              {{scope.row.status === 0 ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>  
    </div>
    <!-- 修改页面 -->
    <el-dialog
      title="修改套餐信息"
      :visible.sync="dialogVisible"
      @close="handleClose('form')"
      width="30%">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="80px">
        <el-form-item label="套餐名称" prop="comboName">
          <el-input v-model="form.comboName"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格" prop="price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="陪驾次数" prop="times">
          <el-input v-model="form.times"></el-input>
        </el-form-item>
        <el-form-item label="单次时间" prop="everyTime">
          <el-input v-model="form.everyTime"></el-input>
        </el-form-item>
        <el-form-item label="陪驾车型" prop="vehicleModelName">
          <el-select style="width:100%;" v-model="form.vehicleModelName" placeholder="请选择">
            <el-option
              v-for="item in carList"
              :key="item.vehicleModelName"
              :label="item.vehicleModelName"
              :value="item.vehicleModelName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套餐详情" prop="description"> 
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="margin:0 0 20px -80px;">上传套餐图片</div>
          <Uploadimg ref="uploadimg">
            <li class="special" v-if="showImg">
              <img class="img" :src="form.picUrl" alt="">
              <div v-show="form.picUrl!=='' && form.picUrl!==undefined" class="delete" @click="operateImage">X</div>
            </li>
          </Uploadimg>
        </el-form-item>
      </el-form>
      <div class="footers">
        <el-button @click="handleClose('form')">取 消</el-button>
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
import Uploadimg from '@/components/uploadImg'
import {getComboData,getAllCar,modifyCombo,addCombo,deleteCombo} from '@/api/index.js'
import {allNumber,allNumbertwo} from '@/api/utility.js'
export default {
  name:'ComboList',
  components:{
    headTop,
    Search,
    Uploadimg
  },
  data () {
    let validatePass = (rule,value,callback) => {
      if (allNumber(value)){
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    let validatePasstwo = (rule,value,callback) => {
      if (allNumbertwo(value)){
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    return {
      text:'套餐名称',
      currentPage:1,//当前页码
      count:1,//总条目数
      pageSize:15,//每页条数
      tableData:[],
      load_data:true, //是否在加载数据
      dialogVisible:false, //弹出修改窗口
      carList:[],
      form:{},              //修改数据,
      showImg:false,
      rules:{
        comboName:[{required: true, message: '请输入套餐名称', trigger: 'blur'}],
        price:[{validator:validatePass,trigger:'blur'},{required:true,message: '请输入套餐价格'}],
        times:[{validator:validatePasstwo,trigger:'blur'},{required:true,message: '请输入陪驾次数'}],
        everyTime:[{validator:validatePass,trigger:'blur'},{required:true,message: '请输入每次陪驾时长'}],
        vehicleModelName:[{required:true,message: '请选择陪驾车型', trigger: 'change'}],
        description:[{required:true,message: '请输入套餐详情', trigger: 'blur'}]
      }
    }
  },
  created () {
    this._getComboData(1,'')
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
    //获取套餐数据
    _getComboData (pageNo,name) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name
      }
      getComboData(data).then(res => {
        if (res.code === '0') {
          this.load_data = false
          this.count = res.data.totalRecord,
          this.tableData = res.data.results
        }
      })
    },
    //搜索或者刷新
    _search () {
      this._getComboData(this.currentPage,this.$refs.search.searchText)
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this._getComboData(val,this.$refs.search.searchText)
    },
     //修改数据
    handleEdit (index,val) {
      this.$refs.uploadimg && (this.$refs.uploadimg.imgList = [])
      val.picUrl !== "" && (this.showImg = true)
      this.form = val
      this.dialogVisible = true
      this.form.picList = []
      if (this.form.picId) {
        this.form.picList[0] = {}
        this.form.picList[0].id = this.form.picId
        this.form.picList[0].status = 1
      }
    },
     //添加数据
    addDate () {
      this.form= {}
      this.$refs.uploadimg && (this.$refs.uploadimg.imgList = [])
      this.form.picList = []
      this.dialogVisible = true
    },
    //提交修改/添加
    confirmModify (formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.form.name = this.form.comboName
          for (let tmp of this.carList) {
            if (tmp.vehicleModelName === this.form.vehicleModelName) {
              this.form.vModelId = tmp.id
            }
          }
          let length = this.$refs.uploadimg.imgList.length
          if (this.form.id && this.form.picUrl !== "") {
            length++
          }
          if (length !== 1) {
            this.$message({
              type:'info',
              message:'必须上传一张图片'
            })
          } else {
            if (this.form.picUrl === '' || this.form.picUrl === undefined) {
              console.log('gg')
              let item = {
                status:0,
                picUrl:this.$refs.uploadimg.imgList[0]
              }
              console.log(this.form.picList)
              if (this.form.picList[0] && this.form.picList[0].id) {
                this.form.picList[1] = item
              } else {
                this.form.picList[0] = item
              }
              // console.log(this.form)
            } 
            this.submit()
          }
        } else {
          this.$message({
            type:'info',
            message:'信息填写错误'
          })
        }
      })
    },
    //修改和添加
    submit () {
      let _this = this
      if (this.form.id) {
        this.$confirm('是否确认执行该操作？',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() => {
          this.form.picList = JSON.stringify(this.form.picList)
          modifyCombo(this.form).then(res => {
            if (res.code === '0') {
              _this.dialogVisible = false
              _this._getComboData(_this.currentPage,_this.$refs.search.searchText)
              _this.showImg = false
              console.log(_this.showImg)
              _this.$message({
                type:'success',
                message:'操作成功'
              })
            }
          })
        })
      } else {
        this.$confirm('是否确认执行该操作？',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() => {
          this.form.picList = JSON.stringify(this.form.picList)
          addCombo(this.form).then(res => {
            if (res.code === '0') {
              _this.dialogVisible = false
              _this._getComboData(_this.currentPage,_this.$refs.search.searchText)
              _this.$message({
                type:'success',
                message:'操作成功'
              })
            }
          })
        })
      }
    },
    //启用禁用套餐
    handleDelete (index,val) {
      let _this = this
      this.$confirm('是否执行该操作？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() => {
        let data = {
          id:val.id,
          operateType: val.status === 0 ? 1 : 0
          }
        deleteCombo(data).then(res => {
          if (res.code === '0') {
            _this._getComboData(_this.currentPage,_this.$refs.search.searchText)
            this.$message({
              type:'success',
              message:'操作成功'
            })
          }
        })
      })
    },
    //操作图片
    operateImage () {
      this.form.picUrl = ""
      this.showImg = false
    },
    //关闭dialog
    handleClose (formName) {
      this.$refs[formName].resetFields()
      this.$refs.uploadimg.imgList =[]
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .comboList{
    .table_container{
      padding:0 20px;
      min-height:660px;
    }
    .Pagination{
      padding-left:75%;
      margin-top:20px;
    }
    .form{
      padding:10px;
    }
    .footers{
      width:100%;
      padding-left: 35% !important;
    }
    .special{
      position: relative;
      .img{
        width:100px;
        height:100px;
      }
      .delete{
        position: absolute;
        top:-10px;
        background:lightpink;
        width:20px;
        height:20px;
        line-height: 20px;
        text-align:center;
        border-radius: 50%;
        left:-5px;
        z-index:20;
      }
    }
  }
</style>