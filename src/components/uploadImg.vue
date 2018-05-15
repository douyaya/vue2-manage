<template>
  <div class="uploadimg">
      <ul class="imglist">
        <slot></slot>  
        <li class="item" v-show="imgList.length" v-for="(item,index) of imgList" :key="index"> 
            <img class="img" :src="item" alt="">
            <div class="close" @click="deleteImg(index)">x</div>
        </li>
        <li class="item">
          <label for="iamge" @click="emitimage">
            <img class="img" src="../assets/img/add.png" alt="">
          </label>
        </li>
      </ul>
    <form style="display:none" id="orderimg">
      <input accept="image/*" id="image" type="file" name="file" ref="inputs" @change="upload"> 
    </form>
  </div>
</template>
<script>
import {typeofimg} from '@/api/utility'
import axios from 'axios'
export default {
  name:'Uploadimg',
  data () {
    return {
      imgList: []
    }
  },
  methods: {
    upload () {
      let self = this
      let type = typeofimg(self.$refs.inputs.files[0])
      let arr = ['png', 'jpg', 'jpeg', 'gif', 'psd', 'eps']
      if (arr.indexOf(type) !== -1) {
        let form = document.getElementById("orderimg")
        console.log(form)
        let fd = new FormData(form)
        axios({
          method: 'post',
          url: 'http://pjxmgr.howelliot.com:8080/evdrive_web/file/picUpload.do',
          // url: 'http://192.168.1.106:8084/file/picUpload.do',
          data: fd
        }).then(res => {
          if (res.data.code === '0') {
            self.imgList.push(res.data.data[0])
            document.getElementById("image").value = ''
          } else {
            alert('上传失败')
          }
        })
      } else {
        alert('图片格式错误')
      }
    },
    emitimage () {
      document.getElementById("image").click()
    },
    // 删除图片
    deleteImg (index) {
      this.imgList.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
   .uploadimg{
      .imglist{
        margin-left:-70px;
        list-style: none;
        display:flex;
        flex-wrap: wrap;
        .item{
          margin-left:10px;
          .img{
            width:100px;
            height:100px;
            position: relative;
          }
          .close{
            position: absolute;
            top:40px;
            background:lightpink;
            width:20px;
            height:20px;
            line-height: 20px;
            text-align:center;
            border-radius: 50%;
            z-index:20;
          }
        }
      }
   }
</style>