<template>
  <div class="appGift">
    <el-dialog :visible.sync="dialogTableVisible" width="80%">
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
      <span class="blue">订单标蓝的意味着该订单同时也被其他的申请单使用</span>
      <div class="table">
        <orderImgTable :tableDataList="tableDataList" :StepsActive="3" :isShowUploadImg="false"></orderImgTable>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import orderImgTable from '../../component/orderImgTable'
import { getReceiveLogByReceiveNo } from '@/api/finance/giftCard'
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
  components: {
    orderImgTable,
  },
  data() {
    return {
      dialogTableVisible: false,
      tableDataList: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogTableVisible = this.visible
        if (val) {
          this.getReceiveLogByReceiveNo()
        }
      }
    },
    dialogTableVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    async getReceiveLogByReceiveNo() {
      const res = await getReceiveLogByReceiveNo({ receiveNo: this.applyId })
      this.tableDataList = res.data
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
  .blue {
    color: #1890ff;
  }
}
</style>