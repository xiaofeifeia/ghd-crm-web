import axios from 'axios';
import {
  Message,
  MessageBox
} from 'element-ui';
import store from '../store';
import {
  getToken
} from 'utils/auth';

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 300000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  const token = getToken()
  if (token) {
    config.headers.Authorization = token; // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  if (store.getters.userId) { // 让每个请求携带userId
    if (config.params !== undefined) {
      config.params.userId = store.getters.userId;
    }
    if (config.data !== undefined) {
      config.data.userId = store.getters.userId;
    }
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    // 导出 需要取name 直接返回
    if (response.config.url.includes('exeport')) return response
    if (response.config.url.includes('export')) return response

    // console.log(response)
    const res = response.data;
    if (response.status === 401 || res.status === 40101 || res.status === 40301) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      })
      return Promise.reject('error');
    }
    if (res.status === 40301) {
      Message({
        message: '当前用户无相关操作权限！',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject('error');
    }
    if (res.status === 40001) {
      Message({
        message: '账户或密码错误！',
        type: 'warning'
      });
      return Promise.reject('error');
    }
    if (response.status !== 200 && res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      return response.data;
    }
  },
  error => {
    // console.log(error); // for debug
    let errorMsg = error.message;
    if (error.response.data.message) {
      errorMsg = error.response.data.message;
    }

    Message({
      message: errorMsg,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

export default service;
