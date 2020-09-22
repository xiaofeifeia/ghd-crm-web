import fetch from 'utils/fetch';

export function page(serverName, query) {
    return fetch({
    url: '/api/'+serverName+'/campaignInvitation/page',
    method: 'get',
    params: query
    });
}

export function addObj(obj) {
return fetch({
url: '/api/reviewer/campaignInvitation',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/reviewer/campaignInvitation/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/campaignInvitation/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/reviewer/campaignInvitation/' + id,
method: 'put',
data: obj
})
}
