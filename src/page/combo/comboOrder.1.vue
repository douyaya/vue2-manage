<template>
  <div class="comboorder">
    <head-top></head-top>
    <search v-show="!isList" v-on:search="_search" ref="search" v-on:refresh="_search">
      <el-button size="small" type="primary" @click="toCharts">数据分析</el-button>
    </search>
    <div :class="isList ? 'transparent':''">
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
              <!-- <span>{{scope.row.comboOrderTime | beTime}}</span> -->
              <span>{{scope.row.comboOrderTime}}</span>
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
    <div :class="isList ? '': 'transparent'">
      <div class="charts">
        <el-date-picker class="date"
          v-model="value6"
          type="daterange"
          placeholder="选取查询时间区间"
          align="right"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="handleChange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
        <!-- <el-button @click="searchData">搜索</el-button> -->
      </div>
      <div id="myChart" :style="{width: '1000px', height: '600px'}">
      </div>
    </div>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import Search from '@/components/search' 
import {comboPayList,getComboData,analyseCombo} from '@/api/index.js'
import {getComboName} from '@/api/utility.js'
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
      pageSize:15,
      isList:false,
      value6:'',
      comboData:[],
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
  // mounted () {
  //   this.dramLine()
  // },
  filters:{
    bestatus (val) {
      return val === 0 ? '已支付' : '未支付'
    }
    // beTime (val) {
    //   return val.slice(0,val.lastIndexOf('.'))
    // }
  },
  created () {
    this.getTableData(1,'')
    this._getComboData()
    this._analyseCombo('2018-03-01','2018-04-10')
  },
  methods:{
    //获取套餐种类
    _getComboData () {
      let data = {
        pageNo:1,
        pageSize:1000,
        name:''
      }
      getComboData(data).then(res => {
        if (res.code === '0') {
          this.comboData = getComboName(res.data.results)
        }
      })
    },
    //查看图表分析
    toCharts () {
      this.isList = !this.isList
      this.dramLine()
    },
    //获取分析数据
    _analyseCombo (beginTime,endTime) {
      let data = {
        comboOrderBeginTime:beginTime,
        comboOrderEndTime:endTime
      }
      analyseCombo(data).then(res => {

      })
    },
    //图标参数
    dramLine () {
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        tooltip : {
          trigger: 'axis'
        },
        toolbox: {
            show : true,
            feature : {
                // mark : {show: true},
                // dataView : {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        legend: {
            data:this.comboData
        },
        xAxis : [
            {
              type : 'category',
              data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
        ],
        yAxis : [
          {
              type : 'value',
              name : '数量',
              axisLabel : {
                  formatter: '{value} 个'
              }
          },
          {
              type : 'value',
              name : '',
              axisLabel : {
                  formatter: ''
              }
          }
        ],
        series : [
            {
                name:'套餐A',
                type:'bar',
                data:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },
            {
                name:'套餐B',
                type:'bar',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
                name:'套餐C',
                type:'line',
                yAxisIndex: 1,
                data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
        ]
      })
    },
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
    },
    //根据日期查询数据
    searchData () {
      console.log(this.value6)
    },
    //日期改变是触发
    handleChange (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less" scoped>
  .comboorder{
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
    .transparent{
      display:none;
    }
    .charts{
      display:flex;
      padding:20px;
      .date{
        margin-right:10px;
      }
    }
  }
</style>