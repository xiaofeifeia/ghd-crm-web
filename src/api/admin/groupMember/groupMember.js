import fetch from 'utils/fetch';

export function listGroupMember(obj) {
  return fetch({
    url: '/api/admin/groupMember/listGroupMember',
    method: 'post',
    data: obj
  });
}
