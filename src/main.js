// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/communal.css' // 公用
import 'font-awesome/css/font-awesome.css' // icom
import '../theme/index.css' // 主题
import '@/utils/directives.js' // 全局拖拽指令
import VueClipboard from 'vue-clipboard2' // 复制内容指定

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
