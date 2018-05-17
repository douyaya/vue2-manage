<template>
  <div class="search">
    <form class="input" @submit.prevent="search">
      <el-input  @keyup.enter.native="search" class="text" size="small" :placeholder="placeholder" v-model="searchText"></el-input>
      <slot name="province"></slot>
      <el-button type="primary" style="height:29px;" size="small" @click="search">
        <i class="el-icon-search"></i>
      </el-button>
    </form>
    <div class="refresh">
      <slot name="integral"></slot>
      <el-button type="primary" style="height:29px;" size="small" @click="search">
        <img class="image" src="../assets/img/refresh.png" alt="">
      </el-button>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name:'Search',
  data () {
    return {
      searchText:''
    }
  },
  props:{
    placeholder:{
      type:String,
      required:true
    }
  },
  methods:{
    //搜索事件
    search () {
      this.$emit('search')
    },
    //刷新
    refresh () {
      this.$emit('refresh')
    }
  }
}
</script>
<style lang="less" scoped>
  .search{
    padding:20px;
    display:flex;
    justify-content: space-between;
    .input{
      display:flex;
      .text{
        width:150px;
        margin-right:15px;
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
</style>