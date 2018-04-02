<template>
  <div class="attention">
    <head-top></head-top>
    <search>
    </search>
    <div class="table-container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="真实姓名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="昵称"
          prop="nickname">
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="phone">
        </el-table-column>
        <el-table-column
          label="关注时间"
          prop="time">
        </el-table-column>
      </el-table>
    </div>
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
export default {
  name:'AttentionUser',
  components:{
    headTop,
    Search
  },
  data () {
    return {
      tableData:[],
      load_data:false,
      count:50,
      currentPage:1
    }
  },
  created () {
    this.getTableData()
  },
  methods:{
    getTableData () {
      this.tableData = [
        {name:'lisi',nickname:'李四',phone:'13456767767',time:'2018-03-12'}
      ]
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(this.count)
      console.log(this.currentPage)
    }
  }
}
</script>
<style lang="less" scoped>
  .attention{
    .table-container{
      padding:0 40px;
      min-height:660px;
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
  }
</style>