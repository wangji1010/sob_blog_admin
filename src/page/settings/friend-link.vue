<template>
    <div class="settings-friend-link-box">
        <div class="friend-link-action-bar">
            <el-button type="primary" size="mini" @click="addFriendLink">提升友谊</el-button>
        </div>
        <div class="friend-link-list-box">
            <el-table
                    :data="links"
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="250">
                </el-table-column>
                <el-table-column
                        label="标题"
                        width="120">
                    <template slot-scope="scope">
                        <div><a target="_blank" :href="scope.row.url">{{scope.row.lName}}</a></div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="logo"
                        width="120">
                    <template slot-scope="scope">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="scope.row.logo"
                                fit="contain"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="lOrder"
                        label="权重"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="120">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.lState==='1'">正常</el-tag>
                        <el-tag type="danger" v-if="scope.row.lState==='0'">不可用</el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                        label="创建时间"
                        width="300">
                    <template slot-scope="scope">
                        <div><span v-text="formatDate(scope.row.createTime)"></span></div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="300">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteFriend(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="friend-link-dialog-box">
            <el-dialog
                    @close="fridenDialogClose"
                    :close-on-click-modal="false"
                    :title="FriendLinkTile"
                    :visible.sync="FriendLinkDialogShow"
                    width="600px"
            >
                <div>
                    <el-form  label-width="80px"  ref="loopForm">
                        <el-form-item label="名称">
                            <el-input v-model="link.lName"></el-input>
                        </el-form-item>
                        <el-form-item label="链接">
                            <el-input v-model="link.url" placeholder="链接请以 http:// 或者  https://  开头"></el-input>
                        </el-form-item>
                        <el-form-item label="权重">
                            <el-input-number v-model="link.lOrder" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="link.lState" placeholder="请选择状态">
                                <el-option label="删除" value="0"></el-option>
                                <el-option label="正常" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="logo">
                            <div class="friend-link-image-upload" @click="showFriendUploadDialog">
                               <i class="el-icon-plus" v-if="link.logo===''"></i>
                                <el-image :src="blog_constrans.baseUrl+link.logo" v-else></el-image>
                            </div>
                        </el-form-item>

                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button @click="FriendLinkDialogShow = false" size="small">取 消</el-button>
    <el-button type="primary" @click="handleFriendEditorCommit" size="small">{{loopEditDialigConmitText}}</el-button>
  </span>
            </el-dialog>
        </div>
        <div class="friendLink-dialog">
            <my-upload field="file"
                       @crop-upload-success="friendUploadSuccess"
                       @crop-upload-fail="friendUploadFail"
                       v-model="showFriendUpload"
                       :width="200"
                       :height="100"
                       url="/admin/images"
            ></my-upload>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="deleteDialogShow"
                width="30%"
        >
            <span>你确定要删除:【 {{deleteMessage}} 】该友情连接么？</span>
            <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="deleteDialogShow = false">取 消</el-button>
    <el-button size="mini" type="danger" @click="doDeleteItem">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as dateUtils from '../../utils/date'
    import myUpload from 'vue-image-crop-upload';
    const axios = require('axios').default;
    export default {
        name: "friend-link",
        components: {
            'my-upload': myUpload
        },
        mounted() {
            this.getLinksList();
        },
        data(){
            return{
                deleteMessage:'',
                deleteDialogShow:false,
                links:[],
                FriendLinkTile:'添加友情链接',
                loopEditDialigConmitText:'添加',
                FriendLinkDialogShow:false,
                link:{
                    id:'',
                    lName:'',
                    logo:'',
                    lOrder:0,
                    lState:'1',
                    url:''
                },
                showFriendUpload:false
            }
        }
        ,methods:{
            doDeleteItem(){
                axios.delete('/admin/friend_link/'+this.link.id).then(response=>{
                    let res = response.data;
                    if (res.code===200){
                        this.$message.success(res.message);
                        this.getLinksList();
                        this.deleteDialogShow = false;
                    }else {
                        this.$message.success(res.message);
                    }
                })
            },
            deleteFriend(item){
              this.link.id = item.id;
              this.deleteMessage = item.lName;
              this.deleteDialogShow = true;
            },
            edit(item){
                console.log("=-=-==-"+item.logo)
                this.link.id = item.id;
                this.link.lName = item.lName;
                this.link.logo = item.logo;
                this.link.lOrder = item.lOrder;
                this.link.lState = item.lState;
                this.link.url = item.url;
                this.FriendLinkTile="更新友情链接";
                this.loopEditDialigConmitText="更新";
                //弹窗
                this.FriendLinkDialogShow = true;

            },
            showFriendUploadDialog(){
                this.showFriendUpload = true;
            },
            friendUploadFail(){
                this.$message.success('上传失败');
            },
            friendUploadSuccess(response){
                if (response.code === 200){
                    // this.showAvatar = false
                    this.$message.success('上传成功');
                    //回显数据
                    this.link.logo = '/admin/images/'+response.data.path;
                }
            },
            addFriendLink(){
                this.link.id = ''
               this.FriendLinkTile="添加友情链接";
                this.loopEditDialigConmitText="添加";
                this.FriendLinkDialogShow = true;
            },
            getLinksList(){
                axios.get('/admin/friend_link/list').then(response=>{
                    let res = response.data;
                    console.log(res);
                    this.links = res.data;
                })
            },
            formatDate(datestr){
                let date = new Date(datestr)
                return  dateUtils.formatDate(date,'yyyy-MM-dd hh:mm')
            },
            fridenDialogClose(){
                this.link.url='';
                this.link.logo='';
                this.link.lName='';
                this.link.lState='';
                this.link.lOrder=1;
            },
            uploadSuccess(){
                this.$message.success('上传成功');
            },
            handleFriendEditorCommit(){
                //检查数据
                if (this.link.lName===''){
                    this.$message.error('名称不能为空');
                    return
                }
                if (!this.link.url.startsWith('http://')&&
                    !this.link.url.startsWith('https://')) {
                    this.$message.warning('跳转链接格式不正确！')
                    return;
                }
                if (this.link.logo===''){
                    this.$message.error('logo不能为空');
                    return
                }
                //判断是否携带id 判断是添加还是删除
                if(this.link.id!==''){
                    axios.put('/admin/friend_link/'+this.link.id,this.link).then(response=>{
                        let res = response.data;
                        if (res.code===200) {
                            this.$message.success(res.message);
                            this.getLinksList();
                            this.FriendLinkDialogShow = false;
                        }else {
                            this.$message.error(res.message);
                        }
                    })
                }else {
                    //添加数据
                    axios.post('/admin/friend_link',this.link).then(response=>{
                        let res = response.data;
                        if (res.code===200){
                            this.getLinksList();
                            this.FriendLinkDialogShow = false;
                            this.$message.success(res.message);
                        }else {
                            this.$message.error(res.message);
                        }
                    })
                }



            }
        }
    }
</script>

<style>
    .friend-link-image-upload{
        width: 100px;
        height: 37px;
        border: #cccccc dashed 1px;
        cursor: pointer;
        text-align: center;
    }
</style>