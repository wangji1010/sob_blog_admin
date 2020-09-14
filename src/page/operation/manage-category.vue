<template>
    <div class="category-box">
        <div class="category-action-bar">
            <el-button type="primary" size="mini" @click="showAddCategory">添加分类</el-button>
        </div>
        <div class="category-list-box">
            <el-table
                    :data="categories"
                    border
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="cName"
                        label="分类名"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="pinyin"
                        label="拼音"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="描述"
                        >
                </el-table-column>
                <el-table-column
                        label="状态"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.cStatus==='0'"><el-tag type="danger" size="small">已删除</el-tag></div>
                        <div v-if="scope.row.cStatus==='1'"><el-tag type="success" size="small" > 正 常 </el-tag></div>
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
        <div class="navigation-bar"></div>
        <!--删除弹窗-->
        <el-dialog
                title="提示"
                :visible.sync="deleteDialogShow"
                width="30%"
        >
            <span>你确定要删除: {{deleteMessage}} 分类么？</span>
            <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="deleteDialogShow = false">取 消</el-button>
    <el-button size="mini" type="danger" @click="doDeleteItem">确 定</el-button>
  </span>
        </el-dialog>
        <!--添加/编辑的弹窗-->
        <el-dialog
                :title="editTitle"
                :visible.sync="editorDialogShow"
                width="500px"
                >
            <div class="category-editor-box">
                <el-form  label-width="80px" >
                    <el-form-item label="分类名称">
                        <el-input v-model="category.cName"></el-input>
                    </el-form-item>
                    <el-form-item label="分类拼音">
                        <el-input v-model="category.pinyin"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="category.description"
                                maxlength="30"
                                show-word-limit
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="顺序">
                        <el-input-number v-model="category.cOrder" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="category.cStatus" placeholder="请选择状态">
                            <el-option label="删除" value="0"></el-option>
                            <el-option label="正常" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editorDialogShow = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="postCategory" size="mini">{{editorCommitText}}</el-button>
  </span>
        </el-dialog>

    </div>

</template>
<div>

</div>
<script>

    import * as toast from "../../utils/toast";
    import * as dateUtils from '../../utils/date'
    const axios = require('axios').default;
    export default {
         mounted() {
           this.getCategoiesList();
        },
        name: "manage-category",
        data(){
            return{
                loding:false,
                category:{
                    id:'',
                    pinyin:'',
                    cName:'',
                    cOrder:'1',
                    description:'',
                    cStatus:'1'

                },
                editorCommitText:'修改分类',
                editorDialogShow:false,
                editTitle:'编辑',
                categories:[],
                deleteDialogShow:false,
                deleteMessage:'',
                deleteTargetId:''
            }
        }
        ,methods:{
            postCategory(){
                //检查内容
                if (this.category.cName == null) {
                    this.showWarning("分类名称不能为空！");
                    return;
                }
                if (this.category.description == null) {
                    this.showWarning("分类描述不能为空！");
                    return;
                }
                if (this.category.pinyin == null) {
                    this.showWarning("分类拼音不能为空！");
                    return;
                }
                console.log("数据检查之后"+ this.category)

                /*
                * 如果包含id标识更新数据，如果没有标识添加数据
                * */
                if (this.category.id === ''){
                    //提交数据
                    // 发送 POST 请求
                    axios.post('/admin/category',this.category).then(reponse=>{
                        let res = reponse.data;
                        //提示结果
                        if (res.code === 200){
                            this.$message.success(res.message);
                            this.editorDialogShow = false
                            //刷新列表
                            this.getCategoiesList();
                            //重置表单
                            this.restCategory();
                        }else {
                            this.$message.warning(res.message);
                        }
                    });
                }else {
                    axios.put('/admin/category/'+this.category.id,this.category).then(response=>{
                        console.log("===id==="+this.category.id);
                        let res = response.data;
                        console.log(res);
                        if (res.code === 200 ){
                            this.$message.success(res.message);
                            this.editorDialogShow = false;
                            this.getCategoiesList();
                        }else {
                            this.$message.error(res.message);
                        }
                    })
                }



            },
            restCategory(){
              this.category.cName=''
              this.category.id=''
              this.category.pinyin=''
              this.category.cStatus='1'
              this.category.description=''
              this.category.cOrder='1'

            },
            edit(item){
                console.log("-=-item=-=-"+item.name)
                this.category.cName = item.cName;
                this.category.pinyin = item.pinyin;
                this.category.cOrder = item.cOrder;
                this.category.description = item.description;
                this.category.id = item.id;
                this.category.cStatus = item.cStatus;
                //显示对话框
                this.editTitle="修改分类"
                this.editorCommitText="更新"
                this.editorDialogShow = true;
            },
            deleteItem(item){
                this.deleteDialogShow=true
                this.deleteMessage = item.cName
                this.deleteTargetId = item.id
                console.log(item)
            },
            doDeleteItem(){
                axios.delete('/admin/category/'+this.deleteTargetId).then(response=>{
                    let res = response.data;
                    console.log(res)
                    if (res.code === 200){
                        this.$message.success(res.message)
                    }else if (res.code === 400){
                        this.$message.warning(res.message)
                    }else {
                        toast.toastW(res.message)
                    }
                });
                this.deleteDialogShow=false
                this.getCategoiesList();
            },
            getCategoiesList(){

                //获取分类列表
            axios.get('/admin/category/list')
                .then(response=>{

                    let res = response.data;
                    console.log(res.data);
                    this.categories = res.data;
                })
            },
            formatDate(datestr){
                let date = new Date(datestr)
               return  dateUtils.formatDate(date,'yyyy-MM-dd hh:mm')
            },
            //添加分类的弹窗
            showAddCategory(){
                this.editTitle = '添加分类'
                this.editorCommitText = '提交'
                this.editorDialogShow = true
            },
            showWarning(msg){
                this.$message.warning(msg);
            }
        }
       
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>