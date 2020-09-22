import fetch from 'utils/fetch';

export function page(query) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/listPaymentFlows',
        method: 'get',
        params: query
    });
}

export function addObj(obj) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow',
        method: 'post',
        data: obj
    });
}

export function getObj(id) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/' + id,
        method: 'delete'
    })
}

export function putObj(id, obj) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/' + id,
        method: 'put',
        data: obj
    })
}

export function paymentPage(query) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/listPayments',
        method: 'get',
        params: query
    });
}

export function getDuplicateDetail(obj) {
  return fetch({
    url: '/api/finance/financeReqPaymentFlow/getDuplicateDetail',
    method: 'post',
    params: obj
  });
}

export function audit(obj) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/audit',
        method: 'post',
        data: obj
    });
}

export function saveRejectReason(obj) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/saveRejectReason',
        method: 'post',
        data: obj
    })
}

/**
 * [isNull 空值判断]
 * @author zorro 2019-05-05
 */
export function isNull (val) {
    return val === undefined || val === '' || val === null;
}
/**
 * [getAusitLogPage 审批log]
 * @author zorro 2019-05-05
 */
export function listAuditLogs(query) {
    return fetch({
        url: '/api/finance/financeReqPaymentLog/page',
        method: 'get',
        params: query
    });
}
/**
 * [getAusitLogPage 审批log]
 * @author zorro 2019-05-05
 */
export function getUserGroups(query) {
    return fetch({
        url: '/api/finance/financeReqPaymentFlow/getUserGroups',
        method: 'get',
        params: query
    });
}
