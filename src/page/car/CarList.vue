<template>
  <div class="carList">
    <head-top></head-top>
    <search>
      <el-button @click="addDate" type="primary"><i class="el-icon-plus"></i> 添加数据</el-button>
    </search>
    <div class="table-container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="编号"
          prop="number">
        </el-table-column>
        <el-table-column
          label="车牌号"
          prop="name">
        </el-table-column>
        <el-table-column
          label="车型"
          prop="car">
        </el-table-column>
         <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="small" type="danger"
              @click="handleEdit(scope.$index, scope.row)">禁用</el-button>
          </template>
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
  name:'CarList',
  components:{
    headTop,
    Search
  },
  data () {
    return {
      load_data:false,
      tableData:[],
      currentPage:1,
      count:50
    }
  },
  created () {
    this.getTableData()
  },
  methods:{
    //获取列表信息
    getTableData () {
      this.tableData = [
        {number:1,name:'AD45678',car:'荣威'}
      ]
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(this.count)
      console.log(this.currentPage)
    },
    //添加车辆信息
    addDate () {

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
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
  }
</style>