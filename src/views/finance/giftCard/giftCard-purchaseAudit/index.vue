<template>
  <div class="app-centre">
    <span>Gift Card 采购单审批</span>
    <div class="centent-header">
      <div></div>
      <div>
        <a @click="toggleFullScreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />全屏展示
        </a>
        <el-divider direction="vertical" />
        <i class="el-icon-time" style="font-size:16px;"></i> 时间段选择
        <el-date-picker
          class="timeDate"
          v-model="time"
          size="mini"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          @change="changeTime"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-divider direction="vertical" />
        <span>总共{{ pages.total }}条数据</span>
      </div>
    </div>
    <div class="table">
      <el-card>
        <div class="search">
          <div style="font-size:14PX">
            已选择
            <span style="color:#f00">{{SelectionList.length}}</span>项目
            <el-button
              :disabled="this.loading || SelectionList.length===0"
              size="mini"
              type="primary"
              @click="batchPass(SelectionList)"
            >批量通过</el-button>
            <el-button
              :disabled="this.loading || SelectionList.length===0"
              size="mini"
              type="danger"
              @click="batchReject(SelectionList)"
            >批量驳回</el-button>
          </div>
          <div class="search-input">
            <el-input
              size="mini"
              placeholder="请输入申请单号"
              @keyup.native.enter="searchClick"
              v-model.trim="search"
              class="input-with-select input"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
            </el-input>
            <el-button size="mini" type="primary" @click="exportExcel">导出表格</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="tableDataList"
          :height="tableHeight"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="isSelectable" />
          <el-table-column label="采购单号" prop="purchaseNo" />
          <el-table-column label="申请时间" prop="createDate" />
          <el-table-column label="状态" prop="statusStr" />
          <el-table-column label="事业群" prop="businessGroup" />
          <el-table-column label="支付账户" prop="payer" />
          <el-table-column label="预计使用额度(￥)" prop="total" />
          <el-table-column label="适用站点" prop="country" />
          <el-table-column label="领取情况" prop="receivePercentStr">
            <template slot-scope="{row}">
              <span v-if="row.status===7||row.status===8">{{row.receivePercentStr}}</span>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="235">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="detailsClick(scope.row)">详情</el-button>
              <el-button
                :disabled="this.loading"
                size="mini"
                type="primary"
                v-if="scope.row.isAuditor==1"
                @click="batchPass([scope.row.id])"
              >通过</el-button>
              <el-button
                :disabled="this.loading"
                size="mini"
                type="danger"
                v-if="scope.row.isAuditor==1"
                @click="batchReject([scope.row.id])"
              >驳回</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-size.sync="pages.pageSize"
            :current-page.sync="pages.pageNum"
            :total="pages.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  purchaseGetAuditList,
  giftcardPurchaseReject,
  giftcardPurchaseBatchPass,
} from '@/api/finance/giftCard'
import fullScreenForContainer from '@/mixins/fullScreenForContainer'
import tableHeight from '@/mixins/tableHeight'
export default {
  data() {
    return {
      pages: {
        total: 0,
        page: 1,
        limit: 10
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 300,
      topHeight: 300,//除表格高度外的内容高度
      tableDataList: [],
      loading: false,
      search: '',
      time: [],
      params: {},
      createDateStart: '',
      createDateEnd: '',
      SelectionList: [],
    }
  },
  mixins: [fullScreenForContainer, tableHeight],
  watch: {
    screenGiftCard() {

    }
  },
  created() {
    this.purchaseGetAuditList()
  },
  methods: {
    async purchaseGetAuditList() {
      let params = {
        ...this.params,
        ...this.pages
      }
      this.loading = true
      const res = await purchaseGetAuditList(params)
      this.tableDataList = res.data.rows
      this.pages.total = res.data.total
      this.loading = false
    },
    changeTime(val) {//时间选择
      if (val) {
        this.params = { createDateStart: val[0], createDateEnd: val[1] }
      } else {
        this.params = {}
      }
      this.purchaseGetAuditList()
    },
    handleFilterChange() {

    },
    isSelectable(row) {
      if (row.isAuditor === 1) {
        return true
      } else {
        return false
      }
    },
    detailsClick(row) {
      const query = {
        purchaseId: row.id,
        purchaseNo: row.purchaseNo,
        createDate: row.createDate,
        statusStr: row.statusStr,
        businessGroup: row.businessGroup,
        country: row.country,
        currency: row.currency,
        payer: row.payer
      }
      const router = this.$router.resolve({ path: 'giftCard-purchase/details', query })
      window.open(router.href, '_blank');
    },
    searchClick() {//搜索
      this.params.purchaseNo = this.search
      this.purchaseGetAuditList()
    },
    // 数据分页每页数据变化
    handleSizeChange(pageSize) {
      this.pages.limit = pageSize
      this.purchaseGetAuditList()
    },
    // 选择第几页
    handleCurrentChange(currentPage) {
      this.pages.page = currentPage
      this.purchaseGetAuditList()
    },
    handleSelectionChange(val) {
      const arr = []
      val.forEach(item => {
        arr.push(item.id)
      })
      this.SelectionList = arr;
    },
    async batchPass(arrId) {//通过
      this.loading = true;
      const res = await giftcardPurchaseBatchPass({ purchaseIdList: arrId })
      this.loading = false;
      this.purchaseGetAuditList()
    },
    async batchReject(arrId) {//驳回
      this.loading = true;
      const res = await giftcardPurchaseReject({ purchaseIdList: arrId })
      this.loading = false;
      this.purchaseGetAuditList()
    },
    async exportExcel() {//表格导出
      let params = {
        ...this.params,
        page: 1,
        limit: 10000
      }
      const loading = this.$loading({
        lock: true,
        text: '导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const tHeader = ["采购单号", "申请时间", "状态", "事业群", "支付账户", "预计使用额度", "适用站点", "领取情况"]
      const filterVal = ["purchaseNo", "createDate", "statusStr", "businessGroup", "payer", "total", "country", "receivePercentStr"]
      const res = await purchaseGetAuditList(params).catch(() => loading.close())
      const data = this.formatJson(filterVal, res.data.rows);
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: 'Gift Card 采购单审批', //非必填
          autoWidth: true, //非必填
          bookType: 'xlsx' //非必填
        })
      })
      loading.close()
    },
    formatJson(val, dataList) {
      return dataList.map(v => val.map(j => {
        return v[j];
      }));
    },
  }
}
</script>
<style lang="scss" scoped>
.app-centre {
  .centent-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 12px;
    & >>> .filter .fil-w {
      right: 0px;
    }
    & >>> .handle-btn {
      color: #333333;
      font-size: 12px;
    }
    .timeDate {
      width: 210px;
    }
  }
  .table {
    .search {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .search-input {
        display: flex;
        .input {
          margin-right: 20px;
          width: 300px;
        }
      }
    }
    .pagination {
      text-align: right;
      margin: 10px 0;
    }
  }
}
</style>
