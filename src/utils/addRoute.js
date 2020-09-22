import { setUserId, setUserName } from './auth'
import router from '../router/index'
import store from '../store'

// 动态加载路由

export default () => new Promise((resolve, reject) => {
  if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息
    store.dispatch('GetInfo').then(info => { // 拉取user_info
      setUserId(info.id);
      setUserName(info.name);
      const menus = {};
      for (let i = 0; i < info.menus.length; i++) {
        menus[info.menus[i].code] = true;
      }
      store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        resolve()
      })
    }).catch(() => {
      reject()
    })
  }
})
