import router from './router/index'
import store from './store'
import NProgress from 'nprogress' // progress bar
import { getToken } from 'utils/auth'

import loadRoutes from './utils/addRoute'

const whiteList = ['/login', '/authredirect'];// 不重定向白名单

if (getToken()) {
  loadRoutes()
}

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      let queryStr = '?'
      if (Object.keys(to.query).length > 0) {
        for (const [key, value] of Object.entries(to.query)) {
          queryStr += `${key}=${value}&`
        }
      }
      if (queryStr.indexOf('&') !== -1) queryStr = queryStr.slice(0, queryStr.length - 1)
      store.dispatch('FedLogOut').then(() => {
        next(`/login?redirect=${to.path}${queryStr}`)
        NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done(); // 结束Progress
})
