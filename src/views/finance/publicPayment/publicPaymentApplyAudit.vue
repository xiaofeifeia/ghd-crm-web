<template>
  <div class="app-container calendar-list-container fixed_table" v-loading="fullScreenLoading">
    <div class="filter-container">
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap">
        <el-form-item class="query_item" label="申请单号" label-width="100px">
          <el-input v-model="listQuery.applyNo" placeholder="请输入" @keyup.enter.native="getAuditList" clearable
                    @clear="listQuery.applyNo=undefined"/>
        </el-form-item>
        <el-form-item class="query_item" label="收款公司" label-width="100px">
          <el-input v-model="listQuery.supplierName" placeholder="请输入" @keyup.enter.native="getAuditList" clearable
                    @clear="listQuery.supplierName=undefined"/>
        </el-form-item>
        <el-form-item class="query_item" label="亚马逊单号" label-width="110px">
          <el-input v-model="listQuery.orderId" placeholder="请输入" @keyup.enter.native="getAuditList" clearable
                    @clear="listQuery.orderId=undefined"/>
        </el-form-item>
        <el-form-item class="query_item" label="SKU" label-width="80px">
          <el-input v-model="listQuery.sku" placeholder="请输入" @keyup.enter.native="getAuditList" clearable
                    @clear="listQuery.sku=undefined"/>
        </el-form-item>
        <el-form-item class="query_item" label="ASIN" label-width="80px">
          <el-input v-model="listQuery.asin" placeholder="请输入" @keyup.enter.native="getAuditList" clearable
                    @clear="listQuery.asin=undefined"/>
        </el-form-item>
        <el-form-item class="query_item" v-if="listQuery.type === 2" label="处理结果" label-width="100px">
          <el-select v-model="listQuery.result" clearable @clear="listQuery.result=undefined">
            <el-option label="通过" :value="1" :key="1"/>
            <el-option label="驳回" :value="2" :key="2"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" @click="getAuditList">查询</el-button>
        <el-button v-waves type="primary" @click="reset">重置</el-button>
      </div>
    </div>

    <!--数据列表-->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="待处理" name="auditing">
        <div style="margin-bottom: 10px">
          <span>已选择{{$refs.dataTableRef? $refs.dataTableRef.selection.length : 0}}项</span>
          <el-button v-waves type="primary" size="small" @click="openBatchAuditDialog">批量审批</el-button>
        </div>
        <el-table :data="dataList.dataList" ref="dataTableRef" v-loading="listLoading" border fit highlight-current-row :height="tableHeight">
          <el-table-column fixed="left" width="60px" type="selection" align="center"></el-table-column>
          <el-table-column fixed="left" width="60px" type="index" align="center"></el-table-column>
          <el-table-column fixed="left" width="100px" align="center" label="申请日期" prop="applyDateStr"/>
          <el-table-column fixed="left" width="170px" align="center" label="申请单号" prop="applyNo"/>
          <el-table-column fixed="left" width="180px" align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="small" v-waves type="primary" @click="openInformationDialog(scope.row)">详情</el-button>
              <el-button size="small" v-waves type="warning" @click="openAuditDialog(scope.row)">审批</el-button>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="center" label="组别" prop="team"/>
          <el-table-column width="100px" align="center" label="主管" prop="leader"/>
          <el-table-column width="110px" align="center" label="申请人" prop="createUserName"/>
          <el-table-column width="170px" align="center" label="收款公司" prop="supplierName"/>
          <el-table-column align="center" label="商品信息">
            <el-table-column width="170px" align="center" label="亚马逊单号" prop="orderId"/>
            <el-table-column width="110px" align="center" label="SKU" prop="sku"/>
            <el-table-column width="120px" align="center" label="ASIN" prop="asin"/>
            <el-table-column width="110px" align="center" label="品牌" prop="brand"/>
            <el-table-column width="80px" align="center" label="国家" prop="country"/>
            <el-table-column width="130px" align="center" label="渠道" prop="channel"/>
            <el-table-column width="150px" align="center" label="review链接" prop="link" show-overflow-tooltip/>
          </el-table-column>
          <el-table-column align="center" label="付款信息">
            <el-table-column width="120px" align="center" label="价格" prop="price"/>
            <el-table-column width="80px" align="center" label="价格币种" prop="priceCurrency"/>
            <el-table-column width="120px" align="center" label="佣金" prop="commission"/>
            <el-table-column width="80px" align="center" label="佣金币种" prop="commissionCurrency"/>
            <el-table-column width="120px" align="center" label="手续费" prop="serviceFee"/>
            <el-table-column width="100px" align="center" label="手续费币种" prop="serviceFeeCurrency"/>
            <el-table-column width="150px" align="center" label="付款公司" prop="payer"/>
          </el-table-column>
          <el-table-column width="200px" align="center" label="备注" prop="remark"/>
          <el-table-column width="150px" align="center" label="附件">
            <template slot-scope="scope">
              <span>{{scope.row.fileCount}}个附件</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                         :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="dataList.total"/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="audited">
        <el-table :data="dataList.dataList" v-loading="listLoading" border fit highlight-current-row :height="tableHeight">
          <el-table-column fixed="left" type="index" align="center"></el-table-column>
          <el-table-column fixed="left" width="100px" align="center" label="申请日期" prop="applyDateStr"/>
          <el-table-column fixed="left" width="170px" align="center" label="申请单号" prop="applyNo"/>
          <el-table-column fixed="left" width="80px" align="center" label="处理结果" prop="resultStr"/>
          <el-table-column fixed="left" width="150px" align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="small" v-waves type="primary" @click="openInformationDialog(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="center" label="组别" prop="team"/>
          <el-table-column width="100px" align="center" label="主管" prop="leader"/>
          <el-table-column width="110px" align="center" label="申请人" prop="createUserName"/>
          <el-table-column width="170px" align="center" label="收款公司" prop="supplierName"/>
          <el-table-column align="center" label="商品信息">
            <el-table-column width="170px" align="center" label="亚马逊单号" prop="orderId"/>
            <el-table-column width="110px" align="center" label="SKU" prop="sku"/>
            <el-table-column width="120px" align="center" label="ASIN" prop="asin"/>
            <el-table-column width="110px" align="center" label="品牌" prop="brand"/>
            <el-table-column width="80px" align="center" label="国家" prop="country"/>
            <el-table-column width="130px" align="center" label="渠道" prop="channel"/>
            <el-table-column width="150px" align="center" label="review链接" prop="link" show-overflow-tooltip/>
          </el-table-column>
          <el-table-column align="center" label="付款信息">
            <el-table-column width="120px" align="center" label="价格" prop="price"/>
            <el-table-column width="80px" align="center" label="价格币种" prop="priceCurrency"/>
            <el-table-column width="120px" align="center" label="佣金" prop="commission"/>
            <el-table-column width="80px" align="center" label="佣金币种" prop="commissionCurrency"/>
            <el-table-column width="120px" align="center" label="手续费" prop="serviceFee"/>
            <el-table-column width="100px" align="center" label="手续费币种" prop="serviceFeeCurrency"/>
            <el-table-column width="150px" align="center" label="付款公司" prop="payer"/>
          </el-table-column>
          <el-table-column width="200px" align="center" label="备注" prop="remark"/>
          <el-table-column width="150px" align="center" label="附件">
            <template slot-scope="scope">
              <span>{{scope.row.fileCount}}个附件</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                         :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="dataList.total"/>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!--详情窗口-->
    <el-dialog width="1090px" class="dialog_class" title="查看付款详情" :before-close="closeInfoDialog" :visible.sync="infoDialogVisible" v-loading="fullScreenLoading" v-dialog-drag top="3vh">
      <!--详情窗口 审批框-->
      <div v-if="listQuery.type === 1" class="dialog_card" style="margin-bottom: 10px">
        <div>
          <span>审核结果:</span>
          <el-select v-model="auditForm.result" size="small">
            <el-option label="通过" :value="1" :key="1"/>
            <el-option label="驳回" :value="0" :key="0"/>
          </el-select>
          <el-button style="margin-left: 5px;padding:9px 25px" size="small" v-waves type="primary" @click="audit">提交</el-button>
        </div>
        <div style="display: inline-block;margin: 10px 0 5px 0">
          <span style="vertical-align: top">审核备注:</span>
          <el-input v-model="auditForm.remark" type="textarea" :autosize="{minRows: 4, maxRows: 5}" style="width: 500px"></el-input>
        </div>
      </div>

      <!--详情窗口 基础信息-->
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

      <!--详情窗口 审批信息-->
      <div class="dialog_card" v-if="auditLogList.length > 0 && applyDetail.status !== 0">
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

      <!--详情窗口 收付款信息-->
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

      <!--详情窗口 商品信息-->
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

      <!--详情窗口 付款信息-->
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

      <!--详情窗口 其他信息-->
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
              <div v-for="(item, index) in fileList" :key="item.id" style="display: inline-block; margin-right: 10px">
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

      <div v-if="listQuery.type === 2" align="center" style="padding-top: 15px">
        <el-button v-waves @click="closeInfoDialog" style="margin-left: 20px">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量审批" class="dialog_class" :visible.sync="batchAuditDialogVisible" :before-close="closeBatchAuditDialog" v-loading="fullScreenLoading" v-dialog-drag>
      <div>已勾选{{$refs.dataTableRef ? $refs.dataTableRef.selection.length : 0}}个待处理单据</div>
      <div style="margin-top: 15px">
        <span>审批结果:</span>
        <el-select v-model="auditForm.result">
          <el-option label="通过" :key="1" :value="1"/>
          <el-option label="驳回" :key="0" :value="0"/>
        </el-select>
      </div>
      <div align="center">
        <el-button v-waves type="primary" @click="batchAudit">确定</el-button>
        <el-button v-waves type="primary" @click="closeBatchAuditDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- 审批窗口 -->
    <el-dialog title="审批" :visible.sync="auditDialogVisible" v-loading="fullScreenLoading" :before-close="closeAuditDialog" width="60%" v-dialog-drag top="12vh">
      <el-form v-model="auditForm">
        <el-form-item label="审批结果" prop="isPass" label-width="100px">
          <el-select v-model="auditForm.result" placeholder="请选择" clearable>
            <el-option label="通过" :key="1" :value="1"/>
            <el-option label="驳回" :key="0" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注意见" prop="auditRemark" label-width="100px">
          <el-input type="textarea" v-model="auditForm.remark" :autosize="{minRows: 5, maxRows: 6}" placeholder="请输入"/>
        </el-form-item>
        <div style="text-align: center;margin-top: 10px">
          <el-button type="primary" v-waves @click="audit">确定</el-button>
          <el-button type="primary" v-waves @click="closeAuditDialog">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAuditList,
    getInfo,
    audit
  } from '../../../api/finance/publicPayment/publicPaymentApply';

  export default {
    name: "publicPaymentApplyAudit",
    data() {
      return {
        selectedRow: undefined,
        listLoading: false,
        fullScreenLoading: false,
        tableHeight: window.innerHeight * 0.65,
        infoDialogVisible: false,
        auditDialogVisible: false,
        batchAuditDialogVisible: false,
        applyDetail: {},
        activeTab: 'auditing',
        listQuery: {
          type: 1,
          applyNo: undefined,
          supplierName: undefined,
          orderId: undefined,
          sku: undefined,
          asin: undefined,
          page: 1,
          limit: 20
        },
        dataList: {
          dataList: [],
          total: undefined
        },
        auditLogList: [],
        auditLogShowList: [],
        auditLogCompletedList: [{nodeName: '提交单据'},{nodeName: '主管审批'},{nodeName: '事业部负责人审批'},{nodeName: '会计审批'}],
        fileList: [],
        auditForm: {
          idList: [],
          result: undefined,
          remark: undefined
        }
      }
    },
    created() {
      this.getAuditList();
    },
    methods: {
      getAuditList() {
        this.listLoading = true;
        getAuditList(this.listQuery).then(response => {
          if(response.resCode === 200) {
            this.dataList.dataList = response.data.rows;
            this.dataList.total = response.data.total;
          } else {
            this.$message.error("查询失败");
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error("查询失败");
        });
      },
      reset() {
        for (let key in this.listQuery) {
          if (key !== 'type') {
            this.listQuery[key] = undefined;
          }
        }
        this.listQuery.page = 1;
        this.listQuery.limit = 20;
        this.getAuditList();
      },
      handleTabClick(tab) {
        if (tab.name === 'auditing') {
          // 待处理
          this.listQuery.type = 1;
          this.getAuditList();
        } else if(tab.name === 'audited') {
          // 已处理
          this.listQuery.type = 2;
          this.getAuditList();
        }
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getAuditList();
      },
      handlePageChange(val) {
        this.listQuery.page = val;
        this.getAuditList();
      },
      closeInfoDialog() {
        for (let key in this.auditForm) {
          this.auditForm[key] = undefined;
        }
        this.auditLogList = [];
        this.infoDialogVisible = false;
      },
      closeBatchAuditDialog() {
        for (let key in this.auditForm) {
            this.auditForm[key] = undefined;
        }
        this.auditForm.idList = [];
        this.batchAuditDialogVisible = false;
      },
      getInfo(row) {
        this.selectedRow = row;
        this.fullScreenLoading = true;
        getInfo({id: row.id}).then(response => {
          if(response.resCode === 200) {
            this.applyDetail = response.data;
            this.auditLogList = response.data.auditLogList.concat();
            this.fileList = response.data.fileList;
            // 填充完整步骤条
            if (this.auditLogList.length > 0) {
              this.auditLogShowList = response.data.auditLogList.concat();
              for (let i = 0,showSize = this.auditLogShowList.length; i <= this.auditLogCompletedList.length - showSize - 1; i++) {
                this.auditLogShowList.push(this.auditLogCompletedList[showSize + i]);
              }
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
      audit() {
        if(this.auditForm.result === undefined) {
          this.$message.warning("请选择审批结果");
          return ;
        }
        this.fullScreenLoading = true;
        this.auditForm.idList = [this.selectedRow.id];
        audit(this.auditForm).then(response => {
          if(response.resCode === 200) {
            this.infoDialogVisible = false;
            this.$message.success("审批成功");
            this.getAuditList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("审批失败");
        });
      },
      batchAudit() {
        if(this.auditForm.result === undefined) {
          this.$message.warning("请选择审批结果");
          return;
        }
        this.fullScreenLoading = true;
        let selection = this.$refs.dataTableRef.selection;
        this.auditForm.idList = [];
        for (let i in selection) {
          this.auditForm.idList.push(selection[i].id);
        }
        audit(this.auditForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("审批成功");
            this.closeBatchAuditDialog();
            this.getAuditList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("审批失败");
        });
      },
      openBatchAuditDialog() {
        if (this.$refs.dataTableRef.selection.length === 0) {
          this.$message.error("请勾选单据");
          return;
        }
        this.batchAuditDialogVisible = true;
      },
      openInformationDialog(row) {
        this.getInfo(row);
        this.infoDialogVisible = true;
      },
      openAuditDialog(row) {
        this.selectedRow = row;
        this.auditForm = {};
        this.auditDialogVisible = true;
      },
      closeAuditDialog() {
        this.auditDialogVisible = false;
      }
    }
  }
</script>

<style scoped>
  .query_item {
    margin-bottom: 12px;
  }

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

  .file_card a:hover {
    color: #FF0000;
    border: 1px solid red;
  }

</style>
