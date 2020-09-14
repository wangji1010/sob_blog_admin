<template>
    <div class="settings-web-info-box">
        <el-form label-width="80px">
            <el-form-item label="网站名称">
                <el-input v-model="websizeTitle"></el-input>
            </el-form-item>
            <el-form-item label="关键字">
                <el-input v-model="keywords" placeholder="关键字用“，”隔开"></el-input>
            </el-form-item>
            <el-form-item label="网站描述">
                <el-input type="textarea" v-model="description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateSeoInfo"> 更 新 </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    const axios = require('axios').default;
    export default {
        name: "websize-info",
        data(){
            return{
                websizeTitle:'',
                keywords:'',
                description:'',
                oldInfo:{
                    websizeTitle:'',
                    keywords:'',
                    description:''
                }

            }
        },mounted() {
            this.getwebsizeInfo();
            this.getwebsizeTitle();
        },
        methods:{
            updateSeoInfo(){
                //检查数据
                if (this.websizeTitle===''){
                    this.$message.error('网站标题不可以为空！');
                    return
                }
                if (this.keywords===''){
                    this.$message.error('网站关键字不可以为空！');
                    return
                }
                if (this.description===''){
                    this.$message.error('网站描述不可以为空！');
                    return
                }
                let isSeoUpdate = false;
                //提交数据
                if (this.description!==this.oldInfo.description || this.keywords!==this.oldInfo.keywords){
                    //seo跟原来不一样的时候
                    isSeoUpdate = true;
                    axios.put('/admin/webinfo/seo?description='+this.description+'&keywords='+this.keywords)
                        .then(response=>{
                            let res = response.data;
                            if (res.code===200){
                                this.$message.success(res.message);
                                this.getwebsizeInfo();
                            }
                        })
                }
                if (this.websizeTitle!==this.oldInfo.websizeTitle){

                    axios.put('/admin/webinfo/title?title='+this.websizeTitle).then(response=>{
                        let res = response.data;
                        if (res.code===200){
                            if (!isSeoUpdate){
                                this.$message.success(res.message);
                            }
                            this.getwebsizeTitle();
                        }
                    })
                }


            },
            getwebsizeInfo(){
                axios.get('/admin/webinfo/seo').then(respones=>{
                    let res = respones.data;
                    console.log("seo"+res);
                    if (res.code === 200){
                        this.keywords = res.data['web_size_keywords'];
                        this.description = res.data['web_size_description'];
                        this.oldInfo.keywords = this.keywords;
                        this.oldInfo.description = this.description;
                        this.oldInfo.websizeTitle = this.websizeTitle;
                    }
                })
            },
            getwebsizeTitle(){
                axios.get('/admin/webinfo/title').then(respones=>{
                    let res = respones.data;
                    if (res.code===200){
                        this.websizeTitle = res.data.value;
                    }
                })
            }
        }
    }
</script>

<style lang="css">
        .settings-web-info-box .el-input, .settings-web-info-box .el-textarea{
            width: 500px;
        }
</style>