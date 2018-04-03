<template>
  <div class="search">
    <form class="input" @submit.prevent="search">
      <el-input class="text" placeholder="请输入内容" v-model="searchText"></el-input>
      <slot name="province"></slot>
      <el-button @click="search" type="primary">搜索</el-button>
    </form>
    <div class="refresh">
      <div class="image" @click="refresh">
        <img style="width:30px;" src="../assets/img/refresh.png" alt="">
      </div>
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
    padding:20px 35px;
    display:flex;
    justify-content: space-between;
    .input{
      display:flex;
      .text{
        min-width:150px;
        margin-right:15px;
      }
    }
    .refresh{
      display:flex;
      .image{
        margin-right:10px;
        padding-top:4px;
        cursor: pointer;
      }
    }
  }
</style>