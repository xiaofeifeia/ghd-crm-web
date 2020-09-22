<template>
  <div class="appGift">
    <el-dialog :visible.sync="dialogTableVisible" width="60%">
      <div slot="title" class="title flex">
        <span>申请单详情</span>
        <span>
          <el-tooltip placement="bottom">
            <div slot="content">
              所有的额度指的是人民币额度。
              <br />每次申请不同币种的 Gift Card 金额都会
              <br />根据财务所配置的汇率转化成人民币的，
              <br />并在可用额度中减去想要金额的额度。
              <br />额度的实际大小会随着财务对
              <br />汇率的调整而变化。
              一般而言，财务每
              <br />月月初更新一次汇率。
            </div>
            <div>
              <i class="el-icon-warning-outline"></i>
              <span class="limit">额度说明</span>
            </div>
          </el-tooltip>
        </span>
      </div>
      <div class="flex">
        <span>申请单号：{{applyNo}}</span>
        <span>
          本次预计使用额度：
          <span style="color:#37c4a8">￥{{applyTotal}}</span>
        </span>
      </div>
      <div class="table">
        <el-table
          v-loading="loading"
          :data="tableDataList"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          max-height="450"
          style="width: 100%"
        >
          <el-table-column label="使用站点" prop="country" width="120" />
          <el-table-column label="Gift Card 币种" prop="currency" />
          <el-table-column label="Gift Card 面额" prop="unitPrice" />
          <el-table-column label="数量" prop="totalAmount" width="80" />
          <el-table-column label="金额（站点）" prop="originalTotal" />
          <el-table-column label="参考汇率" prop="rate" />
          <el-table-column label="使用额度（人民币）" prop="total" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="getClick(scope.row)">领用情况</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="Gift Card领用详情" :visible.sync="conditionVisible" width="45%">
      <div class="flex">
        <span></span>
        <span>
          <span>总计：{{amount}}张</span> 已经领用：
          <span style="color:#37c4a8">{{useAmount}}张</span>
        </span>
      </div>
      <div class="table">
        <el-table
          v-loading="dbloading"
          :data="conditionDataList"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          style="width: 100%"
        >
          <el-table-column label="领用时间" prop="receiveDate" width="150" />
          <el-table-column label="领用人" prop="receiverName" />
          <el-table-column label="站点" prop="country" />
          <el-table-column label="Gift Card币种" prop="currency" />
          <el-table-column label="Gift Card面额" prop="unitPrice" />
          <el-table-column label="数量" prop="receiveAmount" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getApplyItem, getApplyItemDetail } from '@/api/finance/giftCard'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    applyId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      conditionVisible: false,
      loading: false,
      dbloading: false,
      applyNo: '',
      applyTotal: null,
      tableDataList: [],
      conditionDataList: [],
      getApplyId: '',
      amount: 0
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogTableVisible = this.visible
        if (val) {
          this.getApplyItem()
        }
      }
    },
    dialogTableVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  computed: {
    useAmount() {
      let num = 0
      this.conditionDataList.forEach(val => {
        num += val.receiveAmount
      })
      return num
    }
  },
  methods: {
    async getApplyItem() {
      this.loading = true
      const res = await getApplyItem({ applyId: this.applyId })
      this.tableDataList = res.data.itemList
      this.applyNo = res.data.applyNo
      this.applyTotal = res.data.applyTotal.toFixed(2)
      this.loading = false
    },
    async getApplyItemDetail() { // 领用情况
      this.dbloading = true
      const res = await getApplyItemDetail({ itemId: this.getApplyId })
      this.conditionDataList = res.data
      this.resCode = res.resCode
      this.dbloading = false
    },
    getClick(data) {
      this.getApplyId = data.id
      this.amount = data.totalAmount
      this.conditionVisible = true
      this.getApplyItemDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
.appGift {
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .title {
    .limit {
      text-decoration: underline;
      color: #1890ff;
      margin-right: 20px;
      font-size: 12px;
    }
  }
}
</style>