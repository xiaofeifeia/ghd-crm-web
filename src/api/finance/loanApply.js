import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/finance/financeLoanApply/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/finance/financeLoanApply/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/finance/financeLoanApply/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/' + id,
    method: 'put',
    data: obj
  })
}

export function getList(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/getList',
    method: 'post',
    data: obj
  })
}

export function create(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/create',
    method: 'post',
    data: obj
  })
}

export function edit(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/edit',
    method: 'post',
    data: obj
  })
}

export function submit(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/submit',
    method: 'post',
    data: obj
  })
}

export function audit(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/audit',
    method: 'post',
    data: obj
  })
}

export function updateStatusAfterPaying(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/updateStatusAfterPaying',
    method: 'post',
    data: obj
  })
}

export function getAuditLog(obj) {
  return fetch({
    url: '/api/finance/financeLoanApply/getAuditLog',
    method: 'post',
    data: obj
  })
}
