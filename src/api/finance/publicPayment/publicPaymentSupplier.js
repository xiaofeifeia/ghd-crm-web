import fetch from 'utils/fetch'

export function getList(query) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/getList',
    method: 'get',
    params: query
  });
}

export function getInfo(query) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/getInfo',
    method: 'get',
    params: query
  });
}

export function changeStatus(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/changeStatus',
    method: 'post',
    data: obj
  })
}

export function addSupplier(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/addSupplier',
    method: 'post',
    data: obj
  })
}

export function editContact(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/editContact',
    method: 'post',
    data: obj
  });
}

export function addContract(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/addContract',
    method: 'post',
    data: obj
  });
}

export function editContract(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/editContract',
    method: 'post',
    data: obj
  });
}

export function deleteContract(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/deleteContract',
    method: 'post',
    data: obj
  });
}

export function addAccount(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/addAccount',
    method: 'post',
    data: obj
  });
}

export function editAccount(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/editAccount',
    method: 'post',
    data: obj
  });
}

export function deleteAccount(obj) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/deleteAccount',
    method: 'post',
    data: obj
  });
}

export function getActiveByTeamName(query) {
  return fetch({
    url: '/api/finance/publicPaymentSupplier/getActiveByTeamName',
    method: 'get',
    params: query
  });
}

