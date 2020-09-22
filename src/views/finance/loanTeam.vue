<template>
  <div class="app-container calendar-list-container fixed_table">
    <div class="filter-container">
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap">
        <el-form-item label="所属事业群" label-width="100px">
          <el-select v-model="listQuery.businessGroup" placeholder="请选择" clearable @clear="listQuery.businessGroup=undefined">
            <el-option v-for="(item,index) in businessGroupOptions" :label="item.name" :key="index" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="组别" label-width="80px">
          <el-input v-model="listQuery.team" placeholder="请输入" @keyup.enter.native="getList" clearable @clear="listQuery.team=undefined"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable @clear="listQuery.status=undefined">
            <el-option :value="0" label="禁用"/>
            <el-option :value="1" label="启用" />
            <el-option :value="2" label="待财务总监审批"/>
          </el-select>
        </el-form-item>
      </el-form>

      <div align="center" style="margin-top: 5px">
        <el-button type="primary" v-waves @click="getList">查询</el-button>
        <el-button type="primary" v-waves @click="reset">重置</el-button>
        <el-button v-if="loanTeam_btn_edit" type="primary" v-waves @click="submit">提交</el-button>
        <el-button type="primary" v-waves @click="handleAudit">审批</el-button>
        <el-button v-if="loanTeam_btn_edit" type="primary" v-waves @click="sendAuditEmail">发送审批提醒邮件</el-button>
        <el-button type="primary" v-waves @click="handleDetailDialog">查询收支明细</el-button>
      </div>
    </div>
    <el-table ref="tableList" :data="list" v-loading.body="listLoading" fit highlight-current-row style="width: 100%"
              :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
              :cell-style="changeCellStyle" :max-height="innerHeight*0.74" show-summary :summary-method="getSummary">
      <el-table-column align="center" type="selection" fixed="left"/>
      <el-table-column align="center" label="组别" prop="team" min-width="105px"/>
      <el-table-column align="center" label="状态" prop="statusStr" min-width="120px"/>
      <el-table-column align="center" label="借款人" prop="loaner" min-width="105px"/>
      <el-table-column align="center" label="核销人" prop="reimburser" min-width="105px"/>
      <el-table-column align="center" label="单次借款额度(借款限额)" prop="amountPerTime" min-width="125px">
        <template slot-scope="scope">
          <span>{{scope.row.amountPerTime === scope.row.amountPerTimeModify ? scope.row.amountPerTime : scope.row.amountPerTime + '(' + scope.row.amountPerTimeModify + ')'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="每月总额度" prop="amountTotal" min-width="125px">
        <template slot-scope="scope">
          <span>{{scope.row.amountTotal === scope.row.amountTotalModify ? scope.row.amountTotal : scope.row.amountTotal + '(' + scope.row.amountTotalModify + ')'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="借款临时额度" prop="amountTemporary" min-width="125px">
        <template slot-scope="scope">
          <span>{{scope.row.amountTemporary === scope.row.amountTemporaryModify ? scope.row.amountTemporary : scope.row.amountTemporary + '(' + scope.row.amountTemporaryModify + ')'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="本月净借款金额" prop="loanCurrentMonth" min-width="90px"/>
      <el-table-column align="center" label="累计未核销额度" prop="amountBorrowed" min-width="110px"/>
      <el-table-column align="center" label="借款审批中的金额" prop="amountAuditing" min-width="110px"/>
      <el-table-column align="center" label="备注" prop="remark" min-width="100px" show-overflow-tooltip/>
      <el-table-column align="center" label="操作" min-width="400px">
        <template slot-scope="scope">
            <el-button v-if="loanTeam_btn_edit && scope.row.status === 1" size="mini" type="primary" @click="openUpdateDialog(scope.row)">编辑额度</el-button>
            <el-button v-if="loanTeam_btn_edit && scope.row.status === 1" size="mini" type="primary" @click="openUpdatePrincipalDialog(scope.row)">修改负责人</el-button>
            <el-button v-if="loanTeam_btn_edit && scope.row.status === 0" size="mini" type="primary" @click="changeStatus(scope.row,1)">启用额度</el-button>
            <el-button v-if="loanTeam_btn_edit && scope.row.status === 1" size="mini" type="danger" @click="changeStatus(scope.row,0)">禁用额度</el-button>
            <el-button size="mini" type="success" @click="openUpdateLogDialog(scope.row)">日志记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    </div>

    <!-- 借款核销明细 -->
    <el-dialog title="明细查询" :visible.sync="searchDetailDialogVisible" width="90%" :before-close="cancelDetailDialog" v-dialog-drag top="3vh">
      <el-form v-model="searchDetailForm" style="display: flex; flex-wrap: wrap">
        <el-form-item label="核销组别" label-width="100px">
          <el-select v-model="searchDetailForm.loanTeamId" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in allList" :label="item.team" :key="index" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="组织架构类型" label-width="120px">
          <el-select v-model="searchDetailForm.organizationType" placeholder="请选择" @change="getTeamOptions" clearable>
            <el-option label="事业群" :value="1"/>
            <el-option label="事业部" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="组织架构组别" label-width="130px">
          <el-select v-model="searchDetailForm.organizationTeamId" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in teamOptions" :label="item.name" :key="index" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" label-width="120px">
          <el-select v-model="searchDetailForm.type" placeholder="请选择" clearable>
            <el-option label="借款" :value="1"/>
            <el-option label="核销" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="完成日期" label-width="100px">
          <el-date-picker v-model="finishDate" type="daterange" range-separator=" - " start-placeholder="开始日期" end-placeholder="结束日期" unlink-panels :picker-options="pickerOptions"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" @click="searchDetail">查询</el-button>
        <el-button v-waves type="primary" @click="handleClear">重置</el-button>
      </div>
      <div align="center" style="padding-top: 10px">
        净借款{{(detailResult.loanTotal+0.0001).toFixed(2)}}元，净核销{{-(detailResult.reimbursementTotal-0.0001).toFixed(2)}}元，统计得{{(detailResult.loanTotal+detailResult.reimbursementTotal+0.0001).toFixed(2)}}元
      </div>
      <el-table :data="detailResult.list" fit highlight-current-row :max-height="innerHeight*0.6"
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" style="width: 100%; margin-top: 10px">
        <el-table-column type="index" align='center' fixed="left"/>
        <el-table-column align="center" label="单号" prop="businessNo"/>
        <el-table-column align="center" label="核销组别" prop="loanTeamName"/>
        <el-table-column align="center" label="组织架构组别" prop="organizationName"/>
        <el-table-column align="center" label="操作人" prop="operatorName"/>
        <el-table-column align="center" label="类型" prop="typeStr"/>
        <el-table-column align="center" label="金额" prop="total"/>
        <el-table-column align="center" label="累计未核销额度" prop="amountBorrowed"/>
        <el-table-column align="center" label="完成时间">
          <template slot-scope="scope"><span>{{$moment(scope.row.createDate).format("YYYY-MM-DD HH:mm:ss")}}</span></template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleDetailSizeChange" @current-change="handleDetailCurrentChange"
                     :page-sizes="[10, 20, 30, 50]" :page-size="searchDetailForm.limit" :current-page.sync="searchDetailForm.page"
                     layout="total, sizes, prev, pager, next, jumper" :total="detailResult.total"/>
    </el-dialog>

    <!-- 修改额度 -->
    <el-dialog title="修改额度" :visible.sync="updateDialogVisible" v-loading="fullScreenLoading" :before-close="closeUpdateDialog" v-dialog-drag>
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="120px">
        <el-form-item label="单次借款额度" prop="amountPerTimeModify">
          <el-input v-model="updateForm.amountPerTimeModify" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="每月总额度" prop="amountTotalModify">
          <el-input v-model="updateForm.amountTotalModify" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="借款临时额度" prop="amountTemporaryModify">
          <el-input v-model="updateForm.amountTemporaryModify" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="updateForm.remark" :autosize="{ minRows: 4, maxRows: 5}" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" v-waves @click="edit">保存</el-button>
        <el-button type="primary" v-waves @click="closeUpdateDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改负责人 -->
    <el-dialog title="修改负责人" :visible.sync="updatePrincipalDialogVisible" v-loading="fullScreenLoading" :before-close="closeUpdatePrincialDialog" v-dialog-drag>
      <el-form :model="updatePrincipalForm" :rules="rules" ref="updatePrincipalForm" label-width="120px">
        <el-form-item label="借款人" prop="loanerName">
          <el-autocomplete v-model="updatePrincipalForm.loaner" placeholder="请输入名字" :trigger-on-focus="false" clearable
                           :fetch-suggestions="searchPrincipal" @select="handleSelectLoaner"></el-autocomplete>
        </el-form-item>
        <el-form-item label="核销人" prop="reimburserName">
          <el-autocomplete v-model="updatePrincipalForm.reimburser" placeholder="请输入名字" :trigger-on-focus="false" clearable
                           :fetch-suggestions="searchPrincipal" @select="handleSelectReimburser"></el-autocomplete>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" v-waves @click="updatePrincipal">保存</el-button>
        <el-button type="primary" v-waves @click="closeUpdatePrincialDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- 额度修改记录 -->
    <el-dialog title="额度修改记录" :visible.sync="updateLogDialogVisible" width="90%" v-dialog-drag top="6vh">
      <el-table :data="updateLogList.list" fit highlight-current-row :max-height="innerHeight*0.74"
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" style="width: 100%; margin-top: 10px">
        <el-table-column align="center" type="index"/>
        <el-table-column align="center" label="组别" prop="teamName"/>
        <el-table-column align="center" label="状态" prop="statusStr"/>
        <el-table-column align="center" label="单次借款额度(借款限额)" prop="amountPerTime">
          <template slot-scope="scope">
            <span>{{scope.row.amountPerTime === scope.row.amountPerTimeModify ? scope.row.amountPerTime : scope.row.amountPerTime + '(' + scope.row.amountPerTimeModify + ')'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="每月总额度" prop="amountTotal">
          <template slot-scope="scope">
            <span>{{scope.row.amountTotal === scope.row.amountTotalModify ? scope.row.amountTotal : scope.row.amountTotal + '(' + scope.row.amountTotalModify + ')'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="借款临时额度" prop="amountTemporary">
          <template slot-scope="scope">
            <span>{{scope.row.amountTemporary === scope.row.amountTemporaryModify ? scope.row.amountTemporary : scope.row.amountTemporary + '(' + scope.row.amountTemporaryModify + ')'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip/>
        <el-table-column align="center" label="审批备注" prop="auditRemark" show-overflow-tooltip/>
        <el-table-column align="center" label="修改人" prop="createUserName"/>
        <el-table-column align="center" label="提交时间" prop="createDate"/>
      </el-table>
      <el-pagination @size-change="handleUpdateLogSizeChange" @current-change="handleUpdateLogCurrentChange"
                     :page-sizes="[10, 20, 50]" :page-size="searchUpdateLogForm.limit" :current-page.sync="searchUpdateLogForm.page"
                     layout="total, sizes, prev, pager, next, jumper" :total="updateLogList.total"/>
    </el-dialog>

    <!-- 审批 -->
    <el-dialog title="审批" :visible.sync="auditDialogVisible" v-loading="fullScreenLoading" width="90%" :before-close="closeAuditDialog" v-dialog-drag top="5vh">
      <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="待审批" name="auditing">
          <el-table :data="auditList" ref="auditForm" fit highlight-current-row :max-height="innerHeight*0.6"
                    :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" style="width: 100%; margin-top: 10px">
            <el-table-column align="center" type="selection"/>
            <el-table-column align="center" type="index"/>
            <el-table-column align="center" label="审批备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.auditRemark" placeholder="请输入" clearable/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="组别" prop="team"/>
            <el-table-column align="center" label="状态" prop="statusStr"/>
            <el-table-column align="center" label="单次借款额度(借款限额)" prop="amountPerTime">
              <template slot-scope="scope">
                <span>{{scope.row.amountPerTime === scope.row.amountPerTimeModify ? scope.row.amountPerTime : scope.row.amountPerTime + '(' + scope.row.amountPerTimeModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="每月总额度" prop="amountTotal">
              <template slot-scope="scope">
                <span>{{scope.row.amountTotal === scope.row.amountTotalModify ? scope.row.amountTotal : scope.row.amountTotal + '(' + scope.row.amountTotalModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="借款临时额度" prop="amountTemporary">
              <template slot-scope="scope">
                <span>{{scope.row.amountTemporary === scope.row.amountTemporaryModify ? scope.row.amountTemporary : scope.row.amountTemporary + '(' + scope.row.amountTemporaryModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip/>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button v-if="loanTeam_btn_edit" size="mini" type="primary" @click="cancelSubmit(scope.row)">撤回提交</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div align="center" style="padding-top: 10px">
            <el-button v-if="loanTeam_btn_audit" type="primary" @click="audit(1)">审批通过</el-button>
            <el-button v-if="loanTeam_btn_audit" type="primary" @click="audit(2)">审批不通过</el-button>
            <el-button type="primary" @click="closeAuditDialog">取消</el-button>
          </div>
        </el-tab-pane>
        <!-- 审批通过历史记录 -->
        <el-tab-pane label="审批通过历史记录" name="pass">
          <el-table :data="passHistoryList.list" fit highlight-current-row :max-height="innerHeight*0.6"
                    :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
            <el-table-column align="center" type="index"/>
            <el-table-column align="center" label="组别" prop="teamName"/>
            <el-table-column align="center" label="状态" prop="statusStr"/>
            <el-table-column align="center" label="单次借款额度(借款限额)" prop="amountPerTime">
              <template slot-scope="scope">
                <span>{{scope.row.amountPerTime === scope.row.amountPerTimeModify ? scope.row.amountPerTime : scope.row.amountPerTime + '(' + scope.row.amountPerTimeModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="每月总额度" prop="amountTotal">
              <template slot-scope="scope">
                <span>{{scope.row.amountTotal === scope.row.amountTotalModify ? scope.row.amountTotal : scope.row.amountTotal + '(' + scope.row.amountTotalModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="借款临时额度" prop="amountTemporary">
              <template slot-scope="scope">
                <span>{{scope.row.amountTemporary === scope.row.amountTemporaryModify ? scope.row.amountTemporary : scope.row.amountTemporary + '(' + scope.row.amountTemporaryModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip/>
            <el-table-column align="center" label="审批备注" prop="remark" show-overflow-tooltip/>
            <el-table-column align="center" label="审批完成时间" prop="createDate"/>
          </el-table>
          <el-pagination @size-change="handleHistorySizeChange" @current-change="handleHistoryCurrentChange"
                         :current-page.sync="getHistoryForm.page" :page-size="getHistoryForm.limit" :page-sizes="[10,20,50,100]"
                         layout="total, sizes, prev, pager, next, jumper" :total="passHistoryList.total"/>
        </el-tab-pane>
        <!-- 审批不通过历史记录 -->
        <el-tab-pane label="审批不通过历史记录" name="notPass">
          <el-table :data="notPassHistoryList.list" fit highlight-current-row :max-height="innerHeight*0.74"
                    :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
            <el-table-column align="center" type="index"/>
            <el-table-column align="center" label="组别" prop="teamName"/>
            <el-table-column align="center" label="状态" prop="statusStr"/>
            <el-table-column align="center" label="单次借款额度(借款限额)" prop="amountPerTime">
              <template slot-scope="scope">
                <span>{{scope.row.amountPerTime === scope.row.amountPerTimeModify ? scope.row.amountPerTime : scope.row.amountPerTime + '(' + scope.row.amountPerTimeModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="每月总额度" prop="amountTotal">
              <template slot-scope="scope">
                <span>{{scope.row.amountTotal === scope.row.amountTotalModify ? scope.row.amountTotal : scope.row.amountTotal + '(' + scope.row.amountTotalModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="借款临时额度" prop="amountTemporary">
              <template slot-scope="scope">
                <span>{{scope.row.amountTemporary === scope.row.amountTemporaryModify ? scope.row.amountTemporary : scope.row.amountTemporary + '(' + scope.row.amountTemporaryModify + ')'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip/>
            <el-table-column align="center" label="审批备注" prop="remark" show-overflow-tooltip/>
            <el-table-column align="center" label="审批完成时间" prop="createDate"/>
          </el-table>
          <el-pagination @size-change="handleHistorySizeChange" @current-change="handleHistoryCurrentChange"
                         :current-page.sync="getHistoryForm.page" :page-size="getHistoryForm.limit" :page-sizes="[10,20,50,100]"
                         layout="total, sizes, prev, pager, next, jumper" :total="notPassHistoryList.total"/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getList,
    getLoanLog,
    getBaseGroupsByType,
    edit,
    updatePrincipal,
    getUpdateLog,
    commitOrRevoke,
    changeStatus,
    audit,
    getAuditList,
    sendAuditEmail
  } from '../../api/finance/loanTeam';
  import { getAllUser } from '../../api/admin/user/user';
  import { mapGetters } from 'vuex';

  export default {
    name: 'financeLoanTeam',
    data() {
      return {
        loanTeam_btn_edit: undefined,
        loanTeam_btn_audit: undefined,
        selectedRow: undefined,
        list: null,
        summaryRow: {},
        allList: [],
        total: null,
        listLoading: false,
        fullScreenLoading: false,
        listQuery: {
          businessGroup: undefined,
          team: undefined,
          status: undefined,
          page: 1,
          limit: 10
        },
        businessGroupOptions: [],
        searchDetailDialogVisible: false,
        updateDialogVisible: false,
        updatePrincipalDialogVisible: false,
        updateLogDialogVisible: false,
        auditDialogVisible: false,
        rules: {
          amountPerTimeModify: [{ required: true, message: '请输入单次借款额度', trigger: 'blur' }, { pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入数值' }],
          amountTotalModify: [{ required: true, message: '请输入每月总额度', trigger: 'blur' }, { pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入数值' }],
          amountTemporaryModify: [{ required: true, message: '请输入借款临时额度', trigger: 'blur' }, { pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入数值' }],
          remark: [{ max: 128, message: '最大长度为128个字符' }]
        },
        finishDate: undefined,
        searchDetailForm: {
          loanTeamId: undefined,
          organizationType: undefined,
          organizationTeamId: undefined,
          type: undefined,
          finishDateStart: undefined,
          finishDateEnd: undefined,
          page: 1,
          limit: 10
        },
        innerHeight: window.innerHeight,
        detailResult: {
          list: [],
          total: undefined,
          loanTotal: 0,
          reimbursementTotal: 0
        },
        updateForm: {
          teamId: undefined,
          amountPerTimeModify: undefined,
          amountTotalModify: undefined,
          amountTemporaryModify: undefined,
          remark: undefined
        },
        updatePrincipalForm: {
          teamId: undefined,
          loaner: undefined,
          reimburser: undefined
        },
        searchUpdateLogForm: {
          teamId: undefined,
          page: 1,
          limit: 10
        },
        getHistoryForm: {
          status: undefined,
          page: 1,
          limit: 10
        },
        updateLogList: { list: [], total: undefined },
        passHistoryList: { list: [], total: undefined },
        notPassHistoryList: { list: [], total: undefined },
        auditList: [],
        userOptions: [],
        activeTab: 'auditing',
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
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        teamOptions: []
      }
    },
    created() {
      this.getUserOptions();
      this.getBusinessGroupOptions();
      this.getList();
      this.loanTeam_btn_edit = this.elements['loanTeam:btn_edit'];
      this.loanTeam_btn_audit = this.elements['loanTeam:btn_audit'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    mounted() {
  },
    methods: {
      getList() {
        this.listLoading = true;
        getList(this.listQuery).then(response => {
          if (response.resCode === 200) {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.summaryRow = response.data.summary;
          } else {
            this.$message.error('查询失败');
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      reset() {
        const page = this.listQuery.page;
        const limit = this.listQuery.limit;
        this.listQuery = {};
        this.listQuery.page = page;
        this.listQuery.limit = limit;
        this.getList();
      },
      getAllList() {
        this.listLoading = true;
        const form = { page: 1, limit: 999 };
        getList(form).then(response => {
          if (response.resCode === 200) {
            this.allList = response.data.rows;
          } else {
            this.$message.error('查询失败');
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      submit() {
        const selection = this.$refs.tableList.selection;
        const length = selection.length;
        for (let i = 0; i <= length - 1; i++) {
          const loanTeam = selection[i];
          if (loanTeam.amountPerTime === loanTeam.amountPerTimeModify &&
          loanTeam.amountTotal === loanTeam.amountTotalModify &&
          loanTeam.amountTemporary === loanTeam.amountTemporaryModify) {
            this.$message.info('勾选的单据额度未变更，请先编辑额度');
            return false;
          }
          if (loanTeam.status !== 1) {
            this.$message.info('不可提交待审批单据');
            return false;
          }
        }
        if (length === 0) {
          this.$message.info('请勾选单据');
          return false;
        }
        // 状态，1提交，2撤回提交
        const form = { idList: [], status: 1 };
        for (let i = 0; i <= length - 1; i++) {
          form.idList.push(selection[i].id);
        }
        this.fullScreenLoading = true;
        commitOrRevoke(form).then(response => {
          if (response.resCode === 200) {
            this.$message.success('提交成功');
            this.getList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error('提交发生异常');
        });
      },
      cancelSubmit(row) {
        // 状态，1提交，2撤回提交
        const form = { idList: [row.id], status: 2 };
        this.fullScreenLoading = true;
        commitOrRevoke(form).then(response => {
          if (response.resCode === 200) {
            this.$message.success('撤回成功');
            this.getAuditList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error('撤回发生异常');
        });
      },
      audit(pass) {
        // pass 1通过，2不通过
        const auditArray = this.$refs.auditForm.selection;
        if (auditArray.length === 0) {
          console.log('请勾选单据');
          return false;
        }
        const form = {};
        form.auditList = auditArray;
        form.pass = pass;
        this.fullScreenLoading = true;
        audit(form).then(response => {
          if (response.resCode === 200) {
            this.$message.success('审批成功');
            this.getAuditList();
          } else {
            this.$alert(response.resDes, '审批失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error('审批发生异常');
        });
      },
      sendAuditEmail() {
        this.fullScreenLoading = true;
        sendAuditEmail().then(response => {
          if (response.resCode === 200) {
            this.$message.success('发送成功');
          } else {
            this.$message.error('发送失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error('发送失败');
        });
      },
      getAuditList() {
        this.fullScreenLoading = true;
        getAuditList({}).then(response => {
          if (response.status === 200) {
            this.auditList = response.data.rows;
          } else {
            this.$message.error('查询失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      handleAudit() {
        this.activeTab = 'auditing';
        this.getAuditList();
        this.auditDialogVisible = true;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleHistorySizeChange(val) {
        this.getHistoryForm.limit = val;
        this.getHistory();
      },
      handleHistoryCurrentChange(val) {
        this.getHistoryForm.page = val;
        this.getHistory();
      },
      handleDetailDialog() {
        if (this.allList.length === 0) {
          this.getAllList();
        }
        // this.searchDetailForm = {
        //   page: 1,
        //   limit: 10
        // };
        this.searchDetail();
        this.searchDetailDialogVisible = true;
      },
      cancelDetailDialog() {
        this.teamOptions = [];
        this.detailResult = {
          list: [],
          total: undefined,
          loanTotal: 0,
          reimbursementTotal: 0
        };
        this.searchDetailDialogVisible = false;
      },
      searchDetail() {
        if (this.searchDetailForm.organizationType !== undefined && this.searchDetailForm.organizationType !== '' &&
          (this.searchDetailForm.organizationTeamId === undefined || this.searchDetailForm.organizationTeamId === '')) {
          this.$message.info('选择组织架构类型的同时，请选择组织架构组别');
          return false;
        }
        this.fullScreenLoading = true;
        if (this.finishDate != undefined) {
          this.searchDetailForm.finishDateStart = this.$moment(this.finishDate[0]).format('YYYY-MM-DD');
          this.searchDetailForm.finishDateEnd = this.$moment(this.finishDate[1]).format('YYYY-MM-DD');
        } else {
          this.searchDetailForm.finishDateStart = undefined;
          this.searchDetailForm.finishDateEnd = undefined;
        }
        getLoanLog(this.searchDetailForm).then(response => {
          if (response.resCode == 200) {
            this.detailResult.list = response.data.rows;
            // 数据量
            this.detailResult.total = response.data.total;
            // 借款、核销总金额
            this.detailResult.loanTotal = response.data.loanTotal;
            this.detailResult.reimbursementTotal = response.data.reimbursementTotal;
          } else {
            this.$alert(response.resDes, '查询失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      handleClear() {
        this.finishDate = undefined;
        this.searchDetailForm = {
          page: 1,
          limit: 10
        };
        this.searchDetail();
      },
      handleDetailSizeChange(val) {
        this.searchDetailForm.limit = val;
        this.searchDetail();
      },
      handleDetailCurrentChange(val) {
        this.searchDetailForm.page = val;
        this.searchDetail();
      },
      getTeamOptions(organizationType) {
        if (organizationType === undefined || organizationType === '') {
          this.teamOptions = [];
          this.searchDetailForm.organizationType = undefined;
          this.searchDetailForm.organizationTeamId = undefined;
          return false;
        }
        this.fullScreenLoading = true;
        getBaseGroupsByType({ type: organizationType }).then(response => {
          if (response.resCode == 200) {
            this.teamOptions = response.data;
          } else {
            this.$message.error('查询组别错误');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      getBusinessGroupOptions() {
        this.fullScreenLoading = true;
        getBaseGroupsByType({ type: 1 }).then(response => {
          if (response.resCode == 200) {
            this.businessGroupOptions = response.data;
          } else {
            this.$message.error('查询事业群组别错误');
          }
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
        this.fullScreenLoading = false;
      },
      edit() {
        this.$refs.updateForm.validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            edit(this.updateForm).then(response => {
              if (response.resCode === 200) {
                this.$message.success('更新成功');
                this.updateDialogVisible = false;
                this.getList();
              } else {
                this.$alert('更新失败', response.resDes);
              }
              this.fullScreenLoading = false;
            }).catch(error => {
              this.fullScreenLoading = false;
              this.$message.error(JSON.stringify(error));
            });
          }
        })
      },
      updatePrincipal() {
        this.fullScreenLoading = true;
        updatePrincipal(this.updatePrincipalForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success('更新成功');
            this.updatePrincipalDialogVisible = false;
            this.getList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      openUpdateDialog(row) {
        this.selectedRow = row;
        this.updateForm.teamId = row.id;
        this.updateForm.amountPerTimeModify = row.amountPerTimeModify;
        this.updateForm.amountTotalModify = row.amountTotalModify;
        this.updateForm.amountTemporaryModify = row.amountTemporaryModify;
        this.updateForm.remark = row.remark;
        this.updateDialogVisible = true;
      },
      openUpdatePrincipalDialog(row) {
        this.selectedRow = row;
        this.updatePrincipalForm.teamId = row.id;
        this.updatePrincipalForm.loaner = row.loaner;
        this.updatePrincipalForm.reimburser = row.reimburser;
        this.updatePrincipalDialogVisible = true;
      },
      closeUpdateDialog() {
        this.updateDialogVisible = false;
        this.selectedRow = undefined;
      },
      closeUpdatePrincialDialog() {
        this.updatePrincipalDialogVisible = false;
        this.selectedRow = undefined;
      },
      searchPrincipal(str, cb) {
        const userOptions = this.userOptions;
        const results = str ? userOptions.filter(this.createFilter(str)) : userOptions;
        cb(results);
      },
      createFilter(str) {
        return user => user.value.toLowerCase().indexOf(str.toLowerCase()) === 0;
      },
      getUserOptions() {
        this.fullScreenLoading = true;
        getAllUser().then(response => {
          response.push({ id: 0, username: '---' });
          for (let i = 0; i <= response.length - 1; i++) {
            response[i].value = response[i].username;
          }
          this.userOptions = response;
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      handleSelectLoaner(item) {
        this.updatePrincipalForm.loaner = item.username;
      },
      handleSelectReimburser(item) {
        this.updatePrincipalForm.reimburser = item.username;
      },
      openUpdateLogDialog(row) {
        this.selectedRow = row;
        this.updateLogDialogVisible = true;
        this.getUpdateLog();
      },
      getUpdateLog() {
        const param = { teamId: this.selectedRow.id };
        this.fullScreenLoading = true;
        getUpdateLog(param).then(response => {
          if (response.status === 200) {
            this.updateLogList.list = response.data.rows;
            this.updateLogList.total = response.data.total;
          } else {
            this.$message.error('查询失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      getHistory() {
        // 状态，1新建，2待财务总监，3审批通过，4审批不通过
        this.getHistoryForm.status = this.activeTab === 'pass' ? 3 : 4;
        const list = this.activeTab === 'pass' ? this.passHistoryList : this.notPassHistoryList;
        this.fullScreenLoading = true;
        getUpdateLog(this.getHistoryForm).then(response => {
          if (response.status === 200) {
            list.list = response.data.rows;
            list.total = response.data.total;
          } else {
            this.$message.error('查询失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      changeCellStyle(row) {
        if (row.column.property === 'amountPerTime') {
          if (row.row.amountPerTime !== row.row.amountPerTimeModify) {
            // 单次借款额度
            return 'background-color: #ecf5ff';
          }
        }
        if (row.column.property === 'amountTotal') {
          if (row.row.amountTotal !== row.row.amountTotalModify) {
            // 每月总额度
            return 'background-color: #ecf5ff';
          }
        }
        if (row.column.property === 'amountTemporary') {
          if (row.row.amountTemporary !== row.row.amountTemporaryModify) {
            // 临时额度
            return 'background-color: #ecf5ff';
          }
        }
        if (row.column.property === 'remark') {
          if (row.row.remark) {
            // 备注
            return 'background-color: #ecf5ff';
          }
        }
      },
      handleUpdateLogSizeChange(val) {
        this.searchUpdateLogForm.limit = val;
        this.getUpdateLog();
      },
      handleUpdateLogCurrentChange(val) {
        this.searchUpdateLogForm.page = val;
        this.getUpdateLog();
      },
      handleTabClick(tab) {
        if (tab.name === 'auditing') {
          this.getAuditList();
        } else if (tab.name === 'pass') {
          this.getHistory();
        } else if (tab.name === 'notPass') {
          this.getHistory();
        }
      },
      closeAuditDialog() {
        this.getList();
        this.auditDialogVisible = false;
      },
      getSummary(param) {
        if (param.data === null) {
          return [];
        } else {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            console.log();
            if (column.label === '组别') {
              sums[index] = '全部页合计';
            } else if (column.label === '每月总额度' || column.label === '借款临时额度' || column.label === '本月净借款金额' ||
              column.label === '累计未核销额度' || column.label === '借款审批中的金额') {
              sums[index] = this.summaryRow[column.property];
            } else {
              sums[index] = '/';
            }
          });
          return sums;
        }
      },
      changeStatus(row, type) {
        // type 1 启用 0 停用
        this.selectedRow = row;
        this.$confirm(`是否${type === 1 ? '启用' : '停用'}?`, '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await changeStatus({id: row.id, type});
          if (res.resCode !== 200) {
            this.$message.info(res.resDes);
          }
          this.$message.success(`${type === 1 ? '启用' : '停用'}成功`)
          this.getList();
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .filter-container {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
</style>
