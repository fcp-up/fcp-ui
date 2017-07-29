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

/* devicedata */
const DeviceData = _import('devicedata/index');

/* devicealarmdata */
const DeviceAlarmData = _import('devicealarmdata/index');

/* devicemanage */
const DeviceManage = _import('devicemanage/index');

/* editdevice */
const EditDevice = _import('devicemanage/editdevice');

/* terminalstate */
const TerminalState = _import('terminalstate/index');

/* terminalmanage */
const TerminalManage = _import('terminalmanage/index');

/* editterminal */
const EditTerminal = _import('terminalmanage/editterminal');

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
    path: '/terminalstate',
    component: Layout,
    redirect: 'noredirect',
    icon: 'bug',
    noDropdown: true,
    children: [{ path: 'terminalstate', component: TerminalState, name: '终端状态' }]
  }, {
    path: '/devicedata',
    component: Layout,
    redirect: 'noredirect',
    icon: 'EXCEL',
    noDropdown: true,
    children: [{ path: 'devicedata', component: DeviceData, name: '设备数据' }]
  }, {
    path: '/devicealarmdata',
    component: Layout,
    redirect: 'noredirect',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'devicealarmdata', component: DeviceAlarmData, name: '报警日志' }]
  }, {
    path: '/devicemanage',
    component: Layout,
    redirect: '/devicemanage/index',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'index', component: DeviceManage, name: '设备管理' },
      { path: 'editdevice', component: EditDevice, name: '编辑设备', hidden: true }]
  }, {
    path: '/terminalmanage',
    component: Layout,
    redirect: '/terminalmanage/index',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'index', component: TerminalManage, name: '终端管理' },
      { path: 'editterminal', component: EditTerminal, name: '编辑终端', hidden: true }]
  }, { path: '*', redirect: '/404', hidden: true }
];
