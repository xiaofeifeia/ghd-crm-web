<template>
  <div class="app-centre">
    <span>Gift Card 申请管理</span>
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
      <div>
        <el-button size="mini" type="primary" @click="createdDialog=true">新建申请</el-button>
      </div>
      <div>
        <a @click="toggleFullScreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />全屏展示
        </a>
        <template v-if="byUserList.length>1">
          <el-divider direction="vertical" />
          <i class="el-icon-notebook-2" style="font-size:16px;"></i>组别
          <el-select v-model="byUserId" placeholder="请选择" size="mini" @change="byUserChange">
            <el-option
              v-for="(item , index) in byUserList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>
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
          <div style="font-size:14PX"></div>
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
        >
          <el-table-column label="申请单号" prop="applyNo" />
          <el-table-column label="申请时间" prop="applyDate" />
          <el-table-column label="状态" prop="statusStr" align="center">
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
          <el-table-column label="当前未操作人" width="220px">
            <template slot-scope="{row}">
              <div>{{row.currentAuditor}}</div>
              <div>流转时间:{{row.flowTime ? row.flowTime : '无'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="预计使用额度(￥)" prop="total" />
          <el-table-column label="适用站点" prop="country" />
          <el-table-column label="领取情况" prop="receivePercentStr">
            <template slot-scope="{row}">
              <span v-if="row.status===4||row.status===5">{{row.receivePercentStr}}</span>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="detailsClick(scope.row.id)">详情</el-button>
              <el-button
                v-if="scope.row.status===1||scope.row.status===2"
                size="mini"
                type="danger"
                @click="giftcardApplyRevoke(scope.row)"
              >撤回</el-button>
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
    <created
      :visible.sync="createdDialog"
      v-if="createdDialog"
      :freeQuota="quotaBy.freeQuota"
      :quotaId="byUserId"
      @succeedCreated="succeedCreated"
    />
    <details-apply :visible.sync="detailsDialog" :applyId="applyId" />
  </div>
</template>
<script>
import detailsApply from './details'
import created from './created'
import {
  getList,
  getDeptQuotaById,
  giftcardApplyRevoke,
  getQuotaListByUserId
} from '@/api/finance/giftCard'
import fullScreenForContainer from '@/mixins/fullScreenForContainer'
import tableHeight from '@/mixins/tableHeight'
export default {
  components: {
    created,
    detailsApply
  },
  data() {
    return {
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 450,
      topHeight: 450,//除表格高度外的内容高度
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
      tableDataList: [],
      loading: false,
      search: '',
      time: [],
      params: {},
      createDateStart: '',
      createDateEnd: '',
      createdDialog: false,
      detailsDialog: false,
      applyId: null,
      SelectionList: [],
      quotaBy: {},
      statusModel: "",
      byUserId: null,
      byUserList: []
    }
  },
  mixins: [fullScreenForContainer, tableHeight],
  watch: {
    screenGiftCard() {

    }
  },
  created() {
    this.getQuotaListByUserId()
  },
  methods: {
    async getList() {
      let params = {
        ...this.params,
        ...this.pages,
        quotaId: this.byUserId
      }
      this.loading = true
      const res = await getList(params)
      this.tableDataList = res.data.rows
      this.pages.total = res.data.total
      this.loading = false
    },
    async getDeptQuotaById() {
      const res = await getDeptQuotaById({ quotaId: this.byUserId })
      this.quotaBy = res.data
    },
    async getQuotaListByUserId() {
      const res = await getQuotaListByUserId({})
      this.byUserList = res.data
      this.byUserId = res.data[0].id
      this.getList()
      this.getDeptQuotaById()
    },
    byUserChange() {
      this.getList()
      this.getDeptQuotaById()
    },
    giftcardApplyRevoke(row) {
      this.$confirm(`是否确定撤回申请单${row.applyNo}?`, '撤回申请单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await giftcardApplyRevoke({ applyId: row.id });
        this.$message.success(res.data);
        this.getList();
        this.getDeptQuotaById();
      })
    },
    succeedCreated() {//创建成功
      this.getDeptQuotaById()
      this.getList()
    },
    changeTime(val) {//时间选择
      if (val) {
        this.params = { createDateStart: val[0], createDateEnd: val[1] }
      } else {
        this.params = {}
      }
      this.getList()
    },
    handleFilterChange() {

    },
    statusChange(val) {//状态
      this.params.status = val
      this.getList()
    },
    detailsClick(id) {
      this.applyId = id
      this.detailsDialog = true
    },
    searchClick() {//搜索
      this.params.applyNo = this.search
      this.getList()
    },
    // 数据分页每页数据变化
    handleSizeChange(pageSize) {
      this.pages.limit = pageSize
      this.getList()
    },
    // 选择第几页
    handleCurrentChange(currentPage) {
      this.pages.page = currentPage
      this.getList()
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
      const tHeader = ['申请单号', '申请时间', '状态', '当前未操作人', '预计使用额度(￥)', '适用站点', '领取情况']
      const filterVal = ['applyNo', 'applyDate', 'statusStr', 'currentAuditor', 'total', 'country', 'receivePercentStr']
      const res = await getList(params).catch(() => loading.close())
      const data = this.formatJson(filterVal, res.data.rows);
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: 'Gift Card 申请管理', //非必填
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
    margin: 20px 0;
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
