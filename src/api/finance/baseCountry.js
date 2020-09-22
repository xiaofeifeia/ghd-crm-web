import fetch from 'utils/fetch';

export function getCountryList(query) {
  return fetch({
    url: '/api/finance/baseCountry/getList',
    method: 'get',
    params: query
  });
}

