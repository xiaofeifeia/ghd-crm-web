import fetch from 'utils/fetch';

export function getRateList(query) {
  return fetch({
    url: '/api/finance/currencyRate/getRateList',
    method: 'get',
    params: query
  });
}

export function addRate(obj) {
  return fetch({
    url: '/api/finance/currencyRate/addRate',
    method: 'post',
    data: obj
  });
}

export function editRate(obj) {
  return fetch({
    url: '/api/finance/currencyRate/editRate',
    method: 'post',
    data: obj
  });
}

export function deleteRate(obj) {
  return fetch({
    url: '/api/finance/currencyRate/deleteRate',
    method: 'post',
    data: obj
  });
}
