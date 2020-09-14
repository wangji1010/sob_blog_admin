<template>
    <div class="article-list-box">
      <div class="article-action-bar">
        <!--发表文章 、 搜索文章-->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="分类">
            <el-select v-model="ArticleSearch.categoryId" size="mini"  placeholder="根据文章分类过滤">
              <el-option :label="item.cName" :value="item.id" size="mini" v-for="item in categorys" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="ArticleSearch.keywords" size="mini" placeholder="根据文章关键词过滤"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="ArticleSearch.state" size="mini"  placeholder="选择状态过滤">
              <el-option label="发布" value="1"></el-option>
              <el-option label="草稿" value="2" ></el-option>
              <el-option label="删除" value="0"></el-option>
              <el-option label="置顶" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch" size="mini" plain>搜 索</el-button>
            <el-button type="warning" @click="cleanSeach" size="mini" plain>清 空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="article-page-navgation">
        <el-table
            :data="articles"
            style="width: 100%">
          <el-table-column
              fixed
              prop="id"
              label="ID"
              width="190">
          </el-table-column>
          <el-table-column
              prop="title"
              label="标题"
              width="200">
          </el-table-column>
          <el-table-column
              prop="summary"
              label="摘要"
              width="200">
          </el-table-column>
          <el-table-column
              width="100"
              prop="viewCount"
              label="浏览"
          >
          </el-table-column>
          <el-table-column
              label="状态"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.state==='0'"><el-tag type="danger" size="small">已删除</el-tag></div>
              <div v-if="scope.row.state==='1'"><el-tag type="success" size="small" > 正 常 </el-tag></div>
              <div v-if="scope.row.state==='2'"><el-tag type="info" size="small" > 草 稿 </el-tag></div>
              <div v-if="scope.row.state==='3'"><el-tag type="warning" size="small" > 置 顶 </el-tag></div>
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
      <div class="article-dialog-part">
      </div>
      <!--分页-->
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
    </div>
</template>
<script>
    import * as dateUtils from "@/utils/date";
    const axios = require('axios').default;
    export default {
        name: "manage-article",
      mounted() {
          this.getArticleList();
          this.getCategories();
      },
      data(){
          return{
            articles:[],
            page:'1',
            size:'5',
            ArticleSearch:{
              categoryId:'',
              keywords:'',
              state:''
            },
            categorys:[],
            pageNavigation:{
              currentPage:1,//当前页
              totalSize:0,//总条数
              totalPage:1,//共页
              pageSize:5//查询几条
            }


          }
      },
      methods:{
        deleteItem(item){
          axios.delete('/admin/article/'+item.id).then(res=>{
            console.log(res)
              if(res.code==='200'){
                this.getArticleList()
                this.$message.success(res.message);
              }
          })
        },
        doSearch(){
          this.getArticleList();
        },
        cleanSeach(){
          //清空表单
          this.ArticleSearch.state = ''
          this.ArticleSearch.categoryId = ''
          this.ArticleSearch.keywords = ''
          //查询所有
          this.getArticleList();
        },
        formatDate(datestr){
          let date = new Date(datestr)
          return  dateUtils.formatDate(date,'yyyy-MM-dd hh:mm')
        },
        getArticleList(){
          axios.get('/admin/article/list/'+this.pageNavigation.currentPage+'/'+this.pageNavigation.pageSize+'?categoryId='+this.ArticleSearch.categoryId+'&keywords='+this.ArticleSearch.keywords+'&state='+this.ArticleSearch.state).then(response=>{
            let res = response.data;
            console.log(res)
            if (res.code === 200){
              console.log(res.data.records)
              this.articles =res.data.records;
              //总记录
              this.pageNavigation.totalSize = res.data.total
              //总页数
              this.pageNavigation.totalPage = res.data.page
            }
          })
        },
        //获取分类
        getCategories(){
          axios.get('/admin/category/list').then(response=>{
            let res = response.data;
            console.log(res);
            if (res.code === 200){
              this.categorys = res.data;
            }
          })
        },
        handleSizeChange(size){
          this.pageNavigation.pageSize = size
          this.getArticleList()
        },
        handleCurrentChange(page){
          this.pageNavigation.currentPage = page;
          this.getArticleList()
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>