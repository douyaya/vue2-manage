<template>
  <div class="operateDriver">
    <head-top></head-top>
    <search>
    </search>
    <div class="container">
      <div class="title">
        未分配订单
      </div>
      <div class="table-container">
        <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="订单编号"
          prop="number">
        </el-table-column>
        <el-table-column
          label="下单人"
          prop="name">
        </el-table-column>
        <el-table-column
          label="电话"
          prop="phone">
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="time">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="small" type="primary"
              @click="handleEdit(scope.$index, scope.row)">去分配</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>
    <!-- 修改页面 -->
    <el-dialog class="dialog"
      title="分配陪驾人"
      :visible.sync="dialogVisible"
      width="30%">
      <el-radio-group class="modify" v-model="radio3">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
      <div class="footers">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <!-- <div class="Pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="15"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import Search from '@/components/search'
export default {
  name:'OperateDriver',
  components:{
    headTop,
    Search
  },
  data () {
    return {
      tableData:[
        {number:'1334555666666',name:'漳卅按',phone:'13456766567',time:'2018-03-12'}
      ],
      dialogVisible:false,
      radio3:'',
      load_data:false
    }
  },
  methods:{
    //去分配陪驾人
    handleEdit (index,val) {
      this.dialogVisible = true
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
      .title{
        padding-left:50px;
        margin-bottom:10px;
        color:@text-color;
      }
      .table-container{
        padding:0 40px;
        min-height:660px;
      }
    }
    .dialog{
      .modify{
        width:100%;
        margin-bottom:60px;
        text-align:center;
      }
      .footers{
        width:100%;
        text-align:center;
      }
    }
  }
</style>