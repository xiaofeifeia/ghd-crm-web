<template>
  <div class="app-container calendar-list-container fixed_table" v-loading="fullScreenLoading">
    <div class="filter-container">
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap">
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" @click="getBillList">查询</el-button>
        <el-button v-waves type="primary" @click="reset">重置</el-button>
      </div>
    </div>

    <!--数据列表-->
    <div style="margin-bottom: 10px">
      <span>已选择{{$refs.billDataTableRef? $refs.billDataTableRef.selection.length : 0}}项</span>
      <el-button v-waves type="primary" size="small" @click="openMultipleAuditDialog">批量审批</el-button>
    </div>
    <el-table :data="billDataList.dataList" ref="billDataTableRef" v-loading="listLoading" border fit highlight-current-row :height="billTableHeight">
      <el-table-column type="selection" align="center"/>
      <el-table-column type="index" align="center"/>
      <el-table-column width="100px" align="center" label="提交时间" prop="applyDate">
        <template slot-scope="scope">
          {{$moment(scope.row.applyDate).format("YYYY-MM-DD")}}
        </template>
      </el-table-column>
      <el-table-column width="170px" align="center" label="付款单号" prop="billNo"/>
      <el-table-column width="170px" align="center" label="收款公司" prop="supplierName"/>
      <el-table-column width="170px" align="center" label="收款账户名称" prop="accountName"/>
      <el-table-column width="220px" align="center" label="收款银行" prop="bankName"/>
      <el-table-column width="180px" align="center" label="收款账户" prop="accountNo"/>
      <el-table-column width="120px" align="center" label="付款公司" prop="payer"/>
      <el-table-column width="120px" align="center" label="付款币种" prop="currency"/>
      <el-table-column width="120px" align="center" label="付款金额" prop="payTotal"/>
      <el-table-column width="120px" align="center" label="状态" prop="statusStr"/>
      <el-table-column width="200px" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" v-waves type="primary" @click="openBillInfoDialog(scope.row)">查看明细</el-button>
          <el-button size="small" v-waves type="warning" @click="openAuditDialog(scope.row)">审批</el-button>
          <el-button size="small" v-waves type="success" @click="">查看付款单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleBillSizeChange" @current-change="handleBillPageChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="billDataList.total"/>
    </div>

    <!--付款单详情页-->
    <el-dialog class="dialog_class" title="付款单详情" :before-close="closeBillInfoDialog" :visible.sync="billInfoDialogVisible" v-loading="fullScreenLoading" v-dialog-drag width="85%" top="3vh">
      <div style="margin-bottom: 10px">
        <table width="90%">
          <tr>
            <td width="10%"><span style="float: right;margin-right: 10px;">付款单号:</span></td>
            <td width="33%">{{this.selectedBillRow.billNo}}</td>
            <td width="10%"><span style="float: right;margin-right: 10px;">收款公司:</span></td>
            <td width="23%">{{this.selectedBillRow.supplierName}}</td>
            <td width="10%"><span style="float: right;margin-right: 10px;">状态:</span></td>
            <td width="23%">{{this.selectedBillRow.statusStr}}</td>
          </tr>
          <tr>
            <td><span style="float: right;margin-right: 10px;">收款账号名称:</span></td>
            <td>{{this.selectedBillRow.accountName}}</td>
            <td><span style="float: right;margin-right: 10px;">收款银行:</span></td>
            <td>{{this.selectedBillRow.bankName}}</td>
            <td><span style="float: right;margin-right: 10px;">收款账户:</span></td>
            <td>{{this.selectedBillRow.accountNo}}</td>
          </tr>
          <tr>
            <td><span style="float: right;margin-right: 10px;">支付币种:</span></td>
            <td>{{this.selectedBillRow.currency}}</td>
            <td><span style="float: right;margin-right: 10px;">支付公司:</span></td>
            <td>{{this.selectedBillRow.payer}}</td>
            <td><span style="float: right;margin-right: 10px;">预计付款金额:</span></td>
            <td>{{this.selectedBillRow.payTotal}}</td>
          </tr>
        </table>
        <table width="90%">
          <tr>
            <td width="10%"><span style="float: right;margin-right: 10px;">备注:</span></td>
            <td width="90%">{{this.selectedBillRow.remark}}</td>
          </tr>
        </table>
      </div>

      <!--详情 付款明细-->
      <el-table :data="billData.dataList" ref="billDataTableRef" v-loading.sync="fullScreenLoading" border fit highlight-current-row height="600px">
        <el-table-column fixed="left" type="selection" width="65px" align="center"/>
        <el-table-column fixed="left" type="index" width="65px" align="center"/>
        <el-table-column fixed="left" width="100px" align="center" label="申请日期" prop="applyDate">
          <template slot-scope="scope">
            {{$moment(scope.row.applyDate).format("YYYY/M/D")}}
          </template>
        </el-table-column>
        <el-table-column fixed="left" width="160px" align="center" label="申请单号" prop="applyNo"/>
        <el-table-column fixed="left" width="100px" align="center" label="组别" prop="team"/>
        <el-table-column fixed="left" width="100px" align="center" label="主管" prop="leader"/>
        <el-table-column fixed="left" width="100px" align="center" label="申请人" prop="createUserName"/>
        <el-table-column fixed="left" align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-waves type="primary" size="small" @click="openApplyInfoDialogFromBill(scope.row.applyId)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品信息">
          <el-table-column width="170px" align="center" label="亚马逊单号" prop="orderId"/>
          <el-table-column width="120px" align="center" label="SKU" prop="sku"/>
          <el-table-column width="120px" align="center" label="ASIN" prop="asin"/>
          <el-table-column width="100px" align="center" label="品牌" prop="brand"/>
          <el-table-column width="100px" align="center" label="国家" prop="country"/>
          <el-table-column width="120px" align="center" label="渠道" prop="channel"/>
          <el-table-column width="120px" align="center" label="Review链接" prop="link" show-overflow-tooltip/>
        </el-table-column>
        <el-table-column align="center" label="付款信息(标绿为本打款单包含款项)">
          <el-table-column width="280px" align="center" label="价格">
            <template slot-scope="scope">
              <span v-if="scope.row.priceCurrency===scope.row.currency" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.applyPriceCurrency + "   商品价格:" + scope.row.applyPrice +
                '\r\n支付币种:' + scope.row.priceCurrency + "   支付金额:" + scope.row.price}}</span>
              <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.applyPriceCurrency + "   商品价格:" + scope.row.applyPrice +
                '\r\n支付币种:' + scope.row.priceCurrency + "   支付金额:" + scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column width="280px" align="center" label="佣金">
            <template slot-scope="scope">
              <span v-if="scope.row.commissionCurrency===scope.row.currency" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.applyCommissionCurrency + "   商品价格:" + scope.row.applyCommission +
                '\r\n支付币种:' + scope.row.commissionCurrency + "   支付金额:" + scope.row.commission}}</span>
              <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.applyCommissionCurrency + "   商品价格:" + scope.row.applyCommission +
                  '\r\n支付币种:' + scope.row.commissionCurrency + "   支付金额:" + scope.row.commission}}</span>
            </template>
          </el-table-column>
          <el-table-column width="280px" align="center" label="手续费">
            <template slot-scope="scope">
                <span v-if="scope.row.serviceFeeCurrency===scope.row.currency" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.applyServiceFeeCurrency + "   商品价格:" + scope.row.applyServiceFee +
                  '\r\n支付币种:' + scope.row.serviceFeeCurrency + "   支付金额:" + scope.row.serviceFee}}</span>
              <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.applyServiceFeeCurrency + "   商品价格:" + scope.row.applyServiceFee +
                  '\r\n支付币种:' + scope.row.serviceFeeCurrency + "   支付金额:" + scope.row.serviceFee}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="280px" align="center" label="本次支付">
          <template slot-scope="scope">
            <span style="white-space:pre-wrap">{{'支付币种:' + scope.row.currency + "   支付金额:" + scope.row.total}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="备注" prop="remark" show-overflow-tooltip/>
        <el-table-column width="100px" align="center" label="附件">
          <template slot-scope="scope">
            {{scope.row.fileCount + '个附件'}}
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!fullScreenLoading" class="pagination-container">
        <el-pagination @size-change="handleInfoSizeChange" @current-change="handleInfoPageChange"
                       :current-page.sync="getBillDataForm.page" :page-sizes="[10,20,50,100,500]" :page-size="getBillDataForm.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="billData.total"/>
      </div>
    </el-dialog>

    <!--申请单详情窗口-->
    <el-dialog width="1090px" class="dialog_class" title="查看申请详情" :before-close="closeApplyInfoDialog" :visible.sync="applyInfoDialogVisible" v-loading="fullScreenLoading" v-dialog-drag top="3vh">
      <table>
        <tr>
          <td class="info_table_row_label"><span>申请单号:</span></td>
          <td width="200px"><span>{{applyDetail.applyNo}}</span></td>
          <td class="info_table_row_label"><span>申请时间:</span></td>
          <td width="200px"><span>{{applyDetail.applyDateStr}}</span></td>
          <td class="info_table_row_label"><span>状态:</span></td>
          <td width="200px"><span>{{applyDetail.statusStr}}</span></td>
        </tr>
        <tr>
          <td class="info_table_row_label"><span>申请人:</span></td>
          <td><span>{{applyDetail.createUserName}}</span></td>
          <td class="info_table_row_label"><span>组别: </span></td>
          <td><span>{{applyDetail.team}}</span></td>
          <td class="info_table_row_label"><span>主管: </span></td>
          <td><span>{{applyDetail.leader}}</span></td>
        </tr>
      </table>

      <!--申请单详情窗口 审批信息-->
      <div class="dialog_card" v-if="auditLogShowList.length > 0 && applyDetail.status !== 0">
        <el-steps :active="auditLogList.length" align-center>
          <el-step v-for="(item,index) in auditLogShowList" :title="item.nodeName" :key="index"
                   :status="item.result === 1 ? 'success' : (item.result === 0 ?'error':'')">
            <template slot="description">
              <!--自行填充的步骤条不需描述，需增加if判断-->
              <div v-if="item.operatorName != undefined" v-html="item.operatorName + '<br/>' +
                   $moment(item.createDate).format('YYYY-MM-DD') + '<br/>' +
                    $moment(item.createDate).format('HH:mm:ss') + '<br/>' +
                    (!!item.remark?item.remark:'')"/>
            </template>
          </el-step>
        </el-steps>
      </div>

      <!--申请单详情窗口 收付款信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">收款信息</div>
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>收款公司:</span></td>
            <td class="withdraw_table_row_value"><span>{{applyDetail.supplierName}}</span></td>
            <td class="info_table_row_label"><span>付款公司:</span></td>
            <td class="withdraw_table_row_value"><span>{{applyDetail.payer}}</span></td>
          </tr>
        </table>
      </div>

      <!--申请单详情窗口 商品信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">商品信息</div>
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>亚马逊单号:</span></td>
            <td class="withdraw_table_row_value"><span>{{applyDetail.orderId}}</span></td>
            <td class="info_table_row_label"><span>商品ASIN:</span></td>
            <td class="withdraw_table_row_value"><span>{{applyDetail.asin}}</span></td>
          </tr>
          <tr>
            <td class="info_table_row_label"><span>商品SKU:</span></td>
            <td><span>{{applyDetail.sku}}</span></td>
            <td class="info_table_row_label"><span>品牌:</span></td>
            <td><span>{{applyDetail.brand}}</span></td>
          </tr>
          <tr>
            <td class="info_table_row_label"><span>国家:</span></td>
            <td><span>{{applyDetail.country}}</span></td>
            <td class="info_table_row_label"><span>渠道:</span></td>
            <td><span>{{applyDetail.channel}}</span></td>
          </tr>
        </table>
      </div>

      <!--申请单详情窗口 付款信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">付款信息</div>
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>商品价格:</span></td>
            <td width="80px"><span>{{applyDetail.price}}</span></td>
            <td style="width: 270px;">
              <span v-if="applyDetail.priceBillStatus===4" style="color: green">已打款</span>
              <span v-else-if="applyDetail.priceBillStatus===5" style="color: red">打款失败</span>
            </td>
            <td class="info_table_row_label"><span>价格币种:</span></td>
            <td class="withdraw_table_row_value"><span>{{applyDetail.priceCurrency}}</span></td>
          </tr>

          <tr>
            <td class="info_table_row_label"><span>佣金金额:</span></td>
            <td><span>{{applyDetail.commission}}</span></td>
            <td>
              <span v-if="applyDetail.commissionBillStatus===4" style="color: green">已打款</span>
              <span v-else-if="applyDetail.commissionBillStatus===5" style="color: red">打款失败</span>
            </td>
            <td class="info_table_row_label"><span>佣金币种:</span></td>
            <td><span>{{applyDetail.commissionCurrency}}</span></td>
          </tr>

          <tr>
            <td class="info_table_row_label"><span>手续费:</span></td>
            <td><span>{{applyDetail.serviceFee}}</span></td>
            <td>
              <span v-if="applyDetail.serviceFeeBillStatus===4" style="color: green">已打款</span>
              <span v-else-if="applyDetail.serviceFeeBillStatus===5" style="color: red">打款失败</span>
            </td>
            <td class="info_table_row_label"><span>手续费币种:</span></td>
            <td><span>{{applyDetail.serviceFeeCurrency}}</span></td>
          </tr>
        </table>
      </div>

      <!--申请单详情窗口 其他信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">其他信息(非必填)</div>
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>备注信息:</span></td>
            <td><span>{{applyDetail.remark}}</span></td>
          </tr>
          <tr>
            <td class="info_table_row_label"><span>附件:</span></td>
            <td>
              <div v-for="(item, index) in infoFileList" :key="item.id" style="display: inline-block; margin-right: 10px">
                <div class="file_card" style="margin-right: 10px; cursor: pointer; color: deepskyblue;">
                  <a @click="downloadAttchment(item)" download="" :href="'http://api-data.srv.nearbyexpress.com/api/dfilecenter/file/download/' + item.fileKey">
                    <div class="dialog_card">
                      <div>{{item.name}}</div>
                      <div>{{item.size + ' '}}<span style="text-decoration:underline">点击下载</span></div>
                    </div>
                  </a>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>

    <!-- 审批窗口 -->
    <el-dialog title="审批" :visible.sync="auditDialogVisible" v-loading="fullScreenLoading" :before-close="closeAuditDialog" width="60%" v-dialog-drag top="12vh">
      <el-form v-model="auditForm">
        <el-form-item label="审批结果" prop="isPass" label-width="100px">
          <el-select v-model="auditForm.isPass" placeholder="请选择" clearable>
            <el-option label="通过" :key="1" :value="1"/>
            <el-option label="驳回" :key="0" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注意见" prop="auditRemark" label-width="100px">
          <el-input type="textarea" v-model="auditForm.remark" :autosize="{minRows: 5, maxRows: 6}" placeholder="请输入"/>
        </el-form-item>
        <div style="text-align: center;margin-top: 10px">
          <el-button type="primary" v-waves @click="auditBill">确定</el-button>
          <el-button type="primary" v-waves @click="closeAuditDialog">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getBillList,
    getBill,
    getBillData,
    auditBill
  } from '../../../api/finance/publicPayment/publicPaymentBill';
  import {getInfo} from '../../../api/finance/publicPayment/publicPaymentApply';

  export default {
    name: "publicPaymentBillAudit",
    data() {
      return {
        selectedBillRow: {},
        applyDetail: {},
        listLoading: false,
        fullScreenLoading: false,
        billInfoDialogVisible: false,
        applyInfoDialogVisible: false,
        auditDialogVisible: false,
        billTableHeight: window.innerHeight * 0.77,
        auditLogList: [],
        auditLogShowList: [],
        auditLogCompletedList: [{nodeName: '提交单据'},{nodeName: '主管审批'},{nodeName: '事业部负责人审批'},{nodeName: '会计审批'}],
        infoFileList: [],
        listQuery: {page: 1, limit: 20},
        billDataList: {dataList: [], total: undefined},
        getBillDataForm: {
          id: undefined,
          page: 1,
          limit: 20
        },
        // 查看详情数据
        billData: {dataList: [], total: undefined},
        auditForm: {
          idList:[],
          isPass: undefined,
          remark: undefined
        }
      }
    },
    created() {
      this.getBillList();
    },
    methods: {
      getBillList() {
        this.listLoading = true;
        getBillList(this.listQuery).then(response => {
          if (response.resCode === 200) {
            this.billDataList.dataList = response.data.rows;
            this.billDataList.total = response.data.total;
          } else {
            this.$message.error("查询失败");
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error("查询失败");
        });
      },
      handleBillSizeChange(val) {
        this.listQuery.limit = val;
        this.getBillList();
      },
      handleBillPageChange(val) {
        this.listQuery.page = val;
        this.getBillList();
      },
      reset() {
        this.listQuery.page = 1;
        this.listQuery.limit = 20;
        this.getBillList();
      },
      openBillInfoDialog(row) {
        this.selectedBillRow = row;
        this.getBill(row.id);
        this.getBillData(row.id);
        this.billInfoDialogVisible = true;
      },
      getBill(id) {
        this.listLoading = true;
        return getBill({id: id}).then(response => {
          if (response.resCode === 200) {
            this.selectedBillRow = response.data;
          } else {
            this.$message.error("查询单据失败");
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error("查询单据失败");
        });
      },
      getBillData(id) {
        this.fullScreenLoading = true;
        this.getBillDataForm.id = id;
        getBillData(this.getBillDataForm).then(response => {
          if(response.resCode === 200) {
            this.billData.dataList = response.data.dataList;
          } else {
            this.$message.error("查询付款单详情失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询付款单详情失败");
        });
      },
      closeBillInfoDialog() {
        this.billInfoDialogVisible = false;
      },
      handleInfoSizeChange(val) {
        this.getBillDataForm.limit = val;
        this.getBillData(this.selectedBillRow.id);
      },
      handleInfoPageChange(val) {
        this.getBillDataForm.page = val;
        this.getBillData(this.selectedBillRow.id);
      },
      openApplyInfoDialogFromBill(id) {
        this.getApplyInfo(id);
        this.applyInfoDialogVisible = true;
      },
      getApplyInfo(id) {
        this.fullScreenLoading = true;
        getInfo({id: id}).then(response => {
          if (response.resCode === 200) {
            this.applyDetail = response.data;
            this.auditLogList = response.data.auditLogList.concat();
            this.infoFileList = response.data.fileList;
            // 填充完整步骤条
            if (this.auditLogList.length > 0) {
              this.auditLogShowList = response.data.auditLogList.concat();
              for (let i = 0,showSize = this.auditLogShowList.length; i <= this.auditLogCompletedList.length - showSize - 1; i++) {
                this.auditLogShowList.push(this.auditLogCompletedList[showSize + i]);
              }
            } else {
              this.auditLogShowList = [];
            }
          } else {
            this.$message.error("查询审批日志失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询审批日志失败");
        });
      },
      closeApplyInfoDialog() {
        this.applyInfoDialogVisible = false;
      },
      openAuditDialog(row) {
        this.selectedBillRow = row;
        this.auditForm.idList = [row.id];
        this.auditForm.isPass = undefined;
        this.auditForm.remark = undefined;
        this.auditDialogVisible = true;
      },
      openMultipleAuditDialog() {
        let selection = this.$refs.billDataTableRef.selection;
        if (selection.length === 0) {
          this.$message.error("请勾选单据");
          return;
        }
        this.auditForm.idList = [];
        this.auditForm.isPass = undefined;
        this.auditForm.remark = undefined;
        for (let i = 0; i <= selection.length - 1; i++) {
          this.auditForm.idList.push(selection[i].id);
        }
        this.auditDialogVisible = true;
      },
      closeAuditDialog() {
        this.auditDialogVisible = false;
      },
      auditBill() {
        if(this.auditForm.isPass === undefined) {
          this.$message.error("请选择审批结果");
          return;
        }
        this.fullScreenLoading = true;
        auditBill(this.auditForm).then(response => {
          if (response.resCode === 200) {
            this.getBillList();
            this.auditDialogVisible = false;
            this.$message.success("审批成功");
          } else {
            this.$message.error("审批失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("审批失败");
        });
      }
    }
  }
</script>

<style scoped>
  .dialog_class >>> .el-dialog__body {
    padding: 10px 20px 30px 20px;
  }

  .dialog_card {
    margin-top: 10px;
    padding: 8px;
    border: 1px solid;
    width: 100%;
  }

  .info_table_row_label {
    width: 90px;
  }

  .info_table_row_label span {
    float: right;
    margin-right: 10px;
  }

  .withdraw_table_row_value {
    width: 350px;
  }
</style>
