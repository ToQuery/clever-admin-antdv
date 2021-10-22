import request from '@/utils/request'

const userApi = {
  Login: '/user/token',
  Logout: '/user/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/nav'
}

const systemApi = {
  user: '/sys/user',
  log: '/sys/log',
  role: '/sys/role',
  menu: '/sys/menu'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function systemUserPage (params) {
  return request({
    url: systemApi.user,
    method: 'get',
    params: params
  })
}

export function systemUserDetail (id) {
  return request({
    url: systemApi.user + '/' + id,
    method: 'get'
  })
}

export function systemUserSave (data) {
  return request({
    url: systemApi.user,
    method: 'post',
    data: data
  })
}

export function systemUserUpdate (data) {
  return request({
    url: systemApi.user,
    method: 'put',
    data: data
  })
}

export function systemUserDelete (ids) {
  return request({
    url: systemApi.user,
    method: 'delete',
    params: { ids: ids }
  })
}

export function systemLogPage (params) {
  return request({
    url: systemApi.log,
    method: 'get',
    params: params
  })
}

export function systemMenuList (params) {
  return request({
    url: systemApi.menu + '/list',
    method: 'get',
    params: params
  })
}

export function systemMenuTree (params) {
  return request({
    url: systemApi.menu + '/tree',
    method: 'get',
    params: params
  })
}

export function systemMenuDetail (id) {
  return request({
    url: systemApi.menu + '/' + id,
    method: 'get'
  })
}

export function systemMenuSave (data) {
  return request({
    url: systemApi.menu,
    method: 'post',
    data: data
  })
}

export function systemMenuUpdate (data) {
  return request({
    url: systemApi.menu,
    method: 'put',
    data: data
  })
}

export function systemMenuDelete (ids) {
  return request({
    url: systemApi.menu,
    method: 'delete',
    params: { ids: ids }
  })
}

export function systemRolePage (params) {
  return request({
    url: systemApi.role,
    method: 'get',
    params: params
  })
}

export function systemRoleDetail (id) {
  return request({
    url: systemApi.role + '/' + id,
    method: 'get'
  })
}

export function systemRoleSave (data) {
  return request({
    url: systemApi.role,
    method: 'post',
    data: data
  })
}

export function systemRoleUpdate (data) {
  return request({
    url: systemApi.role,
    method: 'put',
    data: data
  })
}

export function systemRoleDelete (ids) {
  return request({
    url: systemApi.role,
    method: 'delete',
    params: { ids: ids }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
