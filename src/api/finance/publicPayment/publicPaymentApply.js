import fetch from 'utils/fetch'

export function getApplyList(query) {
  return fetch({
    url: '/api/finance/publicPaymentApply/getApplyList',
    method: 'get',
    params: query
  })
}

export function getAuditList(query) {
  return fetch({
    url: '/api/finance/publicPaymentApply/getAuditList',
    method: 'get',
    params: query
  })
}

export function getInfo(query) {
  return fetch({
    url: '/api/finance/publicPaymentApply/getInfo',
    method: 'get',
    params: query
  })
}

export function deleteById(query) {
  return fetch({
    url: '/api/finance/publicPaymentApply/deleteById',
    method: 'get',
    params: query
  })
}

export function revokeById(obj) {
  return fetch({
    url: '/api/finance/publicPaymentApply/revokeById',
    method: 'post',
    data: obj
  })
}

export function addPayment(obj) {
  return fetch({
    url: '/api/finance/publicPaymentApply/addPayment',
    method: 'post',
    data: obj
  })
}

export function audit(obj) {
  return fetch({
    url: '/api/finance/publicPaymentApply/audit',
    method: 'post',
    data: obj
  });
}
