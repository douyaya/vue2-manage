<template>
  <div class="comboorder">
    <head-top></head-top>
    <search>
    </search>
    <div class="table-container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="套餐名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="购买人"
          prop="person">
        </el-table-column>
        <el-table-column
          label="价格"
          prop="price">
        </el-table-column>
        <el-table-column
          label="支付状态"
          prop="payStatus">
        </el-table-column>
        <el-table-column
          label="车型"
          prop="car">
        </el-table-column>
        <el-table-column
          label="剩余次数"
          prop="times">
        </el-table-column>
        <el-table-column
          label="下单时间"
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
  name:'ComboOrder',
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
        {name:'套餐A',person:'李四',price:'300',payStatus:'已支付',car:'荣威',time:'2018-03-12'}
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
  .comboorder{
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