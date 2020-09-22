<template>
  <div class="app-container calendar-list-container fixed_table">
    <div class="filter-container">
      <el-form v-model="listQuery" label-width="100px" class="form-el-all">
        <el-form-item label="批次号">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.batchNo" clearable @clear="listQuery.batchNo=undefined"/>
        </el-form-item>
        <el-form-item label="请款人">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.applicant" clearable @clear="listQuery.applicant=undefined"/>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker v-model="createDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"
                          :picker-options="pickerOptions" clearable @clear="createDate=listQuery.createDateStart=listQuery.createDateEnd=undefined"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable @clear="listQuery.status=undefined">
            <el-option v-for="item in statusOptions" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="事业部">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.team" clearable @clear="listQuery.team=undefined"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center; margin-top: 7px">
        <el-button type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" v-waves icon="search" @click="handleClear">清空</el-button>
      </div>
    </div>

    <el-table :data="list" v-loading.body="fullScreenLoading" fit highlight-current-row style="width: 100%" ref="elementTable" :max-height="tableHeight" element-loading-background="rgba(0, 0, 0, 0)"
              :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
      <el-table-column align="center" type="index"/>
      <el-table-column label="批次号" align="center" prop="batchNumber"/>
      <el-table-column label="状态" align="center" prop="statusStr"/>
      <el-table-column label="事业部" align="center" prop="salesTeam"/>
      <el-table-column label="币别" align="center" prop="currency"/>
      <el-table-column label="总金额" align="center" prop="totalAmount"/>
      <el-table-column label="请款人" align="center" prop="applicant"/>
      <el-table-column label="提交时间" align="center" prop="applyDateStr"/>
      <el-table-column label="备注" align="center" prop="remark" width="300px" show-overflow-tooltip/>
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.selfFlow && (scope.row.status === 21 || scope.row.status === 22 || scope.row.status === 23 || scope.row.status === 24)"
                     size="mini" type="primary" @click="showAuditDetail(scope.row)">审批</el-button>
          <el-button v-else size="mini" type="success" @click="showAuditDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!fullScreenLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    </div>

    <!-- 工作流审核窗口 -->
    <el-dialog title="审批" :visible.sync="auditDialogVisible" width="90%" :before-close="closeAuditDialog" v-dialog-drag top="2vh">
      <div>
        <el-input type="textarea" :rows="2" placeholder="请输入审批备注" v-model="auditRemark" style="width:75%" v-if="isSelfFlow"/>
        <el-button size="small" type="success" :disabled="btnDisabledFlag" v-if="isSelfFlow" @click="paymentAudit(1)">通过</el-button>
        <el-button size="small" type="danger" :disabled="btnDisabledFlag" v-if="isSelfFlow" @click="paymentAudit(0)">打回</el-button>
      </div>
      <br>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTagClick" v-loading="fullScreenLoading" element-loading-background="rgba(0, 0, 0, 0)">
        <el-tab-pane label="流转状态" name="second" >
          <div>
            <el-steps :active=activeStep :finish-status="stepfinishStatus" style="margin-top: 20px" align-center>
            <el-step title="提交"/>
            <el-step title="事业部负责人审批"/>
            <el-step title="财务会计审批"/>
          </el-steps>
          </div>
          <br>
        <el-table :data="auditLogList" fit highlight-current-row style="width: 100%"
                  :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
            <el-table-column align="center" label="批次号" prop="batchNo"/>
            <el-table-column align="center" label="操作人" prop="userName"/>
            <el-table-column align="center" label="职位" prop="userDept"/>
            <el-table-column align="center" label="审批备注" prop="remark"/>
            <el-table-column align="center" label="操作时间" prop="createDate"/>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="流程表单" name="first">
          <el-table :data="paymentList" fit highlight-current-row style="width: 100%" :max-height="windowHeight*0.67"
                    :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
            <el-table-column min-width="220px" align="center" label="财务审批备注">
              <template slot-scope="scope"><el-input size="mini" v-model="scope.row.rejectReason" @blur="saveRejectReason(scope.row)" :disabled="!(isAccountant && accountAuditStatus)"/></template>
            </el-table-column>
            <el-table-column min-width="200px" align="center" label="自定义备注" prop="customNote" show-overflow-tooltip/>
            <el-table-column min-width="150px" align="center" label="批次号" prop="batchNumber"/>
            <el-table-column min-width="110px" align="center" label="请款人" prop="applicant"/>
            <el-table-column min-width="120px" align="center" label="提交日期" prop="applyDateStr"/>
            <el-table-column min-width="170px" align="center" label="请款单号" prop="applyNumber"/>
            <el-table-column min-width="225px" align="center" label="亚马逊单号">
              <template slot-scope="scope">
                <span style="color: red; cursor:pointer;background-color: papayawhip;padding: 10px" @click="viewDuplPayment(scope.row)" v-if="scope.row.countNum >= 1" >{{scope.row.orderId}}</span>
                <span v-else>{{scope.row.orderId}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="160px" align="center" label="erp sku">
              <template slot-scope="scope">
                 <span style="color: red; cursor:pointer;background-color: papayawhip;padding: 10px" @click="viewDuplPayment(scope.row)" v-if="scope.row.countNum >= 1" >{{scope.row.erpSku}}</span>
                <span v-else>{{scope.row.erpSku}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="250px" align="center" label="付款paypal账号" prop="payer" show-overflow-tooltip/>
            <el-table-column min-width="230px" align="center" label="收款paypal账号" prop="payee"/>
            <el-table-column min-width="150px" align="center" label="客户名字" prop="firstName" show-overflow-tooltip/>
            <el-table-column min-width="100px" align="center" label="客户姓氏" prop="lastName"/>
            <el-table-column min-width="200px" align="center" label="街道" prop="street" show-overflow-tooltip/>
            <el-table-column min-width="140px" align="center" label="城市" prop="city" show-overflow-tooltip/>
            <el-table-column min-width="140px" align="center" label="州/省" prop="province" show-overflow-tooltip/>
            <el-table-column min-width="140px" align="center" label="邮编" prop="postalCode" show-overflow-tooltip/>
            <el-table-column min-width="120px" align="center" label="品牌" prop="brand"/>
            <el-table-column min-width="120px" align="center" label="组别" prop="team"/>
            <el-table-column min-width="130px" align="center" label="主管" prop="leader"/>
            <el-table-column min-width="150px" align="center" label="渠道" prop="channel"/>
            <el-table-column min-width="60px" align="center" label="国家" prop="country"/>
            <el-table-column min-width="100px" align="center" label="币种" prop="currency"/>
            <el-table-column min-width="120px" align="center" label="订单金额(本币)" prop="trueAmount"/>
            <el-table-column min-width="100px" align="center" label="佣金(本币)" prop="commission"/>
            <el-table-column min-width="100px" align="center" label="手续费(本币)" prop="serviceFee"/>
            <el-table-column min-width="100px" align="center" label="total(本币)" prop="total"/>
            <el-table-column min-width="180px" align="center" label="备注" prop="remark"/>
            <el-table-column min-width="230px" align="center" label="邮箱或微信" prop="reviewerContact" show-overflow-tooltip/>
            <el-table-column min-width="190px" align="center" label="创建时间" prop="createDate"/>
          </el-table>
          <div v-show="!fullScreenLoading" class="pagination-container">
            <el-pagination @size-change="paymentHandleSizeChange" @current-change="paymenthandleCurrentChange" :current-page.sync="paymentListQuery.page"
              :page-sizes="[10,20,30,50,100]" :page-size="paymentListQuery.limit"
              layout="total, sizes, prev, pager, next, jumper" :total="paymentListtotal"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="重复单据" width="90%" :visible.sync="duplOrderFormVisible" v-dialog-drag>
      <el-table :data="duplPaymentList" border fit highlight-current-row style="width: 100%">
        <el-table-column min-width="220px" align="center" label="财务审批备注">
          <template slot-scope="scope"><el-input v-model="scope.row.rejectReason" @blur="saveRejectReason(scope.row)" :disabled="!(isAccountant && accountAuditStatus)"/></template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="批次号" prop="batchNumber"/>
        <el-table-column min-width="100px" align="center" label="请款人" prop="applicant"/>
        <el-table-column min-width="120px" align="center" label="提交日期" prop="applyDateStr"/>
        <el-table-column min-width="150px" align="center" label="请款单号" prop="applyNumber"/>
        <el-table-column min-width="150px" align="center" label="状态" prop="statusStr"/>
        <el-table-column min-width="200px" align="center" label="亚马逊单号" prop="orderId"/>
        <el-table-column min-width="150px" align="center" label="erp sku" prop="erpSku"/>
        <el-table-column min-width="200px" align="center" label="付款paypal账号" prop="payer"/>
        <el-table-column min-width="200px" align="center" label="收款paypal账号" prop="payee"/>
        <el-table-column min-width="100px" align="center" label="客户名字" prop="firstName"/>
        <el-table-column min-width="100px" align="center" label="客户姓氏" prop="lastName"/>
        <el-table-column min-width="200px" align="center" label="街道" prop="street" show-overflow-tooltip/>
        <el-table-column min-width="140px" align="center" label="城市" prop="city" show-overflow-tooltip/>
        <el-table-column min-width="140px" align="center" label="州/省" prop="province" show-overflow-tooltip/>
        <el-table-column min-width="140px" align="center" label="邮编" prop="postalCode" show-overflow-tooltip/>
        <el-table-column min-width="120px" align="center" label="品牌" prop="brand"/>
        <el-table-column min-width="120px" align="center" label="组别" prop="team"/>
        <el-table-column min-width="120px" align="center" label="主管" prop="leader"/>
        <el-table-column min-width="150px" align="center" label="渠道" prop="channel"/>
        <el-table-column min-width="60px" align="center" label="国家" prop="country"/>
        <el-table-column min-width="100px" align="center" label="价格币种" prop="priceCurrency"/>
        <el-table-column min-width="100px" align="center" label="订单金额" prop="trueAmount"/>
        <el-table-column min-width="100px" align="center" label="佣金币种" prop="commissionCurrency"/>
        <el-table-column min-width="100px" align="center" label="佣金" prop="commission"/>
        <el-table-column min-width="100px" align="center" label="手续费币种" prop="serviceFeeCurrency"/>
        <el-table-column min-width="100px" align="center" label="手续费" prop="serviceFee"/>
        <el-table-column min-width="100px" align="center" label="total(本币)" prop="total"/>
        <el-table-column min-width="120px" align="center" label="备注" prop="remark"/>
        <el-table-column min-width="120px" align="center" label="自定义备注" prop="customNote"/>
        <el-table-column min-width="150px" align="center" label="邮箱或微信" prop="reviewerContact"/>
        <el-table-column min-width="180px" align="center" label="创建时间" prop="createDate"/>
        <el-table-column fixed="right" min-width="180px" align="center" label="单据来源" prop="duplicateSource"/>
      </el-table>
    </el-dialog>

  </div>
</template>
<script>
import {
  page,
  paymentPage,
  getDuplicateDetail,
  audit,
  saveRejectReason,
  isNull,
  listAuditLogs,
  getUserGroups
} from "../../api/finance/financeReqPaymentFlow";
 import {
    getSellerDeptGroups
  } from 'api/finance/reqPayment';
import { mapGetters } from "vuex";

export default {
  name: "reqPaymentFlow",
  data() {
    return {
      list: null,
      total: null,
      fullScreenLoading: false,
      windowHeight: undefined,
      tableHeight: undefined,
      createDate: undefined,
      listQuery: {
        page: 1,
        limit: 10,
        batchNo: undefined,
        applicant: undefined,
        status: undefined,
        team: undefined,
        createDateStart: undefined,
        createDateEnd: undefined
      },
      dialogFormVisible: false,
      auditDialogVisible: false,
      duplOrderFormVisible: false,
      paymentList: null,
      duplPaymentList: null,
      paymentListtotal: null,
      paymentListQuery: {
        page: 1,
        limit: 10,
        batchNumber: undefined
      },
      auditRemark: undefined,
      activeName: "first",
      imgSrc: "",
      auditLogList: null,
      auditButtonText: "",
      currentTaskId: null,
      activeStep: 1,
      stepfinishStatus: 'success',
      stepProcessStatus: undefined,
      isSelfFlow: false,
      isAccountant: false, // 用户是否会计
      statusOptions: [{dicValue: -1, dicName: '审批不通过'},{dicValue: 1, dicName: '待提交'}, {dicValue: 22, dicName: '待负责人审批'}, {dicValue: 23, dicName: '待会计审批'}, {dicValue: 3, dicName: '待支付'}, {dicValue: 4, dicName: '支付成功'}, {dicValue: 5, dicName: '支付失败'}],
      teamOptions: undefined,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }}, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);}
        }]
      },
      btnDisabledFlag: false,
      accountAuditStatus: false
    };
  },
  watch: {
    createDate() {
      this.listQuery.createDateStart = this.createDate ? (this.createDate[0] ? this.changeDate(this.createDate[0]) : undefined) : undefined;
      this.listQuery.createDateEnd = this.createDate ? (this.createDate[1] ? this.changeDate(this.createDate[1]) : undefined) : undefined;
    }
  },
  created() {
    this.getList();
    this.isAccountantUser();
    this.getSellerDeptGroups();
  },
  computed: {
    ...mapGetters(["elements"])
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    this.createDate = [start,end];

    this.windowHeight = window.innerHeight;
    this.tableHeight = window.innerHeight * 0.62;
  },
  methods: {
    /** 工作流审核窗口切换tab页 */
    handleTagClick(tab, event) {
      if (this.activeName === 'second') {
        this.getAuditLogs();
      }
      if (this.activeName === 'first') {
        this.getPaymentList();
      }
    },
    /** 查询审批列表 */
    getList() {
      this.fullScreenLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.fullScreenLoading = false;
      }).catch(error => {
        this.fullScreenLoading = false;
        this.$message.error(JSON.stringify(error));
      });
    },
    handleFilter() {
      this.getList();
    },
    handleClear() {
      this.createDate = undefined;
      this.listQuery = {page: 1, limit: 10};
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    /** 查看单据详情 */
    showAuditDetail(row) {
      this.activeName = "second";
      this.isSelfFlow = row.selfFlow && (row.status === 21 || row.status === 22 || row.status === 23 || row.status === 24);
      this.paymentListQuery.batchNumber = row.batchNumber;
      this.currentTaskId = row.taskId;
      this.accountAuditStatus = row.selfFlow && row.status === 23;
      this.auditRemark = '';
      this.paymentList = [];
      this.auditLogList = [];
      this.getPaymentList();
      this.getAuditLogs();
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditRemark = "";
      this.paymentList = undefined;
      this.paymentListtotal = undefined;
      this.auditLogList = undefined;
      this.auditDialogVisible = false;
    },
    paymentHandleSizeChange(val) {
      this.paymentListQuery.limit = val;
      this.getPaymentList();
    },
    paymenthandleCurrentChange(val) {
      this.paymentListQuery.page = val;
      this.getPaymentList();
    },
    /** 查询付款列表 */
    getPaymentList() {
      this.fullScreenLoading = true;
      paymentPage(this.paymentListQuery).then(response => {
        if (response.status === 200) {
          this.paymentList = response.data.rows;
          this.paymentListtotal = response.data.total;
        } else {
          this.$message.error("查询单据失败");
        }
        this.fullScreenLoading = false;
      }).catch(error => {
        this.fullScreenLoading = false;
        this.$message.error(JSON.stringify(error));
      });
    },
    /** 工作流审核 */
    paymentAudit(val) {
      if (val === 0 && isNull(this.auditRemark)) {
        // 打回
        this.$notify({title: "警告", message: "打回失败，审批备注不能为空", type: "warning", duration: 2000});
        return false;
      }
      let auditForm = {
        isPass: val,
        auditRemark: this.auditRemark,
        batchNo: this.paymentListQuery.batchNumber,
        procInstId: this.currentTaskId
      };
      this.btnDisabledFlag = true;
      audit(auditForm).then(response => {
        if (response.resCode === 200) {
          this.$notify({title: "成功", message: "审批成功", type: "success", duration: 2000});
          this.auditDialogVisible = false;
          this.getList();
        } else {
          this.$notify({title: "失败", message: response.resDes, type: "error", duration: 2000});
        }
        this.btnDisabledFlag = false;
      });
    },
    /** 保存财务驳回理由 */
    saveRejectReason(row) {
      saveRejectReason(row).then(() => {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success",
          duration: 2000
        });
      });
    },
    /** 查询审批日志 */
    getAuditLogs() {
      let logQuery = {
        page: 1,
        limit: 3,
        batchNo: this.paymentListQuery.batchNumber
      };
      listAuditLogs(logQuery).then(response => {
        this.auditLogList = response.data.rows;
        // 由于后端返回流程图展示异常，展示处理方案，通过log展示流程图
        if (this.auditLogList != null && this.auditLogList.length > 0) {
          let logListSize = this.auditLogList.length;
          this.activeStep = logListSize;
          let lastLogObj = this.auditLogList[logListSize-1];
          if (lastLogObj.remark && lastLogObj.remark.indexOf('打回') != -1 ) {
            this.activeStep = logListSize - 1;
            this.stepProcessStatus = 'error';
          }
        } else {
          this.activeStep = 0;
        }
      });
    },
    /** 判断用户是否有会计节点权限 */
    isAccountantUser() {
      let query = {};
      getUserGroups(query).then(res => {
        let userGroupList = res.data;
        if (userGroupList && userGroupList.length > 0) {
          for (var i=0; i < userGroupList.length; i++) {
            let groupObj = userGroupList[i];
            if (groupObj.code.indexOf('accountant') != -1) {
              this.isAccountant = true;
            }
          }
        }
      }).catch(error => {
          console.log(error);
      });
    },
    /** 查询组别 */
    getSellerDeptGroups() {
      getSellerDeptGroups().then(response => {
        this.teamOptions = response.data;
      })
    },
    changeDate(date) {
      return this.$moment(date).format("YYYY-MM-DD");
    },
    viewDuplPayment (row) {
      if (!row.countNum || row.countNum === 0) {
        return;
      }
      let form = {
        page: 1,
        limit: 100,
        id: row.id,
        orderId: row.orderId,
        erpSku: row.erpSku
      };
      this.fullScreenLoading = true;
      getDuplicateDetail(form).then(response => {
        this.duplPaymentList = response.data.rows;
        this.fullScreenLoading = false;
        this.duplOrderFormVisible = true;
      }).catch(error => {
        this.fullScreenLoading = false;
        this.$message.error(JSON.stringify(error));
      });

    }
  }
};
</script>
<style lang="scss" scoped>
  .form-el-all{
    display: flex;
    flex-wrap: wrap;
  }

  .filter-container {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
</style>
