import fetch from 'utils/fetch';

export function page(tgServer,query) {
return fetch({
url: '/api/'+tgServer+'/memberPointsItem/page',
method: 'get',
params: query
});
}

export function addObj(tgServer, obj) {
return fetch({
url: '/api/'+tgServer+'/memberPointsItem',
method: 'post',
data: obj
});
}

export function getObj(tgServer, id) {
return fetch({
url: '/api/'+tgServer+'/memberPointsItem/' + id,
method: 'get'
})
}

export function delObj(tgServer, id) {
return fetch({
url: '/api/'+tgServer+'/memberPointsItem/' + id,
method: 'delete'
})
}

export function putObj(tgServer, id, obj) {
return fetch({
url: '/api/'+tgServer+'/memberPointsItem/' + id,
method: 'put',
data: obj
})
}
