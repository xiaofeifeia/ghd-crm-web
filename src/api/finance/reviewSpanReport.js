import fetch from 'utils/fetch';

export function getOrganizationOptions(obj) {
  return fetch({
    url: '/api/finance/reviewSpanReport/getOrganizationOptions',
    method: 'post',
    data: obj
  });
}

export function getLineChart(obj) {
  return fetch({
    url: '/api/finance/reviewSpanReport/getLineChart',
    method: 'post',
    data: obj
  });
}

export function getStatistics(obj) {
  return fetch({
    url: '/api/finance/reviewSpanReport/getStatistics',
    method: 'post',
    data: obj
  });
}
