import fetch from 'utils/fetch';

export function brandPage(query) {
    return fetch({
        url: '/api/reviewer/sysBrand/page',
        method: 'get',
        params: query
    });
}

export function addObj(obj) {
return fetch({
url: '/api/reviewer/sysBrand',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/reviewer/sysBrand/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/sysBrand/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/reviewer/sysBrand/' + id,
method: 'put',
data: obj
})
}
