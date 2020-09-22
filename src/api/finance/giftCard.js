import fetch from 'utils/fetch';

export function getFreeList(query) { // 领用-查询可领用列表
  return fetch({
    url: '/api/finance/giftcardReceive/getFreeList',
    method: 'get',
    params: query
  });
}

export function getQuotaListByUserId(query) { // 领用-领用-查询用户关联的额度组别
  return fetch({
    url: '/api/finance/giftcardReceive/getQuotaListByUserId',
    method: 'get',
    params: query
  });
}

export function getReceivedList(query) { // 领用-查询已领用列表
  return fetch({
    url: '/api/finance/giftcardReceive/getReceivedList',
    method: 'get',
    params: query
  });
}

export function getReceivedDetail(query) { // 领用-查询已领用的明细
  return fetch({
    url: '/api/finance/giftcardReceive/getReceivedDetail',
    method: 'get',
    params: query
  });
}

export function receiveGiftCard(query) { // 领用-领用
  return fetch({
    url: '/api/finance/giftcardReceive/receiveGiftCard',
    method: 'post',
    data: query
  });
}

export function getCode(query) { // 领用-查看code
  return fetch({
    url: '/api/finance/giftcardReceive/getCode',
    method: 'get',
    params: query
  });
}

export function getOrderInfo(data) { // 领用-查询订单信息
  return fetch({
    url: '/api/finance/giftcardReceive/getOrderInfo',
    method: 'post',
    data
  });
}

export function getDuplicateOrder(query) { // 领用-根据订单号查询已领取的订单
  return fetch({
    url: '/api/finance/giftcardReceive/getDuplicateOrder',
    method: 'get',
    params: query
  });
}

export function getList(query) { // 申请管理-查询申请单列表
  return fetch({
    url: '/api/finance/giftcardApply/getList',
    method: 'get',
    params: query
  });
}

export function getAuditList(query) { // 申请管理-查询待审批申请单列表
  return fetch({
    url: '/api/finance/giftcardApply/getAuditList',
    method: 'get',
    params: query
  });
}

export function addApply(query) { // 申请管理-新建申请单
  return fetch({
    url: '/api/finance/giftcardApply/addApply',
    method: 'post',
    data: query
  });
}

export function baseCountryGetList(query) { // 查询国家、币种
  return fetch({
    url: '/api/finance/baseCountry/getList',
    method: 'get',
    params: query
  });
}

/**
 * 获取额度列表
 * @param {*} params
 */
export function getGiftcardQuotaList(params) {
  return fetch({
    url: '/api/finance/giftcardQuota/getList',
    method: 'get',
    params
  })
}

/**
 * 获取每月额度详情
 * @param {*} params
 */
export function getQuotaLogById(params) {
  return fetch({
    url: '/api/finance/giftcardQuota/getQuotaLog',
    method: 'get',
    params

  })
}

/**
 * 获取申请记录
 * @param {*} params
 */
export function getApplyLog(params) {
  return fetch({
    url: '/api/finance/giftcardQuota/getApplyLog',
    method: 'get',
    params

  })
}

export function getApplyItem(query) { // 申请管理-查询申请单明细
  return fetch({
    url: '/api/finance/giftcardApply/getApplyItem',
    method: 'get',
    params: query
  })
}

export function getApplyItemDetail(query) { // 申请管理-查看领用情况
  return fetch({
    url: '/api/finance/giftcardApply/getApplyItemDetail',
    method: 'get',
    params: query
  })
}

export function giftcardApplyBatchReject(query) { // 申请管理-批量驳回
  return fetch({
    url: '/api/finance/giftcardApply/batchReject',
    method: 'post',
    data: query
  })
}

export function giftcardApplyBatchPass(query) { // 申请管理-批量通过
  return fetch({
    url: '/api/finance/giftcardApply/batchPass',
    method: 'post',
    data: query
  })
}

export function giftcardApplyRevoke(query) { // 申请管理-批量通过
  return fetch({
    url: '/api/finance/giftcardApply/revoke',
    method: 'post',
    data: query
  })
}

export function giftcardApplyBatchRevoke(query) { // 申请管理-批量撤回
  return fetch({
    url: '/api/finance/giftcardApply/batchRevoke',
    method: 'post',
    data: query
  })
}

export function getStatisticsByUserId(query) { // 额度管理-部门额度
  return fetch({
    url: '/api/finance/giftcardQuota/getStatisticsByUserId',
    method: 'get',
    params: query
  })
}

export function getPurchaseList(query) { // 采购管理-查询采购单列表
  return fetch({
    url: '/api/finance/giftcardPurchase/getPurchaseList',
    method: 'get',
    params: query
  })
}

export function getApplyList(query) { // 采购管理-查询采购单列表
  return fetch({
    url: '/api/finance/giftcardPurchase/getApplyList',
    method: 'get',
    params: query
  })
}

// 启用停用额度
export function switchQuatoStatus(data) {
  return fetch({
    url: '/api/finance/giftcardQuota/switchStatus',
    method: 'post',
    data
  })
}

export function getPurchaseInfo(query) { // 采购管理--查询采购统计
  return fetch({
    url: '/api/finance/giftcardPurchase/getPurchaseInfo',
    method: 'get',
    params: query
  })
}

export function exportPurchaseList(query) { // 采购管理--导出
  return fetch({
    url: '/api/finance/giftcardPurchase/exportPurchaseList',
    method: 'post',
    responseType: 'blob',
    data: query
  })
}

export function changeExportStatus(query) { // 采购管理--更改导出状态
  return fetch({
    url: '/api/finance/giftcardPurchase/changeExportStatus',
    method: 'post',
    data: query
  })
}

export function getIdleApplyList(query) { // 采购管理-查询待采购的申请单列表
  return fetch({
    url: '/api/finance/giftcardPurchase/getIdleApplyList',
    method: 'get',
    params: query
  })
}

export function addPurchase(query) { // 采购管理-创建采购单
  return fetch({
    url: '/api/finance/giftcardPurchase/addPurchase',
    method: 'post',
    data: query
  })
}

export function getApplyListByPurchaseId(query) { // 采购管理-查询关联申请单列表
  return fetch({
    url: '/api/finance/giftcardPurchase/getApplyListByPurchaseId',
    method: 'get',
    params: query
  })
}

export function getItemList(query) { // 采购管理-查询关联申请单列表
  return fetch({
    url: '/api/finance/giftcardPurchase/getItemList',
    method: 'get',
    params: query
  })
}

export function countIdleApply(query) { // 采购管理-查询代采购的申请单数目
  return fetch({
    url: '/api/finance/giftcardPurchase/countIdleApply',
    method: 'get',
    params: query
  })
}

export function batchDiscard(query) { // 采购管理-批量废弃
  return fetch({
    url: '/api/finance/giftcardPurchase/batchDiscard',
    method: 'post',
    data: query
  })
}

export function modifyQuota(data) { // 额度管理-修改额度
  return fetch({
    url: '/api/finance/giftcardQuota/modifyQuota',
    method: 'post',
    data
  })
}

export function getUsers(params) { // 额度管理-部门详情-获取申请人列表
  return fetch({
    url: '/api/finance/baseUser/getUsers',
    method: 'get',
    params
  })
}

export function getDeptQuotaById(params) { // 额度管理-部门详情-获取部门额度
  return fetch({
    url: '/api/finance/giftcardQuota/getQuotaById',
    method: 'get',
    params
  })
}

export function getReceiveLog(params) { // 额度管理-查询领用明细
  return fetch({
    url: '/api/finance/giftcardQuota/getReceiveLog',
    method: 'get',
    params
  })
}

export function exportReceiveLog(query) { // 采购管理--导出领用明细
  return fetch({
    url: '/api/finance/giftcardQuota/exportReceiveLog',
    method: 'post',
    responseType: 'blob',
    data: query
  })
}

export function getReceiveLogByReceiveNo(params) { // 额度管理-查询领用明细
  return fetch({
    url: '/api/finance/giftcardQuota/getReceiveLogByReceiveNo',
    method: 'get',
    params
  })
}

export function batchImportCode(query) { // 采购管理-批量导入
  return fetch({
    url: '/api/finance/giftcardPurchase/batchImportCode',
    method: 'post',
    data: query
  })
}

export function purchaseGetAuditList(query) { // 采购管理-查询关联申请单列表
  return fetch({
    url: '/api/finance/giftcardPurchase/getAuditList',
    method: 'get',
    params: query
  })
}

export function giftcardPurchaseReject(query) { // 申请管理-批量驳回
  return fetch({
    url: '/api/finance/giftcardPurchase/batchReject',
    method: 'post',
    data: query
  })
}

export function giftcardPurchaseBatchPass(query) { // 申请管理-批量通过
  return fetch({
    url: '/api/finance/giftcardPurchase/batchPass',
    method: 'post',
    data: query
  })
}

export function exportMyReceiveLogSummary(query) { // 申请管理-导出我领用的gift card 汇总
  return fetch({
    url: '/api/finance/giftcardReceive/exportMyReceiveLogSummary',
    method: 'post',
    responseType: 'blob',
    data: query
  })
}

export function exportMyReceiveLogDetail(query) { // 申请管理-导出我领用的gift card 明细
  return fetch({
    url: '/api/finance/giftcardReceive/exportMyReceiveLogDetail',
    method: 'post',
    responseType: 'blob',
    data: query
  })
}

export function exportQuotaLog(params) { // 额度管理-详情-导出每月额度使用情况
  return fetch({
    url: '/api/finance/giftcardQuota/exportQuotaLog',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}

export function exportApplyLog(params) { // 额度管理-详情-导出申请记录
  return fetch({
    url: '/api/finance/giftcardQuota/exportApplyLog',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}

export function exportIdleApplyList(obj) { // 采购管理-新建采购单-导出待新建记录
  return fetch({
    url: '/api/finance/giftcardPurchase/exportIdleApplyList',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}

export function exportPayment(obj) { // 采购管理-查看付款单
  return fetch({
    url: '/api/finance/giftcardPurchase/exportPayment',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}

export function exportReceiveTemplate(data) { // 领用-下载模版
  return fetch({
    url: '/api/finance/giftcardReceive/exportReceiveTemplate',
    method: 'post',
    responseType: 'blob',
    data: data
  });
}

export function exportItemList(data) { // 采购管理-详情-gift card详情-导出表格
  return fetch({
    url: '/api/finance/giftcardPurchase/exportItemList',
    method: 'post',
    responseType: 'blob',
    data: data
  });
}
