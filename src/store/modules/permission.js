import {
  asyncRouterMap,
  constantRouterMap
} from 'src/router'
import { getAllMenus } from 'api/login';
/**
 * 通过authority判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.authority) {
    if (menus[route.authority] !== undefined) {
      return menus[route.authority];
    } else {
      return false;
    }
  } else if (route.notPermission) {
    return true
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
export function filterAsyncRouter(routes, menus, menuDatas) {
  const res = []

  routes.forEach(route => {
    if (hasPermission(menuDatas, route)) {
      route.name = menuDatas[route.authority] ? menuDatas[route.authority].title : route.name;
      route.icon = menuDatas[route.authority] ? menuDatas[route.authority].icon : route.icon;
      if (route.children) {
        route.children = filterAsyncRouter(route.children, menus, menuDatas)
      }
      res.push(route)
    }
  })

  // 添加404
  // res.push({ path: '*', redirect: '/404', hidden: true })
  return res
  // return routes
}
// function filterAsyncRouter(asyncRouterMap, menus, menuDatas) {
//   console.log(asyncRouterMap, menus, menuDatas)
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(menus, route)) {
//       route.name = menuDatas[route.authority] ? menuDatas[route.authority].title : route.name;
//       route.icon = menuDatas[route.authority] ? menuDatas[route.authority].icon : route.icon;
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, menus, menuDatas);
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, menus) {
      return new Promise(resolve => {
        getAllMenus().then(data => {
          const menuDatas = {};
          for (let i = 0; i < data.length; i++) {
            menuDatas[data[i].code] = data[i];
          }
          const accessedRouters = filterAsyncRouter(asyncRouterMap, menus, menuDatas);
          commit('SET_ROUTERS', accessedRouters);
          resolve();
        });
      })
    }
  }
};

export default permission;
