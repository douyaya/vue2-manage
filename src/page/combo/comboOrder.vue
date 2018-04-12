<template>
  <div class="comboorder">
    <head-top></head-top>
    <!-- <search v-bind:placeholder="text" v-show="isAnalyse" v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-button @click="isAnalyse = false" type="primary" size="small">数据分析</el-button>
    </search> -->
    <div v-show="isAnalyse" class="nav">
      <div class="input">
        <el-input class="item" @keyup.enter.native="_search" size="small" placeholder="客户姓名" v-model="name"></el-input>
        <el-input class="item" @keyup.enter.native="_search" size="small" placeholder="客户电话" v-model="cellphone"></el-input>
        <el-input class="item" @keyup.enter.native="_search" size="small" placeholder="套餐名称" v-model="comboName"></el-input>
        <el-input class="item" @keyup.enter.native="_search" size="small" placeholder="订单编号" v-model="orderNo"></el-input>
        <!-- <el-input class="item" @keyup.enter.native="_search" size="small" placeholder="下单时间" v-model="createTime"></el-input> -->
        <el-date-picker class="item"
          v-model="createTime"
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          @change="handleChange"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" style="height:29px;margin-left:10px;" size="small" @click="_search">
          <i class="el-icon-search"></i>
        </el-button>
      </div>
      <div class="refresh">
        <el-button type="primary" style="height:29px;" size="small" @click="_search">
          <img class="image" src="../../assets/img/refresh.png" alt="">
        </el-button>
        <el-button @click="dataAnalyse" type="primary" size="small">数据分析</el-button>
      </div>
    </div>
    <div v-if="isAnalyse">
      <div class="table-container">
        <el-table v-loading="load_data"
            element-loading-text="拼命加载中"
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div>套餐信息</div>
              <el-form label-position="left" inline>
                <el-form-item label="套餐名称：" style="width:23%">
                  <span>{{ props.row.comboName}}</span>
                </el-form-item>
                <el-form-item label="套餐价格：" style="width:23%">
                  <span>{{`￥${props.row.comboPrice}`}}</span>
                </el-form-item>
                <el-form-item label="套餐陪驾次数：" style="width:23%">
                  <span>{{`${props.row.comboDriveTime}次`}}</span>
                </el-form-item>
                <el-form-item label="单次陪驾时间：" style="width:23%">
                  <span>{{`${props.row.comboDriveEveryTime}小时`}}</span>
                </el-form-item>
                <el-form-item label="陪驾车型：" style="width:23%">
                  <span>{{ props.row.vehicleModelName}}</span>
                </el-form-item>
                <el-form-item label="已使用次数：" style="width:23%">
                  <span>{{ props.row.comboResidueTime}}</span>
                </el-form-item>
                <el-form-item label="套餐描述：">
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
            label="套餐编号" width="225px"
            prop="comboOrderNo">
          </el-table-column>
          <el-table-column
            label="购买人"
            prop="custName">
          </el-table-column>
          <el-table-column
            label="联系人电话" width="130px"
            prop="custPhone">
          </el-table-column>
          <el-table-column
            label="套餐名称"
            prop="comboName">
          </el-table-column>
          <el-table-column
            label="支付金额">
            <template slot-scope="scope">
              <span>{{`￥${scope.row.comboPrice}`}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下单时间" width="175px">
            <template slot-scope="scope">
              <span>{{scope.row.comboOrderTime}}</span>
            </template>
          </el-table-column> 
          <el-table-column label="支付状态" prop="payStatus">
            <template slot-scope="scope">
              <span class="pay" :class="scope.row.payStatus === 0 ? 'paystatus1' : 'paystatus2'">{{scope.row.payStatus | bestatus}}</span>
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
    <div v-else class="analyse-container">
      <div class="analyse">
        <el-date-picker
          size="small"
          v-model="value7"
          value-format="yyyy-MM-dd"
          @change="handleChanges"
          type="daterange"
          align="right"
          unlink-panels
          placeholder="开始日期至结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
        <el-button type="primary" size="small" @click="isAnalyse = true">返回套餐列表</el-button>
      </div>
      <el-table v-loading="load_datatwo"
            element-loading-text="拼命加载中"
          :data="analyseData">
        <el-table-column
          label="套餐名称"
          prop="comboName">
        </el-table-column> 
        <el-table-column
          label="套餐价格"
          prop="comboPrice">
        </el-table-column>
        <el-table-column
          label="套餐陪驾次数"
          prop="comboDriveTime">
        </el-table-column>
          <el-table-column
          label="单次陪驾时间"
          prop="comboDriveEveryTime">
        </el-table-column>
        <el-table-column
          label="订单总数"
          prop="orderCount">
        </el-table-column> 
        <el-table-column
          label="套餐总金额"
          prop="sumPrice">
        </el-table-column> 
          <el-table-column
          label="总交易金额"
          prop="sumAmount">
        </el-table-column> 
      </el-table>  
    </div>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import {comboPayList,analyseCombo} from '@/api/index.js'
export default {
  name:'ComboOrder',
  components:{
    headTop
  },
  data () {
    return {
      tableData:[],
      load_data:true,
      count:43,
      currentPage:1,
      pageSize:15,
      isAnalyse:true,
      load_datatwo:true,
      analyseData:[],
      name:'',
      cellphone:'',
      comboName:'',
      orderNo:'',
      createTime:'',
      value7:'',
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
    }
  },
  filters:{
    bestatus (val) {
      return val === 0 ? '已支付' : '未支付'
    }
    // beTime (val) {
    //   return val.slice(0,val.lastIndexOf('.'))
    // }
  },
  created () {
    this.getTableData(1,'','','','')
  },
  methods:{
    //日期选择
    handleChange (val) {
      this.createTime = val
      this._search()
    },
    //调到数据分析页面
    dataAnalyse () {
      this.isAnalyse = false
      this._analyseCombo()
    },
    //数据分析的日期选择
    handleChanges (val) {
      let arr = val.split('至')
      this._analyseCombo(arr[0],arr[1])
    },
    //获取分析数据
    _analyseCombo (beginTime,endTime) {
      let data = {
        comboOrderBeginTime:beginTime,
        comboOrderEndTime:endTime
      }
      analyseCombo(data).then(res => {
        if (res.code === '0') {
          this.load_datatwo= false
          this.analyseData = res.data
        }
      })
    },
    //获取列表数据
    getTableData (pageNo,name,cellphone,comboName,orderNo,createTime) {
      let data = {
        pageNo:pageNo,
        pageSize:this.pageSize,
        name:name,
        cellphone:cellphone,
        comboName:comboName,
        orderNo:orderNo,
        createTime:createTime
      }
      console.log(data)
      comboPayList (data).then(res => {
        if (res.code === '0') {
          this.load_data = false
          this.tableData = res.data.results
          this.count = res.data.totalRecord
        }
      })
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData(val,this.name,this.cellphone,this.comboName,this.orderNo,this.createTime)
    },
    //搜索
    _search () {
      this.getTableData(this.currentPage,this.name,this.cellphone,this.comboName,this.orderNo,this.createTime)
    }
  }
}
</script>
<style lang="less" scoped>
  .comboorder{
    .nav{
      display:flex;
      justify-content: space-between;
      padding:20px;
      .input{
        display:flex;
        .item{
          width:120px;
          margin-left:10px;
        }
      }
      .refresh{
        display:flex;
        .image{
          width:20px;
          margin:-3px -3px 0;
        }
      }
    }
    .table-container{
      padding:0 20px;
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
    .analyse-container{
      padding:0 30px;
      .analyse{
        display:flex;
        padding:10px 0;
        justify-content: space-between;
      }
    }
  }
</style>