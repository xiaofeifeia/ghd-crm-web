<template>
  <div class="app-container calendar-list-container fixed_table" v-loading="fullScreenLoading">
    <!--数据列表-->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="待生成付款单" name="waitGenerating">
        <el-form v-model="selectedBillRow" style="display: flex; flex-wrap: wrap; float: left">
          <el-form-item class="query_item" label="收款公司" label-width="100px">
            <el-autocomplete v-model="addApplyQuery.supplierName" placeholder="请输入收款公司" :trigger-on-focus="true"
                             :fetch-suggestions="searchPayee" @select="handleSelectSupplierName"/>
          </el-form-item>
          <el-form-item class="query_item" label="收款账户" label-width="100px">
            <el-autocomplete v-model="addApplyQuery.bankNameAndCurrency" :disabled="!addApplyQuery.supplierName" placeholder="请输入收款账户"
                             :trigger-on-focus="true" :fetch-suggestions="searchBank" @select="handleSelectBank" style="width: 300px"/>
          </el-form-item>
        </el-form>
        <span style="margin-left: 10px">已选择{{$refs.dataTableRef? $refs.dataTableRef.selection.length : 0}}项</span>
        <el-button v-waves type="info" size="small" @click="openGenerateBillDialog" style="margin-left: 10px;margin-top: 3px">生成付款单</el-button>
        <el-button v-waves type="info" size="small" @click="resetApplyTab">重置</el-button>

        <el-table :data="addApplyList.dataList" ref="dataTableRef" v-loading="listLoading" border fit highlight-current-row :height="applyTableHeight">
          <el-table-column fixed="left" width="60px" type="selection" align="center"/>
          <el-table-column fixed="left" width="60px" type="index" align="center"/>
          <el-table-column fixed="left" width="100px" align="center" label="申请日期" prop="applyDateStr">
            <template slot-scope="scope">
              {{$moment(scope.row.applyDate).format("YYYY/M/D")}}
            </template>
          </el-table-column>
          <el-table-column fixed="left" width="160px" align="center" label="申请单号" prop="applyNo"/>
          <el-table-column fixed="left" width="100px" align="center" label="组别" prop="team"/>
          <el-table-column fixed="left" width="100px" align="center" label="主管" prop="leader"/>
          <el-table-column fixed="left" width="110px" align="center" label="申请人" prop="createUserName"/>
          <el-table-column fixed="left" width="100px" align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="small" v-waves type="primary" @click="openApplyInfoDialog(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column width="160px" align="center" label="收款公司" prop="supplierName"/>
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
            <el-table-column width="120px" align="center" label="付款公司" prop="payer"/>
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
                         :current-page.sync="addApplyQuery.page" :page-sizes="[10,20,50,100,500]" :page-size="addApplyQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="addApplyList.total"/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="已生成付款单" name="hasGenerated">
        <el-form v-model="getBillForm" style="display: flex; flex-wrap: wrap;">
          <el-form-item label="状态" label-width="80px">
            <el-select v-model="getBillForm.status" placeholder="请选择" clearable @clear="getBillForm.status=undefined">
              <el-option label="已驳回" :key="-1" :value="-1"/>
              <el-option label="已撤回" :key="0" :value="0"/>
              <el-option label="事业部负责人审核" :key="2" :value="2"/>
              <el-option label="事业群负责人审核" :key="3" :value="3"/>
              <el-option label="总经办审核" :key="4" :value="4"/>
              <el-option label="会计审核" :key="5" :value="5"/>
              <el-option label="总账审核" :key="6" :value="6"/>
              <el-option label="高级财务经理审核" :key="7" :value="7"/>
              <el-option label="出纳打款" :key="8" :value="8"/>
              <el-option label="部分打款" :key="9" :value="9"/>
              <el-option label="已打款" :key="10" :value="10"/>
              <el-option label="打款失败" :key="11" :value="11"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div align="center" style="margin-bottom: 12px">
          <el-button v-waves type="primary" @click="getBillList">查询</el-button>
          <el-button v-waves type="primary" @click="resetBillTab">重置</el-button>
        </div>
        <el-table :data="billDataList.dataList" v-loading="listLoading" border fit highlight-current-row :height="billTableHeight">
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
                <el-button size="small" v-waves type="warning" @click="openSubmitDialog(scope.row)">提交付款</el-button>
                <el-button size="small" v-waves type="danger" @click="revokeBill(scope.row)">撤回</el-button>
                <el-button size="small" v-waves type="success" @click="">查看付款单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleBillSizeChange" @current-change="handleBillPageChange"
                         :current-page.sync="getBillForm.page" :page-sizes="[10,20,30,50]" :page-size="getBillForm.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="billDataList.total"/>
        </div>
      </el-tab-pane>
    </el-tabs>

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

    <!--生成付款单-->
    <el-dialog title="" :visible.sync="generateBillDialogVisible" :before-close="closeGenerateBillDialog" v-loading="fullScreenLoading" width="1000px" v-dialog-drag>
      <div v-if="haveGenerateBill" align="center" style="font-size: 24px;color: black">√ 付款单已生成</div>
      <!--生成付款单窗口 收款账户信息-->
      <div style="font-size: 18px">收款账户信息</div>
      <div class="dialog_card">
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>收款公司:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.supplierName}}</span></td>
          </tr>
          <tr>
            <td class="info_table_row_label"><span>收款账户名称:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.accountName}}</span></td>
            <td class="info_table_row_label"><span>收款银行:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.bankName}}</span></td>
            <td class="info_table_row_label"><span>收款账户:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.accountNo}}</span></td>
          </tr>
        </table>
      </div>

      <!--生成付款单窗口 支付信息-->
      <div style="font-size: 18px; margin-top: 20px">支付信息</div>
      <div class="dialog_card">
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>支付币种:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.currency}}</span></td>
            <td class="info_table_row_label"><span>支付公司:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.payer}}</span></td>
            <td class="info_table_row_label"><span>预计付款金额:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.payTotal}}</span></td>
          </tr>
        </table>
      </div>

      <div align="center" style="margin-top: 25px">
        <el-button v-if="!haveGenerateBill" v-waves type="warning" @click="generateBillAndGetBill">生成付款单</el-button>
        <el-button v-if="haveGenerateBill" v-waves type="warning" @click="openSubmitDialogFromApply">提交付款单</el-button>
        <el-button v-if="haveGenerateBill" v-waves type="warning" @click="openBillInfoDialogFromApply">查看付款单详情</el-button>
        <el-button v-waves @click="closeGenerateBillDialog">取消</el-button>
      </div>
    </el-dialog>

    <!--提交付款窗口-->
    <el-dialog title="" :visible.sync="submitBillDialogVisible" :before-close="closeSubmitBillDialog" v-loading="fullScreenLoading" width="1000px" v-dialog-drag>
      <div v-if="haveSubmitBill" align="center" style="font-size: 24px;color: black">√ 付款单提交成功</div>
      <!--提交付款窗口 收款账户信息-->
      <div style="font-size: 18px">收款账户信息</div>
      <div class="dialog_card">
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>付款单号:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.billNo}}</span></td>
            <td class="info_table_row_label"><span>收款公司:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.supplierName}}</span></td>
          </tr>
          <tr>
            <td class="info_table_row_label"><span>收款账户名称:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.accountName}}</span></td>
            <td class="info_table_row_label"><span>收款银行:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.bankName}}</span></td>
            <td class="info_table_row_label"><span>收款账户:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.accountNo}}</span></td>
          </tr>
        </table>
      </div>

      <!--提交付款窗口 支付信息-->
      <div style="font-size: 18px; margin-top: 20px">支付信息</div>
      <div class="dialog_card">
        <table style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="info_table_row_label"><span>支付币种:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.currency}}</span></td>
            <td class="info_table_row_label"><span>支付公司:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.payer}}</span></td>
            <td class="info_table_row_label"><span>预计付款金额:</span></td>
            <td class="withdraw_table_row_value"><span>{{selectedBillRow.payTotal}}</span></td>
          </tr>
        </table>
      </div>

      <div style="font-size: 18px; margin-top: 20px">付款原因</div>
      <span v-if="haveSubmitBill">{{submitBillForm.remark}}</span>
      <el-input v-else type="textarea" v-model="submitBillForm.remark" :autosize="{minRows:6, maxRows:8}" placeholder="请输入付款原因"/>

      <div align="center" style="margin-top: 25px">
        <el-button v-if="haveSubmitBill" v-waves type="primary" @click="openBillInfoDialogFromApply">查看付款单</el-button>
        <el-button v-if="!haveSubmitBill" :disabled="submitBillForm.remark===undefined||this.submitBillForm.remark.length===0" v-waves type="warning" @click="submitBill">提交付款单</el-button>
        <el-button v-waves @click="closeSubmitBillDialog">取消</el-button>
      </div>
    </el-dialog>

    <!--付款单详情页-->
    <el-dialog class="dialog_class" title="付款单详情" :before-close="closeBillInfoDialog" :visible.sync="billInfoDialogVisible" v-loading="fullScreenLoading" v-dialog-drag width="85%" top="3vh">
      <div align="center" style="margin-bottom: 10px">
        <el-button v-waves type="warning" @click="revokeBill()">撤回</el-button>
        <el-button v-waves type="success" @click="rollBillToNewStatus">再次提交付款</el-button>
        <el-button v-waves type="primary" @click="openSubmitDialogFromBillInfo">提交付款单</el-button>
        <el-button v-waves @click="closeBillInfoDialog">取消</el-button>
      </div>
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

      <div style="margin: 20px 0 10px 0">
        <span>已选择{{$refs.billDataTableRef ? $refs.billDataTableRef.selection.length : 0}}项</span>
        <el-button v-waves type="danger" size="small" @click="deleteApplyFromBill">批量移除</el-button>
        <el-button v-waves type="warning" size="small" @click="openAddBillDataDialog">添加付款</el-button>
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
              <span v-if="scope.row.contractPriceCurrency===scope.row.currency" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.priceCurrency + "   商品价格:" + scope.row.price +
                '\r\n支付币种:' + scope.row.contractPriceCurrency + "   支付金额:" + scope.row.contractPrice}}</span>
              <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.priceCurrency + "   商品价格:" + scope.row.price +
                '\r\n支付币种:' + scope.row.contractPriceCurrency + "   支付金额:" + scope.row.contractPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column width="280px" align="center" label="佣金">
            <template slot-scope="scope">
              <span v-if="scope.row.contractCommissionCurrency===scope.row.currency" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.commissionCurrency + "   商品价格:" + scope.row.commission +
                '\r\n支付币种:' + scope.row.contractCommissionCurrency + "   支付金额:" + scope.row.contractCommission}}</span>
              <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.commissionCurrency + "   商品价格:" + scope.row.commission +
                  '\r\n支付币种:' + scope.row.contractCommissionCurrency + "   支付金额:" + scope.row.contractCommission}}</span>
            </template>
          </el-table-column>
          <el-table-column width="280px" align="center" label="手续费">
            <template slot-scope="scope">
                <span v-if="scope.row.contractServiceFeeCurrency===scope.row.currency" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.serviceFeeCurrency + "   商品价格:" + scope.row.serviceFee +
                  '\r\n支付币种:' + scope.row.contractServiceFeeCurrency + "   支付金额:" + scope.row.contractServiceFee}}</span>
              <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.serviceFeeCurrency + "   商品价格:" + scope.row.serviceFee +
                  '\r\n支付币种:' + scope.row.contractServiceFeeCurrency + "   支付金额:" + scope.row.contractServiceFee}}</span>
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

    <!--添加申请单-->
    <el-dialog class="dialog_class" title="添加付款" :before-close="closeAddBillDataDialog" :visible.sync="addBillDataDialogVisible" v-loading="fullScreenLoading" v-dialog-drag width="80%" top="5vh">
      <div style="margin-bottom: 10px">
        <table width="90%">
          <tr>
            <td width="10%"><span style="float: right;margin-right: 10px;">收款公司:</span></td>
            <td width="33%">{{this.selectedBillRow.supplierName}}</td>
            <td width="10%"></td>
            <td width="23%"></td>
            <td width="10%"></td>
            <td width="23%"></td>
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
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>

      <div style="margin: 20px 0 10px 0">
        <span>已选择{{$refs.addApplyTableRef ? $refs.addApplyTableRef.selection.length : 0}}项</span>
        <el-button v-waves type="warning" size="small" @click="addApplyToBill">添加付款</el-button>
      </div>
      <!--详情 付款明细-->
      <el-table :data="addApplyList.dataList" ref="addApplyTableRef" v-loading.sync="fullScreenLoading" border fit highlight-current-row height="600px">
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
            <el-button v-waves type="primary" size="small" @click="openApplyInfoDialogFromBill(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column width="170px" align="center" label="亚马逊单号" prop="orderId"/>
        <el-table-column width="120px" align="center" label="SKU" prop="sku"/>
        <el-table-column width="120px" align="center" label="ASIN" prop="asin"/>
        <el-table-column width="100px" align="center" label="品牌" prop="brand"/>
        <el-table-column width="100px" align="center" label="国家" prop="country"/>
        <el-table-column width="120px" align="center" label="渠道" prop="channel"/>
        <el-table-column width="120px" align="center" label="Review链接" prop="link" show-overflow-tooltip/>
        <el-table-column width="280px" align="center" label="价格">
          <template slot-scope="scope">
            <span v-if="scope.row.contractPriceCurrency===scope.row.currency && (scope.row.priceBillStatus===undefined || scope.row.priceBillStatus===3)" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.priceCurrency + "   商品价格:" + scope.row.price +
              '\r\n支付币种:' + scope.row.contractPriceCurrency + "   支付金额:" + scope.row.contractPrice}}</span>
            <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.priceCurrency + "   商品价格:" + scope.row.price +
              '\r\n支付币种:' + scope.row.contractPriceCurrency + "   支付金额:" + scope.row.contractPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="center" label="佣金">
          <template slot-scope="scope">
            <span v-if="scope.row.contractCommissionCurrency===scope.row.currency && (scope.row.commissionBillStatus===undefined || scope.row.commissionBillStatus===3)" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.commissionCurrency + "   商品价格:" + scope.row.commission +
              '\r\n支付币种:' + scope.row.contractCommissionCurrency + "   支付金额:" + scope.row.contractCommission}}</span>
            <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.commissionCurrency + "   商品价格:" + scope.row.commission +
                '\r\n支付币种:' + scope.row.contractCommissionCurrency + "   支付金额:" + scope.row.contractCommission}}</span>
          </template>
        </el-table-column>
        <el-table-column width="280px" align="center" label="手续费">
          <template slot-scope="scope">
            <span v-if="scope.row.contractServiceFeeCurrency===scope.row.currency && (scope.row.serviceFeeBillStatus===undefined || scope.row.serviceFeeBillStatus===3)" style="white-space:pre-wrap;color: green">{{'商品币种:' + scope.row.serviceFeeCurrency + "   商品价格:" + scope.row.serviceFee +
              '\r\n支付币种:' + scope.row.contractServiceFeeCurrency + "   支付金额:" + scope.row.contractServiceFee}}</span>
            <span v-else style="white-space:pre-wrap">{{'商品币种:' + scope.row.serviceFeeCurrency + "   商品价格:" + scope.row.serviceFee +
                '\r\n支付币种:' + scope.row.contractServiceFeeCurrency + "   支付金额:" + scope.row.contractServiceFee}}</span>
          </template>
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
        <el-pagination @size-change="handleAddApplySizeChange" @current-change="handleAddApplyPageChange"
                       :current-page.sync="addApplyQuery.page" :page-sizes="[10,20,50,100,500]" :page-size="addApplyQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="addApplyList.total"/>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getAddApplyList,
    getBillList,
    getSupplierAndAccount,
    generateBill,
    submitBill,
    getBill,
    getBillData,
    revokeBill,
    addApply,
    deleteApplyFromBill,
    rollBillToNewStatus
  } from '../../../api/finance/publicPayment/publicPaymentBill';
  import {getInfo} from '../../../api/finance/publicPayment/publicPaymentApply';
  import {getRateList} from '../../../api/finance/currencyRate';

  export default {
    name: "publicPaymentBill",
    data() {
      return {
        selectedApplyRow: {},
        selectedBillRow: {},
        applyDetail: {},
        listLoading: false,
        fullScreenLoading: false,
        generateBillDialogVisible: false,
        applyInfoDialogVisible: false,
        submitBillDialogVisible: false,
        billInfoDialogVisible: false,
        applyTableHeight: window.innerHeight * 0.7,
        billTableHeight: window.innerHeight * 0.71,
        activeTab: 'waitGenerating',
        addApplyQuery: {
          supplierId: undefined,
          accountId: undefined,
          supplierName: undefined,
          bankNameAndCurrency: undefined,
          page: 1,
          limit: 20
        },
        getBillForm: {
          page: 1,
          limit: 20
        },
        // 已生成付款单
        billDataList: {
          dataList: [],
          total: undefined
        },
        // 添加申请单数据
        addApplyList: {
          dataList: [],
          total: undefined
        },
        generateBillForm: {
          supplierId: undefined,
          contractId: undefined,
          accountId: undefined,
          currency: undefined,
          applyIdList: [],
          payTotal: 0
        },
        submitBillForm: {
          id: undefined,
          remark: undefined
        },
        haveGenerateBill: false,
        haveSubmitBill: false,
        payeeOptions: [],
        bankOptions: [],
        auditLogList: [],
        auditLogShowList: [],
        auditLogCompletedList: [{nodeName: '提交单据'},{nodeName: '主管审批'},{nodeName: '事业部负责人审批'},{nodeName: '会计审批'}],
        infoFileList: [],
        rateList: [],
        getBillDataForm: {
          id: undefined,
          page: 1,
          limit: 20
        },
        // 查看详情数据
        billData: {
          dataList: [],
          total: undefined
        },
        addBillDataDialogVisible: false
      }
    },
    created() {
      this.getSupplierAndAccount();
      this.getAddApplyList();
      this.getRateList();
    },
    methods: {
      getList() {
        if (this.activeTab === 'waitGenerating') {
          this.getAddApplyList();
        } else if (this.activeTab === 'hasGenerated') {
          this.getBillList();
        }
      },
      getAddApplyList() {
        this.fullScreenLoading = true;
        getAddApplyList(this.addApplyQuery).then(response => {
          if (response.resCode === 200) {
            this.addApplyList.dataList = response.data.rows;
            this.addApplyList.total = response.data.total;
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询失败");
        });
      },
      getBillList() {
        this.listLoading = true;
        getBillList(this.getBillForm).then(response => {
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
      resetApplyTab() {
        this.selectedBillRow = {};
        this.generateBillForm = {};
        this.addApplyQuery = {page: 1, limit: 20};
        this.getAddApplyList();
      },
      resetBillTab() {
        this.getBillForm.page = 1;
        this.getBillForm.limit = 20;
        this.getBillList();
      },
      getRateList() {
        this.fullScreenLoading = true;
        getRateList({}).then(response => {
          if (response.resCode === 200) {
            this.rateList = response.data.rows;
          } else {
            this.$message.error("查询汇率失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询汇率失败");
        });
      },
      getSupplierAndAccount() {
        this.fullScreenLoading = true;
        getSupplierAndAccount().then(response => {
          if (response.resCode === 200) {
            this.payeeOptions = response.data;
            this.payeeOptions.forEach(item => {
              item.value = item.supplierName;
            });
          } else {
            this.$message.error("查询收款公司失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询收款公司失败");
        });
      },
      handleTabClick(tab) {
        if (tab.name === 'waitGenerating') {
          // 待生成付款单
          this.addApplyQuery = {page: 1, limit: 20};
          this.selectedBillRow = {};
          this.generateBillForm = {};
          this.getAddApplyList();
        } else if (tab.name === 'hasGenerated') {
          // 已生成付款单
          this.getBillForm.page = 1;
          this.getBillForm.limit = 20;
          this.getBillList();
        }
      },
      handleSizeChange(val) {
        this.addApplyQuery.limit = val;
        this.getAddApplyList();
      },
      handlePageChange(val) {
        this.addApplyQuery.page = val;
        this.getAddApplyList();
      },
      handleBillSizeChange(val) {
        this.getBillForm.limit = val;
        this.getBillList();
      },
      handleBillPageChange(val) {
        this.getBillForm.page = val;
        this.getBillList();
      },
      handleInfoSizeChange(val) {
        this.getBillDataForm.limit = val;
        this.getBillData(this.selectedBillRow.id);
      },
      handleInfoPageChange(val) {
        this.getBillDataForm.page = val;
        this.getBillData(this.selectedBillRow.id);
      },
      handleAddApplySizeChange(val) {
        this.addApplyQuery.limit = val;
        this.getAddApplyList();
      },
      handleAddApplyPageChange(val) {
        this.addApplyQuery.page = val;
        this.getAddApplyList();
      },
      searchPayee(str, cb) {
        let payeeOptions = this.payeeOptions;
        let results = (str ? payeeOptions.filter(this.createFilter(str)) : payeeOptions);
        cb(results);
      },
      createFilter(str) {
        return (item) => {
          return (item.value.toLowerCase().indexOf(str.toLowerCase()) >= 0);
        };
      },
      handleSelectSupplierName(item) {
        this.generateBillForm.supplierId = item.id;
        this.addApplyQuery.supplierId = item.id;
        this.bankOptions = item.accountList ? item.accountList : [];
        if (this.bankOptions.length > 0) {
          this.bankOptions.forEach(bankItem => {
            bankItem.value = bankItem.bankName + ' ' + bankItem.currency;
          });
        } else {
          this.bankOptions.push({value: '无', bankName: '无'});
        }
      },
      handleSelectBank(item) {
        this.selectedBillRow.bankName = item.bankName;
        this.selectedBillRow.accountName = item.accountName;
        this.selectedBillRow.accountNo = item.accountNo;
        this.selectedBillRow.currency = item.currency;
        this.addApplyQuery.accountId = item.id;
        this.addApplyQuery.bankNameAndCurrency = item.value;
        this.generateBillForm.accountId = item.id;
        this.generateBillForm.currency = item.currency;
        this.getAddApplyList();
      },
      searchBank(str, cb) {
        let bankOptions = this.bankOptions;
        let results = (str ? bankOptions.filter(this.createFilter(str)) : bankOptions);
        cb(results);
      },
      openGenerateBillDialog() {
        if (!this.generateBillForm.supplierId) {
          this.$message.error("请选择收款公司");
          return;
        }
        if (!this.generateBillForm.accountId) {
          this.$message.error("请选择收款账户");
          return;
        }
        let selection = this.$refs.dataTableRef.selection;
        if (selection.length === 0) {
          this.$message.error("请勾选单据");
          return;
        }
        let contractId = selection[0].contractId;
        for (let i = 0, length = selection.length; i <= length - 1; i++) {
          if (contractId !== selection[i].contractId) {
            this.$message.error("付款单只能对应一个收款公司的一个付款账户，请筛选后重试");
            return;
          }
        }
        this.selectedBillRow.payTotal = 0;
        for (let i = 0; i <= selection.length - 1; i++) {
          // 计算价格total
          if (this.selectedBillRow.currency === selection[i].contractPriceCurrency) {
            // 待支付币种与合同价格币种一致，则加入此次付款
            let rate = undefined;
            if (selection[i].priceCurrency === this.selectedBillRow.currency) {
              // 待支付币种与申请单价格币种一致
              rate = 1;
            } else {
              // 待支付币种与申请单价格币种不一致，转换币种
              for (let j = 0; j <= this.rateList.length - 1; j++) {
                if (this.rateList[j].currencyFrom === selection[i].priceCurrency &&
                  this.rateList[j].currencyTo === this.selectedBillRow.currency) {
                  rate = this.rateList[j].rate;
                  break;
                }
              }
            }
            if (rate !== undefined) {
              this.selectedBillRow.payTotal += selection[i].price * rate;
            } else {
              this.$message.error("未维护" + selection[i].priceCurrency + "折" + this.selectedBillRow.currency + "的汇率");
              return;
            }
          }
          // 计算佣金total
          if (this.selectedBillRow.currency === selection[i].contractCommissionCurrency) {
            // 待支付币种与合同佣金币种一致，则加入此次付款
            let rate = undefined;
            if (selection[i].commissionCurrency === this.selectedBillRow.currency) {
              // 待支付币种与申请单佣金币种一致
              rate = 1;
            } else {
              // 待支付币种与申请单佣金币种不一致，转换币种
              for (let j = 0; j <= this.rateList.length - 1; j++) {
                if (this.rateList[j].currencyFrom === selection[i].commissionCurrency &&
                  this.rateList[j].currencyTo === this.selectedBillRow.currency) {
                  rate = this.rateList[j].rate;
                  break;
                }
              }
            }
            if (rate !== undefined) {
              this.selectedBillRow.payTotal += selection[i].commission * rate;
            } else {
              this.$message.error("未维护" + selection[i].commissionCurrency + "折" + this.selectedBillRow.currency + "的汇率");
              return;
            }
          }
          // 计算手续费total
          if (this.selectedBillRow.currency === selection[i].contractServiceFeeCurrency) {
            // 待支付币种与合同手续费币种一致，则加入此次付款
            let rate = undefined;
            if (selection[i].serviceFeeCurrency === this.selectedBillRow.currency) {
              // 待支付币种与申请单手续费币种一致
              rate = 1;
            } else {
              // 待支付币种与申请单手续费币种不一致，转换币种
              for (let j = 0; j <= this.rateList.length - 1; j++) {
                if (this.rateList[j].currencyFrom === selection[i].serviceFeeCurrency &&
                  this.rateList[j].currencyTo === this.selectedBillRow.currency) {
                  rate = this.rateList[j].rate;
                  break;
                }
              }
            }
            if (rate !== undefined) {
              this.selectedBillRow.payTotal += selection[i].serviceFee * rate;
            } else {
              this.$message.error("未维护" + selection[i].serviceFeeCurrency + "折" + this.selectedBillRow.currency + "的汇率");
              return;
            }
          }
        }
        this.selectedBillRow.payer = this.$refs.dataTableRef.selection[0].payer;
        this.generateBillForm.contractId = contractId;
        this.generateBillForm.applyIdList = [];
        for (let i = 0; i <= selection.length - 1; i++) {
          this.generateBillForm.applyIdList.push(selection[i].id);
        }
        this.haveGenerateBill = false;
        this.generateBillDialogVisible = true;
      },
      closeGenerateBillDialog() {
        this.generateBillDialogVisible = false;
      },
      closeSubmitBillDialog() {
        this.submitBillDialogVisible =false;
      },
      generateBill() {
        this.fullScreenLoading = true;
        return generateBill(this.generateBillForm).then(response => {
          if (response.resCode === 200) {
            this.selectedBillRow = response.data;
            this.haveGenerateBill = true;
            this.getAddApplyList();
            this.$message.success("生成付款单成功");
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("生成付款单失败");
        });
      },
      async generateBillAndGetBill() {
        await this.generateBill();
        this.getBill(this.selectedBillRow.id);
      },
      closeApplyInfoDialog() {
        this.applyInfoDialogVisible = false;
      },
      openApplyInfoDialog(row) {
        this.selectedApplyRow = row;
        this.getApplyInfo(row.id);
        this.applyInfoDialogVisible = true;
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
      openSubmitDialog(row) {
        this.selectedBillRow = row;
        this.haveSubmitBill = false;
        this.submitBillForm.remark = undefined;
        this.submitBillDialogVisible = true;
      },
      openSubmitDialogFromBillInfo() {
        this.billInfoDialogVisible = false;
        this.openSubmitDialog(this.selectedBillRow);
      },
      async openSubmitDialogFromApply() {
        await this.getBill(this.selectedBillRow.id);
        this.generateBillDialogVisible = false;
        this.openSubmitDialog(this.selectedBillRow);
      },
      submitBill() {
        if (this.submitBillForm.remark === undefined || this.submitBillForm.remark.length === 0) {
          this.$message.error("请填写付款原因");
          return;
        }
        this.submitBillForm.id = this.selectedBillRow.id;
        submitBill(this.submitBillForm).then(response => {
          if (response.resCode === 200) {
            this.haveSubmitBill = true;
            this.getBillList();
            this.$message.success("提交成功");
          } else {
            this.$message.error("提交失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("提交失败");
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
      openBillInfoDialog(row) {
        this.selectedBillRow = row;
        this.getBill(row.id);
        this.getBillData(row.id);
        this.billInfoDialogVisible = true;
      },
      openBillInfoDialogFromApply() {
        this.getBill(this.selectedBillRow.id);
        this.getBillData(this.selectedBillRow.id);
        this.billInfoDialogVisible = true;
      },
      closeBillInfoDialog() {
        this.billInfoDialogVisible = false;
      },
      revokeBill(row) {
        this.selectedBillRow = row || this.selectedBillRow;
        this.$confirm('此操作将撤回付款单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullScreenLoading = true;
          revokeBill({id: this.selectedBillRow.id}).then(response => {
            if (response.resCode === 200) {
              this.getBill(this.selectedBillRow.id);
              this.getBillList();
              this.$message.success("撤回成功");
            } else {
              this.$message.error("撤回失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("撤回失败");
          });
        }).catch(error => {});
      },
      closeAddBillDataDialog() {
        this.addBillDataDialogVisible = false;
      },
      openAddBillDataDialog() {
        this.addApplyQuery.supplierId = this.selectedBillRow.supplierId;
        this.addApplyQuery.accountId = this.selectedBillRow.accountId;
        this.getAddApplyList();
        this.addBillDataDialogVisible = true;
      },
      addApplyToBill() {
        let selection = this.$refs.addApplyTableRef.selection;
        if (selection.length === 0) {
          this.$message.error("请勾选单据");
          return;
        }
        for (let i = 0; i <= selection.length - 1; i++) {
          if (selection[i].contractPrice === undefined) {
            this.$message.error("请先维护" + selection[i].priceCurrency + "折" + selection[i].contractPriceCurrency + "的汇率");
            return;
          }
          if (selection[i].contractCommission === undefined) {
            this.$message.error("请先维护" + selection[i].commissionCurrency + "折" + selection[i].contractCommissionCurrency + "的汇率");
            return;
          }
          if (selection[i].contractServiceFee === undefined) {
            this.$message.error("请先维护" + selection[i].serviceFeeCurrency + "折" + selection[i].contractServiceFeeCurrency + "的汇率");
            return;
          }
          let addApplyToBillForm = {
            applyIdList: [],
            billId: this.selectedBillRow.id,
            accountId: this.selectedBillRow.accountId,
            contractId: this.selectedBillRow.contractId
          };
          for(let i = 0;i <=selection.length - 1;i++) {
            addApplyToBillForm.applyIdList.push(selection[i].id);
          }
          this.fullScreenLoading = true;
          addApply(addApplyToBillForm).then(response => {
            if (response.resCode === 200) {
              this.getAddApplyList();
              this.getBillList();
              this.getBill(this.selectedBillRow.id);
              this.getBillData(this.selectedBillRow.id);
              this.$message.success("添加成功");
            } else {
              this.$message.error("添加失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("添加失败");
          });
        }
      },
      deleteApplyFromBill() {
        let selection = this.$refs.billDataTableRef.selection;
        if (selection.length === 0) {
          this.$message.error("请勾选单据");
          return;
        }

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullScreenLoading = true;
          let form = {
            billId: this.selectedBillRow.id,
            applyIdList: []
          };
          for (let i = 0; i <= selection.length - 1; i++) {
            form.applyIdList.push(selection[i].applyId);
          }
          deleteApplyFromBill(form).then(response => {
            if (response.resCode === 200) {
              this.getBill(this.selectedBillRow.id);
              this.getBillData(this.selectedBillRow.id);
              this.getBillList();
              this.$message.success("删除成功");
            } else {
              this.$message.error("删除失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("删除失败");
          });
        }).catch(error => {});
      },
      rollBillToNewStatus() {
        this.fullScreenLoading = true;
        rollBillToNewStatus({billId: this.selectedBillRow.id}).then(response => {
          if (response.resCode === 200) {
            this.getBill(this.selectedBillRow.id);
            this.getBillList();
            this.$message.success("操作成功");
          } else {
            this.$message.error("操作失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("操作失败");
        });
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
    width: 150px;
  }

  .info_table_row_label span {
    float: right;
    margin-right: 10px;
  }

  .withdraw_table_row_value {
    width: 350px;
  }

</style>
