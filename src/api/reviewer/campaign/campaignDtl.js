import fetch from 'utils/fetch';
import axios from 'axios';

export function page(serverName, query) {
    return fetch({
        url: '/api/'+serverName+'/campaignDtl/listAllOrders',
        method: 'get',
        params: query
    });
}

export function updateStatus(serverName,obj) {
    return fetch({
        url: '/api/'+serverName+'/campaignDtl/updateStatus',
        method: 'post',
        data: obj
    });
}

export function expPaymentResultTpl(serverName,obj) {
    return fetch({
        url: '/api/'+serverName+'/campaignDtl/expPaymentResultTpl',
        method: 'post',
        data: obj,
        responseType: 'blob'
    });
}

export function listReviewReport(serverName, query) {
    return fetch({
        url: '/api/'+serverName+'/campaignDtl/listReviewReport',
        method: 'get',
        params: query
    });
}

export function addObj(obj) {
    return fetch({
        url: '/api/reviewer/campaignDtl',
        method: 'post',
        data: obj
    });
}

export function getObj(id) {
return fetch({
url: '/api/reviewer/campaignDtl/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/reviewer/campaignDtl/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
    return fetch({
        url: '/api/reviewer/campaignDtl/' + id,
        method: 'put',
        data: obj
    })
}

/**
 * 恢复被取消订单
 * @param {服务名} serverName 
 * @param {*} obj 
 */
export function recoverOrder(serverName, obj) {
    return fetch({
        url: '/api/'+serverName+'/campaignDtl/recoverOrder',
        method: 'post',
        data: obj
    })
}

/**
 * 保存预付款单上传结果
 * @param {服务名} serverName 
 * @param {*} obj 
 */
export function saveUploadResult(serverName, obj) {
    return fetch({
        url: '/api/'+serverName+'/campaignDtl/saveUploadResult',
        method: 'post',
        data: obj
    })
}
