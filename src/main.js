import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'
import constrans from "./utils/constrans";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.prototype.blog_constrans = constrans;
Vue.component('leftMenu',leftMenu)
Vue.component('topHeader',topHeader)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(mavonEditor)
Vue.config.productionTip = false
const axios = require('axios').default;
router.beforeEach((to, from, next) => {
  //如果是登录的界面需要放行
    if (to.path === "/login") {
        //如果当前用户已经登录则没必要渠道登录界面
        next();
    }else {
        //否则检查用户角色
        axios.get('/user/check-token').then(result=>{
            let res = result.data
            if (res.code===200){
                //成功判断角色
                if (res.data.roles === 'role_admin') {
                    next()
                }else {
                    //普通用户
                    //跳转到前端门户
                    location.href = "http://39.106.150.176:8090";
                }

            } else {
            //    跳转到登录页面
                next("/login");
            }
            // console.log(res)
        });
        //如果是管理员放行
    }

  //普通用户跳转到门户首页
 next();
});
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
