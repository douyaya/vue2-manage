<template>
  <div class="subscribeorder">
    <head-top></head-top>
    <search>
      <div style="display:flex;" slot="province">
        <el-input size="small" class="text" placeholder="陪驾人姓名" v-model="searchText"></el-input>
        <el-input size="small" class="text" placeholder="陪驾人手机号" v-model="searchText"></el-input>
      </div>
      <el-select size="small" style="width:100px" v-model="value" placeholder="请选择">
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
import {getSubscribeOrder} from '@/api/index.js'
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
      count:0,
      currentPage:1,
      pageSize:15,
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
    this.getTableData(1)
  },
  methods:{
    getTableData (pageNo,name,driveName,driverPhone,operateType) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name,
        driverName:driveName,
        driverPhone:driverPhone,
        operateType:operateType
      }
      console.log(data)
      getSubscribeOrder(data).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.results
        }
      })
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