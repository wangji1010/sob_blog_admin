<template>
    <div class="user-box">
        <div class="user-search-box">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="用户名">
                    <el-input v-model="ueSearch.userName" size="mini" placeholder="用户名查询"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址">
                    <el-input v-model="ueSearch.email" size="mini" placeholder="邮箱地址查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="doSearch" size="mini" plain>搜 索</el-button>
                    <el-button type="warning" @click="cleanSeach" size="mini" plain>清 空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--显示-->
        <div class="user-list-show">
            <el-table
                    :data="userList"
                    border
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名"
                        width="130">
                </el-table-column>
                <el-table-column
                        label="头像"

                >
                    <template slot-scope="scope">
                        <el-image
                                class="loop-image"
                                style="width: 60px; height: 60px"
                                :src="scope.row.avatar"
                                fit="fit"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                prop="sign"
                label="签名"
                >

                </el-table-column>
                <el-table-column
                        label="状态"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.state==='0'"><el-tag type="danger" size="small">已删除</el-tag></div>
                        <div v-if="scope.row.state==='1'"><el-tag type="success" size="small" > 正 常 </el-tag></div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="角色"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.roles==='role_admin'"><el-tag type="warning">超级管理员</el-tag></div>
                        <div v-if="scope.row.roles==='role_normal'"><el-tag>普通用户</el-tag></div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="注册日期"
                >
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.createTime)"></span>
                    </template>
                </el-table-column>


                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="rePassword(scope.row)" type="primary" size="small">重置密码</el-button>
                        <el-button @click="deleteItem(scope.row)" type="danger" v-if="scope.row.cStatus!=='0'" size="small" >删除</el-button>
                        <el-button @click="deleteItem(scope.row)" type="danger" v-if="scope.row.cStatus==='0'" disabled size="small" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
<div class="page-navigation">
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNavigation.currentPage"
            :page-sizes="[3, 5, 8, 15]"
            :page-size="pageNavigation.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageNavigation.totalSize">
    </el-pagination>
</div>
        <div>
            <!--删除弹窗-->
            <el-dialog
                    title="提示"
                    :visible.sync="deleteDialogShow"
                    width="30%"
            >
                <span>你确定要删除:【 {{deleteMessage}} 】该用户么？</span>
                <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="deleteDialogShow = false">取 消</el-button>
    <el-button size="mini" type="danger" @click="doDeleteItem">确 定</el-button>
  </span>
            </el-dialog>
            <!--删除弹窗-->
            <el-dialog
                    title="重置密码"
                    :visible.sync="resetPasswordDialogShow"
                    width="30%"
            >
                <el-form :model="resetPassword" status-icon  ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="resetPassword.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="resetPassword.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="resetPasswordDialogShow = false">取 消</el-button>
    <el-button size="mini" type="danger" @click="doResetPassword">确 定</el-button>
  </span>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import * as dateUtils from '../../utils/date'
    const axios = require('axios').default;
    export default {
        name: "list",
        data(){
            return{
                resetPassword:{
                  oldPassword:'',
                    newPassword:''
                },
                resetPasswordDialogShow:false,
                deleteMessage:'',
                deleteDialogShow:false,
                ueSearch:{
                    userName:'',
                    email:''
                },
                pageNavigation:{
                    currentPage:1,//当前页
                    totalSize:0,//总条数
                    totalPage:1,//共页
                    pageSize:5//查询几条
                },
                userList:[],
                userId:''

            }
        },
        mounted() {
            this.getUserList();
        },
        methods:{
            doResetPassword(){
                //验证两次密码是否一致
                if (this.resetPassword.oldPassword===this.resetPassword.newPassword){
                    //发起请求
                    axios.put('/user/reset-password/'+this.userId+'?password='+this.resetPassword.newPassword).then(response=>{
                        let res = response.data;
                        if (res.code === 200){
                            this.$message.success(res.message)
                            this.resetPasswordDialogShow = false
                            this.getUserList();
                        }else {
                            this.$message.error(res.message)
                        }
                    })
                }else {
                    this.$message.warning('密码不一致！')
                }
            },
            rePassword(item){
                this.userId = item.id
                this.resetPasswordDialogShow = true
            },
            doDeleteItem(){
                axios.delete('/user/'+this.userId).then(response=>{
                    let res = response.data;
                    if (res.code===200){
                        this.$message.success(res.message)
                        this.getUserList()
                        this.deleteDialogShow = false
                    }else {
                        this.$message.error(res.message)
                    }
                })
            },
            deleteItem(item){
                this.userId = item.id;
                this.deleteMessage = item.userName;
                //弹窗
                this.deleteDialogShow = true
            },
            handleSizeChange(size){
                console.log("页面大小"+size)
                this.pageNavigation.pageSize = size
                this.getUserList()
            },
            handleCurrentChange(page){
                console.log(page)
              this.pageNavigation.currentPage = page;
                this.getUserList()
            },

            cleanSeach(){
                //清空表单
                this.ueSearch.email='';
                this.ueSearch.userName='';
                //获得所有数
                this.getUserList();

            },
            doSearch(){
                if (this.ueSearch.userName===''&&this.ueSearch.email===''){
                    return
                }else if (this.ueSearch.userName!==''&&this.ueSearch.email!==''){
                    //两个都不为空
                    axios.get('/user/list?email='+this.ueSearch.email+'&page='+this.pageNavigation.currentPage+
                        '&size='+this.pageNavigation.pageSize+'&userName='+this.ueSearch.userName)
                        .then(response=>{
                            console.log(response);
                            let res = response.data;
                            if (res.code === 200){
                                this.userList  = res.data.records;
                            }
                        })
                }else if (this.ueSearch.userName===''&& this.ueSearch.email!==''){
                    //在搜索路径下加上邮箱
                    //发起请求
                    axios.get('/user/list?email='+this.ueSearch.email+'&page='+this.pageNavigation.currentPage+
                        '&size='+this.pageNavigation.pageSize)
                        .then(response=>{
                            console.log(response);
                            let res = response.data;
                            if (res.code === 200){
                                this.userList  = res.data.records;
                            }
                        })
                }else if (this.ueSearch.userName!==''&& this.ueSearch.email===''){
                    //在搜索路径下加上用户名
                    axios.get('/user/list?page='+this.pageNavigation.currentPage+
                        '&size='+this.pageNavigation.pageSize+'&userName='+this.ueSearch.userName)
                        .then(response=>{
                            console.log(response);
                            let res = response.data;
                            if (res.code === 200){
                                this.userList  = res.data.records;
                            }
                        })
                }
            },

            formatDate(datestr){
                let date = new Date(datestr)
                return  dateUtils.formatDate(date,'yyyy-MM-dd hh:mm')
            },
            getUserList(){
                axios.get('/user/list?page='+this.pageNavigation.currentPage+'&size='+this.pageNavigation.pageSize)
                    .then(response=>{
                        console.log(response);
                        let res = response.data;
                        if (res.code === 200){
                           this.userList  = res.data.records;
                           this.pageNavigation.currentPage=res.data.current
                           this.pageNavigation.pageSize=res.data.size
                           this.pageNavigation.totalSize=res.data.total
                           this.pageNavigation.totalPage=res.data.pages
                        }

                    })
            }
        }
    }
</script>

<style>
    .loop-image{
        border: 1px #cccccc solid;
        border-radius: 50%;
    }

</style>