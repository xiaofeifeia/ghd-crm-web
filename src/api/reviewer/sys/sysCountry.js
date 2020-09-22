import fetch from 'utils/fetch';

export function countryPage(query) {
    return fetch({
        url: '/api/reviewer/sysCountry/page',
        method: 'get',
        params: query
    });
}

export function addObj(obj) {
return fetch({
url: '/api/reviewer/sysCountry',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/reviewer/sysCountry/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/sysCountry/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/reviewer/sysCountry/' + id,
method: 'put',
data: obj
})
}
