import fetch from 'utils/fetch';

export function getList(query) {
  return fetch({
    url: '/api/finance/reimbursementNorReviewType/getList',
    method: 'get',
    params: query
  });
}

export function edit(obj) {
  return fetch({
    url: '/api/finance/reimbursementNorReviewType/edit',
    method: 'post',
    data: obj
  });
}

export function batchDelete(obj) {
  return fetch({
    url: '/api/finance/reimbursementNorReviewType/batchDelete',
    method: 'post',
    data: obj
  });
}

export function batchEdit(obj) {
  return fetch({
    url: '/api/finance/reimbursementNorReviewType/batchEdit',
    method: 'post',
    data: obj
  });
}

export function changeStatus(obj) {
  return fetch({
    url: '/api/finance/reimbursementNorReviewType/changeStatus',
    method: 'post',
    data: obj
  })
}
