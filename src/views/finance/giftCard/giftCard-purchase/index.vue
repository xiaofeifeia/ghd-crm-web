<template>
  <div class="app-centre">
    <span>Gift Card 采购管理</span>
    <div class="box">
      <ul>
        <li>
          <p>待导入 Code 采购单</p>
          <span>{{Info.waitImportCount}}</span>
        </li>
        <li>
          <p>待领取 Code 金额（人民币）</p>
          <span>￥{{Info.idleTotal}}</span>
        </li>
        <li>
          <p>本月已采购 Gift Card 金额</p>
          <span>￥{{Info.totalCurrentMonth}}</span>
        </li>
      </ul>
    </div>
    <div class="centent-header">
      <div>
        <el-badge is-dot :hidden="businessGroups.MBG.count===0&&businessGroups.DBG.count===0&&businessGroups.ABG.count===0">
          <el-button size="mini" type="primary" @click="dialogVisible=true;purchase={}">新建采购单</el-button>
        </el-badge>&nbsp;当前未处理申请单详情：
        MBG<span style="color:#f00">{{businessGroups.MBG.count}}</span> 条，
        DBG<span style="color:#f00">{{businessGroups.DBG.count}}</span> 条，
        ABG<span style="color:#f00">{{businessGroups.ABG.count}}</span> 条
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
          <div style="font-size:14px">
            <span>
              已选择
              <span style="color:#f00">{{SelectionList.length}}</span>项目
            </span>
            <div style="display: inline-block">
              <div class="uploadButton">
                <el-upload :action="action" name="excel" :show-file-list="false" :headers="headers"
                  :data="{userId: getUserId(),purchaseIdList:SelectionList.join(',')}"
                  :limit="1" :key="uploadKey"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  :on-success="uploadSuccess" :before-upload="handleBeforeUpload" :on-error="uploadError">
                  <el-button size="mini" type="primary" :disabled="SelectionList.length===0">批量导入 Code</el-button>
                </el-upload>
              </div>
              <div class="uploadButton" style="margin-left: 10px">
                <el-button size="mini" type="primary" @click="uploadtemplate">下载导入模板</el-button>
                <el-button :disabled="SelectionList.length===0" size="mini" type="primary" @click="exporClick">批量标记为已导出</el-button>
              </div>
            </div>
          </div>
          <div class="search-input">
            <el-input
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
          :data="tableDataList"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="isSelectable" />
          <el-table-column label="采购单号" prop="purchaseNo" min-width="110" />
          <el-table-column label="申请时间" prop="createDate" min-width="110" />
          <el-table-column label="状态" prop="statusStr" align="center" width="160">
            <template slot="header">
              <el-select v-model="statusModel" placeholder="请选择" size="mini" @change="statusChange">
                <el-option label="全部状态" value />
                <el-option label="新建" value="0" />
                <el-option label="审批中" value="1" />
                <el-option label="待导入" value="6" />
                <el-option label="待领取" value="7" />
                <el-option label="已驳回" value="-1" />
                <el-option label="全部领取" value="8" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="当前未操作人" prop="currentAuditor" min-width="110" />
          <el-table-column label="事业群" prop="businessGroup" min-width="80" />
          <el-table-column label="国家" prop="country" min-width="80" />
          <el-table-column label="支付币种" prop="currency" min-width="80" />
          <el-table-column label="付款账户" prop="payer" min-width="90" />
          <el-table-column label="预计支付金额(￥)" prop="total" min-width="130" />
          <el-table-column label="领取情况" prop="receivePercentStr" min-width="100">
            <template slot-scope="{row}">
              <span v-if="row.status===7||row.status===8">{{row.receivePercentStr}}</span>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="160">
            <template slot="header">
              <el-select
                v-model="exportStatus"
                placeholder="请选择"
                size="mini"
                @change="exportChange"
              >
                <el-option label="全部状态" value />
                <el-option label="已导出" value="1" />
                <el-option label="待导出" value="0" />
              </el-select>
            </template>
            <template slot-scope="{row}">
              <template v-if="row.status===6">
                <el-select
                  v-model="row.exportStatus"
                  placeholder="请选择"
                  size="mini"
                  @change="rowExportChange(row)"
                >
                  <el-option label="已导出" :value="1" />
                  <el-option label="待导出" :value="0" />
                </el-select>
              </template>
              <template v-else-if="row.status===7||row.status===8">已导出</template>
              <template v-else>---</template>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <div class="table-but">
                <el-button size="mini" type="success" @click="detailsClick(scope.row)">详情</el-button>
                <el-upload
                  v-if="scope.row.status===6"
                  :action="action"
                  name="excel"
                  :show-file-list="false"
                  :headers="headers"
                  :data="{userId: getUserId(),purchaseIdList:scope.row.id}"
                  :limit="1"
                  :key="uploadKey"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  :on-success="uploadSuccess"
                  :before-upload="handleBeforeUpload"
                  :on-error="uploadError"
                >
                  <el-button size="mini" type="primary">导入 Code</el-button>
                </el-upload>
                <el-button v-if="scope.row.status===6 || scope.row.status===7 || scope.row.status===8"
                           size="mini" type="warning" @click="exportPayment(scope.row)">查看付款单</el-button>
              </div>
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
    <div class="error-table">
      <el-dialog :visible.sync="dialogTableVisible" width="40%" v-if="dialogTableVisible">
        <div class="table">
          <div class="titel">
            <i class="el-icon-circle-close"></i>批量导入失败
          </div>
          <h3>批量导入失败。请根据下列信息，检查表单后重新导入</h3>
          <el-table
            :data="errorDataList"
            max-height="450"
            :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
            :row-class-name="tableRowClassName"
            style="width: 100%"
          >
            <template>
              <el-table-column label="使用站点" prop="country"></el-table-column>
              <el-table-column label="Gift Card 币种" prop="currency"></el-table-column>
              <el-table-column label="Gift Card 面额" prop="unitPrice"></el-table-column>
              <el-table-column label="需要数量" prop="applyCodeAmount"></el-table-column>
              <el-table-column label="Excel 数量" prop="excelCodeAmount"></el-table-column>
            </template>
          </el-table>
        </div>
        <div class="foold">
          <el-button size="mini" type="primary" @click="dialogTableVisible=false">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="生成采购单" :visible.sync="dialogVisible" width="30%" v-if="dialogVisible">
      <el-form :model="purchase" ref="ruleForm" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="选择事业群:" prop="businessGroup">
          <el-select v-model="purchase.businessGroup" placeholder="请选择" size="mini" @change="businessGroupChange">
            <el-option label="MBG" value="MBG" />
            <el-option label="DBG" value="DBG" />
            <el-option label="ABG" value="ABG" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款账户:" prop="payer">
          <el-select v-model="purchase.payer" placeholder="请选择" size="mini">
            <el-option label="LYT" value="LYT" />
            <el-option label="SKL" value="SKL" />
            <el-option label="HWL" value="HWL" />
            <el-option label="PCL" value="PCL" />
            <el-option label="SPEC" value="SPEC" />
            <el-option label="STK" value="STK" />
          </el-select>
        </el-form-item>
        <el-form-item label="国家:" prop="country">
          <el-select v-model="purchase.country" placeholder="请选择" size="mini" :disabled="!purchase.businessGroup" @change="countryChange">
            <el-option v-for="(item,index) in countryOptions" :key="index" :label="item.countryCode" :value="item.countryCode"
                       :disabled="purchase.businessGroup===undefined ||
                       businessGroups[purchase.businessGroup]===undefined ||
                       businessGroups[purchase.businessGroup].countries.indexOf(item.countryCode) === -1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="支付币种:" prop="currency">
          <span>{{purchase.currency}}</span>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="created">下一步</el-button>
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPurchaseList,
  getPurchaseInfo,
  countIdleApply,
  exportPurchaseList,
  changeExportStatus,
  baseCountryGetList,
  exportPayment
} from '@/api/finance/giftCard';
import fullScreenForContainer from '@/mixins/fullScreenForContainer';
import Cookies from 'js-cookie';
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
      uploadKey: new Date().getTime(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      exportStatus: '',
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 450,
      topHeight: 450,//除表格高度外的内容高度
      action: '/api/finance/giftcardPurchase/batchImportCode',
      dialogTableVisible: false,
      dialogVisible: false,
      tableDataList: [],
      errorDataList: [],
      countryOptions: [],
      loading: false,
      search: '',
      time: [],
      params: {},
      createDateStart: '',
      createDateEnd: '',
      detailsDialog: false,
      currentTab: 'group',
      SelectionList: [],
      Info: {},
      statusModel: '',
      purchase: {
        payer: '',
        businessGroup: '',
        country: '',
        currency: ''
      },
      businessGroups: {
        MBG: {count: 0, countries: ''},
        DBG: {count: 0, countries: ''},
        ABG: {count: 0, countries: ''}
      },
      rules: {
        payer: [
          { required: true, message: '请选择事业群', trigger: 'change' }
        ],
        businessGroup: [
          { required: true, message: '请选择付款账户', trigger: 'change' }
        ],
        country: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ]
      },
      uploadLoading: null
    }
  },
  mixins: [fullScreenForContainer, tableHeight, mixins],
  created() {
    this.baseCountryGetList();
    this.getPurchaseList();
    this.getPurchaseInfo();
    this.countIdleApply();
  },
  computed: {
    headers() {
      return {
        Authorization: Cookies.get('Admin-Token')
      }
    }
  },
  methods: {
    async getPurchaseList() { // 表格列表
      const params = {
        ...this.params,
        ...this.pages
      }
      this.loading = true
      const res = await getPurchaseList(params)
      this.tableDataList = res.data.rows
      this.pages.total = res.data.total
      this.loading = false
    },
    async getPurchaseInfo() {
      const res = await getPurchaseInfo({})
      this.Info = res.data
    },
    async countIdleApply() {
      const res = await countIdleApply({});
      for (let i = 0, length = res.data.length; i <= length - 1; i++) {
        let name = res.data[i].name;
        this.businessGroups[name] = {count: res.data[i].count, countries: res.data[i].countries};
      }
    },
    async baseCountryGetList() {
      const res = await baseCountryGetList();
      this.countryOptions = res.data;
    },
    countryChange(val) {
      let list = this.countryOptions;
      for(let i = 0,length = list.length;i<length;i++) {
        if(val === list[i].countryCode) {
          this.purchase.currency = list[i].currency;
        }
      }
    },
    businessGroupChange() {
      this.purchase.country = "";
      this.purchase.currency = "";
      this.purchase = {...this.purchase};
    },
    changeExportStatus(id, type) {
      this.$confirm('是否确认将此采购单标记为“已导出/未导出”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await changeExportStatus({ purchaseIdList: id, exportStatus: type })
        if (res.resDes === 'OK') {
          this.getPurchaseList()
          this.$message.success(res.data)
        }
      })
    },
    handleBeforeUpload(file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.error('上传失败，请上传正确的Excel文件');
        return false
      }
      this.uploadLoading = this.$loading({
        lock: true,
        text: '导入中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
    },
    uploadError() {
      this.uploadLoading.close()
    },
    uploadSuccess(res) { // 导入
      if (res.resDes === 'OK') { // 导入失败
        this.errorDataList = res.data
        this.dialogTableVisible = true
      } else if (res.resCode === 200) { // 成功
        this.getPurchaseList()
        this.getPurchaseInfo()
        this.$message.success(res.resDes);
      } else {
        this.$message.error(res.resDes);
      }
      this.uploadKey = new Date().getTime()
      this.uploadLoading.close()
    },
    tableRowClassName({ row }) {
      if (row.applyCodeAmount !== row.excelCodeAmount) {
        return 'warning-row'
      }
      return ''
    },
    isSelectable(row) {
      if (row.status === 6) {
        return true
      } else {
        return false
      }
    },
    statusChange(val) {
      this.params.status = val
      this.getPurchaseList()
    },
    exportChange(val) {
      this.params.exportStatus = val
      this.getPurchaseList()
    },
    exporClick() {//批量标记为已导出
      this.changeExportStatus(this.SelectionList, 1)
    },
    rowExportChange(row) {
      this.changeExportStatus([row.id], row.exportStatus)
    },
    created() { // 新建
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const router = this.$router.resolve({ path: 'giftCard-purchase/created', query: this.purchase })
          window.open(window.origin + '/' + router.href, '_blank');
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    async exportExcel() { // 表格导出
      const data = {
        status: this.statusModel,
        purchaseNo: this.search,
        createDateStart: this.time[0],
        createDateEnd: this.time[1],
        exportStatus: this.exportStatus
      };
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
      const res = await exportPurchaseList(data).catch(() => loading.close());
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
    },
    async exportPayment(row) { // 表格导出
      const data = {purchaseId: row.id};
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
      const res = await exportPayment(data).catch(() => loading.close());
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
    },
    uploadtemplate() {//下载导入模板
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: ['站点', '币种', '面额', 'Code'], // 表头必填
          data: [['ED', 'EUR', '20', '20200525001'], ['ED', 'EUR', '30', '20200525002']], // 具体数据 必填
          filename: 'Gift Card 采购管理导入模板', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    formatJson(val, dataList) {
      return dataList.map(v => val.map(j => v[j]));
    },
    changeTime(val) { // 时间选择
      if (val) {
        this.params = { createDateStart: val[0], createDateEnd: val[1] }
      } else {
        this.params = {}
      }
      this.getPurchaseList()
    },
    detailsClick(row) {
      const query = {
        purchaseId: row.id,
        purchaseNo: row.purchaseNo,
        createDate: row.createDate,
        createUserName: row.createUserName,
        statusStr: row.statusStr,
        businessGroup: row.businessGroup,
        payer: row.payer,
        country: row.country,
        currency: row.currency
      }
      const router = this.$router.resolve({ path: 'giftCard-purchase/details', query })
      window.open(window.origin + '/' + router.href, '_blank');
      this.detailsDialog = true
    },
    searchClick() { // 搜索
      this.params.purchaseNo = this.search
      this.getPurchaseList()
    },
    // 数据分页每页数据变化
    handleSizeChange(pageSize) {
      this.pages.limit = pageSize
      this.getPurchaseList()
    },
    // 选择第几页
    handleCurrentChange(currentPage) {
      this.pages.page = currentPage
      this.getPurchaseList()
    },
    handleSelectionChange(val) {
      const arr = []
      val.forEach(item => {
        arr.push(item.id)
      })
      this.SelectionList = arr;
    },
    getUserId() {
      const userId = Cookies.get('UserId');
      return userId;
    }
  }
}
</script>
<style lang="scss">
.error-table {
  .table {
    .titel {
      text-align: center;
      font-size: 20px;
      i {
        font-size: 28px;
        color: #f00;
      }
      margin-bottom: 20px;
    }
    .warning-row {
      color: #f00;
    }
  }
  .foold {
    text-align: center;
    margin-top: 15px;
  }
}
.table-but {
  display: flex;
  .el-upload {
    margin: 0 10px;
  }
}
</style>
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
        width: 270px;
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
      .uploadButton {
        display: inline-block;
      }
    }
    .pagination {
      text-align: right;
      margin: 10px 0;
    }
  }
}
</style>
