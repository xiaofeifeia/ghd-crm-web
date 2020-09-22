<template>
  <div class="app-container calendar-list-container" v-loading="fullscreenLoading">
    <div class="filter-container">
      <el-form
        v-model="listQuery"
        label-width="100px"
        class="form-el-all"
        @keyup.enter.native="handleFilter">
        <el-form-item  label="站点">
          <font color="red">*</font>
          <el-select v-model="serverName" clearable placeholder="请选择" class="filter-item" @change="changeWebsite">
            <el-option
              v-for="item in websiteOptions"
              :key="item.websiteName"
              :label="item.websiteName"
              :value="item.serverName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Model">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.model"></el-input>
        </el-form-item>
        <el-form-item label="Asin">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.asin"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.orderNo"></el-input>
        </el-form-item>
           <el-form-item label="客人邮箱">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.buyerEmail"></el-input>
        </el-form-item>
           <el-form-item label="状态">
          <el-select v-model="listQuery.status" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in campaignDtlStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论类型">
          <el-select v-model="listQuery.reviewFlag" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in reviewType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
           <el-form-item label="邀请人邮箱">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.inviteEmail"></el-input>
        </el-form-item>
           <el-form-item label="活动创建人">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.createEmail"></el-input>
        </el-form-item>
        <el-form-item label="是否返仓">
          <el-select v-model="listQuery.isReturnWarehouse" placeholder="请选择" clearable >
            <el-option v-for="item in returnWhOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-remove-outline"
          @click="resetTemp"
        >重置</el-button>
        </el-form-item>
         <el-form-item>
           <el-dropdown>
            <el-button type="primary">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="exportPaymentReport">新请款报表</el-dropdown-item>
              <el-dropdown-item @click.native="exportReviewReport(1)">组别-留评</el-dropdown-item>
              <el-dropdown-item @click.native="exportReviewReport(2)">用户-留评</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
         </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      ref="multipleTable"
      style="width: 100%"
      :height="tableHeight"
     @selection-change="handleSelectionChange"
     @cell-click="viewImg">
      <el-table-column width="180px" align="center" label="订单号" fixed="left">
        <template slot-scope="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column width="80px" align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgThumbUrl" width="60px" height="60px"/>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="发票">
        <template slot-scope="scope">
           <a :href="scope.row.invoiceFileName" target="_blank" v-if="scope.row.invoiceFileName"><el-link>查看<i class="el-icon-view el-icon--right"></i> </el-link></a>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="评论类型" :formatter="formatReviewFlag">
      </el-table-column>
      <el-table-column width="80px" align="center" label="评论截图" >
          <template slot-scope="scope">
            <img :src="scope.row.reviewThumbScreenshots" width="60px" height="60px"  v-if="scope.row.reviewThumbScreenshots"/>
          </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="是否返仓" :formatter="formatReturnWhOption">
      </el-table-column>
      <el-table-column width="80px" align="center" label="币别">
        <template slot-scope="scope">
          <span>{{scope.row.currency}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="订单金额">
        <template slot-scope="scope">
          <span>{{scope.row.grandTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="奖励">
        <template slot-scope="scope">
          <span>{{scope.row.bonus}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="收款账号">
        <template slot-scope="scope">
          <span>{{scope.row.paymentAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="客人邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邀请人邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.inviterEmail}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="领取日期">
        <template slot-scope="scope">
          <span>{{scope.row.receiveDate}}</span>
        </template>
      </el-table-column>
       <el-table-column width="180px" align="center" label="留评日期">
        <template slot-scope="scope">
          <span>{{scope.row.reviewDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="申请退款日期">
        <template slot-scope="scope">
          <span>{{scope.row.reqRefundDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="退款日期">
        <template slot-scope="scope">
          <span>{{scope.row.finishDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="管理员退款日期">
        <template slot-scope="scope">
          <span>{{scope.row.adminRefundDate}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="建议评论内容" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.suggestedReviewContent}}</span>
        </template>
      </el-table-column>
       <el-table-column width="80px" align="center" label="Pre Paid Label">
        <template slot-scope="scope">
           <a :href="scope.row.prePaidLabelFileName" target="_blank" v-if="scope.row.prePaidLabelFileName"><el-link>查看<i class="el-icon-view el-icon--right"></i> </el-link></a>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="物流单照片" >
          <template slot-scope="scope">
            <img :src="scope.row.courierPicFileNameThumb" width="60px" height="60px"  v-if="scope.row.courierPicFileNameThumb"/>
          </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="Drop Off照片" >
          <template slot-scope="scope">
            <img :src="scope.row.dropOffPicFileNameThumb" width="60px" height="60px"  v-if="scope.row.dropOffPicFileNameThumb"/>
          </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="付款账号">
        <template slot-scope="scope">
          <span>{{scope.row.payer}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="请款单号">
        <template slot-scope="scope">
          <span>{{scope.row.requestNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="渠道">
        <template slot-scope="scope">
          <span>{{scope.row.channel}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="Asin">
        <template slot-scope="scope">
          <span>{{scope.row.asin}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="model">
        <template slot-scope="scope">
          <span>{{scope.row.model}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="60px">
        <template slot-scope="scope">
           <el-button type="warning" icon="el-icon-upload" circle title="上传预付款快递单" v-if="scope.row.status == 8 && scope.row.isReturnWarehouse == 1" @click="handleUpload(scope.row)"></el-button>
           <el-button type="success" icon="el-icon-refresh" circle title="恢复订单" v-if="scope.row.status == -1" @click="recoverOrder(scope.row)"></el-button>
        </template>
      </el-table-column> 
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="图片"
      :visible.sync="imgDialogVisible"
      width="80%">
      <div class="block">
        <el-image :src="viewImgUrl">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
    </el-dialog>

    <!-- upload pre paid label -->
    <el-drawer
      title="上传快递预付款单"
      :visible.sync="dialogPrdPaidLabelVisible"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      >
      <div class="demo-drawer__content">
        <el-form :v-model="uploadForm"  ref="uploadForm" label-width="100px">
          <el-form-item label="预付款单">
            <el-upload
              class="upload-demo"
              :action="uploadLabelUrl"
              ref="returnLabel"
              multiple
              :limit="1"
              :on-success="uploadSuccess"
              :on-exceed="handleExceed"
              :headers="headers">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过5mb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="评论内容" >
            <el-input type="textarea" rows=3 v-model="uploadForm.suggestedReviewContent" placeholder="请输入建议评论内容"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 5px">
          <el-button style="margin-left: 20px;" type="primary" @click="saveUploadResult()">确 定</el-button>
          <el-button @click="dialogPrdPaidLabelVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import {
  page,
  getObj,
  updateStatus,
  expPaymentResultTpl,
  listReviewReport,
  recoverOrder,
  saveUploadResult
} from "api/reviewer/campaign/campaignDtl";
import {
  getWebsiteList,
  checkServerSelected,
  campaignDtlStatus,
  formatJson,
  reviewType,
  formatReviewType,
  returnWhOptions,
  returnWhOptionsFn
} from "api/reviewer/reviewCommon";
import { mapGetters } from "vuex";
import Cookies from 'js-cookie';
export default {
  name: "campaignDtl",
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        model: undefined,
        asin: undefined,
        orderNo: undefined,
        buyerEamil: undefined,
        inviteEmail: undefined,
        createEmail: undefined,
        reviewFlag: undefined,
        isReturnWarehouse: ''
      },
      dialogFormVisible: false,
      dialogStatus: "",
      campaignDtlManager_btn_edit: false,
      campaignDtlManager_btn_del: false,
      campaignDtlManager_btn_add: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      serverName: undefined,
      websiteOptions: undefined,
      campaignDtlStatus: undefined,
      tableHeight: undefined,
      multipleSelection: [],
      imgDialogVisible: false,
      viewImgUrl: undefined,
      fullscreenLoading: false,
      importPaymentUrl: '',
      importErrorList: [],
      reviewType: [],
      returnWhOptions: [],
      dialogPrdPaidLabelVisible: false,
      suggestedReviewContent: undefined,
      uploadLabelUrl: '',
      uploadForm: {
        id: undefined,
        suggestedReviewContent: undefined,
        prePaidLabelFileName: undefined
      }
    };
  },
  created() {
    this.getWebsiteList();
    this.campaignDtlStatus = campaignDtlStatus;
    this.returnWhOptions = returnWhOptions;
  },
  mounted: function(){
    this.tableHeight = window.innerHeight - 100;
    this.reviewType = reviewType;
  },
  computed: {
    ...mapGetters(["elements"]),
    headers(){
      return {
        'Authorization': Cookies.get('Admin-Token')
      }
    }
  },
  methods: {
    getList() {
      if (!checkServerSelected(this.serverName)) {
        this.$notify({
          title: '失败',
          message: '请选择目标站点！',
          type: 'error',
          duration: 2000
        });
        return false;
      }
      this.listLoading = true;
      page(this.serverName, this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
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
    // 重置
    resetTemp() {
      this.listQuery = {
        status: undefined,
        model: undefined,
        asin: undefined,
        orderNo: undefined,
        buyerEamil: undefined,
        inviteEmail: undefined,
        createEmail: undefined,
        reviewFlag: undefined
      }
    },
    // 获取站点列表
    getWebsiteList() {
      getWebsiteList().then(response => {
        this.websiteOptions = response.data.rows;
      });
    },
    // 改变站点时清空数据
    changeWebsite () {
      this.list = [];
      if (this.serverName) {
        this.importPaymentUrl = '/api/'+this.serverName+'/campaignDtl/importPaymentInfo';
        this.uploadLabelUrl = '/api/' + this.serverName + '/campaignDtl/uploadReturnLabel';
      }
    },
    // 提交单据到财务审批流程
    handleSubmit () {
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.warning("操作失败，请选择需要提交的单据！");
        return false;
      }
      for (let i = 0; i <  this.multipleSelection.length; i++) {
        let obj = this.multipleSelection[i];
        if (obj.status != 4 && obj.status != 10) { // 只允许待退款和已同步的记录同步
          this.$message.warning("操作失败，只能同步待退款状态的单据！");
          return false;
        }
        if (!obj.channel || !obj.requestNo || !obj.payer) {
          this.$message.warning("操作失败，请款单号、付款账号和渠道不能为空！");
          return false;
        }
        obj.nextStatus = 10; // 提交到财务审批流程
      }
      updateStatus(this.serverName, this.multipleSelection).then(() => {
        this.getList();
        this.$notify({
          title: "成功",
          message: "提交成功",
          type: "success",
          duration: 2000
        });
      });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 管理活动状态
    handleCampManager(row, type) {
      row.nextStatus = 3; // 待申请退款
      tipMsg ="请确认是否将订单打回至待申请退款状态?";
      if (type == 2) {
        row.nextStatus = 5; // 已退款
        var tipMsg ="请确认是否退款?";
      }
      this.$confirm(tipMsg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let obj = [];
        obj.push(row);
        updateStatus(this.serverName, obj).then(() => {
          this.getList();
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
        });
      });
    },
     // 点击单元格
    viewImg(row, column, cell, event) {
      if (column.label=='评论' && row.reviewScreenshots) {
        this.imgDialogVisible = true;
        this.viewImgUrl = row.reviewScreenshots;
      }
      if (column.label=='发票截图' && row.orderInvoiceImg) {
        this.imgDialogVisible = true;
        this.viewImgUrl = row.orderInvoiceImg;
      }
      if (column.label=='图片' && row.imgUrl) {
        this.imgDialogVisible = true;
        this.viewImgUrl = row.imgUrl;
      }
      if (column.label=='物流单照片' && row.courierPicFileName) {
        this.imgDialogVisible = true;
        this.viewImgUrl = row.courierPicFileName;
      }
       if (column.label=='Drop Off照片' && row.dropOffPicFileName) {
        this.imgDialogVisible = true;
        this.viewImgUrl = row.dropOffPicFileName;
      }
    },
    // 导出请款报表
    exportPaymentReport() {
      if (!checkServerSelected(this.serverName)) {
        this.$message.warning("操作失败，目标站点不能为空！");
        return false;
      }
      let exportQuery= {
        page: 1,
        limit: 6000,
        status: 4,
        model: this.listQuery.model,
        asin: this.listQuery.asin,
        orderNo: this.listQuery.orderNo,
        buyerEamil: this.listQuery.buyerEamil,
        inviteEmail: this.listQuery.inviteEmail,
        createEmail: this.listQuery.createEmail
      }
      this.fullscreenLoading = true;
      page(this.serverName, exportQuery).then(response => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['系统批次号','请款人','请款日期','请款单号','支付状态','亚马逊单号','ERP SKU','订单paypal账号','付款paypal账号','Brand','主管','Team','渠道','Country','币种','订单金额（本币）','佣金（本币）','手续费（本币）','Total（本币）','备注','Reviewer Email/微信','自定义备注','财务驳回理由','创建人','创建时间'];
          const filterVal = ['batchNumber','applicant','applyDate','requestNo','statusStr','orderNo','sku','paymentAccount','payer','brand','teamLeader','salesGroup','channel','countryName','currency','grandTotal','bonus','serviceFee','totalAmount','remark','email','customNote','rejectReason','createUserName','createDate'];
          const list = response.data.rows;
          const data = formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'paymentReport',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
        this.fullscreenLoading = false;
      });
      this.exportDialogVisible = false;
    },
    // 导出review报表
    exportReviewReport(type) {
      if (!checkServerSelected(this.serverName)) {
        this.$message.warning('操作失败，目标站点不能为空！');
        return false;
      }
      let exportQuery= {
        reportType: type
      }
       let fileName = '组别';
      if (type === 2) {
          fileName = '全名';
      }
      this.fullscreenLoading = true;
      listReviewReport(this.serverName, exportQuery).then(response => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [fileName,'Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec','Total'];
          const filterVal = ['fieldName','jan','feb','mar','apr','may','june','july','aug','sept','oct','nov','dec','total'];
          const list = response.data;
          const data = formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'review-report',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
        this.fullscreenLoading = false;
      });
      this.exportDialogVisible = false;
    },
    formatStatus (row, column) {
      switch(row.status){
          case -2:
            return '管理员取消';
            break;
         case -1:
            return '取消';
            break;
          case 1:
            return '待上传订单号';
            break;
          case 2:
            return '待评论';
            break;
          case 3:
            return '待申请退款';
            break;
           case 4:
            return '待退款';
            break;
          case 5:
            return '已退款';
            break;
          case 6:
            return '平台退款';
            break;
          case 7:
            return '上传寄件地址';
            break;
          case 8:
            return '待上传预付款快递单';
            break;
          case 9:
            return '待上传订发票';
            break;
          case 10:
            return '提交财务退款';
            break;
          case 12:
            return '待上传物流单 & Drop off照片';
            break;
          default:
            return '未知';
      }
    },
    formatReviewFlag (row, column) {
      return formatReviewType(row, column);
    },
    formatReturnWhOption (row, column) {
      return returnWhOptionsFn(row, column);
    },
    // 恢复取消订单 
    recoverOrder (row) {
      if (!this.serverName) {
        this.$notify({
          title: '失败',
          message: '请选择目标站点！',
          type: 'error'
        });
        return false;
      }
      this.fullscreenLoading = true;
      recoverOrder(this.serverName, row).then(resp => {
        this.fullscreenLoading = false;
        if (resp.resCode == 200) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success"
          });
        } else {
           this.$notify({
            title: "失败",
            message: resp.resDes,
            type: "error"
          });
        }
      });
    },
     // 上传pre paid label
    handleUpload (row) {
      this.uploadForm = row;
      this.dialogPrdPaidLabelVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
    },
    uploadSuccess (response, file, fileList) {
        if (response.resCode === 200 && response.data) {
          this.uploadForm.prePaidLabelFileName = response.data;
        } else {
           this.uploadForm.prePaidLabelFileName = undefined;
           this.$message.error(`文件上传失败，请联系技术IT支持！</br>`+ resultVo.resDes);
        }
      },
    // 保存Return label上传结果
    saveUploadResult() {
      this.dialogFormVisible = false;
      if (!this.uploadForm.prePaidLabelFileName) {
        this.$message.error(`操作失败，请先上传预付款单PDF文件！`);
        return false;
      } 
      saveUploadResult(this.serverName, this.uploadForm).then(() => {
        this.$message.success(`上传成功！`);
        this.getList();
        this.dialogPrdPaidLabelVisible = false;
      });
  }
  }
};
</script>
<style scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
</style>
