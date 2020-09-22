<template>
  <div class="app-container calendar-list-container fixed_table" v-loading="fullScreenLoading">
    <div class="filter-container">
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap;">
        <el-form-item label="申请单号" label-width="100px">
          <el-input v-model="listQuery.applyNo" placeholder="请输入" @keyup.enter.native="getApplyList" clearable @clear="listQuery.applyNo=undefined"/>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable @clear="listQuery.status=undefined">
            <el-option label="已驳回" :key="-2" :value="-2"/>
            <el-option label="已撤回" :key="-1" :value="-1"/>
            <el-option label="新建" :key="0" :value="0"/>
            <el-option label="待主管审批" :key="1" :value="1"/>
            <el-option label="待事业部负责人审批" :key="2" :value="2"/>
            <el-option label="待会计审批" :key="3" :value="3"/>
            <el-option label="待生成打款单" :key="4" :value="4"/>
            <el-option label="部分打款" :key="5" :value="5"/>
            <el-option label="已打款" :key="6" :value="6"/>
            <el-option label="打款失败" :key="7" :value="7"/>
          </el-select>
        </el-form-item>
        <el-form-item label="收款公司" label-width="100px">
          <el-input v-model="listQuery.supplierName" placeholder="请输入" @keyup.enter.native="getApplyList" clearable @clear="listQuery.payee=undefined"/>
        </el-form-item>
        <el-form-item label="亚马逊单号" label-width="110px">
          <el-input v-model="listQuery.orderId" placeholder="请输入" @keyup.enter.native="getApplyList" clearable @clear="listQuery.orderId=undefined"/>
        </el-form-item>
        <el-form-item label="SKU" label-width="80px">
          <el-input v-model="listQuery.sku" placeholder="请输入" @keyup.enter.native="getApplyList" clearable @clear="listQuery.sku=undefined"/>
        </el-form-item>
        <el-form-item label="ASIN" label-width="80px">
          <el-input v-model="listQuery.asin" placeholder="请输入" @keyup.enter.native="getApplyList" clearable @clear="listQuery.asin=undefined"/>
        </el-form-item>
        <el-form-item label="申请时间" label-width="100px">
          <el-date-picker v-model="applyDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" @click="getApplyList">查询</el-button>
        <el-button v-waves type="primary" @click="reset">重置</el-button>
        <el-button v-waves type="primary" @click="openAddDialog">新增付款</el-button>
        <el-button v-waves type="primary" @click="exportData">导出报表</el-button>
        <el-button v-waves type="primary" @click="downloadTemplate">下载模版</el-button>
        <el-upload action="/api/finance/publicPaymentApply/importData" style="display: inline-block; margin-left: 10px" ref="uploadTemplate"
                   name="excel" :headers="headers" :data="{userId: this.userId}" :limit="1"
                   :on-success="uploadTemplate" :on-error="uploadError"  :before-upload="beforeUpload"
                   accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button v-waves type="primary">导入模版</el-button>
        </el-upload>
      </div>
    </div>

    <!--数据列表-->
    <el-table :data="dataList.dataList" v-loading="listLoading" fit highlight-current-row
              :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight * 0.69">
      <el-table-column fixed="left" type="index" align="center"></el-table-column>
      <el-table-column fixed="left" min-width="100px" align="center" label="申请日期" prop="applyDateStr"/>
      <el-table-column fixed="left" min-width="170px" align="center" label="申请单号" prop="applyNo"/>
      <el-table-column fixed="left" min-width="140px" align="center" label="状态" prop="statusStr"/>
      <el-table-column fixed="left" min-width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" v-waves type="success" @click="openInformationDialog(scope.row)">查看详情</el-button>
          <el-button v-if="userId===scope.row.createUserId.toString() && (scope.row.status===1||scope.row.status===2||scope.row.status===3)"
                     size="mini" v-waves type="warning" @click="revoke(scope.row)">撤回</el-button>
          <el-button v-if="userId===scope.row.createUserId.toString() && (scope.row.status===-2||scope.row.status===-1||scope.row.status===0)"
                     size="mini" v-waves type="danger" @click="deleteById(scope.row)">删除</el-button>
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
        <el-table-column width="150px" align="center" label="付款公司" prop="payer"/>
      </el-table-column>
      <el-table-column width="250px" align="center" label="备注" prop="remark" show-overflow-tooltip/>
      <el-table-column width="150px" align="center" label="附件">
        <template slot-scope="scope">
          <span>{{scope.row.fileCount}}个附件</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 10px">
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="dataList.total"/>
    </div>

    <!--新建窗口-->
    <el-dialog class="dialog_class" title="新建对公付款申请" :before-close="closeAddDialog" :visible.sync="addDialogVisible" v-loading="fullScreenLoading" v-dialog-drag top="3vh">
      <div>
        <span style="padding-right: 100px">申请人: {{userName}}</span>
        <span>组别: </span>
        <el-autocomplete v-model="addForm.team" placeholder="请输入组别" @select="getActiveByTeamName" :fetch-suggestions="queryTeam" style="padding-right: 100px" size="small"/>
        <span>主管: </span>
        <el-autocomplete v-model="addForm.leader" placeholder="请输入主管" :fetch-suggestions="queryLeader" size="small"/>
      </div>

      <!--新建窗口 收付款信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">收付款信息</div>
        <table width="100%" style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="add_dialog_table_col1"><span class="add_dialog_table_label">收款公司:</span></td>
            <td class="add_dialog_table_col2"><el-autocomplete v-model="supplierName" placeholder="输入组别后选择收款公司" @select="handleSelectSupplier" :fetch-suggestions="querySupplier" size="small" style="width: 250px"/></td>
            <td class="add_dialog_table_col3"><span v-if="!!payer" class="add_dialog_table_label">付款公司:</span></td>
            <td class="add_dialog_table_col4"><span v-if="!!payer">{{payer}}</span></td>
          </tr>
        </table>
      </div>

      <!--新建窗口 商品信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">商品信息</div>
        <table width="100%" style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="add_dialog_table_col1"><span class="add_dialog_table_label">亚马逊单号:</span></td>
            <td class="add_dialog_table_col2"><el-input v-model="addForm.orderId" placeholder="请输入亚马逊订单号" style="width: 250px" size="small"/></td>
            <td class="add_dialog_table_col3"><span class="add_dialog_table_label">商品ASIN:</span></td>
            <td class="add_dialog_table_col4"><el-input v-model="addForm.asin" placeholder="请输入商品ASIN" style="width: 250px" size="small"/></td>
          </tr>
          <tr>
            <td><span class="add_dialog_table_label">商品SKU:</span></td>
            <td><el-input v-model="addForm.sku" placeholder="请输入商品SKU" style="width: 250px" size="small"/></td>
            <td><span class="add_dialog_table_label">品牌:</span></td>
            <td><el-input v-model="addForm.brand" placeholder="请输入品牌" style="width: 250px" size="small"/></td>
          </tr>
          <tr>
            <td><span class="add_dialog_table_label">国家:</span></td>
            <td><el-autocomplete v-model="addForm.country" placeholder="请输入国家" @select="handleSelectCountry" :fetch-suggestions="queryCountry" style="width: 250px" size="small"/></td>
            <td><span class="add_dialog_table_label">渠道:</span></td>
            <td><el-autocomplete v-model="addForm.channel" placeholder="请输入渠道" :fetch-suggestions="queryChannel" style="width: 250px" size="small"/></td>
          </tr>
        </table>
      </div>

      <!--新建窗口 付款信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">付款信息</div>
        <table width="100%" style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td class="add_dialog_table_col1"><span class="add_dialog_table_label">商品价格:</span></td>
            <td class="add_dialog_table_col2"><el-input v-model="addForm.price" placeholder="请输入商品价格" style="width: 250px" size="small"/></td>
            <td class="add_dialog_table_col3"><span class="add_dialog_table_label">价格币种:</span></td>
            <td class="add_dialog_table_col4"><span>{{addForm.priceCurrency}}</span></td>
          </tr>
          <tr>
            <td><span class="add_dialog_table_label">佣金金额:</span></td>
            <td><el-input v-model="addForm.commission" placeholder="请输入佣金金额" style="width: 250px" size="small"/></td>
            <td><span class="add_dialog_table_label">佣金币种:</span></td>
            <td><el-autocomplete v-model="addForm.commissionCurrency" placeholder="请输入佣金币种" :fetch-suggestions="queryCurrency" style="width: 250px" size="small"/></td>
          </tr>
          <tr>
            <td><span class="add_dialog_table_label">手续费:</span></td>
            <td><el-input v-model="addForm.serviceFee" placeholder="请输入手续费" style="width: 250px" size="small"/></td>
            <td><span class="add_dialog_table_label">手续费币种:</span></td>
            <td><span>{{addForm.serviceFeeCurrency}}</span></td>
          </tr>
        </table>
      </div>

      <!--新建窗口 其他信息-->
      <div class="dialog_card">
        <div style="font-size: 18px">其他信息(非必填)</div>
        <table width="100%" style="border-collapse:separate;border-spacing:0px 10px;">
          <tr>
            <td><div style="float: left; margin-left: 0px;"><span>Review链接:</span>
            <el-input v-model="addForm.link" placeholder="请输入Review链接" style="width: 250px" size="small"/>
            </div></td>
          </tr>
          <tr>
            <td><div style="float: left; margin-left: 17px;"><span>备注信息:</span></div>
            <div style="float: left; margin-left: 5px; display: inline-block;vertical-align: top">
              <el-input v-model="addForm.remark" type="textarea" :autosize="{minRows: 4, maxRows: 5}" placeholder="请输入此次申请的备注信息" style="width: 600px" size="small"/>
            </div></td>
          </tr>
          <tr>
            <td><div style="float:left; margin-left: 45px"><span>附件:</span></div>
            <el-upload :file-list="addForm.fileList" action="http://api-data.srv.nearbyexpress.com/api/dfilecenter/file/upload"
                       ref="uploadAttachment" name="excel" :headers="headers" drag multiple
                       style="margin-left: 5px; display: inline-block; vertical-align: top" :before-upload="beforeUpload" :on-success="uploadAttachment">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            </el-upload>
            </td>
          </tr>
        </table>
      </div>

      <div align="center" style="padding-top: 15px">
        <el-button v-waves type="success" @click="addPayment">提交</el-button>
        <el-button v-waves @click="closeAddDialog" style="margin-left: 40px">取消</el-button>
      </div>
    </el-dialog>

    <!--详情窗口-->
    <el-dialog width="1090px" class="dialog_class" title="查看付款详情" :before-close="closeInfoDialog" :visible.sync="infoDialogVisible" v-loading="fullScreenLoading" v-dialog-drag top="3vh">
    <table>
      <tr>
        <td class="info_table_row_label"><span>申请单号:</span></td>
        <td width="200px"><span>{{selectedRow.applyNo}}</span></td>
        <td class="info_table_row_label"><span>申请时间:</span></td>
        <td width="200px"><span>{{selectedRow.applyDateStr}}</span></td>
        <td class="info_table_row_label"><span>状态:</span></td>
        <td width="200px"><span>{{selectedRow.statusStr}}</span></td>
      </tr>
      <tr>
        <td class="info_table_row_label"><span>申请人:</span></td>
        <td><span>{{selectedRow.createUserName}}</span></td>
        <td class="info_table_row_label"><span>组别:</span></td>
        <td><span>{{selectedRow.team}}</span></td>
        <td class="info_table_row_label"><span>主管:</span></td>
        <td><span>{{selectedRow.leader}}</span></td>
      </tr>
    </table>

    <!--详情窗口 审批信息-->
    <div class="dialog_card" v-if="auditLogShowList.length > 0 && selectedRow.status !== 0">
      <el-steps :active="auditLogList.length" align-center>
        <el-step v-for="(item,index) in auditLogShowList" :title="item.nodeName" :key="index"
                 :status="item.result === 1 ? 'success' : (item.result === 0 || item.result === -1 ?'error':'')">
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
          <td class="withdraw_table_row_value"><span>{{selectedRow.supplierName}}</span></td>
          <td class="info_table_row_label"><span>付款公司:</span></td>
          <td class="withdraw_table_row_value"><span>{{selectedRow.payer}}</span></td>
        </tr>
      </table>
    </div>

    <!--详情窗口 商品信息-->
    <div class="dialog_card">
      <div style="font-size: 18px">商品信息</div>
      <table style="border-collapse:separate;border-spacing:0px 10px;">
        <tr>
          <td class="info_table_row_label"><span>亚马逊单号:</span></td>
          <td class="withdraw_table_row_value"><span>{{selectedRow.orderId}}</span></td>
          <td class="info_table_row_label"><span>商品ASIN:</span></td>
          <td class="withdraw_table_row_value"><span>{{selectedRow.asin}}</span></td>
        </tr>
        <tr>
          <td class="info_table_row_label"><span>商品SKU:</span></td>
          <td><span>{{selectedRow.sku}}</span></td>
          <td class="info_table_row_label"><span>品牌:</span></td>
          <td><span>{{selectedRow.brand}}</span></td>
        </tr>
        <tr>
          <td class="info_table_row_label"><span>国家:</span></td>
          <td><span>{{selectedRow.country}}</span></td>
          <td class="info_table_row_label"><span>渠道:</span></td>
          <td><span>{{selectedRow.channel}}</span></td>
        </tr>
      </table>
    </div>

    <!--详情窗口 付款信息-->
    <div class="dialog_card">
      <div style="font-size: 18px">付款信息</div>
      <table style="border-collapse:separate;border-spacing:0px 10px;">
        <tr>
          <td class="info_table_row_label"><span>商品价格:</span></td>
          <td width="80px"><span>{{selectedRow.price}}</span></td>
          <td style="width: 270px;">
            <span v-if="selectedRow.priceBillStatus===4" style="color: green">已打款</span>
            <span v-else-if="selectedRow.priceBillStatus===5" style="color: red">打款失败</span>
          </td>
          <td class="info_table_row_label"><span>价格币种:</span></td>
          <td class="withdraw_table_row_value"><span>{{selectedRow.priceCurrency}}</span></td>
        </tr>

        <tr>
          <td class="info_table_row_label"><span>佣金金额:</span></td>
          <td><span>{{selectedRow.commission}}</span></td>
          <td>
            <span v-if="selectedRow.commissionBillStatus===4" style="color: green">已打款</span>
            <span v-else-if="selectedRow.commissionBillStatus===5" style="color: red">打款失败</span>
          </td>
          <td class="info_table_row_label"><span>佣金币种:</span></td>
          <td><span>{{selectedRow.commissionCurrency}}</span></td>
        </tr>

        <tr>
          <td class="info_table_row_label"><span>手续费:</span></td>
          <td><span>{{selectedRow.serviceFee}}</span></td>
          <td>
            <span v-if="selectedRow.serviceFeeBillStatus===4" style="color: green">已打款</span>
            <span v-else-if="selectedRow.serviceFeeBillStatus===5" style="color: red">打款失败</span>
          </td>
          <td class="info_table_row_label"><span>手续费币种:</span></td>
          <td><span>{{selectedRow.serviceFeeCurrency}}</span></td>
        </tr>
      </table>
    </div>

    <!--详情窗口 其他信息-->
    <div class="dialog_card">
      <div style="font-size: 18px">其他信息(非必填)</div>
      <table style="border-collapse:separate;border-spacing:0px 10px;">
        <tr>
          <td class="info_table_row_label"><span>备注信息:</span></td>
          <td><span>{{selectedRow.remark}}</span></td>
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

    <div align="center" style="padding-top: 15px">
      <el-button v-if="userId===selectedRow.createUserId+'' && (selectedRow.status===-2||selectedRow.status===-1||selectedRow.status===0)"
                 v-waves type="success" @click="openAddDialogFromExists">再次提交申请</el-button>
      <el-button v-if="userId===selectedRow.createUserId+'' && (selectedRow.status===1||selectedRow.status===2||selectedRow.status===3)"
                 v-waves type="success" @click="revoke()">撤回</el-button>
      <el-button v-waves @click="closeInfoDialog" style="margin-left: 20px">取消</el-button>
    </div>
  </el-dialog>

    <!--导入失败窗口-->
    <el-dialog title="导入失败" :visible.sync="importErrorDialogVisible" v-loading="fullScreenLoading" v-dialog-drag width="90%" top="5vh">
      <el-table :data="importErrorList" fit highlight-current-row
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight * 0.67 + 100">
        <el-table-column width="90px" align="center" label="excel行数" prop="index" fixed="left"/>
        <el-table-column width="210px" align="center" label="错误信息" prop="errorMsg" fixed="left"/>
        <el-table-column width="160px" align="center" label="收款公司" prop="supplierName"/>
        <el-table-column width="170px" align="center" label="亚马逊单号" prop="orderId"/>
        <el-table-column width="110px" align="center" label="SKU" prop="sku"/>
        <el-table-column width="120px" align="center" label="ASIN" prop="asin"/>
        <el-table-column width="110px" align="center" label="组别" prop="team"/>
        <el-table-column width="110px" align="center" label="主管" prop="leader"/>
        <el-table-column width="110px" align="center" label="品牌" prop="brand"/>
        <el-table-column width="80px" align="center" label="国家" prop="country"/>
        <el-table-column width="110px" align="center" label="渠道" prop="channel"/>
        <el-table-column width="150px" align="center" label="review链接" prop="link" show-overflow-tooltip/>
        <el-table-column width="90px" align="center" label="价格" prop="price"/>
        <el-table-column width="100px" align="center" label="价格币种" prop="priceCurrency"/>
        <el-table-column width="90px" align="center" label="佣金" prop="commission"/>
        <el-table-column width="100px" align="center" label="佣金币种" prop="commissionCurrency"/>
        <el-table-column width="90px" align="center" label="手续费" prop="serviceFee"/>
        <el-table-column width="100px" align="center" label="手续费币种" prop="serviceFeeCurrency"/>
        <el-table-column width="250px" align="center" label="备注" prop="remark"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getApplyList,
    getInfo,
    deleteById,
    addPayment,
    revokeById
  } from '../../../api/finance/publicPayment/publicPaymentApply';
  import {getActiveByTeamName} from '../../../api/finance/publicPayment/publicPaymentSupplier';
  import {getGroupsByType} from '../../../api/finance/baseGroup';
  import {getCountryList} from '../../../api/finance/baseCountry';
  import {getConstantsByTypeAndName} from '../../../api/finance/reqPaymentConstants';
  import {mapGetters} from 'vuex';
  import Cookie from 'js-cookie';
  import Vue from 'vue';


  export default {
    name: "publicPaymentApply",
    data() {
      return {
        selectedRow: {},
        userName: undefined,
        userId: undefined,
        tableHeight: window.innerHeight,
        addDialogVisible: false,
        infoDialogVisible: false,
        importErrorDialogVisible: false,
        listLoading: false,
        fullScreenLoading: false,
        applyDate: undefined,
        listQuery: {
          applyNo: undefined,
          status: undefined,
          supplierName: undefined,
          orderId: undefined,
          sku: undefined,
          asin: undefined,
          applyDate: undefined,
          page: 1,
          limit: 10
        },
        dataList: {
          dataList: [],
          total: undefined
        },
        selectedRow: {},
        auditLogList: [],
        auditLogShowList: [],
        auditLogCompletedList: [{nodeName: '提交单据'}, {nodeName: '主管审批'}, {nodeName: '事业部负责人审批'}, {nodeName: '会计审批'}],
        infoFileList: [],
        importErrorList: [],
        supplierName: undefined,
        payer: undefined,
        addForm: {
          supplierId: undefined,
          contractId: undefined,
          orderId: undefined,
          asin: undefined,
          sku: undefined,
          team: undefined,
          leader: undefined,
          brand: undefined,
          country: undefined,
          channel: undefined,
          price: undefined,
          commission: undefined,
          serviceFee: undefined,
          priceCurrency: undefined,
          commissionCurrency: undefined,
          serviceFeeCurrency: undefined,
          link: undefined,
          remark: undefined,
          fileList: []
        },
        supplierList: [],
        currencyList: [],
        teamList: [],
        channelList: [],
        countryList: [],
        leaderList: [],
        countryCurrencyList: [],
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
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    watch: {
      applyDate() {
        this.listQuery.applyDateStart = this.applyDate ? this.formatDate(this.applyDate[0]) : undefined;
        this.listQuery.applyDateEnd = this.applyDate ? this.formatDate(this.applyDate[1]) : undefined;
      }
    },
    created() {
      this.initConstantList();
      this.userName = Cookie.get('UserName');
      this.userId = Cookie.get('UserId');
      this.getApplyList();
    },
    computed: {
      headers() {
        return {
          'Authorization': Cookie.get('Admin-Token')
        }
      }
    },
    methods: {
      getApplyList() {
        this.listLoading = true;
        getApplyList(this.listQuery).then(response => {
          if (response.resCode === 200) {
            this.dataList.dataList = response.data.rows;
            this.dataList.total = response.data.total;
          } else {
            this.$message.error("查询失败");
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      reset() {
        this.applyDate = undefined;
        for (let key in this.listQuery) {
          this.listQuery[key] = undefined;
        }
        this.listQuery.page = 1;
        this.listQuery.limit = 20;
        this.getApplyList();
      },
      getInfo(row) {
        this.fullScreenLoading = true;
        getInfo({id: row.id}).then(response => {
          if (response.resCode === 200) {
            this.selectedRow = response.data;
            this.auditLogList = response.data.auditLogList.concat();
            this.infoFileList = response.data.fileList;
            // 填充完整步骤条
            if (this.auditLogList.length > 0) {
              this.auditLogShowList = response.data.auditLogList.concat();
              for (let i = 0, showSize = this.auditLogShowList.length; i <= this.auditLogCompletedList.length - showSize - 1; i++) {
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
      openInformationDialog(row) {
        this.selectedRow = row;
        this.getInfo(row);
        this.infoDialogVisible = true;
      },
      addPayment() {
        this.fullScreenLoading = true;
        addPayment(this.addForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("提交成功");
            this.addDialogVisible = false;
            this.getApplyList();
          } else {
            this.$alert(response.resDes, "提交失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("提交失败");
        });
      },
      deleteById(row) {
        this.selectedRow = row;
        this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullScreenLoading = true;
          deleteById({id: row.id}).then(response => {
            if (response.resCode === 200) {
              this.$message.success("删除成功");
              this.getApplyList();
            } else {
              this.$message.error(response.resDes);
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("删除失败");
          });
        }).catch(() => {});
      },
      querySupplier(str, callback) {
        let supplierList = this.supplierList;
        let result = str ? supplierList.filter(this.createFilter(str)) : supplierList;
        callback(result);
      },
      queryCurrency(str, callback) {
        let currencyList = this.currencyList;
        let result = str ? currencyList.filter(this.createFilter(str)) : currencyList;
        callback(result);
      },
      queryTeam(str, callback) {
        let teamList = this.teamList;
        let result = str ? teamList.filter(this.createFilter(str)) : teamList;
        callback(result);
      },
      queryLeader(str, callback) {
        let leaderList = this.leaderList;
        let result = str ? leaderList.filter(this.createFilter(str)) : leaderList;
        callback(result);
      },
      queryCountry(str, callback) {
        let countryList = this.countryList;
        let result = str ? countryList.filter(this.createFilter(str)) : countryList;
        callback(result);
      },
      queryChannel(str, callback) {
        let channelList = this.channelList;
        let result = str ? channelList.filter(this.createFilter(str)) : channelList;
        callback(result);
      },
      createFilter(str) {
        return (item) => {
          return (item.value.toLowerCase().indexOf(str.toLowerCase()) !== -1);
        }
      },
      initConstantList() {
        // 查询币别
        getConstantsByTypeAndName({type: 2}).then(response => {
          if (response.resCode === 200) {
            let currencyList = response.data;
            for (let i = 0, length = currencyList.length; i <= length - 1; i++) {
              currencyList[i].value = currencyList[i].name;
            }
            this.currencyList = currencyList;
          } else {
            this.$message.error("查询常量失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
        // 查询组别
        getGroupsByType({type: 3}).then(response => {
          if (response.resCode === 200) {
            let teamList = response.data;
            for (let i = 0, length = teamList.length; i <= length - 1; i++) {
              teamList[i].value = teamList[i].name;
            }
            this.teamList = teamList;
          } else {
            this.$message.error("查询组别失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
        // 查询渠道
        getConstantsByTypeAndName({type: 3}).then(response => {
          if (response.resCode === 200) {
            let channelList = response.data;
            for (let i = 0, length = channelList.length; i <= length - 1; i++) {
              channelList[i].value = channelList[i].name;
            }
            this.channelList = channelList;
          } else {
            this.$message.error("查询常量失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
        // 查询国家
        getConstantsByTypeAndName({type: 4}).then(response => {
          if (response.resCode === 200) {
            let countryList = response.data;
            for (let i = 0, length = countryList.length; i <= length - 1; i++) {
              countryList[i].value = countryList[i].name;
            }
            this.countryList = countryList;
          } else {
            this.$message.error("查询常量失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
        // 查询主管
        getConstantsByTypeAndName({type: 5}).then(response => {
          if (response.resCode === 200) {
            let leaderList = response.data;
            for (let i = 0, length = leaderList.length; i <= length - 1; i++) {
              leaderList[i].value = leaderList[i].name;
            }
            this.leaderList = leaderList;
          } else {
            this.$message.error("查询组别失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
        // 查询国家币种关系
        getCountryList({}).then(response => {
          if (response.resCode === 200) {
            this.countryCurrencyList = response.data;
          } else {
            this.$message.error("查询组别失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
      },
      uploadTemplate(response) {
        this.$refs.uploadTemplate.clearFiles();
        this.fullScreenLoading = false;
        if (response.resCode != 200) {
          if (response.data) {
            this.importErrorList = response.data;
            this.importErrorDialogVisible = true;
          } else {
            this.$message.error(response.message);
          }
        } else {
          this.$message.success("导入成功");
          this.getApplyList();
        }
      },
      uploadAttachment(response, file, fileList) {
        let uploadFile = response.data;
        uploadFile.id = undefined;
        uploadFile.name = response.data.fileName;
        uploadFile.size = response.data.fileSize;
        uploadFile.mimeType = response.data.fileMimeType;
        uploadFile.fileKey = response.data.fileKey;
        uploadFile.bucketName = response.data.bucketName;
        this.addForm.fileList.push(uploadFile);
        this.fullScreenLoading = false;
      },
      uploadError(error) {
        this.fullScreenLoading = false;
        this.$message.error('导入失败，请检查excel或联系IT人员!');
      },
      beforeUpload(file) {
        this.fullScreenLoading = true;
      },
      exportData() {
        this.listLoading = true;
        let originalPage = this.listQuery.page;
        let originalLimit = this.listQuery.limit;
        this.listQuery.page = 1;
        this.listQuery.limit = 999999;
        getApplyList(this.listQuery).then(response => {
          if (response.resCode === 200) {
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['申请日期', '申请单号', '状态', '收款公司', '亚马逊单号', 'SKU', 'ASIN', '组别', '主管', '品牌', '国家', '渠道', 'review链接', '价格', '价格币种', '佣金', '佣金币种', '手续费', '手续费币种', '备注'];
              const filterVal = ['applyDateStr', 'applyNo', 'statusStr', 'supplierName', 'orderId', 'sku', 'asin', 'team', 'leader', 'brand', 'country', 'channel', 'link', 'price', 'priceCurrency', 'commission', 'commissionCurrency', 'serviceFee', 'serviceFeeCurrency', 'remark'];
              const list = response.data.rows;
              const data = this.formatJson(filterVal, list);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'publicPayment',
                autoWidth: true,
                bookType: 'xlsx'
              });
            });
          } else {
            this.$message.error("查询失败");
          }
          this.listLoading = false;
          this.listQuery.page = originalPage;
          this.listQuery.limit = originalLimit;
        }).catch(error => {
          this.listLoading = false;
          this.listQuery.page = originalPage;
          this.listQuery.limit = originalLimit;
          this.$message.error(JSON.stringify(error));
        });
      },
      downloadTemplate() {
        this.listLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['申请日期', '申请单号', '状态', '收款公司', '亚马逊单号', 'SKU', 'ASIN', '组别', '主管', '品牌', '国家', '渠道', 'review链接', '价格', '价格币种', '佣金', '佣金币种', '手续费', '手续费币种', '备注'];
          const data = [];
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'publicPaymentTemplate',
            autoWidth: true,
            bookType: 'xlsx'
          });
          this.listLoading = false;
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        }));
      },
      openAddDialog() {
        if (this.$refs.uploadAttachment) {
          this.$refs.uploadAttachment.clearFiles();
        }
        this.addForm = {fileList: []};
        this.payer = undefined;
        this.supplierName = undefined;
        this.addDialogVisible = true;
      },
      closeAddDialog() {
        this.addDialogVisible = false;
      },
      openAddDialogFromExists() {
        this.infoDialogVisible = false;
        for (let key in this.selectedRow) {
          this.addForm[key] = this.selectedRow[key];
        }
        this.payer = this.selectedRow.payer;
        this.supplierName = this.selectedRow.supplierName;
        this.addForm.fileList = this.infoFileList;
        for (let i in this.addForm.fileList) {
          this.addForm.fileList[i].id = undefined;
        }
        this.addDialogVisible = true;
      },
      closeInfoDialog() {
        this.auditLogList = [];
        this.infoDialogVisible = false;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getApplyList();
      },
      handlePageChange(val) {
        this.listQuery.page = val;
        this.getApplyList();
      },
      formatDate(date) {
        return this.$moment(date).format("YYYY-MM-DD");
      },
      getActiveByTeamName() {
        // 查询供应商
        getActiveByTeamName({teamName: this.addForm.team}).then(response => {
          if (response.resCode === 200) {
            let supplierList = response.data;
            if (supplierList.length > 0) {
              for (let i = 0, length = supplierList.length; i <= length - 1; i++) {
                supplierList[i].value = supplierList[i].supplierName;
              }
              this.supplierList = supplierList;
            } else {
              this.supplierList = [{value: '无'}];
            }
          } else {
            this.$message.error("查询供应商失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
        this.supplierName = undefined;
        this.payer = undefined;
        this.addForm.supplierId = undefined;
        this.addForm.contractId = undefined;
      },
      handleSelectSupplier(item) {
        this.addForm.supplierId = item.supplierId;
        this.addForm.contractId = item.id;
        this.payer = item.payer;
      },
      handleSelectCountry(item) {
        let countryHasCurrency = false;
        for (let i = 0; i <= this.countryCurrencyList.length - 1; i++) {
          if (this.countryCurrencyList[i].countryCode === item.name) {
            this.addForm.priceCurrency = this.countryCurrencyList[i].currency;
            this.addForm.serviceFeeCurrency = this.countryCurrencyList[i].currency;

            countryHasCurrency = true;
            break;
          }
        }
        if (!countryHasCurrency) {
          this.$message.error("尚未维护所选国家的币种，请联系相关IT人员");
        }
      },
      revoke(row) {
        this.selectedRow = row || this.selectedRow;
        this.$confirm('此操作将不可取消, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullScreenLoading = true;
          revokeById({id: this.selectedRow.id}).then(response => {
            if(response.resCode === 200) {
              this.getApplyList();
              this.$message.success("撤回成功");
            } else {
              this.$message.error("撤回失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("撤回失败");
          });
        }).catch(() => {});
      }
    }
  }
</script>

<style scoped>
  .filter-container .el-form-item {
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

  .add_dialog_table_col1 {width: 10%;}
  .add_dialog_table_col2 {width: 40%;}
  .add_dialog_table_col3 {width: 10%;}
  .add_dialog_table_col4 {width: 40%;}

  .add_dialog_table_label {
    float: right;
    margin-right: 10px
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
