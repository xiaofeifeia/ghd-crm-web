import fetch from 'utils/fetch';

export function page(serverName, query) {
    return fetch({
        url: '/api/'+serverName+'/campaignInfo/listCampaigns',
        method: 'get',
        params: query
    });
}


export function update(serverName, obj) {
    return fetch({
        url: '/api/'+serverName+'/campaignInfo/update',
        method: 'post',
        data: obj
    })
}

export function addObj(serverName, obj) {
    return fetch({
        url: '/api/'+serverName+'/campaignInfo/addCampaign',
        method: 'post',
        data: obj
    });
}

export function getObj(serverName,id) {
return fetch({
url: '/api/'+serverName+'/campaignInfo/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/campaignInfo/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
    return fetch({
        url: '/api/reviewer/campaignInfo/' + id,
        method: 'put',
        data: obj
    })
}

export function sendInvitationEmail(serverName, obj) {
  return fetch({
    url: '/api/'+serverName+'/campaignInfo/sendInvitationEmail',
    method: 'post',
    data: obj
  });
}


export function topping(serverName, obj) {
    return fetch({
        url: '/api/'+serverName+'/campaignInfo/topping',
        method: 'post',
        data: obj
    })
}