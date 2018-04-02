<template>
  <div class="systemuser">
    <head-top></head-top>
    <search>
      <el-button @click="addDate" type="primary"><i class="el-icon-plus"></i> 添加数据</el-button>
    </search>
    <div class="table_container">
      <el-table v-loading="load_data"
          element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%">
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="套餐详情">
                <span>{{ props.row.detail}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column
          label="编号"
          prop="number">
        </el-table-column>
        <el-table-column
          label="用户姓名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="phone">
        </el-table-column>
        <el-table-column
          label="类型"
          prop="type">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>  
    </div>
    <!-- 修改页面 -->
    <el-dialog
      title="修改套餐信息"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" :model="form" class="form" label-width="80px">
        <el-form-item label="用户姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.everyTime"></el-input>
        </el-form-item>
      </el-form>
      <div class="footers">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
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
  name:'SystemUser',
  components:{
    headTop,
    Search
  },
  data () {
    return {
      currentPage:1,//当前页码
      count:50,//总条目数
      tableData:[],
      load_data:true, //是否在加载数据
      dialogVisible:false, //弹出修改窗口
      form:{              //修改数据
        name:'', 
        times:'',    
        price:'',  
        everyTime:'', 
        car:'',   
        detail:'' 
      }
    }
  },
  created () {
    this.getComboData()
  },
  methods:{
    //添加数据
    addDate () {
      this.dialogVisible = true
    },
    //页码改变时触发
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(this.count)
      console.log(this.currentPage)
    },
    //获取套餐数据
    getComboData () {
      this.tableData = [
         {
          name:'fffff', //套餐名称
          times:'3',    //陪驾次数
          price:'300',  //套餐价格
          everyTime:'3', //单次时间
          car:'荣威',   //车型
          detail:'该套餐便宜好用' //套餐详情
        }
      ]
      this.load_data = false
    },
    //删除数据
    handleDelete (index,val) {

    },
    //修改数据
    handleEdit (index,val) {
      this.form = val
      this.dialogVisible = true
    },
    //提交修改
    confirmModify () {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
  .systemuser{
    .table_container{
      padding:0 40px;
      min-height:660px;
    }
    .Pagination{
      padding-left:70%;
      margin-top:10px;
    }
    .form{
      padding:10px;
    }
    .footers{
      width:100%;
      padding-left: 35% !important;
    }
  }
</style>