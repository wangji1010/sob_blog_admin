<template>
    <div class="loop-box">
        <div class="loop-action-bar">
            <el-button type="primary" size="mini" @click="showAddLoop">添加轮播图</el-button>
        </div>
        <div class="loop-list-box">
            <el-table
                    :data="loops"
                    border
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="标题"
                        width="200">
                    <template slot-scope="scope">
                        <a class="loop-link" :href="scope.row.targetUrl" target="_blank">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        label="轮播图"
                >
                    <template slot-scope="scope">
                        <el-image
                                class="loop-image"
                                style="width: 180px; height: 80px"
                                :src="scope.row.imageUrl"
                                fit="fit"></el-image>
                    </template>
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
                        label="创建时间"
                >
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="更新日期"
                >
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="primary" size="small">编辑</el-button>
                        <el-button @click="deleteItem(scope.row)" type="danger" v-if="scope.row.cStatus!=='0'" size="small" >删除</el-button>
                        <el-button @click="deleteItem(scope.row)" type="danger" v-if="scope.row.cStatus==='0'" disabled size="small" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <div class="loop-dialog-box">
            <el-dialog
                    @close="dialogClose"
                    :close-on-click-modal="false"
                    :title="editTile"
                    :visible.sync="loopDialogShow"
                    width="600px"
                   >
                <div>
                    <el-form  label-width="80px"  :model="loop" ref="loopForm">
                        <el-form-item label="标题">
                            <el-input v-model="loop.title"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转链接">
                            <el-input v-model="loop.targetUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="loop.lorder" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="loop.state" placeholder="请选择状态">
                                <el-option label="删除" value="0"></el-option>
                                <el-option label="正常" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="封面">
                            <el-upload
                                    class="avatar-uploader"
                                    action="/admin/images"
                                    :show-file-list="false"
                                    :on-success="uploadSuccess"
                                    :before-upload="beforeUpload">
                                 <el-image fit="cover" v-if="loop.imageUrl !== ''" :src="loop.imageUrl" class="avatar"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>

                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button @click="loopDialogShow = false" size="small">取 消</el-button>
    <el-button type="primary" @click="handleLoopEditorCommit" size="small">{{loopEditDialigConmitText}}</el-button>
  </span>
            </el-dialog>
            <!--删除弹窗-->
            <el-dialog
                    title="提示"
                    :visible.sync="deleteDialogShow"
                    width="30%"
            >
                <span>你确定要删除: {{deleteMessage}} 该轮播图么？</span>
                <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="deleteDialogShow = false">取 消</el-button>
    <el-button size="mini" type="danger" @click="doDeleteItem">确 定</el-button>
  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import * as dateUtils from '../../utils/date'
    const axios = require('axios').default;
    export default {

        name: "loop",
        data(){
            return{
                loop:{
                    id:'',
                    title:'',
                    targetUrl:'',
                    lorder:1,
                    state:'1',
                    imageUrl:''
                },
                deleteDialogShow:false,
                deleteMessage:'',
                loopEditDialigConmitText:'添加轮播',
                loopDialogShow:false,
                editTile:'添加轮播图',
                url:'http://localhost:8090/admin/images/1593658645988_1278523143975075840.png',
                loops:[]
            }
        },methods:{
            dialogClose(){
                //清空form表单的数据
                this.loop.id=''
                this.loop.lorder=''
                this.loop.title=''
                this.loop.state=''
                this.loop.targetUrl=''
                this.loop.imageUrl=''
            },
            doDeleteItem(){
                axios.delete('/admin/looper/'+this.loop.id).then(response=>{
                    let res = response.data;
                    console.log(res.code);
                    if (res.code === 200) {
                        this.deleteDialogShow = false;
                        this.getLoopList();
                        this.$message.success(res.message);
                    }else {
                        this.$message.error(res.message);
                    }

                })
            },
            handleLoopEditorCommit(){
                //添加记录
                //检查数据
                if (this.loop.title === '') {
                    this.$message.warning('标题不能为空！')
                    return
                }
                if (this.loop.targetUrl === '') {
                    this.$message.warning('跳转链接不能为空！')
                    return;
                }
                if (!this.loop.targetUrl.startsWith('http://')&&
                    !this.loop.targetUrl.startsWith('https://')) {
                    this.$message.warning('跳转链接格式不正确！')
                    return;
                }
                if (this.loop.imageUrl === '') {
                    this.$message.warning('图片不能为空！')
                    return;
                }
                //判断是添加还是更新，如果有id是更新
                if (this.loop.id===''){
                    //天加
                    axios.post('/admin/looper',this.loop).then(reponse=>{
                        let res = reponse.data;
                        console.log(res);
                        if (res.code === 200){
                            this.$message.success(res.message);
                            //关闭对话框
                            this.loopDialogShow = false;
                            //刷新列表
                            this.getLoopList();
                            this.resetForm('loopForm');
                        }else {
                            this.$message.error(res.message);
                        }

                    })
                }else {
                    axios.put('/admin/looper/'+this.loop.id,this.loop).then(response=>{
                        let res = response.data;
                        if (res.code===200){
                            this.$message.success(res.message);
                            this.getLoopList();
                            this.loopDialogShow = false;
                            this.resetForm('loopForm');
                        }else {
                            this.$message.error(res.message);
                            this.resetForm('loopForm');
                        }

                    })
                }

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            uploadSuccess(response){
                console.log(response)
                if (response.code === 200){

                    //上传成功 回显数据
                    this.loop.imageUrl = 'http://localhost:8090/portal/image/'+response.data.path;
                    this.$message.success(response.message);
                }else {
                    this.$message.error(response.message)
                }

            },
            beforeUpload(){
                console.log('beforeUpload')
            },
            showAddLoop(){
                this.loopDialogShow = true

            },
            edit(item){
                console.log(item)
                //展示
                this.loopEditDialigConmitText = '保存变更'
                this.loopDialogShow=true
                this.editTile='修改轮播'
                this.loop.id = item.id
                this.loop.lorder = item.lorder
                this.loop.title = item.title
                this.loop.targetUrl = item.targetUrl
                this.loop.state = item.state
                this.loop.imageUrl = item.imageUrl
            },
            deleteItem(item){
                this.deleteMessage = item.title
                this.deleteDialogShow = true;
                this.loop.id = item.id;
                console.log(item)
            },
            formatDate(datestr){
                let date = new Date(datestr)
                return  dateUtils.formatDate(date,'yyyy-MM-dd hh:mm')
            },
            //请求数据
            getLoopList(){
                axios.get('/admin/looper/list').then(reponse=>{
                    let res = reponse.data;
                    console.log(res)
                    if (res.code === 200){
                        this.loops = res.data;
                    }
                })
            }
        }
        ,mounted() {
            this.getLoopList();
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .loop-image{
        align-items: center;
        border: 1px solid #4d4c4d;
        padding: 5px;
        border-radius: 5px;
    }

    .loop-link{
        color: #506acc;
        text-decoration: none;
    }

</style>