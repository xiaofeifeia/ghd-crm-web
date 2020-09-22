import {
  loginByEmail,
  logout,
  getInfo,
  getMenus,
  getGroups
} from 'api/login';
import {
  getToken,
  setToken,
  removeToken,
  removeUserId,
  removeUserName
} from 'utils/auth';
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    menus: undefined,
    eleemnts: undefined,
    permissionMenus: undefined,
    setting: {
      articlePlatform: []
    },
    userId: undefined,
    groups: undefined
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
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus;
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId;
    },
    SET_GROUPS: (state, groups) => {
      state.groups = groups;
    },
  },

  actions: {
    // 邮箱登录
    LoginByEmail({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_MENUS', undefined);
      commit('SET_ELEMENTS', undefined);
      removeToken();
      return new Promise((resolve, reject) => {
        loginByEmail(username, userInfo.password).then(response => {
          setToken(response.data);
          commit('SET_TOKEN', response.data);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response;
          commit('SET_ROLES', 'admin');
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558693549994&di=20ce04f87d3cf213c485d208bae9f596&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F16%2F12%2F31%2F05235f47e5e9ead68ac49cf32c1dbdb7.jpg');
          commit('SET_INTRODUCTION', data.description);
          commit('SET_USER_ID',data.id);
          const menus = {};
          for (let i = 0; i < data.menus.length; i++) {
            menus[data.menus[i].code] = true;
          }
          commit('SET_MENUS', menus);
          const elements = {};
          for (let i = 0; i < data.elements.length; i++) {
            elements[data.elements[i].code] = true;
          }
          commit('SET_ELEMENTS', elements);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
        getMenus(state.token).then(response => {
          commit('SET_PERMISSION_MENUS', response);
        });
        getGroups(state.token).then(response => {
          const groups = {};
          for (let i = 0; i < response.length; i++) {
            groups[i] = response[i].code;
          }
          commit('SET_GROUPS', groups);
        });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          commit('SET_TOKEN', response.data.token);
          setToken(response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_MENUS', undefined);
          commit('SET_ELEMENTS', undefined);
          commit('SET_PERMISSION_MENUS', undefined);
          commit('SET_GROUPS', undefined);
          removeToken();
          removeUserId();
          removeUserName();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENUS', undefined);
        commit('SET_ELEMENTS', undefined);
        commit('SET_PERMISSION_MENUS', undefined);
        commit('SET_GROUPS', undefined);
        removeToken();
        removeUserId();
        removeUserName();
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({
      commit
    }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        setToken(role);
        resolve();
      })
    }
  }
};

export default user;
