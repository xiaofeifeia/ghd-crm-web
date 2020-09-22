import fetch from 'utils/fetch';

export function getWebsiteList() {
  return fetch({
    url: "/api/reviewer/reviewerWebsite/listWebsite",
    method: "get",
    params: {
      page: 1,
      limit: 20,
      status: 1
    }
  });
}

export function getSalesGroups() {
  return fetch({
    url: '/api/finance/reqPayment/getSellerDeptGroups',
    method: 'get'
  })
}



export function getUserRoles() {
  return fetch({
    url: '/api/admin/groupRest/listUserGroups',
    method: 'post',
    data: {}
  })
}

export function getPayerList() {
  return fetch({
    url: '/api/finance/reqPaymentConstants/getConstants?type=1',
    method: 'get'
  })
}

/**
 * 品牌
 */
export function brandPage(serverName) {
  return fetch({
      url: '/api/'+serverName+'/sysBrand/page',
      method: 'get',
      params: {
        page: 1,
        limit: 20,
        status: 1
      }
  });
}
/**
 * 品牌
 */
export function countryPage() {
  return fetch({
      url: '/api/reviewer/country/page',
      method: 'get',
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

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'timestamp') {
      return parseTime(v[j])
    } else {
      return v[j]
    }
  }))
}

// 会员积分类型输前端配置
export const itemTypeOptions = [{
        value: 1,
        label: '获取'
      }, {
        value: 2,
        label: '消费'
      }]

// 活动
export const campaignDtlStatus = [{
        value: 1,
        label: '待上传订单号'
      }, {
        value: 9,
        label: '待上传订发票'
      },{
        value: 2,
        label: '待评论'
      }, {
        value: 7,
        label: '待上传寄件地址'
      },{
        value: 8,
        label: '待上传预付款快递单'
      },{
        value: 12,
        label: '待上传物流单&Drop Off照片'
      },{
        value: 3,
        label: '待申请退款'
      }, {
        value: 4,
        label: '待退款'
      },{
        value: 10,
        label: '提交财务请款'
      }, {
        value: 5,
        label: '已退款'
      },{
        value: 6,
        label: '管理员退款'
      }, {
        value: -1,
        label: '取消'
      }, {
        value: -2,
        label: '管理员取消'
      },{
        value: 11,
        label: '打回'
      }
      ]

// 活动是否留评
export const yesOrNo = [{
  value: 1,
  label: '是'
}, {
  value: 2,
  label: '否'
}]

export function formatCampStatus(row, column) {
  switch (row.status) {
    case -1:
      return "删除";
      break;
    case 0:
      return "新建";
      break;
    case 1:
      return "已发布";
      break;
    case 2:
      return "已确认";
      break;
    case 3:
      return "结束(手动)";
      break;
    case 31:
      return "结束(售完)";
      break;
    case 32:
      return "结束(到期)";
      break;
    case 4:
      return "暂停";
      break;
    default:
      return "";
  }
}

// 评论类型
export const reviewType = [
{
  value: 2,
  label: '免评'
},{
  value: 1,
  label: '文本'
},{
  value: 3,
  label: '图片'
},{
  value: 4,
  label: '视频'
},{
  value: 5,
  label: '图片+视频'
}]

export function formatReviewType (row, column) {
  switch(row.reviewFlag){
      case 1:
        return '文本';
        break;
      case 2:
        return '免评';
        break;
      case 3:
        return '图片';
        break;
      case 4:
        return '视频';
        break;
      case 5:
        return '图片+视频';
        break;
      default:
        return '';
  }
}

// 账号权限类型
export const reviewPermissionOptions = [
{
  value: 1,
  label: '不限制'
},{
  value: -1,
  label: '仅免评产品'
},{
  value: 2,
  label: '仅留评产品'
}]

// 是否返仓
export const returnWhOptions = [
  {
    value: '0',
    label: '否'
  },{
    value: '1',
    label: '是'
  }]

// 是否返仓
export function returnWhOptionsFn(row, column) {
  if (row.isReturnWarehouse && row.isReturnWarehouse == 1) {
    return '是';
  } else {
    return '否';
  }
}

// 是否返仓
export const enableOrDisable = [
  {
    value: 0,
    label: '禁用'
  },{
    value: 1,
    label: '启用'
  }]
  
  