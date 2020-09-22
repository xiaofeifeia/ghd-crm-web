import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/finance/financeLoanTeam/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/finance/financeLoanTeam/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/finance/financeLoanTeam/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/' + id,
    method: 'put',
    data: obj
  })
}

export function getList(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/getList',
    method: 'post',
    data: obj
  })
}

export function getTeamListByUserId(id) {
  return fetch({
    url: '/api/finance/financeLoanTeam/getTeamListByUserId?userId=' + id,
    method: 'get',
  })
}

export function getLoanLog(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/getLoanLog',
    method: 'post',
    data: obj
  })
}

export function getBaseGroupsByType(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/getBaseGroupsByType',
    method: 'post',
    data: obj
  })
}

export function edit(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/edit',
    method: 'post',
    data: obj
  })
}

export function updatePrincipal(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/updatePrincipal',
    method: 'post',
    data: obj
  });
}

export function getUpdateLog(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/getUpdateLog',
    method: 'get',
    params: obj
  })
}

export function commitOrRevoke(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/commitOrRevoke',
    method: 'post',
    data: obj
  })
}

export function audit(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/audit',
    method: 'post',
    data: obj
  });
}

export function getAuditList(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/getAuditList',
    method: 'get',
    params: obj
  })
}

export function sendAuditEmail() {
  return fetch({
    url: '/api/finance/financeLoanTeam/sendAuditEmail',
    method: 'post',
    data: {}
  })
}

export function changeStatus(obj) {
  return fetch({
    url: '/api/finance/financeLoanTeam/changeStatus',
    method: 'post',
    data: obj
  })
}
