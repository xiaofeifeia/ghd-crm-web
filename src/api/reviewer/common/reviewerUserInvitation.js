import fetch from 'utils/fetch';

export function page(query) {
return fetch({
url: '/api/reviewer/reviewerUserInvitation/listUserInvitations',
method: 'get',
params: query
});
}
// 添加纪录
export function addObj(obj) {
    return fetch({
        url: '/api/reviewer/reviewerUserInvitation/add',
        method: 'post',
        data: obj
    });
}

export function getObj(id) {
return fetch({
url: '/api/reviewer/reviewerUserInvitation/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/reviewerUserInvitation/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/reviewer/reviewerUserInvitation/' + id,
method: 'put',
data: obj
})
}

export function transfer(obj) {
  return fetch({
    url: '/api/reviewer/reviewerUserInvitation/transfer',
    method: 'post',
    data: obj
  });
}
