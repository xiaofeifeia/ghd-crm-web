import fetch from 'utils/fetch';

export function getAddApplyList(query) {
  return fetch({
    url: '/api/finance/publicPaymentBill/getAddApplyList',
    method: 'get',
    params: query
  })
}

export function getBillList(query) {
  return fetch({
    url: '/api/finance/publicPaymentBill/getBillList',
    method: 'get',
    params: query
  })
}

export function getBill(query) {
  return fetch({
    url: '/api/finance/publicPaymentBill/getBill',
    method: 'get',
    params: query
  })
}

export function getBillData(query) {
  return fetch({
    url: '/api/finance/publicPaymentBill/getBillData',
    method: 'get',
    params: query
  })
}

export function addApply(obj) {
  return fetch({
    url: '/api/finance/publicPaymentBill/addApply',
    method: 'post',
    data: obj
  })
}

export function deleteApplyFromBill(obj) {
  return fetch({
    url: '/api/finance/publicPaymentBill/deleteApplyFromBill',
    method: 'post',
    data: obj
  })
}

export function getSupplierAndAccount() {
  return fetch({
    url: '/api/finance/publicPaymentBill/getSupplierAndAccount',
    method: 'get',
    params: {}
  })
}

export function generateBill(obj) {
  return fetch({
    url: '/api/finance/publicPaymentBill/generateBill',
    method: 'post',
    data: obj
  })
}

export function submitBill(obj) {
  return fetch({
    url: '/api/finance/publicPaymentBill/submitBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return fetch({
    url: '/api/finance/publicPaymentBill/auditBill',
    method: 'post',
    data: obj
  })
}

export function revokeBill(obj) {
  return fetch({
    url: '/api/finance/publicPaymentBill/revokeBill',
    method: 'post',
    data: obj
  })
}

export function rollBillToNewStatus(obj) {
  return fetch({
    url: '/api/finance/publicPaymentBill/rollBillToNewStatus',
    method: 'post',
    data: obj
  })
}
