import { loginByEmail, logout, getInfo } from 'api/login';
import { getSessionId } from 'api/session';
import Cookies from 'js-cookie';

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: Cookies.get('Admin-Token'),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    sessionId: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_SESSIONID: (state, sessionId) => {
      state.sessionId = sessionId
    }
  },

  actions: {
    // 邮箱登录
    LoginByEmail({ commit }, userInfo) {
      const email = userInfo.email.trim();
      return new Promise((resolve, reject) => {
        Cookies.set('Admin-Token', 'admin');
        commit('SET_TOKEN', 'admin');
        resolve();
        // loginByEmail(email, userInfo.password).then(response => {
        //   const data = response.data;
        //   Cookies.set('Admin-Token', response.data.token);
        //   commit('SET_TOKEN', data.token);
        //   resolve();
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', ['admin']);
        commit('SET_NAME', 'Super Admin');
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif');
        commit('SET_INTRODUCTION', '我是超级管理员');
        resolve();
        // getInfo(state.token).then(response => {
        //   const data = response.data;
        //   commit('SET_ROLES', data.role);
        //   commit('SET_NAME', data.name);
        //   commit('SET_AVATAR', data.avatar);
        //   commit('SET_INTRODUCTION', data.introduction);
        //   resolve(response);
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          commit('SET_TOKEN', response.data.token);
          Cookies.set('Admin-Token', response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        Cookies.remove('Admin-Token');
        resolve();
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '');
        //   commit('SET_ROLES', []);
        //   Cookies.remove('Admin-Token');
        //   resolve();
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        Cookies.set('Admin-Token', role);
        resolve();
      })
    },

    // 获取sessionId
    GetSessionId({ commit }) {
      // commit('SET_SESSIONID', 'data');
      return new Promise((resolve, reject) => {
        getSessionId().then(response => {
          const data = response.data;
          commit('SET_SESSIONID', eval(data));
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default user;
