import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');

/* monitor */
const Monitor = _import('monitor/index');

/* centerstate */
const CenterState = _import('centerstate/index');

/* devicedata */
const DeviceData = _import('devicedata/index');

/* alarmdata */
const AlarmData = _import('alarmdata/index');

/* devicephone */
const DevicePhone = _import('devicephone/index');

/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');


Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/monitor',
    name: '监控中心',
    hidden: true,
    children: [{ path: 'monitor', component: Monitor }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/centerstate',
    component: Layout,
    redirect: 'noredirect',
    icon: 'bug',
    noDropdown: true,
    children: [{ path: 'centerstate', component: CenterState, name: '终端状态' }]
  },
  {
    path: '/devicedata',
    component: Layout,
    redirect: 'noredirect',
    icon: 'EXCEL',
    noDropdown: true,
    children: [{ path: 'devicedata', component: DeviceData, name: '设备数据' }]
  },
  {
    path: '/alarmdata',
    component: Layout,
    redirect: 'noredirect',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'alarmdata', component: AlarmData, name: '报警数据' }]
  },
  {
    path: '/devicephone',
    component: Layout,
    redirect: 'noredirect',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'index', component: DevicePhone, name: '报警电话' }]
  },
  { path: '*', redirect: '/404', hidden: true }
];
