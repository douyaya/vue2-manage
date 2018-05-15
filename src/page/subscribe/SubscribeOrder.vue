<template>
  <div class="subscribeorder">
    <head-top></head-top>
    <search v-bind:placeholder="text" v-on:search="_search" ref="search" v-on:refresh="_search">
      <div style="display:flex;" slot="province" v-if="value !== 0">
        <el-input @keyup.enter.native="_search" size="small" class="text" placeholder="陪驾师姓名" v-model="drivername"></el-input>
        <el-input @keyup.enter.native="_search" size="small" class="text" placeholder="陪驾师手机号" v-model="driverphone"></el-input>
      </div>
      <el-select size="small" style="margin-left:5px;width:100px" v-model="value" 
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
          size="mini"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="forms">
              <el-form-item class="item" label="套餐名称：">
                <span>{{ props.row.comboName}}</span>
              </el-form-item>
              <el-form-item class="item" label="车型：">
                <span>{{ props.row.vehicleModelName}}</span>
              </el-form-item>
              <el-form-item class="item" label="套餐陪驾次数：">
                <span>{{ props.row.comboDriveTime}}</span>
              </el-form-item>
              <el-form-item class="item" label="套餐单次陪驾时间：">
                <span>{{ props.row.comboDriveEveryTime}}</span>
              </el-form-item>
              <el-form-item class="item" label="套餐已使用次数：">
                <span>{{ props.row.comboResidueTime}}</span>
              </el-form-item>
              <el-form-item class="item" label="套餐价格：">
                <span>{{`￥${props.row.comboPrice}`}}</span>
              </el-form-item>
              <!-- <el-form-item label="陪驾人">
                <span>{{ props.row.driverName}}</span>
              </el-form-item> -->
              <!-- <el-form-item label="陪驾人电话：">
                <span>{{ props.row.driverPhone}}</span>
              </el-form-item> -->
              <el-form-item class="item" label="车牌号：">
                <span>{{ props.row.vehicleCode}}</span>
              </el-form-item>
              <el-form-item class="item" label="陪驾地点：">
                <span>{{ props.row.applyAddress}}</span>
              </el-form-item>
              <el-form-item class="item" label="实际开始时间：">
                <span>{{ props.row.driveStartTime}}</span>
              </el-form-item>
              <el-form-item class="item" label="紧急电话">
                <span>{{ props.row.emergencyPhone}}</span>
              </el-form-item>
              <!-- <el-form-item label="实际结束时间">
                <span>{{ props.row.driveEndTime}}</span>
              </el-form-item> -->
              <el-form-item style="width:100%" label="客户评价：">
                <span>{{decodeURI(props.row.custServiceComments)}}</span>
              </el-form-item>
              <el-form-item label="陪驾师评价：">
                <span>{{decodeURI(props.row.driverServiceComments)}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="约车单号" min-width="100px"
          prop="applyNo">
        </el-table-column>
        <el-table-column 
          label="客户">
          <template slot-scope="props">
            <span v-show="props.row.custName">{{props.row.custName+'('+props.row.custPhone+')'}}</span>
          </template>
        </el-table-column>
        <el-table-column 
          label="陪驾">
          <template slot-scope="props">
            <span v-show="props.row.driverName">{{props.row.driverName+'('+props.row.driverPhone+')'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column 
          label="客户姓名" width="100px"
          prop="custName">
        </el-table-column>
        <el-table-column
          label="客户电话" width="130px"
          prop="custPhone">
        </el-table-column> -->
        <!-- <el-table-column 
          label="陪驾人" width="100px"
          prop="driverName">
        </el-table-column> -->
        <el-table-column v-if="value === 0"
          label="套餐名称" 
          prop="comboName">
        </el-table-column>
        <!-- <el-table-column
          label="套餐已使用次数" width="150px">
          <template slot-scope="props">
            <span>{{`${props.row.comboResidueTime}次`}}</span>
          </template>  
        </el-table-column>
        <el-table-column
          label="套餐价格" width="100px">
          <template slot-scope="props">
            <span>{{`￥${props.row.comboPrice}`}}</span>
          </template>  
        </el-table-column> -->
        <el-table-column
          label="预约开始时间"
          prop="applyPlanTime">
        </el-table-column>
        <el-table-column
          label="实际开始时间" v-if="value !== 0"
          prop="driveStartTime">
        </el-table-column>
        <el-table-column
          label="实际结束时间" v-if="value !== 0"
          prop="driveEndTime">
        </el-table-column>
        <!-- <el-form-item label="预约陪驾时间：" style="min-width:250px">
          <span>{{ props.row.applyPlanTime}}</span>
        </el-form-item> -->
        <el-table-column
          label="操作" width="80px">
          <template slot-scope="props">
            <el-button type="primary" v-if="props.row.allotStatus === 1" size="small"
              @click="toAllot(props.row)">去分配</el-button>
            <el-button v-else disabled size="small"
             class="base" :class="'status'+props.row.applyStatus">
             {{props.row.applyStatus === 1 ? '未开始' : (props.row.applyStatus === 2 ? '进行中' : '已结束')}}
             </el-button>
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
      text:'客户姓名',
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
      this._search()
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
  @green:green;
  @red:red;
  @grey:grey;
  @white:white;
  .subscribeorder{
    .table-container{
      padding:0 20px;
      min-height:660px;
      .forms{
        .item{
          width:250px;
          height:15px;
        }
      }
      .base{
        opacity:0.5;
        color:@white;
        &.status1{
          background-color:@green;
        }
        &.status2{
          background-color:@red;
        }
        &.status3{
          background-color:@grey;
        }
      }
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