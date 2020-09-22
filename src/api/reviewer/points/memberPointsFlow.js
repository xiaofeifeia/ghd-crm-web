import fetch from 'utils/fetch';

export function page(tgServer, query) {
    return fetch({
        url: '/api/'+tgServer+'/memberPointsFlow/listPointsFlows',
        method: 'get',
        params: query
    });
}

export function addObj(obj) {
return fetch({
url: '/api/reviewer/memberPointsFlow',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/reviewer/memberPointsFlow/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/memberPointsFlow/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/reviewer/memberPointsFlow/' + id,
method: 'put',
data: obj
})
}
