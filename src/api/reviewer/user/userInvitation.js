import fetch from 'utils/fetch';

export function page(serverName, query) {
    return fetch({
    url: '/api/'+serverName+'/userInvitation/page',
    method: 'get',
    params: query
    });
}

export function addObj(obj) {
return fetch({
url: '/api/reviewer/userInvitation',
method: 'post',
data: obj
});
}

export function getObj(serverName, id) {
  return fetch({
    url: '/api/' + serverName + '/userInvitation/' + id,
    method: 'get'
  })
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/userInvitation/' + id,
method: 'delete'
})
}

export function putObj(serverName, id, obj) {
  return fetch({
    url: '/api/' + serverName + '/userInvitation/' + id,
    method: 'put',
    data: obj
  })
}

export function listUserInvitation(serverName, obj) {
  return fetch({
    url: '/api/'+serverName+'/userInvitation/listUserInvitations',
    method: 'post',
    data: obj
  });
}

export function sendInviteEmail(serverName, obj) {
  return fetch({
    url:'/api/'+serverName+'/userInvitation/sendInviteEmail',
    method: 'post',
    data: obj
  })
}


export function addToBlacklist(serverName, id) {
  return fetch({
    url: '/api/'+serverName+'/userInvitation/addToBlacklist/'+id,
    method: 'post'
  })
}
