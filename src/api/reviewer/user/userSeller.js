import fetch from 'utils/fetch';

export function page(query) {
return fetch({
url: '/api/reviewer/userSeller/page',
method: 'get',
params: query
});
}

export function addObj(obj) {
return fetch({
url: '/api/reviewer/userSeller',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/reviewer/userSeller/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/userSeller/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/reviewer/userSeller/' + id,
method: 'put',
data: obj
})
}
