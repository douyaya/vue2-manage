<template>
  <div class="subscribeorder">
    <head-top></head-top>
    <search v-on:search="_search" ref="search" v-on:refresh="_search">
      <div style="display:flex;" slot="province">
        <el-input size="small" class="text" placeholder="陪驾人姓名" v-model="drivername"></el-input>
        <el-input size="small" class="text" placeholder="陪驾人手机号" v-model="driverphone"></el-input>
      </div>
      <el-select size="small" style="width:100px" v-model="value" 
        @change="selectChange" placeholder="请选择">
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
              <el-form-item label="车型：" style="min-width:150px">
                <span>{{ props.row.vehicleModelName}}</span>
              </el-form-item>
              <el-form-item label="预约陪驾时间：" style="min-width:250px">
                <span>{{ props.row.applyPlanTime}}</span>
              </el-form-item>
              <el-form-item label="套餐陪驾次数：" style="min-width:150px">
                <span>{{ props.row.comboDriveTime}}</span>
              </el-form-item>
              <el-form-item label="套餐单次陪驾时间：" style="min-width:150px">
                <span>{{ props.row.comboDriveEveryTime}}</span>
              </el-form-item>
              <el-form-item label="套餐已使用次数：" style="min-width:150px">
                <span>{{ props.row.comboResidueTime}}</span>
              </el-form-item>
              <el-form-item label="陪驾人：" style="min-width:150px">
                <span>{{ props.row.driverName}}</span>
              </el-form-item>
              <el-form-item label="陪驾人电话：" style="min-width:250px">
                <span>{{ props.row.driverPhone}}</span>
              </el-form-item>
              <el-form-item label="车牌号：" style="min-width:150px">
                <span>{{ props.row.vehicleCode}}</span>
              </el-form-item>
              <el-form-item label="陪驾地点：" style="min-width:150px">
                <span>{{ props.row.applyAddress}}</span>
              </el-form-item>
              <el-form-item label="实际开始时间">
                <span>{{ props.row.driveStartTime}}</span>
              </el-form-item>
              <el-form-item label="实际结束时间">
                <span>{{ props.row.driveEndTime}}</span>
              </el-form-item>
              <el-form-item label="客户评价">
                <span>{{ props.row.serviceComments}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号" width="70px"
          prop="rowNum">
        </el-table-column>
        <el-table-column
          label="约车单号" width="250px"
          prop="applyNo">
        </el-table-column>
        <el-table-column 
          label="客户姓名" min-width="120px"
          prop="custName">
        </el-table-column>
        <el-table-column
          label="联系方式" width="150px"
          prop="custPhone">
        </el-table-column>
        <el-table-column
          label="套餐名称"
          prop="comboName">
        </el-table-column>
        <el-table-column
          label="套餐价格"
          prop="comboPrice">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" v-if="props.row.allotStatus === 1" size="small"
              @click="toAllot(props.row)">去分配</el-button>
            <el-button type="info" v-else disabled size="small">已分配</el-button>
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
import Vue from 'vue'
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
      load_data:true,
      count:0,
      currentPage:1,
      pageSize:15,
      drivername:'',
      driverphone:'',
      options:[
        {value:0,label:'未分配'},
        {value:1,label:'未开始'},
        {value:2,label:'进行中'},
        {value:3,label:'已结束'},
        {value:'',label:'全部'}
      ],
      value:0
    }
  },
  created () {
    this.getTableData(1,'','','',0)
  },
  methods:{
    //select选择
    selectChange (val) {
      this.getTableData(this.currentPage,this.$refs.search.searchText,this.drivername,this.driverphone,val)
    },
    //获取数据
    getTableData (pageNo,name,driveName,driverPhone,operateType) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name,
        driverName:driveName,
        driverPhone:driverPhone,
        operateType:operateType
      }
      getSubscribeOrder(data).then(res => {
        if (res.code === '0') {
          this.load_data = false
          this.count = res.data.totalRecord
          this.tableData = res.data.results
        }
      })
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
    },
    //刷新或者搜索
    _search () {
      this.getTableData(this.currentPage,this.$refs.search.searchText,this.drivername,this.driverphone,this.value)
    },
    //分配陪驾人
    toAllot (val) {
      this.$router.push({path:'/operateDriver',query:{data:JSON.stringify(val)}})
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