import fetch from 'utils/fetch';

export function getLetterRoomList(serverName,query) {
  return fetch({
      url: '/api/'+serverName+'/letterMessage/listLetterRooms',
      method: 'get',
      params: query
  });
}

export function getLetterMsgList(serverName, query) {
  return fetch({
      url: '/api/'+serverName+'/letterMessage/listLetterMsgs',
      method: 'get',
      params: query
  });
}

export function sendMsg(serverName, obj) {
  return fetch({
    url: '/api/'+serverName+'/letterMessage/saveMessage',
    method: 'post',
    data: obj
  });
}

export function deleteMsg(serverName, obj) {
  return fetch({
    url: '/api/'+serverName+'/letterMessage/deleteMsg',
    method: 'post',
    data: obj
  });
}

export function unReadMsg(serverName, obj) {
  return fetch({
    url: '/api/'+serverName+'/letterMessage/unReadMsg',
    method: 'post',
    data: obj
  });
}

