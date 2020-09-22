import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl/' + id,
    method: 'put',
    data: obj
  })
}

export function getList(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl/listCampaignDtl',
    method: 'post',
    data: obj
  })
}

export function updateOrder(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl/updateOrder',
    method: 'post',
    data: obj
  })
}

export function submitOrder(obj) {
  return fetch({
    url: '/api/reviewer/reviewerCampaignDtl/submitOrder',
    method: 'post',
    data: obj
  })
}

export function reviewCheckPage(query) {
  return fetch({
    url: '/api/reviewer/reviewerReviewCheck/page',
    method: 'get',
    params: query
  });
}
