<template>
  <div class="fixed_table" style="padding: 20px">
    <div>
      <el-form v-model="listQuery" style="display: flex;flex-wrap: wrap">
        <el-form-item label="组织类型" label-width="120px">
          <el-select v-model="listQuery.departmentType" placeholder="请选择">
            <el-option label="事业群" :key="1" :value="1"/>
            <el-option label="事业部" :key="2" :value="2"/>
            <el-option label="组别" :key="3" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" label-width="120px">
          <el-input v-model="listQuery.departmentName" placeholder="请输入" @keyup.enter.native="getList"/>
        </el-form-item>
        <el-form-item label="添加时间" label-width="100px">
          <el-date-picker v-model="createDate" type="daterange" range-separator="-" :picker-options="pickerOptions"
                          unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"/>
        </el-form-item>
      </el-form>
    </div>
    <div align="center">
      <el-button v-waves type="primary" @click="getList">查询</el-button>
      <el-button v-waves type="primary" @click="reset">重置</el-button>
      <el-button v-waves type="primary" @click="exportData">导出报表</el-button>
    </div>

    <el-table :data="dataList.dataList" v-loading.sync="listLoading" border fit highlight-current-row style="margin-top: 10px" :height="tableHeight">
      <el-table-column type="index" align="center" width="100px"/>
      <el-table-column align="center" label="组织" prop="departmentName"/>
      <el-table-column align="center" label="近30天付款金额" prop="latestMonthPayment"/>
      <el-table-column align="center" label="本月付款金额" prop="currentMonthPayment"/>
      <el-table-column align="center" label="今年付款金额" prop="currentYearPayment"/>
      <el-table-column align="center" label="待付款金额" prop="waitPayment"/>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="small" @click="openInfoDialog(scope.row)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="dataList.total"/>
    </div>




    <!--供应商详情页-->
    <el-dialog class="dialog_class" title="部门详情页" :before-close="closeInfoDialog" :visible.sync="infoDialogVisible" v-loading="fullScreenLoading" v-dialog-drag width="1350px" top="3vh">
      <div class="infoDialogTitle" style="margin-top: 0">{{selectedRow.departmentName}}</div>

      <!--详情 合同信息-->
      <div class="infoDialogTitle" style="margin-bottom: 5px">
        合同信息
      </div>
      <el-table :data="information.contractInfo" v-loading.sync="fullScreenLoading" border fit highlight-current-row max-height="300px">
        <el-table-column type="index" align="center" width="65px"/>
        <el-table-column width="170px" align="center" label="合同编号" prop="contractNo"/>
        <el-table-column width="190px" align="center" label="合同期限">
          <template slot-scope="scope">
            {{$moment(scope.row.expireDateStart).format("YYYY/M/D") + " - " + $moment(scope.row.expireDateEnd).format("YYYY/M/D")}}
          </template>
        </el-table-column>
        <el-table-column width="240px" align="center" label="关联供应商" prop="supplierName"/>
        <el-table-column width="120px" align="center" label="付款账户" prop="payer"/>
        <el-table-column width="120px" align="center" label="价格支付币种" prop="priceCurrency"/>
        <el-table-column width="120px" align="center" label="佣金支付币种" prop="commissionCurrency"/>
        <el-table-column width="120px" align="center" label="手续费支付币种" prop="serviceFeeCurrency"/>
      </el-table>

      <!--详情 付款信息-->
      <div class="infoDialogTitle">付款信息</div>
      <div class="dialog_card">
        <div>汇总金额显示币种:
          <el-radio v-model="paymentStatisticsCurrency" label="CNY">人民币</el-radio>
          <el-radio v-model="paymentStatisticsCurrency" label="USD">美元</el-radio>
        </div>
        <table class="paymentInfoTable">
          <tr>
            <td>累计付款金额</td>
            <td>近30天付款金额</td>
            <td>本月付款金额</td>
            <td>今年付款金额</td>
            <td>待付款金额</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
          </tr>
        </table>

        <div style="margin-top: 20px">付款明细统计</div>
        <table class="paymentInfoTable" border="1">
          <tr>
            <td></td>
            <td>人民币</td>
            <td>美元</td>
            <td>澳元</td>
            <td>英镑</td>
          </tr>
          <tr>
            <td>近30天</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>本月</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>今年</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>累计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
      <!--详情 付款明细-->
      <div class="infoDialogTitle">付款明细</div>
      <el-form v-model="paymentDetailForm" style="display: flex; flex-wrap: wrap; margin-top: 5px">
        <el-form-item label="状态" label-width="60px" style="margin-bottom: 5px">
          <el-input v-model="paymentDetailForm.status" placeholder="请输入" clearable @keyup.enter.native="getPaymentDetail"/>
        </el-form-item>
        <el-form-item label="申请日期" label-width="100px" style="margin-bottom: 5px">
          <el-date-picker v-model="applyDate" type="daterange" range-separator="-" :picker-options="pickerOptions"
                          unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" size="small" @click="getPaymentDetail">查询</el-button>
        <el-button v-waves type="primary" size="small" @click="resetPaymentDetailForm">重置</el-button>
        <el-button v-waves type="primary" size="small" @click="exportPaymentDetail">导出报表</el-button>
      </div>
      <el-table :data="information.paymentInfo" v-loading.sync="fullScreenLoading" border fit highlight-current-row max-height="300px">
        <el-table-column fixed="left" type="index" width="65px" align="center"/>
        <el-table-column fixed="left" width="130px" align="center" label="申请日期" prop=""/>
        <el-table-column fixed="left" width="150px" align="center" label="申请单号" prop=""/>
        <el-table-column fixed="left" width="100px" align="center" label="状态" prop=""/>
        <el-table-column fixed="left" align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-waves type="primary" size="small" @click="">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column width="130px" align="center" label="收款公司" prop=""/>
        <el-table-column label="商品信息" align="center">
          <el-table-column width="100px" align="center" label="亚马逊单号" prop=""/>
          <el-table-column width="100px" align="center" label="SKU" prop=""/>
          <el-table-column width="100px" align="center" label="ASIN" prop=""/>
          <el-table-column width="100px" align="center" label="品牌" prop=""/>
          <el-table-column width="100px" align="center" label="国家" prop=""/>
          <el-table-column width="100px" align="center" label="渠道" prop=""/>
          <el-table-column width="100px" align="center" label="Review链接" prop=""/>
        </el-table-column>
        <el-table-column label="付款信息" align="center">
          <el-table-column width="100px" align="center" label="价格" prop=""/>
          <el-table-column width="100px" align="center" label="价格币种" prop=""/>
          <el-table-column width="100px" align="center" label="佣金 " prop=""/>
          <el-table-column width="100px" align="center" label="佣金币种" prop=""/>
          <el-table-column width="100px" align="center" label="手续费" prop=""/>
          <el-table-column width="100px" align="center" label="手续费币种" prop=""/>
          <el-table-column width="100px" align="center" label="付款公司" prop=""/>
        </el-table-column>
        <el-table-column width="100px" align="center" label="备注" prop=""/>
        <el-table-column width="100px" align="center" label="附件" prop=""/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "publicPaymentDepartment",
    data() {
      return {
        tableHeight: window.innerHeight * 0.7,
        selectedRow: {},
        listLoading: false,
        fullScreenLoading: false,
        infoDialogVisible: false,
        createDate: {},
        listQuery: {
          departmentType: 2,
          departmentName: undefined,
          createDateStart: undefined,
          createDateEnd: undefined,
          page: 1,
          limit: 20
        },
        dataList: {
          dataList: [],
          total: undefined
        },
        information: {
          contractInfo: [],
          paymentStatistics: {},
          paymentInfo: []
        },
        paymentStatisticsCurrency: 'CNY',
        applyDate: undefined,
        paymentDetailForm: {
          status: undefined,
          applyDateStart: undefined,
          applyDateEnd: undefined
        },
        pickerOptions: {
          shortcuts: [{
            text: '当前月',
            onClick(picker) {
              const start = new Date();
              start.setDate(1);
              const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上一个月',
            onClick(picker) {
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              start.setDate(1);
              const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    watch: {
      createDate() {
        this.listQuery.createDateStart = this.createDate ? this.changeDate(this.createDate[0]) : undefined;
        this.listQuery.createDateEnd = this.createDate ? this.changeDate(this.createDate[1]) : undefined;
      },
      applyDate() {
        this.paymentDetailForm.applyDateStart = this.applyDate ? this.changeDate(this.applyDate[0]) : undefined;
        this.paymentDetailForm.applyDateEnd = this.applyDate ? this.changeDate(this.applyDate[1]) : undefined;
      }
    },
    methods: {
      getList() {

      },
      reset() {

      },
      getInfo() {
        this.fullScreenLoading = true;
        getInfo({}).then(response => {
          if (response.resCode === 200) {
            this.information.contractInfo = response.data.contractInfo;
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询失败");
        });
      },
      exportData() {

      },
      changeDate(date) {
        return this.$moment(date).format("YYYY-MM-DD");
      },
      openInfoDialog(row) {
        this.selectedRow = row;
        this.getInfo();
        this.infoDialogVisible = true;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handlePageChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      closeInfoDialog() {
        this.infoDialogVisible = false;
      },
      getPaymentDetail() {

      },
      resetPaymentDetailForm() {

      },
      exportPaymentDetail() {

      }
    }
  }
</script>

<style scoped>
</style>
