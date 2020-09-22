<template>
  <div class="fixed_table" style="padding: 20px">
    <div class="filter-container">
      <el-form v-model="listQuery" style="display: flex;flex-wrap: wrap">
        <el-form-item label="供应商编号" label-width="120px">
          <el-input v-model="listQuery.supplierNo" placeholder="请输入" @keyup.enter.native="getList"/>
        </el-form-item>
        <el-form-item label="供应商名称" label-width="120px">
          <el-input v-model="listQuery.supplierName" placeholder="请输入" @keyup.enter.native="getList"/>
        </el-form-item>
        <el-form-item label="合同编号" label-width="100px">
          <el-input v-model="listQuery.contractNo" placeholder="请输入" @keyup.enter.native="getList"/>
        </el-form-item>
        <el-form-item label="添加时间" label-width="100px">
          <el-date-picker v-model="createDate" type="daterange" range-separator="-" :picker-options="pickerOptions"
                          unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable>
            <el-option label="正常" :key="1" :value="1"/>
            <el-option label="已停用" :key="2" :value="2"/>
            <el-option label="合同过期" :key="3" :value="3"/>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div align="center">
      <el-button v-waves type="primary" @click="getList">查询</el-button>
      <el-button v-waves type="primary" @click="reset">重置</el-button>
      <el-button v-waves type="primary" @click="openAddSupplierDialog">新增供应商</el-button>
      <el-button v-waves type="primary" @click="exportData">导出报表</el-button>
    </div>

    <el-table :data="dataList.dataList" v-loading.sync="listLoading" border fit highlight-current-row style="margin-top: 10px"
              :height="tableHeight">
      <el-table-column type="index" align="center" width="65px"/>
      <el-table-column width="130px" align="center" label="供应商编号" prop="supplierNo"/>
      <el-table-column width="180px" align="center" label="供应商名称" prop="supplierName"/>
      <el-table-column width="100px" align="center" label="添加日期" prop="createDateStr"/>
      <el-table-column width="100px" align="center" label="状态" prop="statusStr"/>
      <el-table-column width="80px" align="center" label="账户数量" prop="accountCount"/>
      <el-table-column width="130px" align="center" label="合同编号" prop="contractNo"/>
      <el-table-column width="180px" align="center" label="合同有效期" prop="contractExpireDateStr"/>
      <el-table-column width="130px" align="center" label="近30天付款金额" prop="latestMonthPayment"/>
      <el-table-column width="130px" align="center" label="本月付款金额" prop="currentMonthPayment"/>
      <el-table-column width="130px" align="center" label="今年付款金额" prop="currentYearPayment"/>
      <el-table-column width="130px" align="center" label="待付款金额" prop="waitPayment"/>
      <el-table-column width="200px" align="center" label="Sunvalley联系人">
        <template slot-scope="scope">
          <span>{{scope.row.contactPerson + ' (' + scope.row.contactPhone + ')'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="150px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="small" @click="openInfoDialog(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status === 2" v-waves type="success" size="small" @click="changeStatus(scope.row, 1)">启用</el-button>
          <el-button v-else-if="scope.row.status === 1" v-waves type="danger" size="small" @click="changeStatus(scope.row, 2)">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="dataList.total"/>
    </div>

    <!--新建供应商-->
    <el-dialog title="新建供应商" :before-close="closeAddSupplierDialog" :visible.sync="addSupplierDialogVisible" v-dialog-drag top="6vh">
      <el-form :model="addSupplierForm" :rules="addSupplierRules" ref="addSupplierForm" label-width="160px">
        <el-form-item label="供应商编号" prop="supplierNo" style="margin-bottom: 20px;">
          <el-input v-model="addSupplierForm.supplierNo" placeholder="请输入供应商编号" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName" style="margin-bottom: 20px;">
          <el-input v-model="addSupplierForm.supplierName" placeholder="请输入供应商名称" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="Sunvalley联系人" prop="contactPerson" style="margin-bottom: 20px;">
          <el-input v-model="addSupplierForm.contactPerson" placeholder="请输入Sunvalley联系人" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="Sunvalley联系人电话" prop="contactPhone" style="margin-bottom: 20px;">
          <el-input v-model="addSupplierForm.contactPhone" placeholder="请输入Sunvalley联系人电话" style="width: 600px"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" @click="addSupplier">确 定</el-button>
        <el-button v-waves type="primary" @click="closeAddSupplierDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!--供应商详情页-->
    <el-dialog class="dialog_class" title="供应商详情页" :before-close="closeInfoDialog" :visible.sync="infoDialogVisible" v-loading="fullScreenLoading" v-dialog-drag width="1350px" top="3vh">
      <div>
        <div class="infoDialogTitle" style="margin-top: 0">{{selectedRow.supplierName}}</div>
        <table cellspacing="5">
        <tr>
          <td width="650px">供应商编号:{{this.information.baseInfo.supplierNo}}
            <span style="margin-left: 40px">{{this.information.baseInfo.statusStr}}</span>
          </td>
          <td>
            SunValley联系人:
            <span v-if="!editContactVisible">{{this.information.baseInfo.contactPerson + " (" + this.information.baseInfo.contactPhone + ")"}}</span>
            <el-input v-if="editContactVisible" v-model="editContactForm.contactPerson" size="small" placeholder="联系人" style="width: 120px;"></el-input>
            <el-input v-if="editContactVisible" v-model="editContactForm.contactPhone" size="small" placeholder="电话" style="width: 130px;"></el-input>
            <el-button v-if="editContactVisible" v-waves type="primary" size="small" @click="editContact" style="margin-left: 10px">保存</el-button>
            <el-button v-if="editContactVisible" v-waves type="primary" size="small" @click="editContactVisible=false" style="margin-left: 10px">取消</el-button>
            <el-button v-if="!editContactVisible" v-waves type="primary" size="small" @click="openEditContactVisible" style="margin-left: 10px">编辑</el-button>
          </td>
        </tr>
        <tr>
          <td>添加时间:{{this.$moment(this.information.baseInfo.createDate).format("YYYY/M/D") + " by " +
            this.information.baseInfo.createUserName + " (" + this.information.baseInfo.createUserEmail + ")"}}</td>
          <td>更新时间:{{this.$moment(this.information.baseInfo.updateDate).format("YYYY/M/D") + " by " +
            this.information.baseInfo.updateUserName + " (" + this.information.baseInfo.updateUserEmail + ")"}}</td>
        </tr>
        </table>
      </div>

      <!--详情 合同信息-->
      <div class="infoDialogTitle" style="margin-bottom: 5px">
        <span>合同信息</span>
        <el-button v-waves type="success" size="small" @click="openAddContractDialogVisible" style="margin-left: 5px">+新增合同</el-button>
      </div>
      <el-table :data="information.contractInfo" v-loading.sync="fullScreenLoading" border fit highlight-current-row max-height="300px">
        <el-table-column type="index" align="center" width="65px"/>
        <el-table-column width="170px" align="center" label="合同编号" prop="contractNo"/>
        <el-table-column width="190px" align="center" label="合同期限">
          <template slot-scope="scope">
            {{$moment(scope.row.expireDateStart).format("YYYY/M/D") + " - " + $moment(scope.row.expireDateEnd).format("YYYY/M/D")}}
          </template>
        </el-table-column>
        <el-table-column width="240px" align="center" label="关联Team" prop="teamName" show-overflow-tooltip/>
        <el-table-column width="120px" align="center" label="付款账户" prop="payer"/>
        <el-table-column width="120px" align="center" label="价格支付币种" prop="priceCurrency"/>
        <el-table-column width="120px" align="center" label="佣金支付币种" prop="commissionCurrency"/>
        <el-table-column width="120px" align="center" label="手续费支付币种" prop="serviceFeeCurrency"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-waves type="primary" size="small" @click="openEditContractDialogVisible(scope.row)">编辑</el-button>
            <el-button v-waves type="danger" size="small" @click="deleteContract(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--详情 账户信息-->
      <div class="infoDialogTitle" style="margin-bottom: 5px">
        <span>账户信息</span>
        <el-button v-waves type="success" size="small" @click="openAddAccountDialogVisible" style="margin-left: 5px">+新增账户</el-button>
      </div>
      <el-table :data="information.accountInfo" v-loading.sync="fullScreenLoading" border fit highlight-current-row max-height="300px">
        <el-table-column type="index" align="center" width="65px"/>
        <el-table-column width="230px" align="center" label="开户名称" prop="accountName"/>
        <el-table-column width="270px" align="center" label="开户银行" prop="bankName"/>
        <el-table-column width="180px" align="center" label="银行代号" prop="bankCode"/>
        <el-table-column width="170px" align="center" label="币种" prop="currency"/>
        <el-table-column width="230px" align="center" label="银行账号" prop="accountNo"/>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-waves type="primary" size="small" @click="openEditAccountDialogVisible(scope.row)">编辑</el-button>
            <el-button v-waves type="danger" size="small" @click="deleteAccount(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--详情 付款信息-->
      <div class="infoDialogTitle">付款信息</div>
      <div class="dialog_card">
        <div>付款汇总统计</div>
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
          <tr>
            <td>待付款</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
      <!--详情 付款明细-->
      <div class="infoDialogTitle">付款明细</div>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="按部门申请查看" name="department">
          <el-form v-model="getApplyForm" style="display: flex; flex-wrap: wrap; margin-top: 5px">
            <el-form-item label="状态" label-width="60px" style="margin-bottom: 5px">
              <el-input v-model="getApplyForm.status" placeholder="请输入" clearable @keyup.enter.native="getApplyList"/>
            </el-form-item>
            <el-form-item label="付款公司" label-width="100px" style="margin-bottom: 5px">
              <el-input v-model="getApplyForm.payer" placeholder="请输入" clearable @keyup.enter.native="getApplyList"/>
            </el-form-item>
            <el-form-item label="申请日期" label-width="100px" style="margin-bottom: 5px">
              <el-date-picker v-model="applyDate" type="daterange" range-separator="-" :picker-options="pickerOptions"
                              unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"/>
            </el-form-item>
          </el-form>
          <div align="center" style="margin-bottom: 10px">
            <el-button v-waves type="primary" size="small" @click="getApplyList">查询</el-button>
            <el-button v-waves type="primary" size="small" @click="resetApplyForm">重置</el-button>
            <el-button v-waves type="primary" size="small" @click="exportApplyList">导出报表</el-button>
          </div>

          <el-table :data="information.applyList" v-loading.sync="fullScreenLoading" border fit highlight-current-row max-height="400px">
            <el-table-column fixed="left" type="index" width="65px" align="center"/>
            <el-table-column fixed="left" width="130px" align="center" label="申请日期" prop="applyDate">
              <template slot-scope="scope">
                <span>{{$moment(scope.row.applyDate).format("YYYY/M/D")}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="left" width="170px" align="center" label="申请单号" prop="applyNo"/>
            <el-table-column fixed="left" width="140px" align="center" label="状态" prop="statusStr"/>
            <el-table-column fixed="left" width="100px" align="center" label="操作">
              <template slot-scope="scope">
                <el-button v-waves type="primary" size="small" @click="openApplyInfoDialog(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column width="130px" align="center" label="部门" prop="team"/>
            <el-table-column width="100px" align="center" label="申请人" prop="createUserName"/>
            <el-table-column width="100px" align="center" label="付款公司" prop="payer"/>
            <el-table-column width="100px" align="center" label="收款银行" prop="bankName"/>
            <el-table-column width="100px" align="center" label="收款账户" prop="accountNo"/>
            <el-table-column width="100px" align="center" label="币种" prop="currency"/>
            <el-table-column width="100px" align="center" label="总付款金额" prop=""/>
            <el-table-column width="100px" align="center" label="已付金额" prop=""/>
            <el-table-column width="100px" align="center" label="待付金额" prop=""/>
          </el-table>
          <div v-show="!fullScreenLoading" class="pagination-container">
            <el-pagination @size-change="handleApplySizeChange" @current-change="handleApplyPageChange"
                           :current-page.sync="getApplyForm.page" :page-sizes="[10,20,30,50]" :page-size="getApplyForm.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="information.applyTotal"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="付款单查看" name="payment">
          <el-form v-model="getBillForm" style="display: flex; flex-wrap: wrap; margin-top: 5px">
            <el-form-item label="状态" label-width="60px" style="margin-bottom: 5px">
              <el-input v-model="getBillForm.status" placeholder="请输入" clearable @keyup.enter.native="getBillList"/>
            </el-form-item>
            <el-form-item label="申请日期" label-width="100px" style="margin-bottom: 5px">
              <el-date-picker v-model="billApplyDate" type="daterange" range-separator="-" :picker-options="pickerOptions"
                              unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"/>
            </el-form-item>
          </el-form>
          <div align="center" style="margin-bottom: 10px">
            <el-button v-waves type="primary" size="small" @click="getBillList">查询</el-button>
            <el-button v-waves type="primary" size="small" @click="resetBillForm">重置</el-button>
            <el-button v-waves type="primary" size="small" @click="exportBillList">导出报表</el-button>
          </div>

          <el-table :data="information.billList" v-loading.sync="fullScreenLoading" border fit highlight-current-row max-height="400px">
            <el-table-column type="index" align="center"/>
            <el-table-column width="170px" align="center" label="付款单号" prop="billNo"/>
            <el-table-column width="190px" align="center" label="收款账户名称" prop="accountName"/>
            <el-table-column width="240px" align="center" label="收款银行" prop="bankName"/>
            <el-table-column width="190px" align="center" label="收款账户" prop="accountNo"/>
            <el-table-column width="100px" align="center" label="付款公司" prop="payer"/>
            <el-table-column width="100px" align="center" label="付款币种" prop="currency"/>
            <el-table-column width="130px" align="center" label="付款金额" prop="payTotal"/>
            <el-table-column width="140px" align="center" label="状态" prop="statusStr"/>
          </el-table>
          <div v-show="!fullScreenLoading" class="pagination-container">
            <el-pagination @size-change="handleBillSizeChange" @current-change="handleBillPageChange"
                           :current-page.sync="getBillForm.page" :page-sizes="[10,20,30,50]" :page-size="getBillForm.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="information.billTotal"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--详情 新增合同-->
    <el-dialog :title="openContractDialogType === 'add'?'新增合同':'编辑合同'" :before-close="closeAddContractDialog" :visible.sync="addContractDialogVisible" v-dialog-drag top="15vh">
      <el-form :model="addContractForm" :rules="addContractRules" ref="addContractForm" label-width="160px">
        <el-form-item label="合同编号" prop="contractNo" style="margin-bottom: 20px;">
          <el-input v-model="addContractForm.contractNo" placeholder="请输入合同编号" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="合同期限" prop="expireDateStart" style="margin-bottom: 20px;">
          <el-date-picker v-model="expireDate" type="daterange" range-separator="-" :picker-options="pickerOptions"
                          unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item label="关联Team" prop="teamName" style="margin-bottom: 20px;">
          <el-select v-model="addContractForm.teamName" placeholder="请选择" clearable multiple>
            <el-option v-for="(item,index) in teamNameOptions" :key="index" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="付款账户" prop="payer" style="margin-bottom: 20px;">
          <el-input v-model="addContractForm.payer" placeholder="请输入付款账户" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="价格支付币种" prop="priceCurrency" style="margin-bottom: 20px;">
          <el-input v-model="addContractForm.priceCurrency" placeholder="请输入价格支付币种" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="佣金支付币种" prop="commissionCurrency" style="margin-bottom: 20px;">
          <el-input v-model="addContractForm.commissionCurrency" placeholder="请输入佣金支付币种" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="手续费支付币种" prop="serviceFeeCurrency" style="margin-bottom: 20px;">
          <el-input v-model="addContractForm.serviceFeeCurrency" placeholder="请输入手续费支付币种" style="width: 600px"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-if="openContractDialogType === 'add'" v-waves type="primary" @click="addContract">确 定</el-button>
        <el-button v-else v-waves type="primary" @click="editContract">确 定</el-button>
        <el-button v-waves type="primary" @click="closeAddContractDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!--详情 新增账户-->
    <el-dialog :title="openAccountDialogType === 'add'?'新增账户':'编辑账户'" :before-close="closeAddAccountDialog" :visible.sync="addAccountDialogVisible" v-dialog-drag top="15vh">
      <el-form :model="addAccountForm" :rules="addAccountRules" ref="addAccountForm" label-width="160px">
        <el-form-item label="开户名称" prop="accountName" style="margin-bottom: 20px;">
          <el-input v-model="addAccountForm.accountName" placeholder="请输入开户名称" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="开户银行" prop="expireDate" style="margin-bottom: 20px;">
          <el-input v-model="addAccountForm.bankName" placeholder="请输入开户银行" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="银行代号" prop="bankCode" style="margin-bottom: 20px;">
          <el-input v-model="addAccountForm.bankCode" placeholder="请输入银行代号" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="币种" prop="currency" style="margin-bottom: 20px;">
          <el-input v-model="addAccountForm.currency" placeholder="请输入币种" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="银行账号" prop="accountNo" style="margin-bottom: 20px;">
          <el-input v-model="addAccountForm.accountNo" placeholder="请输入银行账号" style="width: 600px"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-if="openAccountDialogType === 'add'" v-waves type="primary" @click="addAccount">确 定</el-button>
        <el-button v-else v-waves type="primary" @click="editAccount">确 定</el-button>
        <el-button v-waves type="primary" @click="closeAddAccountDialog">取 消</el-button>
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
  </div>
</template>

<script>
  import {
    getList,
    getInfo,
    changeStatus,
    addSupplier,
    editContact,
    addContract,
    editContract,
    deleteContract,
    addAccount,
    editAccount,
    deleteAccount
  } from '../../../api/finance/publicPayment/publicPaymentSupplier';
  import {
    getApplyList,
    getInfo as getApplyInfo
  } from '../../../api/finance/publicPayment/publicPaymentApply';
  import {
    getBillList
  } from '../../../api/finance/publicPayment/publicPaymentBill';

  export default {
    name: "publicPaymentSupplier",
    data() {
      return {
        listLoading: false,
        fullScreenLoading: false,
        infoDialogVisible: false,
        addSupplierDialogVisible: false,
        addContractDialogVisible: false,
        addAccountDialogVisible: false,
        editContactVisible: false,
        applyInfoDialogVisible: false,
        tableHeight: window.innerHeight * 0.65,
        activeTab: 'department',
        openContractDialogType: '',
        openAccountDialogType: '',
        selectedRow: {},
        applyDetail: {},
        auditLogList: [],
        auditLogShowList: [],
        auditLogCompletedList: [{nodeName: '提交单据'},{nodeName: '主管审批'},{nodeName: '事业部负责人审批'},{nodeName: '会计审批'}],
        infoFileList: [],
        createDate: undefined,
        listQuery: {
          supplierNo: undefined,
          supplierName: undefined,
          contractNo: undefined,
          status: undefined,
          createDateStart: undefined,
          createDateEnd: undefined,
          page: undefined,
          limit: undefined
        },
        dataList: {
          dataList: [],
          total: undefined
        },
        paymentStatisticsCurrency: 'CNY',
        information: {
          baseInfo: {},
          contractInfo: [],
          accountInfo: [],
          paymentStatistics: {},
          applyList: [],
          applyTotal: undefined,
          billList: [],
          billTotal: undefined
        },
        addSupplierForm: {
          supplierNo: undefined,
          supplierName: undefined,
          contactPerson: undefined,
          contactPhone: undefined
        },
        addSupplierRules: {
          supplierNo: [{required: true, message: '请输入供应商编号', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}],
          supplierName: [{required: true, message: '请输入供应商名称', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}],
          contractNo: [{required: true, message: '请输入合同编号', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}],
          contactPerson: [{required: true, message: '请输入Sunvalley联系人', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}],
          contactPhone: [{required: true, message: '请输入Sunvalley联系人电话', trigger: 'blur'}, {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}]
        },
        expireDate: undefined,
        teamNameOptions: ['A1', 'EU', 'W5', 'T1'],
        addContractForm: {
          supplierId: undefined,
          contractNo: undefined,
          expireDateStart: undefined,
          expireDateEnd: undefined,
          teamName: ['A1','EU'],
          payer: undefined,
          priceCurrency: undefined,
          commissionCurrency: undefined,
          serviceFeeCurrency: undefined
        },
        addContractRules: {
          contractNo: [{required: true, message: '请输入合同编号', trigger: 'blur'}],
          expireDateStart: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
          teamName: [{required: true, message: '请输入组别名', trigger: 'blur'}],
          payer: [{required: true, message: '请输入付款账户', trigger: 'blur'}],
          priceCurrency: [{required: true, message: '请输入价格币种', trigger: 'blur'}],
          commissionCurrency: [{required: true, message: '请输入佣金币种', trigger: 'blur'}],
          serviceFeeCurrency: [{required: true, message: '请输入手续费币种', trigger: 'blur'}]
        },
        addAccountForm: {
          accountName: undefined,
          bankName: undefined,
          bankCode: undefined,
          accountNo: undefined,
          currency: undefined
        },
        addAccountRules: {
          accountName: [{required: true, message: '请输入合同编号', trigger: 'blur'}],
          bankName: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
          bankCode: [{required: true, message: '请输入组别名', trigger: 'blur'}],
          accountNo: [{required: true, message: '请输入付款账户', trigger: 'blur'}],
          currency: [{required: true, message: '请输入价格币种', trigger: 'blur'}]
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
        },
        editContactForm: {
          id: undefined,
          contactPerson: undefined,
          contactPhone: undefined
        },
        applyDate: undefined,
        getApplyForm: {
          supplierId: undefined,
          status: undefined,
          payer: undefined,
          applyDateStart: undefined,
          applyDateEnd: undefined,
          page: 1,
          limit: 20
        },
        billApplyDate: undefined,
        getBillForm: {
          supplierId: undefined,
          status: undefined,
          applyDateStart: undefined,
          applyDateEnd: undefined,
          page: 1,
          limit: 20
        }
      }
    },
    watch: {
      createDate() {
        this.listQuery.createDateStart = this.createDate ? this.changeDate(this.createDate[0]) : undefined;
        this.listQuery.createDateEnd = this.createDate ? this.changeDate(this.createDate[1]) : undefined;
      },
      expireDate() {
        this.addContractForm.expireDateStart = this.expireDate ? this.changeDate(this.expireDate[0]) : undefined;
        this.addContractForm.expireDateEnd = this.expireDate ? this.changeDate(this.expireDate[1]) : undefined;
      },
      applyDate() {
        this.getApplyForm.applyDateStart = this.applyDate ? this.changeDate(this.applyDate[0]) : undefined;
        this.getApplyForm.applyDateEnd = this.applyDate ? this.changeDate(this.applyDate[1]) : undefined;
      },
      billApplyDate() {
        this.getBillForm.applyDateStart = this.billApplyDate ? this.changeDate(this.billApplyDate[0]) : undefined;
        this.getBillForm.applyDateEnd = this.billApplyDate ? this.changeDate(this.billApplyDate[1]) : undefined;
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getList(this.listQuery).then(response => {
          if (response.resCode === 200) {
            this.dataList.dataList = response.data.rows;
            this.dataList.total = response.data.total;
          } else {
            this.$message.error(response.resDes);
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error("查询失败");
        });
      },
      getInfo() {
        this.fullScreenLoading = true;
        return getInfo({supplierId: this.selectedRow.id}).then(response => {
          if (response.resCode === 200) {
            this.information.baseInfo = response.data.baseInfo;
            this.information.contractInfo = response.data.contractInfo;
            this.information.accountInfo = response.data.accountInfo;
            this.information.applyList = response.data.applyList;
            this.information.applyTotal = response.data.applyTotal;
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询失败");
        });
      },
      reset() {
        for (let key in this.listQuery) {
          this.listQuery[key] = undefined;
        }
        this.createDate = undefined;
        this.getList();
      },
      changeStatus(row, status) {
        this.selectedRow = row;
        this.fullScreenLoading = true;
        changeStatus({businessId: row.id, status: status}).then(response => {
          if (response.resCode === 200) {
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error=> {
          this.fullScreenLoading = false;
          this.$message.error("操作失败");
        });
      },
      exportData() {
        this.listLoading = true;
        let originalPage = this.listQuery.page;
        let originalLimit = this.listQuery.limit;
        this.listQuery.page = 1;
        this.listQuery.limit = 999999;
        getList(this.listQuery).then(response => {
          if (response.resCode === 200) {
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['供应商编号', '供应商名称', '添加日期', '状态', '账户数量', '合同编号', '合同有效期', '近30天付款金额', '本月付款金额', '今年付款金额', '待付款金额', 'Sunvalley联系人'];
              const filterVal = ['supplierNo', 'supplierName', 'createDateStr', 'statusStr', 'accountCount', 'contractNo', 'contractExpireDate', 'latestMonthPayment', 'currentMonthPayment', 'currentYearPayment', 'waitPayment', 'contactPerson'];
              const list = response.data.rows;
              const data = this.formatJson(filterVal, list);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'publicPaymentSupplier',
                autoWidth: true,
                bookType: 'xlsx'
              });
            });
          } else {
            this.$message.error("导出失败");
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
      addSupplier() {
        this.fullScreenLoading = true;
        addSupplier(this.addSupplierForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("新增成功");
            this.addSupplierDialogVisible = false;
            this.getList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("新增失败");
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
      changeDate(date) {
        return this.$moment(date).format("YYYY-MM-DD");
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handlePageChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleApplySizeChange(val) {
        this.getApplyForm.limit = val;
        this.getApplyList();
      },
      handleApplyPageChange(val) {
        this.getApplyForm.page = val;
        this.getApplyList();
      },
      handleBillSizeChange(val) {
        this.getBillForm.limit = val;
        this.getBillList();
      },
      handleBillPageChange(val) {
        this.getBillForm.page = val;
        this.getBillList();
      },
      openAddSupplierDialog() {
        for(let key in this.addSupplierForm) {
          this.addSupplierForm[key] = undefined;
        }
        this.contractExpireDate = undefined;
        this.addSupplierDialogVisible = true;
      },
      closeAddSupplierDialog() {
        this.addSupplierDialogVisible = false;
      },
      async openInfoDialog(row) {
        this.selectedRow = row;
        await this.getInfo();
        this.activeTab = 'department';
        this.infoDialogVisible = true;

        let contractInfo = this.information.contractInfo;
        let prepareToExpire = [];
        let hasExpire = [];
        if (contractInfo !== undefined && contractInfo.length > 0) {
          for (let i = 0, length = contractInfo.length; i <= length - 1; i++) {
            if(contractInfo[i].expireStatus === 1) {
              // 准备过期
              prepareToExpire.push(contractInfo[i].contractNo);
            } else if(contractInfo[i].expireStatus === 2) {
              // 已过期
              hasExpire.push(contractInfo[i].contractNo);
            }
          }
        }
        let message = "该供应商的";
        if(prepareToExpire.length > 0) {
          message = message + "编号为 " + prepareToExpire.join(" 和 ") + " 的合同即将失效，"
        }
        if(hasExpire.length > 0) {
          message = message + "编号为 " + hasExpire.join(" 和 ") + " 的合同已经失效，";
        }
        message = message + "请及时更新相关信息，否则可能会出现支付错误。";

        if(prepareToExpire.length > 0 || hasExpire.length > 0) {
          this.$alert(message, '提示');
        }
      },
      closeInfoDialog() {
        this.infoDialogVisible = false;
      },
      openEditContactVisible() {
        this.editContactForm.contactPerson = this.information.baseInfo.contactPerson;
        this.editContactForm.contactPhone = this.information.baseInfo.contactPhone;
        this.editContactVisible = true;
      },
      openAddContractDialogVisible() {
        for(let key in this.addContractForm) {
          this.addContractForm[key] = undefined;
        }
        this.expireDate = undefined;
        this.openContractDialogType = 'add';
        this.addContractDialogVisible = true;
      },
      openEditContractDialogVisible(row) {
        for(let key in row) {
          this.addContractForm[key] = row[key];
        }
        this.addContractForm.teamName = row.teamName.split(",");
        this.expireDate = [new Date(row.expireDateStart), new Date(row.expireDateEnd)];
        this.openContractDialogType = 'edit';
        this.addContractDialogVisible = true;
      },
      openEditAccountDialogVisible(row) {
        for(let key in row) {
          this.addAccountForm[key] = row[key];
        }
        this.openAccountDialogType = 'edit';
        this.addAccountDialogVisible = true;
      },
      deleteContract(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteContract({supplierId: row.supplierId, contractId: row.id}).then(response => {
            if (response.resCode === 200) {
              this.$message.success("删除成功");
              this.getInfo();
            } else {
              this.$message.error("删除失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("删除失败");
          });
        });
      },
      deleteAccount(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAccount({supplierId: row.supplierId, accountId: row.id}).then(response => {
            if (response.resCode === 200) {
              this.$message.success("删除成功");
              this.getInfo();
            } else {
              this.$message.error("删除失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("删除失败");
          });
        });
      },
      closeAddContractDialog() {
        this.addContractDialogVisible = false;
      },
      openAddAccountDialogVisible() {
        for(let key in this.addAccountForm) {
          this.addAccountForm[key] = undefined;
        }
        this.openAccountDialogType = 'add';
        this.addAccountDialogVisible = true;
      },
      closeAddAccountDialog() {
        this.addAccountDialogVisible = false;
      },
      handleTabClick(tab) {
        if (tab.name === 'department') {
          // 按部门申请查看
          this.getApplyForm = {page: 1, limit: 20};
          this.getApplyList();
        } else if (tab.name === 'payment') {
          // 付款单查看
          this.getBillForm = {page: 1, limit: 20};
          this.getBillList();
        }
      },
      editContact() {
        this.fullScreenLoading = true;
        this.editContactForm.id = this.selectedRow.id;
        editContact(this.editContactForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("保存成功");
            this.information.baseInfo.contactPerson = this.editContactForm.contactPerson;
            this.information.baseInfo.contactPhone = this.editContactForm.contactPhone;
            this.editContactVisible = false;
            this.getList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("保存失败");
        });
      },
      addContract() {
        this.fullScreenLoading = true;
        this.addContractForm.supplierId = this.selectedRow.id;
        addContract(this.addContractForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("新增成功");
            this.addContractDialogVisible = false;
            this.getInfo();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("新增失败");
        });
      },
      editContract() {
        this.fullScreenLoading = true;
        editContract(this.addContractForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("编辑成功");
            this.addContractDialogVisible = false;
            this.getInfo();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("编辑失败");
        });
      },
      addAccount() {
        this.fullScreenLoading = true;
        this.addAccountForm.supplierId = this.selectedRow.id;
        addAccount(this.addAccountForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("新增成功");
            this.addAccountDialogVisible = false;
            this.getInfo();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("新增失败");
        });
      },
      editAccount() {
        this.fullScreenLoading = true;
        editAccount(this.addAccountForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("编辑成功");
            this.addAccountDialogVisible = false;
            this.getInfo();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("编辑失败");
        });
      },
      exportApplyList() {
        this.fullScreenLoading = true;
        let originalPage = this.getApplyForm.page;
        let originalLimit = this.getApplyForm.limit;
        this.getApplyForm.page = 1;
        this.getApplyForm.limit = 999999;
        getApplyList(this.getApplyForm).then(response => {
          if (response.resCode === 200) {
            import('@/vendor/Export2Excel').then(excel => {
              let tHeader = ['申请日期', '申请单号', '状态', '部门', '申请人', '付款公司', '收款银行', '收款账户', '币种', '总付款金额', '已付金额', '待付金额'];
              let filterVal = ['applyDateStr', 'applyNo', 'statusStr', 'team', 'createUserName', 'payer', 'bankName', 'accountNo', '', '', '', ''];
              const list = response.data.rows;
              const data = this.formatJson(filterVal, list);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'paymentDetail',
                autoWidth: true,
                bookType: 'xlsx'
              });
            });
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
          this.getApplyForm.page = originalPage;
          this.getApplyForm.limit = originalLimit;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.getApplyForm.page = originalPage;
          this.getApplyForm.limit = originalLimit;
          this.$message.error("导出失败");
        });
      },
      exportBillList() {
        this.fullScreenLoading = true;
        let originalPage = this.getBillForm.page;
        let originalLimit = this.getBillForm.limit;
        this.getBillForm.page = 1;
        this.getBillForm.limit = 999999;
        getBillList(this.getBillForm).then(response => {
          if (response.resCode === 200) {
            import('@/vendor/Export2Excel').then(excel => {
              let tHeader = ['付款单号', '收款账户名称', '收款银行', '收款账户', '付款公司', '付款币种', '付款金额', '状态'];
              let filterVal = ['billNo', 'accountName', 'bankName', 'accountNo', 'payer', 'currency', 'payTotal', 'statusStr'];
              const list = response.data.rows;
              const data = this.formatJson(filterVal, list);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'paymentDetail',
                autoWidth: true,
                bookType: 'xlsx'
              });
            });
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
          this.getApplyForm.page = originalPage;
          this.getApplyForm.limit = originalLimit;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.getApplyForm.page = originalPage;
          this.getApplyForm.limit = originalLimit;
          this.$message.error("导出失败");
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
      getApplyList() {
        this.fullScreenLoading = true;
        this.getApplyForm.supplierId = this.selectedRow.id;
        getApplyList(this.getApplyForm).then(response => {
          if (response.resCode === 200) {
            this.information.applyList = response.data.rows;
            this.information.applyTotal = response.data.total;
          } else {
            this.$message.error("查询失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询失败");
        });
      },
      getBillList() {
        this.fullScreenLoading = true;
        this.getBillForm.supplierId = this.selectedRow.id;
        getBillList(this.getBillForm).then(response => {
          if (response.resCode === 200) {
            this.information.billList = response.data.rows;
            this.information.billTotal = response.data.total;
          } else {
            this.$message.error("查询失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询失败");
        });
      },
      resetApplyForm() {
        this.applyDate = undefined;
        this.getApplyForm = {page: 1, limit: 20};
        this.getApplyList();
      },
      resetBillForm() {
        this.billApplyDate = undefined;
        this.getBillForm = {page: 1, limit: 20};
        this.getBillList();
      },
      openApplyInfoDialog(row) {
        this.getApplyInfo(row.id);
        this.applyInfoDialogVisible = true;
      },
      getApplyInfo(id) {
        this.fullScreenLoading = true;
        getApplyInfo({id: id}).then(response => {
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

  .paymentInfoTable td{
    width: 250px;
    text-align: center;
  }

  .infoDialogTitle {
    margin-top: 20px;
    font-weight: 800;
    font-size: 16px
  }

</style>
