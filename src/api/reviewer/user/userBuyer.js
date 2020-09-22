import fetch from 'utils/fetch';

export function page(serverName, query) {
  return fetch({
    url: '/api/' + serverName + '/userBuyer/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
return fetch({
url: '/api/reviewer/userBuyer',
method: 'post',
data: obj
});
}

export function getObj(serverName, id) {
  return fetch({
    url: '/api/' + serverName + '/userBuyer/' + id,
    method: 'get'
  })
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/userBuyer/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/reviewer/userBuyer/' + id,
method: 'put',
data: obj
})
}

export function listUserBuyer(serverName, obj) {
  return fetch({
    url: '/api/' + serverName + '/userBuyer/listUserBuyer',
    method: 'post',
    data: obj
  });
}

export function updateUserBuyer(serverName, obj) {
  return fetch({
    url: '/api/' + serverName + '/userBuyer/updateUserBuyer',
    method: 'post',
    data: obj
  })
}
