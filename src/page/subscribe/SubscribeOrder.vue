<template>
  <div class="subscribeorder">
    <head-top></head-top>
    <search>
      <el-input slot="province" class="text" placeholder="请输入陪驾人姓名" v-model="searchText"></el-input>
      <el-select style="width:100px" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
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
              <el-form-item label="实际开始时间">
                <span>{{ props.row.beginTime}}</span>
              </el-form-item>
              <el-form-item label="实际结束时间">
                <span>{{ props.row.endTime}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="phone">
        </el-table-column>
        <el-table-column
          label="预约套餐"
          prop="combo">
        </el-table-column>
        <el-table-column
          label="预约开始时间"
          prop="subBeginTime">
        </el-table-column>
        <el-table-column
          label="预约结束时间"
          prop="payStatus">
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
  name:'SubscribeOrder',
  components:{
    headTop,
    Search
  },
  data () {
    return {
      tableData:[],
      load_data:false,
      count:50,
      currentPage:1,
      options:[
        {value:'1',label:'全部'},
        {value:'2',label:'未开始'},
        {value:'3',label:'进行中'},
        {value:'4',label:'已结束'}
      ],
      value:'1'
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
  .subscribeorder{
    .table-container{
      padding:0 40px;
      min-height:660px;
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
    .text{
      margin-left:-10px;
    }
  }
</style>