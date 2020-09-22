<template>
  <div class="app-container calendar-list-container fixed_table" v-loading="fullscreenLoading">
    <div class="filter-container">
      <el-form v-model="listQuery" class="form-el-all">
        <el-form-item label="批次号" label-width="80px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.batchNumber" clearable @clear="listQuery.batchNumber = undefined"/>
        </el-form-item>
        <el-form-item label="请款单号" label-width="100px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.applyNumber" clearable @clear="listQuery.applyNumber = undefined"/>
        </el-form-item>
        <el-form-item label="状态" label-width="70px">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable @clear="listQuery.status = undefined">
            <el-option v-for="(item,index) in statusOptions" :label="item.dicName" :key="index" :value="item.dicValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊单号" label-width="110px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.orderId" clearable @clear="listQuery.orderId = undefined"/>
        </el-form-item>
        <el-form-item label="Erp Sku" label-width="100px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.erpSku" clearable @clear="listQuery.erpSku = undefined"/>
        </el-form-item>
        <el-form-item label="收款paypal账号" label-width="120px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.payee" clearable @clear="listQuery.payee = undefined"/>
        </el-form-item>
        <el-form-item label="组别" label-width="70px">
          <el-select v-model="listQuery.teams" multiple placeholder="请选择" clearable @clear="listQuery.teams = undefined">
            <el-option v-for="(item,index) in teamOptions" :label="item.name" :key="index" :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Transaction Id" label-width="120px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.transactionId" clearable @clear="listQuery.transactionId = undefined"/>
        </el-form-item>
        <el-form-item label="创建人" label-width="80px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.createUserName"
                    clearable @clear="listQuery.createUserName = undefined"/>
        </el-form-item>
        <el-form-item label="自定义备注" label-width="110px">
          <el-input @keyup.enter.native="handleFilter" placeholder="请输入" v-model="listQuery.customNote"
                    clearable @clear="listQuery.customNote = undefined"/>
        </el-form-item>
        <el-form-item label="创建日期" label-width="100px">
          <el-date-picker v-model="createDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"
                          :picker-options="pickerOptions" clearable @clear="createDate = listQuery.createDateStart = listQuery.createDateEnd = undefined"/>
        </el-form-item>
        <el-form-item label="请款日期" label-width="100px">
          <el-date-picker v-model="applyDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"
                          :picker-options="pickerOptions" clearable @clear="applyDate = listQuery.applyDateStart = listQuery.applyDateEnd = undefined"/>
        </el-form-item>
        <el-form-item label="支付日期" label-width="100px">
          <el-date-picker v-model="payDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"
                          :picker-options="pickerOptions" clearable @clear="payDate = listQuery.payDateStart = listQuery.payDateEnd = undefined"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" v-waves icon="search" @click="handleClear">重置</el-button>
        <el-button v-waves @click="handleCreate" type="primary" icon="edit">添加</el-button>
        <el-button type="primary" v-waves icon="edit" @click="deleteBatch">批量删除</el-button>
        <el-button type="primary" v-waves icon="edit" @click="handleSubmit">提交审批</el-button>
        <el-button type="primary" v-waves icon="edit" @click="downloadTemplate">下载模版</el-button>
        <el-upload style="display: inline-block" ref="uploadFile"
                   action="/api/finance/reqPayment/importData" name="excel" :headers="headers"
                   :data="{userId: getUserId()}" :auto-upload='true' :limit="1" :on-success="uploadSuccess" :on-error="uploadError"
                   accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button style="margin-left: 10px;" v-waves type="primary" icon="edit">导入</el-button>
        </el-upload>
        <el-button style="margin-left: 10px;" v-waves @click="openExportDialog" type="primary" icon="edit">导出</el-button>
        <el-upload style="display: inline-block" v-if="reqPaymentManager_btn_updateStatus" ref="updateAfterPayingFile"
                   action="/api/finance/reqPayment/updateAfterPaying" name="excel" :headers="headers"
                   :data="{userId: getUserId()}" :auto-upload='true' :limit="1" :on-success="updateAfterPayingSuccess" :on-error="uploadError"
                   accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button style="margin-left: 10px;" v-waves type="primary" icon="edit">更新支付状态</el-button>
        </el-upload>
      </div>
    </div>
    <el-table ref="elementTable" :data="list" v-loading.body="listLoading" fit highlight-current-row
              :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" style="width: 100%" :max-height="tableHeight">
      <el-table-column fixed="left" type="selection" min-width="55px"/>
      <el-table-column type="index" min-width="50" align='center'/>
      <el-table-column min-width="150px" align="center" label="批次号" prop="batchNumber"/>
      <el-table-column min-width="110px" align="center" label="创建人" prop="createUserName"/>
      <el-table-column min-width="110px" align="center" label="请款人" prop="applicant"/>
      <el-table-column min-width="120px" align="center" label="请款日期" prop="applyDateStr"/>
      <el-table-column min-width="175px" align="center" label="请款单号" prop="applyNumber"/>
      <el-table-column min-width="120px" align="center" label="状态" prop="statusStr"/>
      <el-table-column min-width="205px" align="center" label="亚马逊单号" prop="orderId"/>
      <el-table-column min-width="140px" align="center" label="erp sku" prop="erpSku"/>
      <el-table-column min-width="250px" align="center" label="付款paypal账号" prop="payer" show-overflow-tooltip/>
      <el-table-column min-width="250px" align="center" label="收款paypal账号" prop="payee" show-overflow-tooltip/>
      <el-table-column min-width="150px" align="center" label="客户名字" prop="firstName" show-overflow-tooltip/>
      <el-table-column min-width="150px" align="center" label="客户姓氏" prop="lastName" show-overflow-tooltip/>
      <el-table-column min-width="180px" align="center" label="街道" prop="street" show-overflow-tooltip/>
      <el-table-column min-width="140px" align="center" label="城市" prop="city" show-overflow-tooltip/>
      <el-table-column min-width="140px" align="center" label="州/省" prop="province" show-overflow-tooltip/>
      <el-table-column min-width="140px" align="center" label="邮编" prop="postalCode" show-overflow-tooltip/>
      <el-table-column min-width="180px" align="center" label="Transaction ID" prop="transactionId"/>
      <el-table-column min-width="110px" align="center" label="品牌" prop="brand"/>
      <el-table-column min-width="120px" align="center" label="组别" prop="team"/>
      <el-table-column min-width="130px" align="center" label="主管" prop="leader"/>
      <el-table-column min-width="160px" align="center" label="渠道" prop="channel"/>
      <el-table-column min-width="80px" align="center" label="国家" prop="country"/>
      <el-table-column min-width="80px" align="center" label="类型" prop="typeStr"/>
      <el-table-column min-width="150px" align="center" label="review链接" prop="reviewLink" show-overflow-tooltip/>
      <el-table-column min-width="90px" align="center" label="币种" prop="currency"/>
      <el-table-column min-width="120px" align="center" label="订单金额(本币)" prop="trueAmount"/>
      <el-table-column min-width="100px" align="center" label="佣金(本币)" prop="commission"/>
      <el-table-column min-width="100px" align="center" label="手续费(本币)" prop="serviceFee"/>
      <el-table-column min-width="100px" align="center" label="total(本币)" prop="total"/>
      <el-table-column min-width="230px" align="center" label="备注" prop="remark" show-overflow-tooltip/>
      <el-table-column min-width="210px" align="center" label="邮箱或微信" prop="reviewerContact" show-overflow-tooltip/>
      <el-table-column min-width="180px" align="center" label="财务驳回理由" prop="rejectReason"/>
      <el-table-column min-width="190px" align="center" label="创建时间" prop="createDate"/>
      <el-table-column min-width="170px" align="center" label="支付时间" prop="payDate"/>
      <el-table-column fixed="right" min-width="150px" align="center" label="自定义备注" prop="customNote" show-overflow-tooltip/>
      <el-table-column fixed="right" align="center" label="操作" min-width="180px">
        <template slot-scope="scope">
          <!-- 测评系统过来的单据不允许修改，当审批打回确定有误时才能修改 -->
          <el-button v-if="scope.row.createUserId==getUserId() && ((scope.row.status == 1 && scope.row.source != 1) || scope.row.status == -1 || scope.row.status == 5)"
                     size="mini" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.createUserId==getUserId() && ((scope.row.status == 1 && scope.row.source != 1) || scope.row.status == -1 || scope.row.status == 5)"
                     size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" style="margin-top: 15px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50,100,200]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialog-drag top="6vh">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="亚马逊单号" prop="orderId" style="margin-bottom: 20px;">
          <el-input v-model="form.orderId" placeholder="请输入亚马逊单号"/>
        </el-form-item>
        <el-form-item label="erp sku" prop="erpSku" style="margin-bottom: 20px;">
          <el-input v-model="form.erpSku" placeholder="请输入erp sku"/>
        </el-form-item>
        <el-form-item label="收款paypal账号" prop="payee" style="margin-bottom: 20px;">
          <el-input v-model="form.payee" placeholder="请输入收款paypal账号"/>
        </el-form-item>
        <el-form-item label="客户名字" prop="firstName" style="margin-bottom: 20px;">
          <el-input v-model="form.firstName" placeholder="请输入客户名字"/>
        </el-form-item>
        <el-form-item label="客户姓氏" prop="lastName" style="margin-bottom: 20px;">
          <el-input v-model="form.lastName" placeholder="请输入客户姓氏"/>
        </el-form-item>
        <el-form-item label="街道" prop="street" style="margin-bottom: 20px;">
          <el-input v-model="form.street" placeholder="请输入街道"/>
        </el-form-item>
        <el-form-item label="城市" prop="city" style="margin-bottom: 20px;">
          <el-input v-model="form.city" placeholder="请输入城市"/>
        </el-form-item>
        <el-form-item label="州/省" prop="province" style="margin-bottom: 20px;">
          <el-input v-model="form.province" placeholder="请输入州/省"/>
        </el-form-item>
        <el-form-item label="邮编" prop="postalCode" style="margin-bottom: 20px;">
          <el-input v-model="form.postalCode" placeholder="请输入邮编"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" style="margin-bottom: 20px;">
          <el-input v-model="form.brand" placeholder="请输入品牌"/>
        </el-form-item>
        <el-form-item label="组别" prop="team" style="margin-bottom: 20px;">
          <el-input v-model="form.team" placeholder="请输入组别"/>
        </el-form-item>
        <el-form-item label="主管" prop="leader" style="margin-bottom: 20px;">
          <el-input v-model="form.leader" placeholder="请输入主管"/>
        </el-form-item>
        <el-form-item label="渠道" prop="channel" style="margin-bottom: 20px;">
          <el-input v-model="form.channel" placeholder="请输入渠道"/>
        </el-form-item>
        <el-form-item label="国家" prop="country" style="margin-bottom: 20px;">
          <el-input v-model="form.country" placeholder="请输入国家，如US"/>
        </el-form-item>
        <el-form-item label="类型" prop="country" style="margin-bottom: 20px;">
          <el-select v-model="form.type" clearable placeholder="请选择">
            <el-option :value="0" label="免评"/>
            <el-option :value="1" label="留评"/>
          </el-select>
        </el-form-item>
        <el-form-item label="review链接" prop="reviewLink" style="margin-bottom: 20px;">
          <el-input v-model="form.reviewLink" placeholder="请输入review链接"/>
        </el-form-item>
        <el-form-item label="币种" prop="currency" style="margin-bottom: 20px;">
          <el-input v-model="form.currency" placeholder="请输入币种，如USD"/>
        </el-form-item>
        <el-form-item label="订单金额（本币）" prop="trueAmount" style="margin-bottom: 20px;">
          <el-input v-model="form.trueAmount" placeholder="请输入订单金额（本币）"/>
        </el-form-item>
        <el-form-item label="佣金（本币）" prop="commission" style="margin-bottom: 20px;">
          <el-input v-model="form.commission" placeholder="请输入佣金（本币）"/>
        </el-form-item>
        <el-form-item label="手续费（本币）" prop="serviceFee" style="margin-bottom: 20px;">
          <el-input v-model="form.serviceFee" placeholder="请输入手续费（本币）"/>
        </el-form-item>
        <el-form-item label="total（本币）" prop="total" style="margin-bottom: 20px;">
          <el-input v-model="form.total" placeholder="请输入total（本币）"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="margin-bottom: 20px;">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="自定义备注" prop="customNote" style="margin-bottom: 20px;">
          <el-input v-model="form.customNote" placeholder="请输入自定义备注"/>
        </el-form-item>
        <el-form-item label="邮箱或微信" prop="reviewerContact" style="margin-bottom: 20px;">
          <el-input v-model="form.reviewerContact" placeholder="请输入邮箱或微信"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 导出弹出框 -->
    <div>
      <el-dialog title="导出" :visible.sync="exportDialogVisible" width="30%" @before-close="exportDialogVisible=false" v-dialog-drag>
        <div style="margin-bottom: 10px; font-size: 14px">请确认查询条件，点击按钮将导出符合查询条件的所有数据</div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" style="margin-left: 10px;" @click="this.exportRefundTasks">导出</el-button>
          <el-button type="primary" style="margin-left: 10px;" @click="exportDialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 导入失败提醒框 -->
    <el-dialog title="导入失败" :visible.sync="importErrorDialogVisible" width="90%" v-dialog-drag top="6vh">
      <el-table :data="importErrorList" fit highlight-current-row style="width: 100%"
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :max-height="tableHeight">
        <el-table-column min-width="100px" align="center" label="excel行数" fixed="left" prop="index"/>
        <el-table-column min-width="210px" align="center" label="错误信息" fixed="left" prop="errorMsg"/>
        <el-table-column min-width="200px" align="center" label="亚马逊单号" prop="orderId"/>
        <el-table-column min-width="140px" align="center" label="erp sku" prop="erpSku"/>
        <el-table-column min-width="230px" align="center" label="收款paypal账号" prop="payee"/>
        <el-table-column min-width="150px" align="center" label="客户名字" prop="firstName" show-overflow-tooltip/>
        <el-table-column min-width="100px" align="center" label="客户姓氏" prop="lastName"/>
        <el-table-column min-width="190px" align="center" label="街道" prop="street" show-overflow-tooltip/>
        <el-table-column min-width="140px" align="center" label="城市" prop="city" show-overflow-tooltip/>
        <el-table-column min-width="140px" align="center" label="州/省" prop="province" show-overflow-tooltip/>
        <el-table-column min-width="140px" align="center" label="邮编" prop="postalCode" show-overflow-tooltip/>
        <el-table-column min-width="100px" align="center" label="品牌" prop="brand"/>
        <el-table-column min-width="120px" align="center" label="组别" prop="team"/>
        <el-table-column min-width="100px" align="center" label="主管" prop="leader"/>
        <el-table-column min-width="140px" align="center" label="渠道" prop="channel"/>
        <el-table-column min-width="80px" align="center" label="国家" prop="country"/>
        <el-table-column min-width="80px" align="center" label="类型" prop="typeStr"/>
        <el-table-column min-width="100px" align="center" label="review链接" prop="reviewLink" show-overflow-tooltip/>
        <el-table-column min-width="90px" align="center" label="币种" prop="currency"/>
        <el-table-column min-width="120px" align="center" label="订单金额(本币)" prop="trueAmount"/>
        <el-table-column min-width="100px" align="center" label="佣金(本币)" prop="commission"/>
        <el-table-column min-width="100px" align="center" label="手续费(本币)" prop="serviceFee"/>
        <el-table-column min-width="100px" align="center" label="total(本币)" prop="total"/>
        <el-table-column min-width="230px" align="center" label="备注" prop="remark" show-overflow-tooltip/>
        <el-table-column min-width="210px" align="center" label="邮箱或微信" prop="reviewerContact" show-overflow-tooltip/>
        <el-table-column min-width="200px" align="center" label="自定义备注" prop="customNote"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getObj,
    add,
    update,
    getList,
    exportPaypalTask,
    submit,
    getSellerDeptGroups,
    deleteTask
  } from '../../api/finance/reqPayment';
  import { mapGetters } from 'vuex';
  import Cookies from 'js-cookie';
  import mixins from '@/mixins';

  export default {
    name: 'reqPayment',
    data() {
      return {
        form: {
          orderId: undefined,
          erpSku: undefined,
          payee: undefined,
          firstName: undefined,
          lastName: undefined,
          street: undefined,
          city: undefined,
          province: undefined,
          postalCode: undefined,
          brand: undefined,
          team: undefined,
          leader: undefined,
          channel: undefined,
          country: undefined,
          type: undefined,
          reviewLink: undefined,
          currency: undefined,
          trueAmount: undefined,
          commission: undefined,
          serviceFee: undefined,
          total: undefined,
          remark: undefined,
          customNote: undefined,
          reviewerContact: undefined
        },
        rules: {
          orderId: [{required: true, message: '请输入亚马逊单号', trigger: 'blur'}, {min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur'}, {pattern: /^(\d){3}\-(\d){7}\-(\d){7}$/, message: '格式错误，参考格式为123-1234567-1234567'}],
          erpSku: [{required: true, message: '请输入erp sku', trigger: 'blur'}, {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}, {pattern: /^(\d){2}\-(\d){5}\-(\d){3}$/, message: '格式错误，参考格式为12-12345-123'}],
          payee: [{required: true, message: '请输入收款paypal账号', trigger: 'blur'}, {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'}],
          firstName: [{required: true, message: '请输入客户名字', trigger: 'blur'}, {min: 1, max: 16, message: '长度在 1 到 32 个字符', trigger: 'blur'}],
          lastName: [{required: true, message: '请输入客户姓氏', trigger: 'blur'}, {min: 1, max: 16, message: '长度在 1 到 32 个字符', trigger: 'blur'}],
          street: [{required: true, message: '请输入街道', trigger: 'blur'}, {min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur'}],
          city: [{required: true, message: '请输入城市', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}],
          province: [{required: true, message: '请输入州/省', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}],
          postalCode: [{required: true, message: '请输入邮编', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}],
          brand: [{required: true, message: '请输入品牌', trigger: 'blur'}, {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}],
          team: [{required: true, message: '请选择组别', trigger: 'blur'}],
          leader: [{required: true, message: '请输入主管', trigger: 'blur'}, {min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur'}, {pattern: /^([a-zA-Z0-9])+\.([a-zA-Z0-9])+$/, message: '目前的全名格式不正确'}],
          channel: [{required: true, message: '请输入渠道', trigger: 'blur'}, {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}],
          country: [{required: true, message: '请输入国家', trigger: 'blur'}, {pattern: /^[A-Z]{2}$/, message: "请输入大写国家简称，如US"}],
          type: [{required: true, message: '请选择类型', trigger: 'blur'}],
          currency: [{required: true, message: '请输入币种', trigger: 'blur'}, {pattern: /^[A-Z]{3}$/, message: "请输入大写币种简称，如USD"}],
          trueAmount: [{required: true, message: '请输入订单金额', trigger: 'blur'}, {pattern: /^\d+(\.{1}\d{1,2}){0,1}$/, message: '请输入不多于两位小数的金额'}],
          commission: [{required: true, message: '请输入佣金', trigger: 'blur'}, {pattern: /^\d+(\.{1}\d{1,2}){0,1}$/, message: '请输入不多于两位小数的金额（日元必须为整数）'}],
          serviceFee: [{required: true, message: '请输入手续费', trigger: 'blur'}, {pattern: /^\d+(\.{1}\d{1,2}){0,1}$/, message: '请输入不多于两位小数的金额（日元必须为整数）'}],
          total: [{required: true, message: '请输入total', trigger: 'blur'}, {pattern: /^\d+(\.{1}\d{1,2}){0,1}$/, message: '请输入不多于两位小数的金额（日元必须为整数）'}],
          remark: [{required: true, message: '请输入备注', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'}],
          reviewerContact: [{required: true, message: '请输入邮箱或微信', trigger: 'blur'}, {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'}]
        },
        list: [],
        total: null,
        listLoading: true,
        applyDate: undefined,
        createDate: undefined,
        payDate: undefined,
        listQuery: {
          page: 1,
          limit: 10,
          batchNumber: undefined,
          applyNumber: undefined,
          status: undefined,
          applyDateStart: undefined,
          applyDateEnd: undefined,
          orderId: undefined,
          erpSku: undefined,
          payee: undefined,
          teams: undefined,
          transactionId: undefined,
          createUserName: undefined,
          customNote: undefined,
          createDateStart: undefined,
          createDateEnd: undefined,
          payDateStart: undefined,
          payDateEnd: undefined
        },
        submitForm: {
          ids: undefined
        },
        uploadForm: {
          excel: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        reqPaymentManager_btn_updateStatus: false,
        tableHeight: undefined,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        statusOptions: [{dicValue: -1, dicName: '审批不通过'},{dicValue: 1, dicName: '新建'}, {dicValue: 22, dicName: '待负责人审批'}, {dicValue: 23, dicName: '待会计审批'}, {dicValue: 3, dicName: '待支付'}, {dicValue: 4, dicName: '支付成功'}, {dicValue: 5, dicName: '支付失败'}],
        teamOptions: undefined,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        exportDialogVisible: false, //导出窗口
        importErrorDialogVisible: false, //导入失败提醒框
        importErrorList: null, // 导入失败的批次数据
        fullscreenLoading: false // 全屏加载loading
      }
    },
    mixins: [mixins],
    created() {
      this.getList();
      this.getSellerDeptGroups();
      this.reqPaymentManager_btn_updateStatus = this.elements['reqPaymentManager:btn_updateStatus'];
    },
    mounted: function(){
      this.tableHeight = window.innerHeight * 0.65;
    },
    computed: {
      ...mapGetters([
        'elements'
      ]),
      headers(){
        return {
          'Authorization': Cookies.get('Admin-Token')
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.applyDateStart = this.applyDate ? (this.applyDate[0] ? this.changeDate(this.applyDate[0]) : undefined) : undefined;
        this.listQuery.applyDateEnd = this.applyDate ? (this.applyDate[1] ? this.changeDate(this.applyDate[1]) : undefined) : undefined;
        this.listQuery.createDateStart = this.createDate ? (this.createDate[0] ? this.changeDate(this.createDate[0]) : undefined) : undefined;
        this.listQuery.createDateEnd = this.createDate ? (this.createDate[1] ? this.changeDate(this.createDate[1]) : undefined) : undefined;
        this.listQuery.payDateStart = this.payDate ? (this.payDate[0] ? this.changeDate(this.payDate[0]) : undefined) : undefined;
        this.listQuery.payDateEnd = this.payDate ? (this.payDate[1] ? this.changeDate(this.payDate[1]) : undefined) : undefined;
        getList(this.listQuery).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          }).catch(error => {
          this.listLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      getSellerDeptGroups() {
        getSellerDeptGroups().then(response => {
          this.teamOptions = response.data;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleSubmit() {
        this.fullscreenLoading = true;
        let selection = this.$refs.elementTable.selection;
        let ids = [];
        for (let i = 0; i <= selection.length - 1; i++) {
          ids.push(selection[i].id);
        }
        let idsStr = ids.join();
        if(idsStr.length < 1){
          this.$message.error("请勾选需要提交审批的数据");
          this.fullscreenLoading = false;
          return false;
        }
        this.submitForm.ids = idsStr;
        submit(this.submitForm).then(response => {
          if (response.resCode != 200) {
            this.$message.error(response.resDes);
          } else {
            this.$message.success("提交成功");
            this.getList();
          }
          this.fullscreenLoading = false;
        }).catch(error => {
          this.fullscreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      handleClear() {
        this.listQuery = {
          page: 1,
          limit: 10
        };
        this.applyDate = undefined;
        this.createDate = undefined;
        this.payDate = undefined;
        this.getList();
      },
      openExportDialog() {
        this.exportDialogVisible = true;
      },
      downloadTemplate() {
        this.fullscreenLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['系统批次号(系统生成)','请款人(系统生成)','请款日期(系统生成)','请款单号(系统生成)','支付状态(系统生成)','亚马逊单号','ERP SKU','付款paypal账号(系统生成)','收款paypal账号','客户名字','客户姓氏','街道','城市','州/省','邮编','Transaction ID(不用填)','Brand','主管','Team','渠道','Country','类型("选评"或"留评")','review链接','币种','订单金额（本币）','佣金（本币）','手续费（本币）','Total（本币）','备注','Reviewer Email/微信','自定义备注','财务驳回理由(不用填)','创建人(系统生成)','创建时间(系统生成)','支付时间(系统生成)'];
          const data = [];
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'refundTaskTemplate',
            autoWidth: true,
            bookType: 'xlsx'
          });
          this.fullscreenLoading = false;
        });
      },
      async exportRefundTasks() {
        this.listQuery.applyDateStart = this.applyDate ? (this.applyDate[0] ? this.changeDate(this.applyDate[0]) : undefined) : undefined;
        this.listQuery.applyDateEnd = this.applyDate ? (this.applyDate[1] ? this.changeDate(this.applyDate[1]) : undefined) : undefined;
        this.listQuery.createDateStart = this.createDate ? (this.createDate[0] ? this.changeDate(this.createDate[0]) : undefined) : undefined;
        this.listQuery.createDateEnd = this.createDate ? (this.createDate[1] ? this.changeDate(this.createDate[1]) : undefined) : undefined;
        this.listQuery.payDateStart = this.payDate ? (this.payDate[0] ? this.changeDate(this.payDate[0]) : undefined) : undefined;
        this.listQuery.payDateEnd = this.payDate ? (this.payDate[1] ? this.changeDate(this.payDate[1]) : undefined) : undefined;

        const loading = this.$loading({
          lock: true,
          text: '下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        const res = await exportPaypalTask(this.listQuery).catch(() => loading.close());
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
        })
        this.exportDialogVisible = false;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.form = {};
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
            .then(response => {
          this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let form = {
              ids: row.id + ""
            };
            this.fullscreenLoading = true;
            deleteTask(form).then(response => {
              if (response.resCode === 200) {
                this.$message.success("删除成功");
                this.getList();
              } else {
                this.$alert(response.resDes, "删除失败");
              }
              this.fullscreenLoading = false;
            }).catch(error => {
              this.fullscreenLoading = false;
              this.$message.error(JSON.stringify(error));
            });
          });
      },
      deleteBatch() {
        this.$confirm('此操作将永久删除勾选的单据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullscreenLoading = true;
          let selection = this.$refs.elementTable.selection;
          let ids = [];
          for (let i = 0; i <= selection.length - 1; i++) {
            ids.push(selection[i].id);
          }
          let idsStr = ids.join();
          if (idsStr.length < 1) {
            this.$message.error("请勾选需要删除的数据");
            this.fullscreenLoading = false;
            return false;
          }
          this.submitForm.ids = idsStr;
          deleteTask(this.submitForm).then(response => {
            if (response.resCode != 200) {
              this.$message.error(response.resDes);
            } else {
              this.$message.success("删除成功");
              this.getList();
            }
            this.fullscreenLoading = false;
          }).catch(error => {
            this.fullscreenLoading = false;
            this.$message.error(JSON.stringify(error));
          })
        })
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            add(this.form)
              .then((response) => {
                if (response.resCode != 200) {
                  this.$alert(response.resDes, "添加失败");
                } else {
                  this.dialogFormVisible = false;
                  this.getList();
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  });
                }
              })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.fullscreenLoading = true;
            update(this.form).then(response => {
              if (response.resCode != 200) {
                this.$alert(response.resDes, "编辑失败");
              } else {
                this.$message.success("编辑成功");
                this.dialogFormVisible = false;
                this.getList();
              }
              this.fullscreenLoading = false;
            });
          } else {
            return false;
          }
        });
      },
      changeDate(date) {
        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      uploadSuccess(response) {
        this.$refs.uploadFile.clearFiles();
        this.fullscreenLoading=false;
        if (response.resCode != 200) {
          if (response.data) {
            this.importErrorList = response.data;
            this.importErrorDialogVisible = true;
          } else {
            this.$message.error(response.message);
          }
        } else {
          this.$message.success("导入成功");
          this.getList();
        }
      },
      updateAfterPayingSuccess(response) {
        this.$refs.updateAfterPayingFile.clearFiles();
        this.fullscreenLoading=false;
        if (response.resCode != 200) {
          if(!response.data) {
            this.$message.error('excel读取失败，请检查excel或联系IT人员!');
          } else {
            this.importErrorList = response.data;
            this.importErrorDialogVisible = true;
          }
        } else {
          this.$message.success("更新成功");
          this.getList();
        }
      },
      uploadError(error) {
        this.fullscreenLoading = false;
        this.$message.error('导入失败，请检查excel或联系IT人员!');
      },
      getUserId() {
        let userId = Cookies.get('UserId');
        return userId;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .form-el-all{
    display: flex;
    flex-wrap: wrap;
  }
  .filter-container {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
</style>
