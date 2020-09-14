<template>
    <div class="home">
        <el-container>
            <el-header id="admin-header">
                <top-header></top-header>
            </el-header>
            <el-container class="main-container">
                <el-aside id="left-menu-list-box" width="200px">
                    <!--左侧菜单-->
                   <left-menu></left-menu>
                </el-aside>
                <el-container>
                    <el-main><router-view/></el-main>

                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "base-view",
        mounted() {
            //动态设置侧边栏的高度
           let leftMenuBox = document.getElementById('left-menu-list-box');
           let adminHeader = document.getElementById('admin-header');
           let dy = window.innerHeight - adminHeader.offsetHeight;
           if (leftMenuBox){
               leftMenuBox.style.height = dy+'px'
           }
        }
    }
</script>

<style lang="css" rel="stylesheet/stylus">
    .main-container{
        position: absolute;
        width: 100%;
        top: 46px;
        bottom: 0;
    }
    .el-header {
        height: 46px!important;
        background-color: #0084ff;
        line-height: 46px;
    }
    .el-aside {
        line-height: 200px;
        border-right: #E9EEF3 1px solid;
    }

    .el-main {
        padding: 0;
        background-color: #ffffff;
        color: #333;
        text-align: center;

    }
</style>