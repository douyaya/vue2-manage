<template>
  <div class="operateDriver">
    <div class="container">
      <div class="title">待分配订单详情</div>
      <div class="card-container">
        <el-card class="card">
          <div style="margin-bottom:5px;">{{`订单编号：${data.applyNo}`}}</div>
          <span class="item">{{`套餐名称：${data.comboName}`}}</span>
          <span class="item">{{`套餐价格：￥${data.comboPrice}`}}</span>
          <span class="item">{{`陪驾车型：${data.vehicleModelName}`}}</span>
          <span class="item">{{`套餐陪驾次数：${data.comboDriveTime}次`}}</span>
          <span class="item">{{`单次陪驾时间：${data.comboDriveEveryTime}小时`}}</span>
          <span class="item">{{`已使用次数：${data.comboResidueTime}次`}}</span>
          <span class="item">{{`客户姓名：${data.custName}`}}</span>
          <span class="item">{{`客户电话：${data.custPhone}`}}</span>
          <span class="item">{{`约车时间：${data.applyPlanTime}`}}</span>
        </el-card>
      </div>
    </div>
    <!-- 选人页面 -->
    <div class="dialog">
      <div class="title">可分配陪驾人</div>
      <el-radio-group @change="getOrder" class="modify" v-model="radio3">
        <el-radio-button v-for="(value,index) in driverList" :key="index" :label="value.id">
          <div>{{`姓名：${value.name}`}}</div>
          <div>{{`电话：${value.cellphone}`}}</div>
        </el-radio-button>
      </el-radio-group>
      <div class="list">
        <el-card class="item" v-for="(tmp,index) of orderList" :key="index">
          <div>{{`订单编号：${tmp.number}`}}</div>
          <div>{{`预约陪驾时间：${tmp.time}`}}</div>
          <div>{{`预约陪驾地点：${tmp.address}`}}</div>
        </el-card> 
      </div>
      <div class="footers">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </div>
    </div>    
  </div>
</template>
<script>
import {allotDriver,getSubscribeOrder} from '@/api/index.js'
export default {
  name:'OperateDriver',
  data () {
    return {
      driverList:[],
      radio3:'',
      orderList:[]
    }
  },
  created () {
    this.data = JSON.parse(this.$route.query.data)
    this._allotDriver()
  },
  methods:{
    //获取陪驾人信息
    _allotDriver () {
      allotDriver().then(res => {
        if (res.code === '0') {
          this.driverList = res.data
          this.radio3 = res.data[0].id
        }
      })
    },
    getOrder (val) {
      console.log(this.radio3)
      // this._getSubscribeOrder()
      this.orderList = [
        {number:11222222222,address:'ffffff',time:'dddd'},
        {number:11222222222,address:'ffffff',time:'dddd'},
        {number:11222222222,address:'ffffff',time:'dddd'},
        {number:11222222222,address:'ffffff',time:'dddd'},
        {number:11222222222,address:'ffffff',time:'dddd'}
      ]
    },
    //获取陪驾人订单
    //////////////////////////////////////////////////////////////////////
    _getSubscribeOrder () {
      let data = {
        
      }
      getSubscribeOrder(data).then(res => {
        if (res.code === '0') {
          this.orderList = res.data
        }
      })
    },
    //提交陪驾人结果
    confirmModify () {
      console.log(this.radio3)
    }
  }
}
</script>
<style lang="less" scoped>
  @text-color:grey;
  .operateDriver{
    .container{
      .card-container{
       display:flex;
       justify-content: center;
       .card{
         width:90%;
         display:flex;
         .item{
           display:inline-block;
           width:250px;
           margin-bottom:5px;
         }
       }
      }
    }
    .dialog{
      .modify{
        width:100%;
        padding-left:50px;
        // text-align:center;
      }
      .list{
        margin:20px 50px;
        display:flex;
        .item{
          margin-right:20px;
        }
      }
      .footers{
        width:100%;
        text-align:center;
      }
    }
    .title{
      padding-left:50px;
      margin:50px 0 15px 0;
      color:@text-color;
    }
  }
</style>