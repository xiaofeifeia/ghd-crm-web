import fetch from '../../utils/fetch';

export function getList(obj) {
  return fetch({
    url: '/api/finance/skuFeeSort/getList',
    method: 'post',
    data: obj
  });
}

