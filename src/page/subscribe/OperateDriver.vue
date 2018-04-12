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
          <span class="item">{{`陪驾地点：${data.applyAddress}`}}</span>
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
        <el-card style="width:350px;margin:0 10px 10px 0" v-for="(tmp,index) of orderList" :key="index">
          <div>{{`订单编号：${tmp.applyNo}`}}</div>
          <div>{{`预约陪驾时间：${tmp.applyPlanTime}`}}</div>
          <div>{{`预约陪驾地点：${tmp.applyAddress}`}}</div>
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
import {allotDriver,getDriverOrder,Allot} from '@/api/index.js'
export default {
  name:'OperateDriver',
  data () {
    return {
      data:{},
      driverList:[],
      radio3:'',
      orderList:[]
    }
  },
  created () {
    this.data = JSON.parse(this.$route.query.data)
    console.log(this.data)
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
      this._getDriverOrder(val)
    },
    //获取陪驾人订单
    _getDriverOrder (val) {
      let data = {
        driverId:val
      }
      console.log(data)
      getDriverOrder(data).then(res => {
        if (res.code === '0') {
          this.orderList = res.data
        }
      })
    },
    //提交陪驾人结果
    confirmModify () {
      let data = {
        applyId:this.data.applyId,
        comboOrderId:this.data.comboOrderId,
        driverId:this.radio3,
        state:'hwdrive'
        // state:'test'
      }
      console.log(data)
      Allot(data).then(res => {
        if (res.code === '0') {
          this.$router.back()
          this.$message({
            type:'success',
            message:'分配成功'
          })
        } else {
          this.$message({
            type:'info',
            message:'分配失败'
          })
        }
      })  
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
        flex-wrap:wrap;
        // .item{
        //   margin-right:20px;
        //   width:400px;
        // }
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