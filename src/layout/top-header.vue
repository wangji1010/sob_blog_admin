<template>
  <div class="header-box">
    <div class="header-left-box">
      <div class="header-logo">博客管理中心</div>
    </div>
    <div class="header-right-box">
      <div class="header-user-info clear-fix">
        <div class="header-user-username float-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.userName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="userInfo!==null" class="head-user-avatar float-left">
          <img :src="userInfo.avatar" alt="">
        </div>
      </div>

    </div>
  </div>
</template>
<div>

</div>
<script>
import * as api from '../api/api'

export default {
  name: "top-header",
  mounted() {
    this.getCheckUser();
  },
  data() {
    return {
      userInfo: {
        userName: '',
        avatar: ''
      }
    }
  },
  methods: {
    handleCommand(command) {
      if (command==='userInfo'){
        //路由到用户信息
        this.$router.push({path:'/user/info'})
      }else if (command==='logout'){
        //退出 登录
        api.doLoginOut().then(res=>{
          if (res.code === 200) {
            // 回到登录页面
            this.$router.push({path:'/login'})
            this.$message.success(res.message);
          }
        })

      }
    },
    getCheckUser() {
      api.checkUser().then(res => {
        console.log(res.data)
        this.userInfo.userName = res.data.userName
        this.userInfo.avatar = res.data.avatar
      })
    }
  }
}
</script>

<style>
.header-user-info{
  cursor: pointer;
}
.clear-fix{
  float: none;
}
.float-left{
  float: left;
}
.float-right{
  float: right;
}
.el-dropdown {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.head-user-avatar{
  margin-right: 10px;
}
.head-user-avatar img {
  vertical-align: middle;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.header-right-box {
  margin-right: 80px;
  float: right;
}

.header-box {
  float: none;
}

.header-left-box {
  float: left;
}

.head-user-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.header-logo {
  font-size: 20px;
  font-weight: 600;
  color: #E9EEF3;
}

</style>