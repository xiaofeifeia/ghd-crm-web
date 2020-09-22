import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/' + id,
    method: 'put',
    data: obj
  })
}

export function getList(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/getList',
    method: 'post',
    data: obj
  })
}

export function getReimbursementItemDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/getReimbursementItemDetail',
    method: 'post',
    data: obj
  })
}

export function saveReviewDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/saveReviewDetail',
    method: 'post',
    data: obj
  })
}

export function saveGiftCardDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/saveGiftCardDetail',
    method: 'post',
    data: obj
  })
}

export function saveNorReviewDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/saveNorReviewDetail',
    method: 'post',
    data: obj
  })
}

export function saveItemDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/saveItemDetail',
    method: 'post',
    data: obj
  })
}

export function saveOtherForUsdDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/saveOtherForUsdDetail',
    method: 'post',
    data: obj
  })
}

export function create(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/create',
    method: 'post',
    data: obj
  })
}

export function edit(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/edit',
    method: 'post',
    data: obj
  })
}

export function deleteData(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/deleteData',
    method: 'post',
    data: obj
  })
}

export function submit(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/submit',
    method: 'post',
    data: obj
  })
}

export function audit(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/audit',
    method: 'post',
    data: obj
  })
}

export function exportDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/exportDetail',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}

export function findDuplicateDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/findDuplicateDetail',
    method: 'post',
    data: obj
  })
}

export function findSameImageDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/findSameImageDetail',
    method: 'post',
    data: obj
  })
}

export function addCheckedOrder(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/addCheckedOrder',
    method: 'post',
    data: obj
  })
}

export function getCheckedOrder(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/getCheckedOrder',
    method: 'post',
    data: obj
  })
}

export function addFeeSubtract(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/addFeeSubtract',
    method: 'post',
    data: obj
  })
}

export function getFeeSubtract(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/getFeeSubtract',
    method: 'post',
    data: obj
  })
}

export function updateFeeSubtract(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/updateFeeSubtract',
    method: 'post',
    data: obj
  })
}

export function confirmFeeSubtract(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/confirmFeeSubtract',
    method: 'post',
    data: obj
  })
}

export function sendEmail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/sendEmail',
    method: 'post',
    data: obj
  })
}

export function clearDetail(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/clearDetail',
    method: 'post',
    data: obj
  })
}

export function exportByReimbursementId(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/exportByReimbursementId',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}

export function exportCheckedOrder(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/exportCheckedOrder',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}

export function exportFeeSubtract(obj) {
  return fetch({
    url: '/api/finance/financeLoanReimbursement/exportFeeSubtract',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}
