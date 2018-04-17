<template>
  <div class="attention">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-select v-model="attentionStatus" size="small"
        style="width:100px;margin-left:10px;"
        @change="selectKind">
        <el-option
          v-for="item in attentionList"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
    </search>
    <div class="table-container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <!-- <el-form-item label="openId" style="width:40%">
                <span>{{props.row.openid}}</span>
              </el-form-item> -->
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
          label="真实姓名"
          prop="realname">
        </el-table-column>
        <el-table-column
          label="昵称">
          <template slot-scope="props">
            <span>{{decodeURI(props.row.nickname)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="cellphone">
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
          label="性别">
          <template slot-scope="props">
            <span>{{props.row | begender}}</span>
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
      load_data:true,
      count:0,
      currentPage:1,
      pageSize:15,
      text:'真实姓名',
      attentionStatus:3,
      attentionList:[
        {key:0,value:'陪驾'},
        {key:1,value:'客户'},
        {key:2,value:'未认证'},
        {key:3,value:'全部'}
      ]
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
    this.getTableData(1,'')
  },
  methods:{
    getTableData (pageNo,name,operateType) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name,
        operateType:operateType
      }
      console.log(data)
      getWxUser(data).then(res => {
        if (res.code === '0') {
          this.count = res.data.totalRecord
          this.tableData = res.data.results
          this.load_data = false
        }
      })
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this._search()
    },
    selectKind (val) {
      console.log(val)
      console.log(this.attentionStatus)
      this._search()
    },
    //刷新搜索
    _search () {
      if (this.attentionStatus === 3) {
        this.getTableData(this.currentPage,this.$refs.search.searchText)
      } else {
        this.getTableData(this.currentPage,this.$refs.search.searchText,this.attentionStatus)
      }
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
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
  }
</style>