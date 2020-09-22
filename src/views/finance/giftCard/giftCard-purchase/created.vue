<template>
  <div class="app-centre">
    <span>创建 Gift Card 采购单</span>
    <div class="centent-header">
      <div class="title">
        选择事业群:
        <span>{{purchase.businessGroup}}</span>
        选择支付公司:
        <span>{{purchase.payer}}</span>
        选择国家:
        <span>{{purchase.country}}</span>
        选择支付币种:
        <span>{{purchase.currency}}</span>
      </div>
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
            <span style="color:#f00">{{selectDataList.length}}</span>项目
            <el-button size="mini" type="primary" @click="createdClick">创建采购单</el-button>
          </div>
          <div class="search-input">
            <el-input
              size="mini"
              placeholder="请输入单号"
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
          ref="multipleTable"
          :height="tableHeight"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="申请单" prop="applyNo" />
          <el-table-column label="申请时间" prop="applyDate" />
          <el-table-column label="事业部" prop="department" />
          <el-table-column label="申请人" prop="createUserName" />
          <el-table-column label="预计金额(￥)" prop="total" />
          <el-table-column label="适用站点" prop="country" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="detailsClick(scope.row)">详情</el-button>
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
    <!-- 详情 和创建弹框 -->
    <div class="appGift">
      <el-dialog :visible.sync="dialogTableVisible" width="60%" v-if="dialogTableVisible">
        <div slot="title" class="title flex">
          <span>
            <template v-if="isParticular">申请单明细</template>
            <template v-else>新建 Gift Card 采购单</template>
          </span>
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
            <template v-if="isParticular">
              <span>申请单号：{{apply.applyNo}}</span>
              <span>事业部：{{apply.department}}</span>
              <span>申请人：{{apply.createUserName}}</span>
            </template>
            <template v-else>
              <span>选择事业群:{{purchase.businessGroup}}</span>
              <span>选择支付公司:{{purchase.payer}}</span>
              <span>选择支付币种:{{purchase.currency}}</span>
            </template>
          </div>
          <span>
            <span
              v-if="!isParticular"
              style="margin-right: 20px"
            >已经选择申请单个数：{{selectDataList.length}}</span>
            本次预计使用额度：
            <span style="color:#37c4a8">￥{{limitTotal.toFixed(2)}}</span>
          </span>
        </div>
        <div class="table">
          <el-table
            v-loading="loading"
            key="1"
            :data="createdDataList"
            max-height="450"
            :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
            class="data-table"
            style="width: 100%"
          >
            <template v-if="isParticular">
              <el-table-column label="使用站点" prop="country"></el-table-column>
              <el-table-column label="Gift Card 币种" prop="currency"></el-table-column>
              <el-table-column label="Gift Card 面额" prop="unitPrice"></el-table-column>
              <el-table-column label="数量" prop="totalAmount"></el-table-column>
              <el-table-column label="金额（站点）" prop="originalTotal"></el-table-column>
              <el-table-column label="参考汇率" prop="rate"></el-table-column>
              <el-table-column label="使用额度（人民币）" prop="total"></el-table-column>
            </template>
            <template v-else>
              <el-table-column label="申请单号" prop="applyNo" />
              <el-table-column label="申请时间" prop="applyDate" />
              <el-table-column label="事业部" prop="department" />
              <el-table-column label="申请人" prop="createUserName" />
              <el-table-column label="预计金额(￥)" prop="total" />
              <el-table-column label="适用站点" prop="country" />
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <a @click="dele(scope)">
                    <i class="el-icon-delete-solid icon"></i>
                  </a>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <!-- 新建 Gift Card 采购单 -->
        </div>
        <div class="foold" v-if="!isParticular">
          <el-button
            size="mini"
            type="primary"
            @click="submit"
            :disabled="this.loading || createdDataList.length===0"
          >提交</el-button>
          <el-button size="mini" @click="dialogTableVisible=false" :disabled="this.loading">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 采购单创建成功弹框 -->
    <el-dialog :visible.sync="dialogVisible" width="20%">
      <div class="succeed">
        <p class="title">
          <i class="el-icon-success"></i> 采购单创建成功
        </p>
        <p>采购单号：<span>{{info.purchaseNo}}</span></p>
        <p>预计付款金额：<span>{{info.total}}</span></p>
        <p>选择事业群:<span>{{purchase.businessGroup}}</span></p>
        <p>选择支付公司:<span>{{purchase.payer}}</span></p>
        <p>选择支付币种:<span>{{purchase.currency}}</span></p>
      </div>
      <div class="footer">
        <el-button type="primary" size="mini" @click="detailsClicks">查看采购单详情</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getApplyList, getIdleApplyList, getApplyItem, addPurchase, exportIdleApplyList } from '@/api/finance/giftCard';
import fullScreenForContainer from '@/mixins/fullScreenForContainer';
import tableHeight from '@/mixins/tableHeight';
import mixins from '@/mixins';
export default {
  components: {

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
      topHeight: 320,//除表格高度外的内容高度
      dialogVisible: false,
      tableDataList: [],
      createdDataList: [],
      selectDataList: [],
      loading: false,
      search: '',
      time: [],
      params: {},
      createDateStart: '',
      createDateEnd: '',
      isParticular: false,
      apply: {},
      SelectionList: [],
      quotaBy: {},
      dialogTableVisible: false,
      conditionVisible: false,
      info: {},
      purchase: {}
    }
  },
  mixins: [fullScreenForContainer, tableHeight, mixins],
  created() {
    this.purchase = this.$route.query
    this.getIdleApplyList()
    //  this.getStatisticsByUserId()
  },
  computed: {
    limitTotal() {
      let num = 0
      this.createdDataList.forEach(val => {
        num += val.total
      })
      return num
    }
  },
  methods: {
    async getIdleApplyList() {
      let params = {
        businessGroup: this.purchase.businessGroup,
        country: this.purchase.country,
        ...this.params,
        ...this.pages
      };
      this.loading = true;
      const res = await getIdleApplyList(params);
      this.tableDataList = res.data.rows;
      this.pages.total = res.data.total;
      this.loading = false;
    },
    async getStatisticsByUserId() {
      const res = await getStatisticsByUserId({})
      this.quotaBy = res.data
    },
    giftCardChange() {
      this.getIdleApplyList()
    },
    succeedCreated() {//创建成功
      this.getIdleApplyList()
    },
    changeTime(val) {//时间选择
      if (val) {
        this.params = { createDateStart: val[0], createDateEnd: val[1] }
      } else {
        this.params = {}
      }
      this.getIdleApplyList()
    },
    handleFilterChange() {

    },
    searchClick() {//搜索
      this.params.applyNo = this.search
      this.getIdleApplyList()
    },
    // 数据分页每页数据变化
    handleSizeChange(pageSize) {
      this.pages.limit = pageSize
      this.getIdleApplyList()
    },
    // 选择第几页
    handleCurrentChange(currentPage) {
      this.pages.page = currentPage
      this.getIdleApplyList()
    },
    handleSelectionChange(val) {//勾选
      this.selectDataList = val
    },
    createdClick() {//创建
      this.isParticular = false
      this.dialogTableVisible = true
      this.createdDataList = this.selectDataList
    },
    async detailsClick(row) {//详情
      this.apply = row
      this.dialogTableVisible = true
      this.isParticular = true
      this.createdDataLis = []
      const res = await getApplyItem({ applyId: row.id })
      this.createdDataList = res.data.itemList
    },
    dele(scope) {//删除
      this.$refs.multipleTable.toggleRowSelection(scope.row);
      this.createdDataList.splice(scope.$index, 1)
    },
    async submit() {//创建提交
      const arr = []
      this.createdDataList.forEach(item => {
        arr.push(item.id)
      })
      const params = {
        applyIdList: arr,
        businessGroup: this.purchase.businessGroup,
        payer: this.purchase.payer,
        currency: this.purchase.currency
      }
      this.loading = true;
      const res = await addPurchase(params)
      this.loading = false;
      if (res.resCode === 400) {
        this.$message.error(res.resDes);
        return
      }
      this.info = res.data
      this.dialogVisible = true
      this.dialogTableVisible = false
      this.getIdleApplyList()
    },
    detailsClicks() {//查看采购单详情
      const query = {
        purchaseId: this.info.id,
        purchaseNo: this.info.purchaseNo,
        createDate: this.info.createDate,
        createUserName: this.info.createUserName,
        statusStr: this.info.statusStr,
        businessGroup: this.purchase.businessGroup,
        payer: this.purchase.payer,
        country: this.purchase.country,
        currency: this.purchase.currency
      }
      const router = this.$router.resolve({ path: 'details', query })
      window.open(router.href, '_blank');
      this.dialogVisible = false
    },
    async exportExcel() { // 表格导出
      const form = {
        businessGroup: this.purchase.businessGroup,
        currency: this.purchase.currency,
        ...this.params
      };
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
      const res = await exportIdleApplyList(form).catch(() => loading.close());
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
  }
}
</script>
<style lang="scss" scoped>
.app-centre {
  .centent-header {
    margin: 20px 0;
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
  .succeed {
    text-align: center;
    span {
      color: #666;
    }
    .title {
      font-size: 22px;
      i {
        color: #13b25c;
        font-size: 26px;
      }
    }
  }
  .footer {
    margin-top: 45px;
    text-align: center;
  }
}
</style>
