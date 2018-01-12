import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: ['admin'] }`  will control the page role
  **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  }  
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
 
  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    name: '系统设置',
    icon: 'zujian',
    meta: { role: ['system']},
    children: [
      { path: 'users', name: '用户设置', icon: 'icons', component: _import('system/users'),meta: { role: ['system'] }},
      
      { path: 'role', name: '角色设置', icon: 'icons', component: _import('system/role'),meta: { role: ['system'] }},
      { path: 'dept', name: '部门设置', icon: 'icons', component: _import('system/dept'),meta: { role: ['system'] }},

      
    ]
  },

  {
    path: '/table',
    component: Layout,
    redirect: '/table/index',
    icon: 'tubiao',
    noDropdown: true,
    children: [{ path: 'index', name: 'Table', component: _import('table/index'), meta: { role: ['user'] }}]
  },

  {
    path: '/DouBan',
    component: Layout,
    redirect: 'noredirect',
    name:"豆瓣查询",
    icon: 'tubiao',
    children: [{ path: 'movie', name: '热门电影', component: _import('DouBan/movie'), meta: { role: ['system'] }},
    { path: 'music', name: '音乐排行', component: _import('DouBan/music'), meta: { role: ['system'] }},
    { path: 'book', name: '热门图书', component: _import('DouBan/book'), meta: { role: ['system'] }}]
  },
  { path: '*', redirect: '/404', hidden: true }
]
