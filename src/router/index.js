import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
/*登录*/
const login = ()=> import('@/page/login/login');
// /*内容部分*/
const postArticle = () => import('@/page/content/post-article');
const articleManage = () => import('@/page/content/manage-article');
const commentManage = ()=> import('@/page/content/manage-comment');
const imageManage = ()=> import('@/page/content/manage-image');
/*首页*/
const index = () => import('@/page/dashboad/index');
/*运营*/
const loopManage = ()=> import('@/page/operation/loop');
const categoryManage = ()=> import('@/page/operation/manage-category');
// /*设置*/
const friendLink = ()=> import('@/page/settings/friend-link');
const websizeInfo = ()=> import('@/page/settings/websize-info');
// /*用户*/
const email = ()=> import('@/page/user/email');
const info = ()=> import('@/page/user/info');
const list = ()=> import('@/page/user/list');
const resetPassword = ()=> import('@/page/user/rest-password');

//布局
const baseView = () => import('@/layout/base-view');
const rightContent = () => import('@/layout/right-content');


export const routes = [
    {
        path: '',
        requireLogin:true,
        name: 'baseView',
        redirect: 'index',
        component: baseView,
        children: [
            {
                path: "/index",
                requireLogin:true,
                name:'首页',
                icon:'el-icon-news',
                hidden:false,
                component: index
            },
            {
                path: '/content',
                name:'内容',
                requireLogin:true,
                icon:'el-icon-tickets',
                hidden:false,
                component: rightContent,
                children: [
                    {
                        path: 'post-article',
                        name:'发表文章',
                        icon:'el-icon-edit',
                        hidden:false,
                        component: postArticle
                    },
                    {
                        path: 'manage-article',
                        name:'文章管理',
                        icon:'el-icon-document',
                        hidden:false,
                        component: articleManage
                    },
                    {
                        path: 'manage-comment',
                        name:'评论管理',
                        icon:'el-icon-chat-line-round',
                        hidden:false,
                        component:commentManage
                    },
                    {
                        path: 'manage-image',
                        name:'图片管理',
                        icon:'el-icon-picture-outline',
                        hidden:false,
                        component:imageManage
                    }
                ]

            },
            {
                path: '/user',
                hidden:false,
                name:'用户',
                icon:'el-icon-user',
                component: rightContent,
                children: [
                    {
                        path: 'list',
                        name:'用户列表',
                        hidden:false,
                        icon:'el-icon-user',
                        component: list
                    },
                    {
                        path: 'reset-password',
                        name:'密码重置',
                        hidden:false,
                        icon: 'el-icon-paperclip',
                        component: resetPassword
                    },
                    {
                        path: 'email',
                        name:'邮箱设置',
                        hidden:false,
                        icon: 'el-icon-message',
                        component:email
                    },
                    {
                        path: 'info',
                        name:'用户信息',
                        hidden:false,
                        icon: 'el-icon-warning-outline',
                        component:info
                    }
                ]

            },
            {
                path: '/operation',
                name:'运营',
                hidden:false,
                icon: 'el-icon-help',
                component: rightContent,
                children: [
                    {
                        path: 'loop',
                        name:'轮播图管理',
                        hidden:false,
                        icon: 'el-icon-picture-outline',
                        component: loopManage
                    },
                    {
                        path: 'category',
                        name:'分类管理',
                        hidden:false,
                        icon: 'el-icon-help',
                        component: categoryManage
                    }
                ]

            },
            {
                path: '/settings',
                name:'设置',
                hidden:false,
                icon: 'el-icon-s-operation',
                component: rightContent,
                children: [
                    {
                        path: 'web-size-info',
                        name:'网站信息',
                        icon: 'el-icon-warning-outline',
                        hidden:false,
                        component: websizeInfo
                    },
                    {
                        path: 'friend-link',
                        name:'友情链接',
                        icon: 'el-icon-link',
                        hidden:false,
                        component: friendLink
                    }
                ]

            }
        ]
    },
    {
        path: '/login',
        component:login,
        requireLogin:false
    }
]

const router = new VueRouter({
    routes
})

export default router
