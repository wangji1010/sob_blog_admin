<template>
    <div class="home">
        <!--首页内容-->

        <div class="content-title-box">
            <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.$route.matched[1].name}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.$route.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
            <div class="content-container-box">
                <router-view/>
            </div>
    </div>
</template>

<script>
    export default {
        name: "base-view",
        mounted() {
            console.log(this.$route)
        }
    }
</script>

<style lang="css" rel="stylesheet/stylus">
    .content-container-box{
        text-align: left;
        padding: 5px;

    }
.content-title-box{
    text-align: left;
    padding: 5px;
    line-height: 46px;
    border-bottom: #ccc 1px solid;
}
    .breadcrumb{
        line-height: 46px;
    }
</style>