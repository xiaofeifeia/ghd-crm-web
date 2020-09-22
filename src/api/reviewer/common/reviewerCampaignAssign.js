import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/getObj/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/' + id,
    method: 'put',
    data: obj
  })
}

export function listCampaignAssign(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/listCampaignAssign',
    method: 'post',
    data: obj
  })
}

export function add(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/add',
    method: 'post',
    data: obj
  })
}

export function update(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/update',
    method: 'post',
    data: obj
  })
}

export function assignCampaign(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/assignCampaign',
    method: 'post',
    data: obj
  })
}

export function updateStatus(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignAssign/updateStatus',
    method: 'post',
    data: obj
  })
}

export function getSellerDeptGroups() {
  return fetch({
    url: '/api/finance/reqPayment/getSellerDeptGroups',
    method: 'get'
  })
}