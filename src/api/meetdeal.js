import fetch from 'utils/fetch';
/**
 * 获取生成code的列表
 * @param {*} data
 */
export function getBatchCodeList(data) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/getBatchCodeList',
    method: 'post',
    data
  })
}
/**
 * 获取面额列表
 * @param {*} data
 */
export function getPriceIds(data) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/getPriceIds',
    method: 'post',
    data
  })
}
/**
 * 生成code
 * @param {*} data
 */
export function createCode(data) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/executeCreateActivationCode',
    method: 'post',
    data
  })
}
/**
 * 获取统计信息
 * @param {*} params
 */
export function getMethodQuery(params) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/getMethodQuery',
    method: 'get',
    params
  })
}
/**
 * 获取面额统计
 * @param {*} params
 */
export function getSumPrice(params) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/getSumPrice',
    method: 'get',
    params
  })
}
/**
 * 导出QRCode
 * @param {*} data
 */
export function exeportQrCodeExcel(data) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/exeportExcel',
    method: 'post',
    responseType: 'blob',
    data
  })
}

/**
 * 礼品卡管理
 * @param {*} data
 */
export function getGiftCartApplyList(data) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/getBindPager',
    method: 'post',
    data
  })
}

/**
 * 获取model
 * @param {*} params
 */
export function getModelList(params) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/getModelList',
    method: 'get',
    params
  })
}

/**
 * 获取创建人列表
 * @param {*} params
 */
export function getCreateUserList(params) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/getCreateUserNameList',
    method: 'get',
    params
  })
}

/**
 * 更新卡状态 通过驳回
 * @param {*} data
 */
export function updateBindStatus(data) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/updateBindStatus',
    method: 'post',
    data
  })
}

/**
 * 发送邮件
 * @param {*} data
 */
export function sendEmail(data) {
  return fetch({
    url: '/api/meetdeals-card/activationManager/sendEmail',
    method: 'post',
    data
  })
}