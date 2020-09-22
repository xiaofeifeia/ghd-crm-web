<template>
  <div class="app-centre">
    <span>Gift Card 审批管理</span>
    <div class="box">
      <ul>
        <li>
          <p>本月可用额度</p>
          <span>￥{{quotaBy.freeQuota}}</span>
        </li>
        <li>
          <p>本月已用额度</p>
          <span>￥{{quotaBy.usedQuota}}</span>
        </li>
        <li>
          <p>审批中 Gift Card 金额</p>
          <span>￥{{quotaBy.auditingQuota}}</span>
        </li>
        <li>
          <p>待领取 Gift Card 金额</p>
          <span>￥{{quotaBy.unclaimedQuota}}</span>
        </li>
      </ul>
    </div>
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
      <el-card ref="card">
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
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          :height="tableHeight"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="isSelectable" />
          <el-table-column label="申请单号" prop="applyNo" mini-width="140" />
          <el-table-column label="申请时间" prop="applyDate" mini-width="155" />
          <el-table-column label="状态" prop="statusStr" align="center" width="160">
            <template slot="header">
              <el-select v-model="statusModel" placeholder="请选择" size="mini" @change="statusChange">
                <el-option label="全部状态" value />
                <el-option label="已撤回" value="-2" />
                <el-option label="已驳回" value="-1" />
                <el-option label="新建" value="0" />
                <el-option label="待事业部负责人审批" value="1" />
                <el-option label="待生成采购单" value="2" />
                <el-option label="采购单审批中" value="3" />
                <el-option label="待导入" value="6" />
                <el-option label="待领取" value="4" />
                <el-option label="全部领取" value="5" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="申请人" prop="createUserName" />
          <el-table-column label="预计使用额度（￥）" prop="total" mini-width="170" />
          <el-table-column label="适用站点" prop="country" />
          <el-table-column label="领取情况" prop="receivePercentStr">
            <template slot-scope="{row}">
              <span v-if="row.status===4||row.status===5">{{row.receivePercentStr}}</span>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="235">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="detailsClick(scope.row.id)">详情</el-button>
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
    <details-apply :visible.sync="detailsDialog" :applyId="applyId" />
  </div>
</template>
<script>
import detailsApply from './details'
import {
  getAuditList,
  giftcardApplyBatchReject,
  giftcardApplyBatchPass,
  giftcardApplyBatchRevoke,
  getStatisticsByUserId
} from '@/api/finance/giftCard'
import fullScreenForContainer from '@/mixins/fullScreenForContainer'
import tableHeight from '@/mixins/tableHeight'
export default {
  components: {
    detailsApply
  },
  data() {
    return {
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 450,
      topHeight: 450,//除表格高度外的内容高度
      quotaBy: {},
      pages: {
        sortName: '',
        sortType: '',
        total: 0,
        page: 1,
        limit: 10
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      tableDataList: [],
      loading: false,
      search: '',
      time: [],
      params: {},
      createDateStart: '',
      createDateEnd: '',
      detailsDialog: false,
      statusModel: '',
      applyId: null,
      SelectionList: [],
      timer: false
    }
  },
  mixins: [fullScreenForContainer, tableHeight],
  watch: {
    screenGiftCard() {

    }
  },
  created() {
    this.getAuditList()
    this.getStatisticsByUserId()
  },
  methods: {
    async getAuditList() {
      const params = {
        ...this.params,
        ...this.pages
      }
      this.loading = true
      const res = await getAuditList(params)
      this.tableDataList = res.data.rows
      this.pages.total = res.data.total
      this.loading = false
    },
    async getStatisticsByUserId() {
      const res = await getStatisticsByUserId({})
      this.quotaBy = res.data
    },
    changeTime(val) { // 时间选择
      if (val) {
        this.params = { createDateStart: val[0], createDateEnd: val[1] }
      } else {
        this.params = {}
      }
      this.getAuditList()
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
    statusChange(val) { // 状态
      this.params.status = val
      this.getAuditList()
    },
    detailsClick(id) {
      this.applyId = id
      this.detailsDialog = true
    },
    searchClick() { // 搜索
      this.params.applyNo = this.search
      this.getAuditList()
    },
    // 数据分页每页数据变化
    handleSizeChange(pageSize) {
      this.pages.limit = pageSize
      this.getAuditList()
    },
    // 选择第几页
    handleCurrentChange(currentPage) {
      this.pages.page = currentPage
      this.getAuditList()
    },
    handleSelectionChange(val) {
      const arr = []
      val.forEach(item => {
        arr.push(item.id)
      })
      this.SelectionList = arr;
    },
    async batchPass(arrId) { // 通过
      this.loading = true;
      const res = await giftcardApplyBatchPass({ applyIdList: arrId })
      if (res.resCode === 400) {
        this.$message.warning(res.resDes);
      }
      this.loading = false;
      this.getAuditList()
    },
    async batchReject(arrId) { // 驳回
      const res = await giftcardApplyBatchReject({ applyIdList: arrId })
      if (res.resCode === 400) {
        this.$message.warning(res.resDes);
      }
      this.getAuditList()
    },
    async batchRevoke(arrId) { // 撤销
      if (arrId.length > 0) {
        const res = await giftcardApplyBatchRevoke({ applyIdList: arrId })
        this.getAuditList()
      } else {
        this.$message.warning('请先勾选数据');
      }
    },
    async exportExcel() { // 表格导出
      const params = {
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
      const tHeader = ['申请单号', '申请时间', '状态', '申请人', '预计使用额度（￥）', '适用站点', '领取情况']
      const filterVal = ['applyNo', 'applyDate', 'statusStr', 'createUserName', 'total', 'country', 'receivePercentStr']
      const res = await getAuditList(params).catch(() => loading.close())
      const data = this.formatJson(filterVal, res.data.rows);
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'Gift Card 审批管理', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
      loading.close()
    },
    formatJson(val, dataList) {
      return dataList.map(v => val.map(j => v[j]));
    }
  }
}
</script>
<style lang="scss" scoped>
.app-centre {
  .data-table {
    height: 100vh;
  }
  .box {
    ul {
      display: flex;
      padding-left: 0;
      li {
        list-style: none;
        border: 1px solid #dad7d7;
        margin: 0 5px;
        width: 250px;
        height: 120px;
        padding: 10px 30px;
        p {
          color: #999;
        }
        span {
          font-size: 28px;
        }
        &:hover {
          box-shadow: 0 0 0 3px #1abc9c;
        }
      }
    }
  }
  .centent-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 12px;
    i.my-filter {
      width: 14px;
      height: 14px;
      display: inline-block;
      background: url("../../../../assets/img/icon-filter.png");
      background-size: contain;
    }
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
