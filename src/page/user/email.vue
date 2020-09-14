<template>
    <div class="user-email-box" >

                <el-form ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
                    <el-form-item
                            label="新邮箱"
                    >
                        <el-input v-model="newEmail"></el-input>
                        <el-button v-if="!isCountDown" type="primary" class="user-veryfyCode" @click="getVeryfyCode">发送验证码</el-button>
                        <el-button v-else type="primary" class="user-veryfyCode" @click="getVeryfyCode" disabled>{{countDown}}</el-button>
                    </el-form-item>
                    <el-form-item
                            label="验证码"
                    >
                        <el-input v-model="verifycode" ></el-input>

                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="updateEmail">修改邮箱</el-button>
                    </el-form-item>
                </el-form>

    </div>
</template>
<div>

</div>
<script>
    const axios = require('axios').default;
    export default {
        name: "email",
        data(){
            return{
                isCountDown:false,
                newEmail:'',
            verifycode:'',
                countDown:'重新发送(60)'
            }
        },
        methods:{
            showCountDown(){
                let that = this
                let time = 60;
                this.isCountDown = true
                let interval = setInterval(function () {
                    time--;
                    if (time<=0){
                        that.isCountDown = false
                        clearInterval(interval)
                    }
                    that.countDown = '重新发送('+time+')'
                },1000);
            },
            getVeryfyCode(){
                //校验邮箱格式
                let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
                if (!reg.test(this.newEmail)){
                    this.$message.warning("邮箱地址格式不正确");
                    return
                }

                //发起请求获取验证码
                axios.get('/user/verify_code?email='+this.newEmail+'&type=update').then(reponse=>{
                    let res = reponse.data;
                    if (res.code===200){
                       this.showCountDown();
                        this.$message.success(res.message)
                    }else {
                        this.$message.error(res.message)
                    }
                })
                //禁止按钮倒计时
            },
            updateEmail(){
                if (this.newEmail===''){
                    this.$message.error('邮箱不能为空');
                    return
                }
                if (this.verifycode===''){
                    this.$message.error('验证码不能为空');
                    return;
                }

                axios.put('/user/email?email='+this.newEmail+'&verifyCode='+this.verifycode).then(response=>{
                    let res = response.data;
                    if (res.code===200){
                        this.newEmail='';
                        this.verifycode='';
                        this.$message.success(res.message)
                    }else {
                        this.$message.error(res.message)
                    }
                })
            }
        }
    }
</script>

<style>
    .user-email-box .el-input{
        max-width: 250px;
    }
    .user-email-box .user-veryfyCode{
        margin-left: 15px;
    }

</style>