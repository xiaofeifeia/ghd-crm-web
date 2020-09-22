import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';
import AppMain from '../views/layout/AppMain';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('error/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index')
      }
    ]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'form',
    noDropdown: true,
    children: [
      {
        path: 'index',
        component: _import('introduction/index'),
        name: '简述'
      }
    ]
  }
];

export const asyncRouterMap = [
  {
    path: '/baseManager',
    component: Layout,
    name: '基础配置管理',
    icon: 'setting',
    authority: 'baseManager',
    children: [
      {
        path: 'userManager',
        icon: 'fa-user',
        component: _import('admin/user/user'),
        name: '用户管理',
        authority: 'userManager'
      },
      {
        path: 'menuManager',
        icon: 'category',
        component: _import('admin/menu/menu'),
        name: '菜单管理',
        authority: 'menuManager'
      },
      {
        path: 'groupManager',
        icon: 'group_fill',
        component: _import('admin/group/group'),
        name: '角色权限管理',
        authority: 'groupManager'
      },
      {
        path: 'groupTypeManager',
        icon: 'fa-users',
        component: _import('admin/groupType/groupType'),
        name: '角色类型管理',
        authority: 'groupTypeManager'
      },
      {
        path: 'gateLogManager',
        icon: 'viewlist',
        component: _import('admin/gateLog/gateLog'),
        name: '操作日志管理',
        authority: 'gateLogManager'
      }
    ]
  },
  {
    path: '/financeManager',
    component: Layout,
    name: '财务管理',
    icon: 'setting',
    authority: 'financeManager',
    children: [
      {
        path: 'reqPaymentManager',
        component: _import('finance/reqPayment'),
        name: '返款管理',
        authority: 'reqPaymentManager'
      },
      {
        path: 'reqPaymentFlowManager',
        component: _import('finance/reqPaymentFlow'),
        name: '返款流程',
        authority: 'reqPaymentFlowManager'
      },
      {
        path: 'loanApply',
        component: _import('finance/loanApply'),
        name: '借款申请',
        authority: 'loanApply'
      },
      {
        path: 'loanReimbursement',
        component: _import('finance/loanReimbursement'),
        name: '借款核销',
        authority: 'loanReimbursement'
      },
      {
        path: 'loanReimbursement',
        component: _import('finance/loanReimbursement'),
        name: '借款核销',
        authority: 'loanReimbursement'
      },
      {
        path: 'loanTeam',
        component: _import('finance/loanTeam'),
        name: '借款额度',
        authority: 'loanTeam'
      },
      {
        path: 'norReviewType',
        component: _import('finance/financeManage/norReviewType/index'),
        name: '非Review费用设置',
        authority: 'norReviewType'
      },
      {
        path: 'currencyRate',
        component: _import('finance/currencyRate'),
        name: '汇率管理',
        authority: 'currencyRate'
      },
      {
        path: 'reviewSpanReportManager',
        component: _import('finance/reviewSpanReport'),
        name: 'Review花费报表',
        authority: 'reviewSpanReportManager'
      },
      {
        path: 'SkuFeeSort',
        component: _import('finance/SkuFeeSort'),
        name: 'Sku费用排序',
        authority: 'SkuFeeSort'
      },
      {
        path: 'reqPaymentConstants',
        component: _import('finance/reqPaymentConstants'),
        name: '校验常量',
        authority: 'reqPaymentConstants'
      }
    ]
  },
  {
    path: '/financeManager/publicPayment',
    // component: {render:c=>c("router-view")},
    component: Layout,
    name: '对公付款',
    authority: 'financeManager/publicPayment',
    children: [
      {
        path: 'publicPaymentApply',
        component: _import('finance/publicPayment/publicPaymentApply'),
        name: '对公付款申请',
        authority: 'publicPaymentApply'
      },
      {
        path: 'publicPaymentApplyAudit',
        component: _import('finance/publicPayment/publicPaymentApplyAudit'),
        name: '对公付款审批',
        authority: 'publicPaymentApplyAudit'
      },
      {
        path: 'publicPaymentBill',
        component: _import('finance/publicPayment/publicPaymentBill'),
        name: '付款单管理',
        authority: 'publicPaymentBill'
      },
      {
        path: 'publicPaymentBillAudit',
        component: _import('finance/publicPayment/publicPaymentBillAudit'),
        name: '打款管理审批',
        authority: 'publicPaymentBillAudit'
      },
      {
        path: 'publicPaymentDepartment',
        component: _import('finance/publicPayment/publicPaymentDepartment'),
        name: '部门管理',
        authority: 'publicPaymentDepartment'
      },
      {
        path: 'publicPaymentSupplier',
        component: _import('finance/publicPayment/publicPaymentSupplier'),
        name: '供应商管理',
        authority: 'publicPaymentSupplier'
      }
    ]
  },
  {
    path: '/giftCard',
    name: 'Gift Card',
    component: Layout,
    authority: 'giftCard',
    children: [
      {
        path: 'giftCard-get',
        component: _import('finance/giftCard/giftCard-get/index'),
        name: 'Gift Card 领取',
        authority: 'giftCard-get'
      },
      {
        path: 'giftCard-apply',
        component: _import('finance/giftCard/giftCard-apply/index'),
        name: 'Gift Card 申请管理',
        authority: 'giftCard-apply'
      },
      {
        path: 'giftCard-audit',
        component: _import('finance/giftCard/giftCard-audit/index'),
        name: 'Gift Card 审批管理',
        authority: 'giftCard-audit'
      },
      {
        path: 'quotaManagement',
        component: _import('finance/giftCard/quotaManagement/index'),
        name: 'Gift Card 额度管理',
        authority: 'quotaManagement'
      },
      {
        path: 'quotaDetail/:quotaId',
        component: _import('finance/giftCard/quotaManagement/quotaDetail'),
        name: 'Gift Card 部门详情',
        hidden: true,
        notPermission: true,
        authority: 'quotaManagement'
      },
      {
        path: 'giftCard-purchase',
        component: _import('finance/giftCard/giftCard-purchase/index'),
        name: 'Gift Card 采购管理',
        authority: 'giftCard-purchase'
      },
      {
        path: 'giftCard-purchaseAudit',
        component: _import('finance/giftCard/giftCard-purchaseAudit/index'),
        name: 'Gift Card 采购单审批',
        authority: 'giftCard-purchaseAudit'
      },
      {
        path: 'giftCard-purchase/created',
        component: _import('finance/giftCard/giftCard-purchase/created'),
        name: '创建Gift Card 采购管理',
        authority: 'giftCard-purchase'
      },
      {
        path: 'giftCard-purchase/details',
        component: _import('finance/giftCard/giftCard-purchase/details'),
        name: 'Gift Card 采购单详情',
        authority: 'giftCard-purchase'
      }
    ]
  },
  {
    path: '/meetdeal',
    component: Layout,
    name: 'meetdeal',
    icon: 'item',
    authority: 'meetdeal',
    children: [
      {
        path: 'createGiftCardCode',
        component: () => import('@/views/meetdeal/create-gift-card-code'),
        name: 'createGiftCardCode',
        authority: 'createGiftCardCode'
      },
      {
        path: 'giftCardManage',
        component: () => import('@/views/meetdeal/gift-card-manage'),
        name: 'giftCardManage',
        authority: 'giftCardManage'
      },
      {
        path: 'sendGiftCard',
        component: () => import('@/views/meetdeal/send-gift-card'),
        name: 'sendGiftCard',
        authority: 'sendGiftCard'
      }
    ]

  },
  {
    path: '/powerbi',
    component: Layout,
    name: 'powerbi',
    icon: 'item',
    authority: 'powerbi',
    children: [
      {
        path: 'report1',
        component: () => import('@/views/powerbi/report1'),
        name: 'report1',
        authority: 'report1'
      }
    ]
  }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

console.log(router)

export default router

// export default new Router({
//   // mode: 'history', //后端支持可开
//   scrollBehavior: () => ({
//     y: 0
//   }),
//   routes: constantRouterMap
// });


