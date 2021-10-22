import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import cloneDeep from 'lodash.clonedeep'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 * @param defaultValue 路由如果未配置的角色，则返回这个默认值
 */
function hasPermission (roles, route, defaultValue = true) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return defaultValue
  }
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 * @param defaultValue 路由如果未配置的角色，则返回这个默认值
 */
export function filterAsyncRoutes (routes, roles, defaultValue = true) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp, defaultValue)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, defaultValue)
      }
      res.push(tmp)
    }
  })

  return res
}

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
    GenerateRoutes ({ commit }, codes) {
      return new Promise(resolve => {
        const routerMap = cloneDeep(asyncRouterMap)
        const accessedRouters = filterAsyncRoutes(routerMap, codes)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
