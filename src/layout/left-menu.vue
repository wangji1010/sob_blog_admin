<template>
    <el-row class="tac">
        <el-col :span="24">
            <el-menu
                    :default-active="$route.path"
                    :unique-opened="true"
                    class="el-menu-vertical">

                <!--遍历菜单内容-->
                <!--没有子菜单-->
                <!--有子菜单-->
                <template v-for="(item,index) in menuList" >
                    <router-link v-if="!item.children && !item.hidden" :key="index" :to="item.path">
                        <el-menu-item :index="item.path" >
                            <i :class="item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                    </router-link>

                    <el-submenu  v-if="item.children && !item.hidden" :key="index" :index="item.path">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <router-link  v-for="(child,subIndex) in item.children"
                                     :key="subIndex" :to="item.path+'/'+child.path">
                            <el-menu-item :index="item.path+'/'+child.path" >
                                <template slot="title" v-if="!child.hidden">
                                    <i :class="child.icon"></i>
                                    <span>{{child.name}}</span>
                                </template>
                            </el-menu-item>
                        </router-link>
                    </el-submenu>
                </template>
            </el-menu>
        </el-col>
    </el-row>
</template>
<div>

</div>
<script>
    import {routes} from '../router';
    export default {
        name: "left-menu",
        data(){
          return{
              menuList:[]
          }
        },
        mounted() {
            let menuList = routes[0];
            this.menuList = menuList.children;
            console.log(this.menuList)
        }
    }
</script>

<style >
    .el-menu-vertical a{
        text-decoration: none;
    }
    el-menu{
      background-color: #f2f2f2;
    }

</style>