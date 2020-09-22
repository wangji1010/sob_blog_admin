<template>
    <!--管理后台只需要，登录，无需注册和找回密码-->
    <!--前端门户，则需要 找回密码，用户注册，用户登录-->
    <!--如果前端门户是管理员登录，则重定向到后台管理页面-->


    <div>
        <!--顶部内容-->
        <div class="admin-login-header-box">
            <div class="admin-login-header-center center">
                <div class="admin-login-logo">
                    <span>博客系统 | 登录</span>
                </div>
            </div>
        </div>
        <!--中间内容-->
        <div class="admin-login-center-box center">
            <div class="login-center-box">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form :model="sobUser" label-position="right" label-width="80px">
                            <el-form-item label="账号" required prop="userName">
                                <el-input v-model="sobUser.userName" placeholder="用户名/或者邮箱地址"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" required prop="password">
                                <el-input type="password" v-model="sobUser.password" placeholder="证明你自己"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" required>
                                <el-input v-model="loginInfo.verifyCode" placeholder="请输入人类验证码" @keypress.enter.native="doLogin"></el-input>
                                <img :src="captchaPath" alt="点击更新" @click="updateVeryfyCode" class="captcha_code">
                            </el-form-item>
                            <el-form-item class="login-button">
                                <el-button type="primary" @click="doLogin" size="small" > 登 录 </el-button>
                                <el-button @click="resetForm('ruleForm')" size="small"> 重 置 </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>

            </div>
        </div>
        <!--底部内容-->
    </div>
</template>
<script>
    const axios = require('axios').default;
    export default {
        name: "login",
        rules: {
            userName: [
                {required: true, message: '请输入账号', trigger: 'blur'},
                {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ],
            password: [
                {required: true, message: '请输入密码', trigger: 'blur'},
                {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ]
        },
        mounted() {
            this.loginInfo.captcha_key = Date.parse(new Date())
            this.updateVeryfyCode();
        },
        data() {
                return {
                    sobUser: {
                        userName: '',
                        password: ''
                    },
                    loginInfo: {
                        verifyCode: "",
                        captcha_key: ""
                    },
                    captchaPath:''
                }
            },
        methods:{
            //检查登录是否有效

            toastS(msg){
                this.$message.success(msg)
            },
            toastW(msg){
                this.$message.warning(msg)
            },
            toastE(msg){
                this.$message.error(msg)
            }
            ,
            doLogin(){
                //发起登录

                //检查数据
                if (this.sobUser.userName==='') {
                    this.toastE("用户名不可以为空！")
                    return
                }
                if (this.sobUser.password==='') {
                    this.toastE("密码不可以为空！")
                    return
                }
                if (this.loginInfo.verifyCode==='') {
                    this.toastE("验证码不可以为空！")
                    return
                }
                //向服务器提交数据
                console.log(this.sobUser)
                console.log(this.loginInfo)
                // Send a POST request
                axios({
                    method: 'post',
                    url: '/user/login/'+this.loginInfo.verifyCode,
                    data: this.sobUser
                }).then(result=>{
                   console.log(result)
                    //判断处理结果
                    //判断状态
                    let data = result.data
                    if (data.code===200){
                        this.toastS(data.message);
                        //如果成功  -->判断角色  如果普通用户  跳转到门户首页，管理员 ，跳转到管理中心
                        //TODO 判断角色
                        this.$router.push({path:'/index'})
                    }else {
                        this.updateVeryfyCode()//更新验证码
                        this.toastE(data.message);
                    }


                    //其他给出提示
                });
                //处理结果
            },
            resetForm(){

            },
            updateVeryfyCode(){
                this.captchaPath = 'http://localhost:8090/user/captcha?captcha_key='+ this.loginInfo.captcha_key
                    + "&random"+Date.parse(new Date());
                console.log(this.captchaPath)
            }
        }
        }

</script>

<style>
   
    .captcha_code{
        margin-left: 10px;
        vertical-align: middle;
        cursor: pointer;
        width: 100px;
        border: 1px solid #cccccc;
        padding: 0 10px;
        height: 41px;
    }
    .login-button{
        margin-bottom: 0;
    }
    .admin-login-header-box{
        margin-bottom: 20px;
        width: 100%;
        height: 46px;
        background-color: dodgerblue;
    }

    .center{
        margin: 0 auto;
        width: 1140px;
    }

    .admin-login-header-center{
        line-height: 46px;

    }
    .admin-login-logo{
        color: #ffffff;
        font-size: 20px;
        font-weight: 600;
    }
    .login-center-box .el-input{
        width: 200px;

    }
    .login-center-box{
        padding: 20px 20px;
        width: 1110px;

        background-color: #ffffff;
        box-shadow: 0 1px 10px #afafaf;
        border-radius: 5px;
    }
    .el-form-item__label{
        border-left: solid 1px #ccc;
        border-top: solid 1px #ccc;
        border-bottom: solid 1px #ccc;
        background-color: #fbfbfb;
        text-align: center;
    }
    .el-input__inner{
        border-radius: 0;
        border-bottom: 1px solid #cccccc;
    }

</style>