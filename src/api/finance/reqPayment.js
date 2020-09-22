import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/finance/reqPayment/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/finance/reqPayment',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/finance/reqPayment/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/finance/reqPayment/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/finance/reqPayment/' + id,
    method: 'put',
    data: obj
  })
}

export function add(obj) {
  return fetch({
    url: '/api/finance/reqPayment/add',
    method: 'post',
    data: obj
  });
}

export function update(obj) {
  return fetch({
    url: '/api/finance/reqPayment/update',
    method: 'post',
    data: obj
  });
}

export function getList(query) {
  return fetch({
    url: '/api/finance/reqPayment/getList',
    method: 'post',
    data: query
  });
}

export function exportPaypalTask(obj) {
  return fetch({
    url: '/api/finance/reqPayment/exportPaypalTask',
    method: 'post',
    responseType: 'blob',
    data: obj
  });
}

export function submit(obj) {
  return fetch({
    url: '/api/finance/reqPayment/submit',
    method: 'post',
    data: obj
  });
}

export function getSellerDeptGroups() {
  return fetch({
    url: '/api/finance/reqPayment/getSellerDeptGroups',
    method: 'get'
  })
}

export function deleteTask(obj) {
  return fetch({
    url: '/api/finance/reqPayment/deleteTask',
    method: 'post',
    data: obj
  });
}
