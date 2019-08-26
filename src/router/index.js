import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 公用路由
export const constantRouterMap = [{
  path: '/',
  name: 'mainView',
  component: () => import('@/views/mainView'),
  redirect: '/disasterLetters',
  meta: {
    title: 'main'
  },
  children: [{
    path: '/disasterLetters',
    name: 'DisasterLetters',
    component: () => import('@/views/DisasterLetters/index'),
    meta: {
      title: '灾情快报'
    },
    children: [{
      path: '/disasterLetters/disasterIndex',
      name: 'disasterIndex',
      component: () => import('@/views/DisasterLetters/disasterDialog/disasterIndex'),
      meta: {
        title: '灾情指标'
      }
    }, {
      path: '/disasterLetters/salvationWork',
      name: 'salvationWork',
      component: () => import('@/views/DisasterLetters/disasterDialog/salvationWork'),
      meta: {
        title: '救助工作'
      }
    }],
    // , {
    //   path: '/disasterLetters/disasterReport',
    //   name: 'disasterReport',
    //   component: () => import('@/views/DisasterLetters/disasterDialog/disasterReport'),
    //   meta: {
    //     title: '灾情报告'
    //   }
    // }, {
    //   path: '/disasterLetters/disasterImage',
    //   name: 'disasterImage',
    //   component: () => import('@/views/DisasterLetters/disasterDialog/disasterImage'),
    //   meta: {
    //     title: '灾情图片'
    //   }
    // }
    hidden: true
  }, {
    path: '/DisasterStatistics',
    name: 'DisasterStatistics',
    component: () => import('@/views/DisasterStatistics/index'),
    meta: {
      title: '灾情统计'
    },
    hidden: true
  }, {
    path: '/ParameterQuery',
    name: 'ParameterQuery',
    component: () => import('@/views/ParameterQuery/index'),
    meta: {
      title: '台账查询'
    },
    hidden: true
  }],
  hidden: true
}]

// 动态路由
export const asyncRouterMap = [{}]

export default new Router({
  routes: constantRouterMap
})
