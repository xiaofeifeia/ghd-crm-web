import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  });
}

export function getAllUser() {
  return fetch({
    url: '/api/admin/user/all',
    method: 'get'
  })
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/user/addUser',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'put',
    data: obj
  })
}

export function listAllPersonalTasks() {
  return fetch({
    url: '/api/admin/user/listAllPersonalTasks',
    method: 'post',
    data: {}
  })
}
