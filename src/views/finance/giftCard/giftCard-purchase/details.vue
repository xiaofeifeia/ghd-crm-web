<template>
  <div class="app-centre">
    <span>Gift Card 采购单详情</span>
    <div class="centent-header">
      <div class="title">
        采购单号：
        <span>{{info.purchaseNo}}</span>
        创建时间：
        <span>{{info.createDate}}</span>
        状态：
        <span>{{info.statusStr}}</span>
        选择事业群：
        <span>{{info.businessGroup}}</span>
        选择支付公司：
        <span>{{info.payer}}</span>
        选择支付币种：
        <span>{{info.currency}}</span>
      </div>
      <div>
        <a @click="toggleFullScreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />全屏展示
        </a>
        <span v-if="activeName==='1'">
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
        </span>
        <el-divider direction="vertical" />
        <span>总共{{ pages.total }}条数据</span>
      </div>
    </div>
    <div class="table">
      <el-card>
        <div class="search">
          <div class="tabs">
            <el-tabs v-model="activeName">
              <el-tab-pane label="关联的申请单" name="1" />
              <el-tab-pane label="Gift Card详情" name="2" />
            </el-tabs>
          </div>
          <div class="search-input">
            <el-input
              v-if="activeName==='1'"
              size="mini"
              placeholder="请输入采购单号"
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
          key="1"
          :data="tableDataList"
          :height="tableHeight"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          style="width: 100%"
        >
          <template v-if="activeName==='2'">
            <el-table-column label="使用站点" prop="country"></el-table-column>
            <el-table-column label="Gift Card 币种" prop="currency"></el-table-column>
            <el-table-column label="Gift Card 面额" prop="unitPrice"></el-table-column>
            <el-table-column label="数量" prop="totalAmount"></el-table-column>
            <el-table-column label="金额（站点）" prop="originalTotal"></el-table-column>
            <el-table-column label="参考汇率" prop="rate"></el-table-column>
            <el-table-column label="使用额度（人民币）" prop="total"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="CodeDialog(scope.row)">查看Code</el-button>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column label="申请单号" prop="applyNo" />
            <el-table-column label="申请时间" prop="applyDate" />
            <el-table-column label="事业部" prop="department" />
            <el-table-column label="申请人" prop="createUserName" />
            <el-table-column label="预计金额" prop="total" />
            <el-table-column label="适用站点" prop="country" />
            <el-table-column label="领用情况" prop="receivePercentStr" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="detailsClick(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </template>
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
    <div class="appGift">
      <el-dialog :visible.sync="detailsDialog" width="60%" v-if="detailsDialog">
        <div slot="title" class="title flex">
          <span>申请单明细</span>
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
          <div>
            <template>
              <span>申请单号：{{detailInfo.purchaseNo}}</span>
              <span>事业部：{{detailInfo.department}}</span>
              <span>申请人：{{detailInfo.createUserName}}</span>
            </template>
          </div>
          <span>
            本次预计使用额度：
            <span style="color:#37c4a8">￥{{limitTotal.toFixed(2)}}</span>
          </span>
        </div>
        <div class="table">
          <!-- 申请明细表格 -->
          <el-table
            v-loading="msloading"
            key="1"
            :data="detailsDataList"
            max-height="450"
            :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
            class="data-table"
            style="width: 100%"
          >
            <el-table-column label="使用站点" prop="country"></el-table-column>
            <el-table-column label="Gift Card 币种" prop="currency"></el-table-column>
            <el-table-column label="Gift Card 面额" prop="unitPrice"></el-table-column>
            <el-table-column label="数量" prop="totalAmount" width="90"></el-table-column>
            <el-table-column label="金额（站点）" prop="originalTotal"></el-table-column>
            <el-table-column label="参考汇率" prop="rate"></el-table-column>
            <el-table-column label="使用额度（人民币）" prop="total"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="CodeDialog(scope.row)">查看 Code</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <examineCode :visible.sync="isCodeDialog" :CodeData="CodeData" />
  </div>
</template>
<script>
import {
  getApplyListByPurchaseId,
  getItemList,
  getApplyItem,
  exportItemList
} from '@/api/finance/giftCard';
import fullScreenForContainer from '@/mixins/fullScreenForContainer';
import examineCode from '../giftCard-get/examineCode';
import tableHeight from '@/mixins/tableHeight';
import mixins from '@/mixins';
export default {
  components: {
    examineCode
  },
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
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 320,
      topHeight: 320, // 除表格高度外的内容高度
      isCodeDialog: false,
      activeName: '1',
      tableDataList: [],
      detailsDataList: [],
      loading: false,
      msloading: false,
      search: '',
      time: [],
      params: {},
      createDateStart: '',
      createDateEnd: '',
      detailsDialog: false,
      info: {},
      detailInfo: {}, // 明细
      CodeData: {}
    }
  },
  mixins: [fullScreenForContainer, tableHeight, mixins],
  created() {
    console.log("111");
    if (this.$route.query) {
      this.info = this.$route.query;
    }
    this.getApplyListByPurchaseId()
  },
  watch: {
    activeName(val) {
      if (val === '1') {
        this.getApplyListByPurchaseId()
      } else {
        this.getItemList()
      }
    }
  },
  computed: {
    limitTotal() {
      let num = 0
      this.detailsDataList.forEach(val => {
        num += val.total
      })
      return num
    }
  },
  methods: {
    async getApplyListByPurchaseId() { // 关联的申请单
      const params = {
        businessGroup: this.info.businessGroup,
        purchaseId: this.info.purchaseId,
        ...this.params,
        ...this.pages
      }
      this.loading = true
      const res = await getApplyListByPurchaseId(params)
      this.tableDataList = res.data.rows
      this.pages.total = res.data.total
      this.loading = false
    },
    async getItemList() { // card 详情
      const params = {
        businessGroup: this.info.businessGroup,
        purchaseId: this.info.purchaseId,
        ...this.params,
        ...this.pages
      }
      this.loading = true
      const res = await getItemList(params)
      this.tableDataList = res.data.rows
      this.detailsDataList = res.data.rows
      this.pages.total = res.data.total
      this.loading = false
    },
    giftCardChange() {
      this.getApplyListByPurchaseId()
    },
    changeTime(val) { // 时间选择
      if (val) {
        this.params = { createDateStart: val[0], createDateEnd: val[1] }
      } else {
        this.params = {}
      }
      this.getApplyListByPurchaseId()
    },
    async detailsClick(row) {
      this.detailInfo.purchaseNo = row.purchaseNo
      this.detailInfo.department = row.department
      this.detailInfo.createUserName = row.createUserName
      const params = {
        applyId: row.id
      }
      this.msloading = true
      const res = await getApplyItem(params)
      this.detailsDataList = res.data.itemList
      this.msloading = false
      this.detailsDialog = true
    },
    searchClick() { // 搜索
      this.params.applyNo = this.search
      this.getApplyListByPurchaseId()
    },
    // 数据分页每页数据变化
    handleSizeChange(pageSize) {
      this.pages.limit = pageSize
      if (this.activeName === '1') {
        this.getApplyListByPurchaseId()
      } else {
        this.getItemList()
      }
    },
    // 选择第几页
    handleCurrentChange(currentPage) {
      this.pages.page = currentPage
      if (this.activeName === '1') {
        this.getApplyListByPurchaseId()
      } else {
        this.getItemList()
      }
    },
    CodeDialog(row) { // 查看code
      this.CodeData.unitPrice = row.unitPrice
      this.CodeData.country = row.country
      this.CodeData.totalAmount = row.totalAmount
      this.CodeData.codeList = row.giftCodeList
      this.isCodeDialog = true
    },
    async exportExcel() { // 表格导出
      const loading = this.$loading({
        lock: true,
        text: '导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
      if (this.activeName === '1') {
        const params = {
          businessGroup: this.info.businessGroup,
          purchaseId: this.info.purchaseId,
          ...this.params,
          page: 1,
          limit: 10000
        };

        let tHeader = ['申请单号', '申请时间', '事业部', '申请人', '预计金额', '适用站点', '领用情况']
        let filterVal = ['purchaseNo', 'applyDate', 'department', 'createUserName', 'total', 'country', 'receivePercentStr']
        let res = await getApplyListByPurchaseId(params).catch(() => loading.close())
        let data = this.formatJson(filterVal, res.data.rows);
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
            header: tHeader, // 表头 必填
            data, // 具体数据 必填
            filename: this.activeName === '1' ? 'Gift Card 采购-关联的申请单' : 'Gift Card 采购-Gift Card详情', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx' // 非必填
          })
        });
        loading.close();
      } else {
        const data = {purchaseId: this.info.purchaseId};
        const res = await exportItemList(data).catch(() => loading.close());
        if(res.data.type === 'application/json') {
          // 导出报错
          loading.close();
          const reader = new FileReader();
          reader.onload = function () {
            let baseReturnVO = JSON.parse(reader.result);
            alert(baseReturnVO.resDes);
          };
          reader.readAsText(res.data);
          return;
        }
        const filename = decodeURI(res.headers['content-disposition'].split('filename=')[1]);
        loading.close();
        this.funDownload({
          content: res.data,
          filename: filename
        });
      }
    },
    formatJson(val, dataList) {
      return dataList.map(v => val.map(j => v[j]));
    }
  }
}
</script>
<style lang="scss">
.tabs {
  height: 30px;
  .el-tabs .el-tabs__active-bar {
    display: none !important;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.app-centre {
  .centent-header {
    margin-top: 25px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 12px;
    .title {
      font-size: 14px;
      margin-top: 5px;
      span {
        color: #999;
        margin-right: 5px;
      }
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
  .appGift {
    .flex {
      display: flex;
      margin-bottom: 10px;
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
    .table {
      .icon {
        color: #f00;
        font-size: 18px;
      }
    }
    .foold {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
