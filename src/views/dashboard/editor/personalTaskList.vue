<template>
  <div
    class="taskTable"
    v-loading="loading"
    style="width: 350px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
  >
    <el-table
      :data="personalTaskList"
      border
      fit
      highlight-current-row
      :header-cell-style="getHeadCellStyle"
    >
      <el-table-column prop="taskName" label="待审批事项" align="center">
        <template slot-scope="scope">
          <el-badge v-if="scope.row.count > 0" :value="scope.row.count">
            <el-button
              v-if="scope.row.taskName === 'requestPaymentFlow'"
              v-waves
              size="small"
              @click="jumpTo(1)"
            >paypal退款待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'loanApplyFlow'"
              v-waves
              size="small"
              @click="jumpTo(2)"
            >借款申请待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'loanReimbursementFlow'"
              v-waves
              size="small"
              @click="jumpTo(3)"
            >借款核销待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'loanTeam'"
              v-waves
              size="small"
              @click="jumpTo(4)"
            >借款额度待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'publicPaymentApply'"
              v-waves
              size="small"
              @click="jumpTo(5)"
            >对公付款申请单待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'publicPaymentBill'"
              v-waves
              size="small"
              @click="jumpTo(6)"
            >对公付款打款单待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'giftcardApply'"
              v-waves
              size="small"
              @click="jumpTo(7)"
            >Gift Card 申请审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'giftcardPurchase'"
              v-waves
              size="small"
              @click="jumpTo(8)"
            >Gift Card 采购审批事项</el-button>
          </el-badge>
          <el-badge v-else-if="scope.row.count <= 0">
            <el-button
              v-if="scope.row.taskName === 'requestPaymentFlow'"
              v-waves
              size="small"
              @click="jumpTo(1)"
              disabled
            >paypal退款待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'loanApplyFlow'"
              v-waves
              size="small"
              @click="jumpTo(2)"
              disabled
            >借款申请待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'loanReimbursementFlow'"
              v-waves
              size="small"
              @click="jumpTo(3)"
              disabled
            >借款核销待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'loanTeam'"
              v-waves
              size="small"
              @click="jumpTo(4)"
              disabled
            >借款额度待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'publicPaymentApply'"
              v-waves
              size="small"
              @click="jumpTo(5)"
              disabled
            >对公付款申请单待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'publicPaymentBill'"
              v-waves
              size="small"
              @click="jumpTo(6)"
              disabled
            >对公付款打款单待审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'giftcardApply'"
              v-waves
              size="small"
              @click="jumpTo(7)"
              disabled
            >Gift Card 申请审批事项</el-button>
            <el-button
              v-else-if="scope.row.taskName === 'giftcardPurchase'"
              v-waves
              size="small"
              @click="jumpTo(8)"
              disabled
            >Gift Card 采购审批事项</el-button>
          </el-badge>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listAllPersonalTasks } from 'src/api/admin/user/user';

export default {
  name: "personalTaskList",
  data() {
    return {
      loading: false,
      personalTaskList: []
    }
  },
  created() {
    this.listAllPersonalTasks();
  },
  methods: {
    listAllPersonalTasks() {
      this.loading = true;
      listAllPersonalTasks().then(response => {
        this.personalTaskList = response.data;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        this.$message.error(JSON.stringify(error));
      });
    },
    jumpTo(type) {
      if (type === 1) {
        this.$router.push('/financeManager/reqPaymentFlowManager');
      } else if (type === 2) {
        this.$router.push('/financeManager/loanApply');
      } else if (type === 3) {
        this.$router.push('/financeManager/loanReimbursement');
      } else if (type === 4) {
        this.$router.push('/financeManager/loanTeam');
      } else if (type === 5) {
        this.$router.push('/financeManager/publicPayment/publicPaymentApplyAudit');
      } else if (type === 6) {
        this.$router.push('/financeManager/publicPayment/publicPaymentBillAudit');
      } else if (type === 7) {
        this.$router.push('/giftCard/giftCard-audit');
      } else if (type === 8) {
        this.$router.push('/giftCard/giftCard-purchaseAudit');
      }

    },
    getHeadCellStyle() {
      return 'font-size:17px';
    }
  }
}
</script>

<style scoped>
.taskItem {
  cursor: pointer;
  color: deepskyblue;
}
.taskTable >>> .el-table__row .cell {
  overflow: visible;
}
</style>
