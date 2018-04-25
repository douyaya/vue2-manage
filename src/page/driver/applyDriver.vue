<template>
  <div class="applyDriver">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-input  size="small" slot="province" style="width:150px;margin-right:10px;" placeholder="申请人电话"></el-input>
      <el-select v-model="statusType" size="small"
        style="width:100px;margin-left:10px;"
        @change="_search">
        <el-option
          v-for="item in statusList"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
    </search>
    <div class="table_container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
          :data="tableData"
          @expand="expandChange">
          <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="地址：" class="item">
                <span>{{props.row.address}}</span>
              </el-form-item>
              <el-form-item label="出生日期：" class="item">
                <span>{{props.row.birthday}}</span>
              </el-form-item>
              <el-form-item label="身份证号：" class="item">
                <span>{{props.row.idNo}}</span>
              </el-form-item>
              <el-form-item label="申请驾照日期：" class="item">
                <span>{{props.row.licenseTime}}</span>
              </el-form-item>
              <el-form-item label="驾照类型：" class="item">
                <span>{{props.row.licenseType | belicenseType}}</span>
              </el-form-item>
              <el-form-item label="驾龄：" class="item">
                <span>{{`${props.row.driverAge}年`}}</span>
              </el-form-item>
              <el-form-item label="审核日期：" class="item">
                <span>{{props.row.examineDate}}</span>
              </el-form-item>
              <el-form-item label="审核人：" class="item">
                <span>{{props.row.examinePersonName}}</span>
              </el-form-item>
              <el-form-item label="工作证号：" class="item">
                <span>{{props.row.workNo}}</span>
              </el-form-item>
              <div>
                <img class="base" v-for="(tmp,index) of imgList" :key="index" :src="tmp.picUrl"
                 @click="changemanify">
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          prop="rowNum">
          </el-table-column>
        <el-table-column
          label="申请人姓名"
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
        <!--错的 --> 
        <el-table-column
          label="申请日期" min-width="120px"
          prop="examineDate">
        </el-table-column>
        <el-table-column label="审核状态" min-width="120px">
          <template slot-scope="scope">
            <span class="status" :class="'status'+scope.row.examineStatus">{{scope.row.examineStatus | examStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.examineStatus !== 0"
              size="small"
              type="primary"
              @click="applydecide(scope.row.id)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>  
    </div>
    <el-dialog title="是否同意该用户的陪驾申请"
      :visible.sync="dialogVisible">
        <el-input type="textarea" :rows="2" placeholder="请输入申请备注" v-model="remark">
        </el-input>
        <div class="bottom">
          <el-button type="primary" @click="_operateApply(0)">通过</el-button> 
          <el-button type="danger" @click="_operateApply(1)">不通过</el-button> 
        </div>
    </el-dialog> 
    <!-- 修改页面 -->
    <!-- <el-dialog
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
    </el-dialog> -->
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
import {getApplyList,operateApply,getApplyImg} from '@/api/index.js'
import {getUser} from '@/api/utility.js'
const license = ['A1','A2','A3','B1','B2','C1','C2','C3','C4','D','E','F','M','N','P']
export default {
  name:'ApplyDriver',
  components:{
    headTop,
    Search
  },
  data () {
    return {
      statusList:[
        {key:'0',value:'待审核'},
        {key:'1',value:'审核成功'},
        {key:'2',value:'审核失败'},
        {key:'',value:'全部'}
      ],
      statusType:'',
      text:'申请人姓名',
      load_data:true,
      tableData:[],
      currentPage:1,
      pageSize:15,
      count:0,
      pageNumber:1,
      cellphone:'',
      dialogVisible:false,
      remark:'',
      driverId:'',
      userId:'',
      imgList:[]
    }
  },
  filters:{
    beGender (val) {
      return val === 0 ? '男' : '女'
    },
    belicenseType (val) {
      return license[val]
    },
    examStatus (val) {
      return val === 0 ? '待审核' : (val === 1 ? '审核成功' : '审核失败')
    }
  },
  created () {
    this._getApplyList(1,'','','')
    this.userId = JSON.parse(getUser()).user.id
  },
  methods:{
    //点击展开获取申请图片
    expandChange (val) {
      getApplyImg({id:val.id}).then(res => {
        this.imgList = res.data
        this.imgList.forEach(item => {
          item.magnify = false
        })
        console.log(this.imgList)
      })
    },
    //获取分页数据
    _getApplyList (pageNo,statusType,name,cellphone) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        operateType:statusType,
        name:name,
        cellphone:cellphone
      }
      getApplyList(data).then(res => {
        if (res.code === '0') {
          this.load_data = false
          this.tableData = res.data.results
          this.count = res.data.totalRecord
        }
      })
    },
     //搜索
    _search () {
      this._getApplyList(this.pageNumber,this.statusType,this.$refs.search.searchText,this.cellphone)
    },
    handleCurrentChange (val) {
      this.pageNumber = val
      this._search()
    },
    //审核
    applydecide (val) {
      this.dialogVisible = true
      this.driverId = val
    },
    _operateApply (val) {
      let data = {
        id:this.driverId,
        userId:this.userId,
        operateType:val,
        remark:this.remark
      }
      console.log(data)
      operateApply(data).then(res => {
        if (res.code === '0') {
          this.dialogVisible = false
          this.remark = ''
          this.$message({
            type:'success',
            message:'审核完成'
          })
        } else {
          this.$message({
            type:'warn',
            message:'操作失败，请重试'
          })
        }
      })
    },
    //改变图片大小
    changemanify (e) {
      // this.imgList[index].magnify = !this.imgList[index].magnify
      // console.log(this.imgList)
      // console.log( e.target.getAttribute('class'))
      console.log(e.target.getAttribute('class') )
      if (e.target.getAttribute('class') === 'base') {
         e.target.setAttribute('class','big')
      } else {
        e.target.setAttribute('class','base')
      }
    }
  }
}
</script>
<style lang="less" scoped>
@red:red;
@green:green;
@grey:grey;
@white:white;
  .applyDriver{
    .table_container{
      padding:0 20px;
      min-height:660px;
      .item{
        width:30%;
      }
      .status{
        color:@white;
        padding:2px;
        &.status0{
          background:@red;
        }
        &.status1{
          background:@green;
        }
        &.status2{
          background:@grey;
        }
      }
      .base{
        height:100px;
        margin:0 10px;
        cursor: pointer;
        transition: all 0.5s;
      }
      .big{
        height:310px;
        cursor: pointer;
        position: absolute;
        top:0;
        left:30%;
        transition: all 1s;
        // z-index:500;
      }
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
    .bottom{
      width:100%;
      text-align:center;
      margin-top:20px;
    }
  }
</style>