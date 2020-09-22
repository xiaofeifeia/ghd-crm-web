import fetch from '../../utils/fetch';

export function getList(obj) {
  return fetch({
    url: '/api/finance/reqPaymentConstants/getList',
    method: 'post',
    data: obj
  });
}

export function getConstantsByTypeAndName(query) {
  return fetch({
    url: '/api/finance/reqPaymentConstants/getConstantsByTypeAndName',
    method: 'get',
    params: query
  });
}
