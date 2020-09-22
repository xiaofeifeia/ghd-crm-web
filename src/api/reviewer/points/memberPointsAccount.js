import fetch from 'utils/fetch';

export function page(tgServer, query) {
return fetch({
  url: '/api/'+tgServer+'/memberPointsAccount/listPointsAccounts',
  method: 'get',
  params: query
  });
}

export function getWebsiteList() {
    return fetch({
      url: "/api/admin/reviewerWebsite/page",
      method: "get",
      params: {
        page: 1,
        limit: 20,
        status: 1
      }
    });
}

export function checkServerSelected (serverName) {
  if (!serverName) {
    return false;
  }
  return true;
}

// 订单运输前端配置
export const itemTypeOptions = [{
  value: 1,
  label: '获取'
}, {
  value: 2,
  label: '消费'
}]
