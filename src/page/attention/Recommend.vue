<template>
  <div class="recommend">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
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
          label="昵称"
          prop="fromName">
        </el-table-column>
        <el-table-column
          label="推荐关注人数"
          prop="followCount">
        </el-table-column>
        <el-table-column
          label="推荐认证人数"
          prop="authCount">
        </el-table-column>
        <el-table-column
          label="推荐购买人数"
          prop="buyCount">
        </el-table-column>
        <el-table-column
          label="金额合计">
          <template slot-scope="props">
            <span>{{`￥${props.row.buyAmountCount}`}}</span>
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
import {getRecommend} from '@/api/index.js'
export default {
  name:'Recommend',
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
      text:'推荐人微信昵称'
    }
  },
  created () {
    this.getTableData(1,'')
  },
  methods:{
    getTableData (pageNo,name) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name
      }
      getRecommend(data).then(res => {
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
    //刷新搜索
    _search () {
      this.getTableData(this.currentPage,this.$refs.search.searchText)
    }
  }
}
</script>
<style lang="less" scoped>
  .recommend{
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