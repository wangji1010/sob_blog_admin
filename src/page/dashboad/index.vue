<template>
    <div class="index-dashboard-box">
      <div class="index-dashborad-container">
        <div class="dashboard-title">
          欢迎使用沙雕博客系统！
      </div>
      <div class="dashboard-seo-box clearfix">
        <div class="seo-item">
          <div class="title">

          </div>
          <div class="content"></div>
        </div>
        <div class="seo-item">
          <div class="title">

          </div>
          <div class="content"></div>
        </div>
        <div class="seo-item">
          <div class="title">

          </div>
          <div class="content"></div>
        </div>
        <div class="seo-item-right">
          <div class="title">

          </div>
          <div class="content"></div>
        </div>
    
      </div>
      <!-- 下半部分 -->
      <div class="dashboard-bottom">

      </div>
      </div>
      
    </div>

</template>
<div>

</div>
<script>
// const axios = require('axios').default;
    export default {
        name: "index",
        mounted:{

        },
        data(){
          return{

          }
        },
        methods:{
          // get
        }

    }
</script>

<style>

.seo-item-right{
  float: left;
  border-radius: 4px;
  width: 305px;
height: 150px;
 line-height: 150;
text-align: center;
background: #fff;
 box-shadow: darkgrey 0px 0px 20px 5px;
}
.dashboard-bottom{
  height: 500px;
  margin-right: 40px;
  margin-top: 200px;
  text-align: center;
  background: cornsilk;
}
.index-dashboard-box{
  width: 100%;
  text-align: center;
  margin-top: 20px;
  padding: 0 10px;
  background: #fff;
  height: 500px;
}
.dashboard-seo-box{
  float: none;
  margin: 20px auto;
  text-align: center;
}
.dashboard-title{
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  columns: #000;
}

.seo-item{
margin-right: 20px;
  float: left;
  border-radius: 4px;
  width: 305px;
height: 150px;
 line-height: 150;
text-align: center;
background: #fff;
 box-shadow: darkgrey 0px 0px 20px 5px;
}


</style>