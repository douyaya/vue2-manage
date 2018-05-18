<template>
  <div class="attention">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
      <div slot="province">
        <el-select v-model="isattention" size="small"
          style="width:100px;margin-left:5px;"
          @change="_search">
          <el-option
            v-for="item in attentionType"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
        <el-select v-model="attentionStatus" size="small"
          style="width:100px;margin:0 10px;"
          @change="_search">
          <el-option
            v-for="item in attentionList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
        <el-date-picker style="width:130px; margin-right:10px;"
          v-model="attentionTime"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          @change="handleChange"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div slot="integral" style="margin-right:25px;">
        当前发放积分总额：{{totalIntegral}}
      </div>
    </search>
    <div class="table-container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="关注时间：" style="width:40%">
                <span>{{props.row.followTime | clearZero}}</span>
              </el-form-item>
              <el-form-item label="地址：" style="width:50%">
                <span>{{props.row.driverAddress || props.row.custAddress || ''}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号" width="100px"
          prop="rowNum">
        </el-table-column>
        <el-table-column
          label="头像">
          <template slot-scope="props">
            <img class="avatar" :src="props.row.headimgurl" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column
          label="昵称">
          <template slot-scope="props">
            <span>{{decodeURI(props.row.nickname)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="真实姓名"
          prop="realname">
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="cellphone">
        </el-table-column>
        <el-table-column
          label="性别">
          <template slot-scope="props">
            <span>{{props.row | begender}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="积分">
          <template slot-scope="props">
            <!-- <div @click="showIntegral" style="color:blue">{{props.row.totalIntegral}}</div> -->
            <div style="color:blue">{{props.row.totalIntegral}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="认证状态">
          <template slot-scope="props">
            <span class="status" :class="props.row.authStatus ===1 ? 'status1' : (props.row.authType === '0' ? 'status2' : 'status3')">
              {{props.row.authStatus === 1 ? '未认证' : (props.row.authType === '0' ? '陪驾' : '客户')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="关注状态">
          <template slot-scope="props">
            <span class="status" :class="props.row.followStatus ===-1 ? 'status2' : (props.row.followStatus === 0 ? 'status3' : 'status1')">
              {{props.row.followStatus === -1 ? '未关注' : (props.row.followStatus === 0 ? '已关注' : '已取关')}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="Pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
    <el-dialog
      title="您当前的积分记录为："
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%">
      <el-steps direction="vertical" style="min-height:200px">
        <el-step title="关注公众号  +100"></el-step>
        <el-step title="认证  +100"></el-step>
        <el-step title="购买套餐  +100"></el-step>
        <el-step title="推荐3人关注  +100"></el-step>
        <el-step title="推荐购买  +100"></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import Search from '@/components/search' 
import {getWxUser} from '@/api/index.js'
export default {
  name:'AttentionUser',
  components:{
    headTop,
    Search
  },
  data () {
    return {
      tableData:[],
      // load_data:true,
      load_data:false,
      count:0,
      currentPage:1,
      pageSize:15,
      text:'真实姓名',
      attentionStatus:3,
      isattention:'',
      attentionType:[
        {key:'0',value:'关注'},
        {key:'1',value:'取关'},
        {key:'',value:'全部'}
      ],
      attentionList:[
        {key:0,value:'陪驾'},
        {key:1,value:'客户'},
        {key:2,value:'未认证'},
        {key:3,value:'全部'}
      ],
      attentionTime:'',
      dialogVisible:false,
      totalIntegral:''
    }
  },
  filters:{
    clearZero (val) {
      return val.slice(0,val.lastIndexOf('.'))
    },
    bestatus (val) {
      return val.authStatus === 1 ? '未认证' : (val.authType === '0' ? '陪驾' : '客户')
    },
    begender (val) {
      let arr = ['男','女']
      return (arr[val.driverGender] || arr[val.custGender])
    }
  },
  created () {
    this.getTableData(1,'','','','')
  },
  methods:{
    getTableData (pageNo,name,operateType,status,createTime) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name,
        operateType:operateType,
        status:status,
        createTime:createTime
      }
      getWxUser(data).then(res => {
        if (res.code === '0') {
          this.count = res.data.totalRecord
          this.tableData = res.data.results
          this.load_data = false,
          this.totalIntegral = res.data.totalIntegral
        }
      })
    },
    handleChange(val){
      this.attentionTime = val
      this._search()
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this._search()
    },
    //刷新搜索
    _search () {
      if (this.attentionStatus === 3) {
        this.getTableData(this.currentPage,this.$refs.search.searchText,'',this.isattention,this.attentionTime)
      } else {
        this.getTableData(this.currentPage,this.$refs.search.searchText,this.attentionStatus,this.isattention,this.attentionTime)
      }
    },
    showIntegral() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .attention{
    .table-container{
      padding:0 20px;
      min-height:660px;
      .status{
        display:inline-block;
        width:50px;
        color:white;
        text-align:center;
        &.status1{
          background-color:grey;
        }
        &.status2{
          background-color:red;
        }
        &.status3{
          background-color:green;
        }
      }
      .avatar{
        width:40px;
        height:40px;
      }
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
  }
</style>