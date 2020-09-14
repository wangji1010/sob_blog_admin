<template>
  <div class="article-post-box">
    <!--标题-->
    <div class="article-title-part">
      <el-input v-model="article.title" placeholder="请输入标题"></el-input>
    </div>
    <!--内容编辑-->
    <div class="article-post-part">
      <mavon-editor v-model="article.content"
                    @change="onContentChange"
      />
    </div>
    <!--文章设置
    分类封面标签
    -->
    <div class="article-post-settings-part">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="文章分类">
          <el-select v-model="article.categoryId" placeholder="请选择活动区域">
            <el-option
                v-for="item in categoryies"
                :label="item.cName"
                :value="item.id"
                :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input type="textarea" placeholder="请输入摘要内容" :rows="3" v-model="article.summary"></el-input>
        </el-form-item>
        <el-form-item label="封面" required>
          <div class="friend-link-image-upload" @click="showFriendUploadDialog">
            <i class="el-icon-plus" v-if="article.cover===''"></i>
            <el-image fit="fill" :src="blog_constrans.imageUrl+article.cover" v-else></el-image>
          </div>
        </el-form-item>
        <el-form-item class="tag-label" label="标签">
          <el-tag
              :key="tag"
              v-for="tag in labels"
              closable
              :disable-transitions="false"
              @close="deleteLabel(tag)">
            {{ tag }}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="LableInputVisible"
              v-model="LableNewValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
          >
          </el-input>
          <el-button v-if="!LableInputVisible&&!isEnough" class="button-new-tag" size="small" @click="showInput">+
            添加标签
          </el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--发布操作-->
    <div class="article-post-action-part clearfix">
      <div class="action-btn-container">
        <el-button plain @click="preView">预览文章</el-button>
        <el-button plain @click="saveArticleDart">保存草稿</el-button>
        <el-button type="primary" @click="commitArticle">发表文章</el-button>
      </div>
    </div>
    <!--图片管理-->
    <div class="article-post-diaog-box">
      <el-dialog
          title="选择图片"
          :visible.sync="isImageSelectShow"
          width="1000"
      >
        <div class="image-select-box">
          <div class="image-action-bar">
              <el-upload
                  class="image-select-uploader"
                  action="/admin/images"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  accept="image/*">
                <el-button size="mini">上传图片</el-button>
              </el-upload>
          </div>
          <div class="image-select-list clearfix">
            <el-radio-group v-model="selectedImageIndex">
              <el-radio-button :label="index" v-for="(item,index) in images" :key="index">
                <el-image :src="blog_constrans.imageUrl+item.url"></el-image>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="image-picker-navgationbar">
            <!--分页-->
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
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="isImageSelectShow = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="onImageSelect" size="mini">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

// import * as dateUtils from '../../utils/date'
// import myUpload from 'vue-image-crop-upload';
const axios = require('axios').default;
export default {
  mounted() {
    this.getCategorys();
  },
  name: "post-article",
  data() {
    return {
      pageNavigation:{
        currentPage:1,//当前页
        totalSize:0,//总条数
        totalPage:1,//共页
        pageSize:5//查询几条
      },
      selectedImageIndex: 0,
      page: '1',
      size: '12',
      isImageSelectShow: false,
      isEnough: false,
      LableNewValue: '',
      LableInputVisible: false,
      labels: [],
      categoryies: [],
      article: {
        categoryId: '',
        title: '',
        content: '',
        cover: '',
        summary: '',
        labels: '',
        state:'1',
        type:'1'
      },
      images: []
    }
  }, methods: {
    preView(){
      this.$message.info('暂未开放此功能')
      this.$refs.mdEditor.toolbar_right_click('read');
    },
    saveArticleDart(){
      //检查内容
      //标题
      if (this.article.title === '') {
        this.$message.error('文章标题不能为空！');
        return
      }
      //修改状态
      this.article.state = '2';
      //提交数据
      axios.post('/admin/article',this.article).then(response=>{
        let res = response.data;
        if (res.code === 200){
          //清空表单的数据
          this.clearForm();
          this.$message.success(res.message);
        }else {
          this.$message.error(res.message);
        }
      })
    },
    commitArticle(){
      //检查内容
      //标题
      if (this.article.title === '') {
        this.$message.error('文章标题不能为空！');
        return
      }
      //内容
      if (this.article.content === '') {
        this.$message.error('文章内容不能为空！');
        return
      }
      //分类
      if (this.article.categoryId === '') {
        this.$message.error('文章分类没有选择！');
        return
      }
      // 摘要
      if (this.article.summary === '') {
        this.$message.error('文章摘要不能为空！');
        return
      }
      //封面
      if (this.article.cover === '') {
        this.$message.error('文章封面不能为空！');
        return
      }
      //标签， 处理标签
      if (this.labels.length===0){
        this.$message.error('请设置标签！');
        return
      }
      //处理标签
      let templabels='';
      this.labels.forEach((item,index)=>{
        templabels +=item;
        if (index!==this.labels.length-1){
          templabels +='-';
        }
      })
      this.article.labels = templabels;
      console.log('label = >>>'+this.article.labels)
      //提交数据
      axios.post('/admin/article',this.article).then(response=>{
        let res = response.data;
        if (res.code === 200){
          //清空表单的数据
          this.clearForm();
          this.$message.success(res.message);
        }else {
          this.$message.error(res.message);
        }
      })
    },
    clearForm(){
      this.article.labels = ''
      this.article.cover = ''
      this.article.summary = ''
      this.article.categoryId = ''
      this.article.content = ''
      this.article.title = ''
      this.article.state = ''
      this.article.type = ''
    },
    handleCurrentChange(page){
      console.log(page)
      this.pageNavigation.currentPage = page;
      this.listImages();
    },
    handleSizeChange(size){
      console.log("页面大小"+size)
      this.pageNavigation.pageSize = size
      this.listImages()
    },
    uploadError(){
      this.$message.error('图片上传失败！');
    },
    uploadSuccess(response){
      if (response.code === 200){
        this.$message.success(response.message);
        //更新列表
        this.listImages();
      }
    },
    onContentChange(value) {
      console.log(value)

    },
    getCategorys() {
      axios.get('/admin/category/getByState').then(response => {
        let res = response.data;
        if (res.code === 200) {
          this.categoryies = res.data;
        }
      })
    },
    handleInputConfirm() {
      if (this.labels.length < 5) {
        this.labels.push(this.LableNewValue);
        this.LableNewValue = ''
      }
      //如果添加完成数量是五影藏输入框
      if (this.labels.length >= 5) {
        this.LableInputVisible = false;
        this.isEnough = true;
      }

    },
    deleteLabel(label) {
      this.labels.splice(this.labels.indexOf(label), 1);
      if (this.labels.length < 5) {
        this.LableInputVisible = true;
        this.isEnough = false;
      }

    },
    showInput() {
      //显示输入框 限制5
      if (this.labels.length < 5) {
        this.LableInputVisible = true;
      } else {
        this.LableInputVisible = false;
      }
      this.$nextTick(()=>{
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    showFriendUploadDialog() {
      this.listImages();
      //显示图片选择器
      this.isImageSelectShow = true;
    },
    /*获取图片列表*/
    listImages() {
      axios.get('/admin/images/list/' +this.pageNavigation.currentPage+ '/' +this.pageNavigation.pageSize).then(response => {
        let res = response.data;
        console.log(res);
        console.log(res.data.pages);
        if (res.code === 200) {
          this.images = res.data.records
          this.pageNavigation.totalSize = res.data.total;
          this.pageNavigation.totalPage = res.data.pages;
        }

      })
    },
    onImageSelect() {
      this.isImageSelectShow = false
      //从数组里面拿到当前选中的对象
     let item = this.images[this.selectedImageIndex];
      console.log(item);
      this.article.cover = item.url;
    }
  }
}
</script>

<style>
.image-select-list .el-radio-button__inner {
  border: none;
  padding: 3px;
  border-radius: 4px;

}

.article-post-diaog-box .el-dialog {
}

.image-select-list img {
  width: 150px;
  height: 150px;
  float: left;
}

.article-post-diaog-box .el-dialog__header {
  display: none;
}

.v-note-op {
  position: sticky;
  top: 0;
}

.input-new-tag {
  width: 120px;
}

.tag-label .el-tag {
  margin-right: 15px;
}

.friend-link-image-upload i {
  line-height: 200px;
  font-size: 20px;
}

.friend-link-image-upload {
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  border: dashed 1px #cccccc;
  width: 200px;
  height: 200px;
}

.article-post-part .markdown-body {
  height: 800px;
}

.article-post-part {
  margin-bottom: 25px;
  margin-top: 2px;
  background-color: #4d4c4d;

}

.article-post-settings-part {

}

.article-post-action-part {
  border-top: 1px solid #cccccc;
}

.action-btn-container {

  float: right;
  margin-right: 35px;
  padding: 15px;
}

</style>