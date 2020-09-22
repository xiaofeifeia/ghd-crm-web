import fetch from 'utils/fetch';

export function getGroupsByType(query) {
  return fetch({
    url: '/api/finance/baseGroup/getGroupsByType',
    method: 'get',
    params: query
  });
}

