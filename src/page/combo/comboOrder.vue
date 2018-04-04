<template>
  <div class="comboorder">
    <head-top></head-top>
    <search v-on:search="_search" ref="search" v-on:refresh="_search">
    </search>
    <div class="table-container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div>套餐信息</div>
            <el-form label-position="left" inline>
              <el-form-item label="套餐名称" style="width:20%">
                <span>{{ props.row.comboName}}</span>
              </el-form-item>
              <el-form-item label="套餐价格" style="width:20%">
                <span>{{`￥${props.row.comboPrice}元`}}</span>
              </el-form-item>
              <el-form-item label="套餐陪驾次数" style="width:20%">
                <span>{{`${props.row.comboDriveTime}次`}}</span>
              </el-form-item>
              <el-form-item label="单次陪驾时间" style="width:20%">
                <span>{{`${props.row.comboDriveEveryTime}小时`}}</span>
              </el-form-item>
              <el-form-item label="陪驾车型" style="width:20%">
                <span>{{ props.row.vehicleModelName}}</span>
              </el-form-item>
              <el-form-item label="套餐描述">
                <span>{{ props.row.comboDesc}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号" width="70px"
          prop="rowNum">
        </el-table-column>
        <el-table-column
          label="套餐编号" width="230px"
          prop="comboOrderNo">
        </el-table-column>
        
        <el-table-column
          label="购买人"
          prop="custName">
        </el-table-column>
        <el-table-column
          label="联系人电话" width="150px"
          prop="custPhone">
        </el-table-column>
        <el-table-column
          label="套餐名称"
          prop="comboName">
        </el-table-column>
        <el-table-column
          label="已使用次数"
          prop="comboResidueTime">
        </el-table-column>
        <el-table-column label="支付状态" prop="payStatus">
          <template slot-scope="scope">
            <span class="pay" :class="scope.row.payStatus === 0 ? 'paystatus1' : 'paystatus2'">{{scope.row.payStatus | bestatus}}</span>
          </template>
        </el-table-column>
         <el-table-column
          label="支付金额"
          prop="comboPrice">
        </el-table-column>
        <el-table-column
          label="下单时间" width="200px"
          prop="comboOrderTime">
          <template slot-scope="scope">
            <span>{{scope.row.comboOrderTime | beTime}}</span>
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
import {comboPayList} from '@/api/index.js'
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
      count:43,
      currentPage:1,
      pageSize:15
    }
  },
  filters:{
    bestatus (val) {
      return val === 0 ? '已支付' : '未支付'
    },
    beTime (val) {
      return val.slice(0,val.lastIndexOf('.'))
    }
  },
  created () {
    this.getTableData(1,'')
  },
  methods:{
    //获取列表数据
    getTableData (pageNo,name) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name
      }
      comboPayList (data).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.results
          this.count = res.data.totalRecord
        }
      })
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData(val,this.$refs.search.searchText)
    },
    //搜索
    _search () {
      this.getTableData(this.currentPage,this.$refs.search.searchText)
    }
  }
}
</script>
<style lang="less" scoped>
  .comboorder{
    .table-container{
      padding:0 40px;
      min-height:660px;
      .pay{
        color:white;
        padding:1px;
        &.paystatus1{
          background:rgb(32, 238, 32); 
        }
        &.paystatus2{
          background:rgb(167, 159, 159);
        }
      }
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
  }
</style>