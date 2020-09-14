<template>
    <div class="settings-userinfo-box">
        <div class="userinfo-list-part">
            <el-form  status-icon  ref="ruleForm" size="small" label-width="100px" class="demo-ruleForm" v-if="userInfo!==null">
                <el-form-item label="用户id" >
                    <el-input type="text" v-model="userInfo.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input type="text" v-model="userInfo.userName" ></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <div class="user-avatar-container" @click="showAvatarDialog">
                        <el-avatar :src="userInfo.avatar" class="useringo-avatar"></el-avatar>
                    </div>
                </el-form-item>
                <el-form-item label="email" >
                    <el-input v-model="userInfo.email" type="email" disabled></el-input>
                    <el-button type="primary" class="userinfo-update-email" @click="toUpdateEmailPage">重置</el-button>
                </el-form-item>
                <el-form-item label="签名">
                    <el-input type="text" v-model="userInfo.sign" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateUserInfo">提交</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div class="userinfo-dialog">
            <my-upload field="file"
                       @crop-upload-success="cropUploadSuccess"
                       @crop-upload-fail="cropUploadFail"
                       v-model="showAvatar"
                       :width="300"
                       :height="300"
                       url="/admin/images"
                       ></my-upload>
        </div>
    </div>
</template>
<div>

</div>
<script>
    const axios = require('axios').default;
    import myUpload from 'vue-image-crop-upload';
    export default {
        components: {
            'my-upload': myUpload
        },
        mounted() {
            this.getUserInfo();
        },
        name: "info",
        data(){
            return{
                      userInfo:[],
                showAvatar:false,
                lastUserName:''
            }
        },
        methods:{
            showAvatarDialog(){
              this.showAvatar = true
            },
            cropUploadFail( status, field){
                console.log("======status=="+ status)
                console.log("======field=="+ field)
            },
            cropUploadSuccess(response){
            if (response.code === 200){
                // this.showAvatar = false
                this.$message.success('上传成功');
                //回显数据
                this.userInfo.avatar = 'http://localhost:8090/admin/images/'+response.data.path;
                console.log(response)
            }else {
                this.$message.error('上传失败');
            }
            },
            getUserInfo(){
                axios.get('/user/check-token').then(response=>{
                    let res = response.data;
                    console.log(res);
                    this.lastUserName = res.data.userName
                    this.userInfo = res.data;
                })
            },
            updateUserInfo(){

                //检查数据
                if (this.userInfo.userName===''){
                    this.$message.error('用户名不能为空');
                }
                console.log(this.lastUserName)
                console.log(this.userInfo.userName)

                if (this.lastUserName===this.userInfo.userName){
                    this.doUpdateInfo();
                }else {
                    axios.get('/user/user_name?userName='+this.userInfo.userName).then(response=>{
                        let res = response.data;
                        if (res.code===400){
                            this.doUpdateInfo();
                        }else {
                            this.$message.error(res.message);
                        }
                    })
                }
                //头像不可以为空
            },
            toUpdateEmailPage(){
                this.$router.push({
                    path:'/user/email'
                })
            },
            doUpdateInfo(){
                if (this.userInfo.avatar === ''){
                    this.$message.error('头像不可以为空')
                    return
                }
                axios.put('/user/user_info/'+this.userInfo.id,this.userInfo).then(response=>{
                    let res = response.data;
                    console.log(res);
                    if (res.code === 400){
                        this.$message.error(res.message);
                    }else {
                       this.getUserInfo();
                        this.$message.success(res.message);
                    }
                })
            }
        }
    }
</script>

<style lang="css">

    .settings-userinfo-box .el-input{
        width: 250px;
    }
    .userinfo-update-email{
        margin-left: 20px;
        display: inline-block;
    }
    .useringo-avatar{
        cursor: pointer;
    }
    .user-avatar-container{
        width: 100px;
    }

</style>