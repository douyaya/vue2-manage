<template>
  <div class="comboList">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-select slot="province" v-model="effectiveType" style="width:100px;margin-right:10px;" size="small" @change="_search">
          <el-option
            v-for="item in effectiveLists"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
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
              <!-- <el-form-item label="套餐生效日期：" style="width:40%">
                <span>{{ props.row.effectiveDate}}</span>
              </el-form-item>
              <el-form-item label="套餐失效日期：" style="width:50%">
                <span>{{ props.row.description}}</span>
              </el-form-item> -->
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
        <el-table-column label="有效期">
            <template slot-scope="prop"> 
              <span>{{prop.row.termOfValidity === 0 ? '无限期' : (`${prop.row.termOfValidity}个月`)}}</span>
            </template>
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
        <el-form-item label="有效时间" prop="termOfValidity">
          <el-select style="width:100%;" v-model="form.termOfValidity" placeholder="请选择">
            <el-option
              v-for="item in effectiveList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
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
      effectiveList:[
        {key:'3',value:'3个月'},
        {key:'6',value:'6个月'},
        {key:'12',value:'12个月'},
        {key:'0',value:'不限期'}
      ],
      effectiveLists:[
        {key:'3',value:'3个月'},
        {key:'6',value:'6个月'},
        {key:'12',value:'12个月'},
        {key:'0',value:'不限期'},
        {key:'',value:'全部'}
      ],
      effectiveType:'',
      form:{},              //修改数据,
      showImg:false,
      rules:{
        comboName:[{required: true, message: '请输入套餐名称', trigger: 'blur'}],
        price:[{validator:validatePass,trigger:'blur'},{required:true,message: '请输入套餐价格'}],
        times:[{validator:validatePasstwo,trigger:'blur'},{required:true,message: '请输入陪驾次数'}],
        everyTime:[{validator:validatePass,trigger:'blur'},{required:true,message: '请输入每次陪驾时长'}],
        vehicleModelName:[{required:true,message: '请选择陪驾车型', trigger: 'change'}],
        description:[{required:true,message: '请输入套餐详情', trigger: 'blur'}],
        termOfValidity:[{required:true,message: '请选择有效期', trigger: 'blur'}]
      },
      picUrl:''
    }
  },
  created () {
    this._getComboData(1,'','')
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
    _getComboData (pageNo,name,operateType) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name,
        operateType:operateType
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
      this._getComboData(this.currentPage,this.$refs.search.searchText,this.effectiveType)
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this._getComboData(val,this.$refs.search.searchText,this.effectiveType)
    },
     //修改数据
    handleEdit (index,val) {
      this.$refs.uploadimg && (this.$refs.uploadimg.imgList = [])
      val.picUrl !== "" && (this.showImg = true)
      this.form = val
      this.form.termOfValidity = '' + this.form.termOfValidity
      this.dialogVisible = true
      this.form.picList = []
      if (this.form.picId) {
        this.picUrl = this.form.picUrl
        // this.form.picList[0].id = this.form.picId
        // this.form.picList[0].status = 1
      }
    },
     //添加数据
    addDate () {
      this.form= {termOfValidity:'3'}
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
          if (this.form.id) {
            //修改
            let imgList = this.$refs.uploadimg.imgList
            console.log(this.form.picUrl)
            console.log(this.form.picId)
            if (this.form.picUrl !== '') {
              imgList.push({
                id:this.form.picId,
                status:1,
                picUrl:this.form.picUrl
              })
            }
            console.log(imgList)
            // if (imgList.length !== 1) {
            //   this.$message({
            //     type:'info',
            //     message:'必须上传一张图片'
            //   })
            // } else {

            // }
          } else {
            //添加
            if (this.$refs.uploadimg.imgList.length !== 1) {
              this.$message({
                type:'info',
                message:'必须上传一张图片'
              })
            } else {
              this.form.picList = JSON.stringify(this.$refs.uploadimg.imgList)
              console.log(this.form)
              this._addCombo()
            }
          }
          // let length = this.$refs.uploadimg.imgList.length
          // if (this.form.id && this.form.picUrl !== "") {
          //   length++
          // }
          // if (length !== 1) {
          //   this.$message({
          //     type:'info',
          //     message:'必须上传一张图片'
          //   })
          // } else {
          //   if (this.form.picUrl === '' || this.form.picUrl === undefined) {
          //     let item = {
          //       status:0,
          //       picUrl:this.$refs.uploadimg.imgList[0]
          //     }
          //     if (this.form.picList[0] && this.form.picList[0].id) {
          //       this.form.picList[1] = item
          //     } else {
          //       this.form.picList[0] = item
          //     }
          //   } else {
          //     this.form.picList = []
          //   } 
          //   this.submit()
          // }
        } else {
          this.$message({
            type:'info',
            message:'信息填写错误'
          })
        }
      })
    },
    //修改和添加
    // submit () {
    //   let _this = this
    //   if (this.form.id) {
    //     this.$confirm('是否确认执行该操作？',{
    //       confirmButtonText:'确定',
    //       cancelButtonText:'取消',
    //       type:'warning'
    //     }).then(() => {
    //       this.form.picList = JSON.stringify(this.form.picList)
    //       modifyCombo(this.form).then(res => {
    //         if (res.code === '0') {
    //           _this.dialogVisible = false
    //           _this._getComboData(_this.currentPage,_this.$refs.search.searchText,this.effectiveType)
    //           _this.showImg = false
    //           _this.$message({
    //             type:'success',
    //             message:'操作成功'
    //           })
    //         }
    //       })
    //     })
    //   } else {
    //     this.$confirm('是否确认执行该操作？',{
    //       confirmButtonText:'确定',
    //       cancelButtonText:'取消',
    //       type:'warning'
    //     }).then(() => {
    //       this.form.picList = JSON.stringify(this.form.picList)
    //       addCombo(this.form).then(res => {
    //         if (res.code === '0') {
    //           _this.dialogVisible = false
    //           _this._getComboData(_this.currentPage,_this.$refs.search.searchText,this.effectiveType)
    //           _this.$message({
    //             type:'success',
    //             message:'操作成功'
    //           })
    //         }
    //       })
    //     })
    //   }
    // },
    //添加套餐
    _addCombo () {
      this.$confirm('是否确认添加该套餐？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() => {
        addCombo(this.form).then(res => {
          if (res.code === '0') {
            this.dialogVisible = false
            this._getComboData(this.currentPage,this.$refs.search.searchText,this.effectiveType)
            this.$message({
              type:'success',
              message:'添加成功'
            })
          }
        })
      })
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
            _this._getComboData(_this.currentPage,_this.$refs.search.searchText,this.effectiveType)
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
      this._search()
      // this.$refs[formName].resetFields()
      // this.$refs.uploadimg.imgList =[]
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