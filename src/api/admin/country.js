import fetch from 'utils/fetch';

export function countryPage(query) {
return fetch({
url: '/api/admin/country/page',
method: 'get',
params: query
});
}

export function addObj(obj) {
return fetch({
url: '/api/admin/country',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/admin/country/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/admin/country/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/admin/country/' + id,
method: 'put',
data: obj
})
}
