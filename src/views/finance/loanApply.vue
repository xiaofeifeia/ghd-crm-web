<template>
  <div class="app-container calendar-list-container fixed_table">
    <div class="filter-container">
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap">
        <el-form-item label="借款单号" label-width="100px">
          <el-input v-model="listQuery.loanNo" placeholder="请输入" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in statusOptions" :label="item.label" :key="index" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="借款人" label-width="100px">
          <el-input v-model="listQuery.borrowerName" placeholder="请输入" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="开户银行" label-width="100px">
          <el-input v-model="listQuery.bankName" placeholder="请输入" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="开户名称" label-width="100px">
          <el-input v-model="listQuery.accountName" placeholder="请输入" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="银行账号" label-width="100px">
          <el-input v-model="listQuery.accountNo" placeholder="请输入" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="提交日期" label-width="100px">
          <el-date-picker v-model="loanDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" v-waves icon="el-icon-remove-outline" @click="handleClear">重置</el-button>
        <el-button type="primary" v-waves icon="el-icon-plus" @click="handleCreate">添加</el-button>
        <el-button type="primary" v-waves icon="el-icon-download" @click="exportDialogVisible = true">导出</el-button>
      </div>
    </div>
    <el-table :data="list" v-loading.body="listLoading" fit highlight-current-row style="width: 100%" class="dataTableClass"
              :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
      <el-table-column type="index" align="center" min-width="65px"/>
      <el-table-column min-width="120px" align="center" label="借款单号" prop="loanNo"/>
      <el-table-column min-width="150px" align="center" label="状态" prop="statusStr"/>
      <el-table-column min-width="110px" align="center" label="提交日期" prop="loanDateStr"/>
      <el-table-column min-width="110px" align="center" label="组别" prop="teamName"/>
      <el-table-column min-width="120px" align="center" label="借款人" prop="borrowerName"/>
      <el-table-column min-width="80px" align="center" label="币种" prop="currency"/>
      <el-table-column min-width="100px" align="center" label="金额" prop="total"/>
      <el-table-column min-width="100px" align="center" label="已支付金额" prop="havePayTotal"/>
      <el-table-column min-width="90px" align="center" label="付款方式" prop="paymentModeStr"/>
      <el-table-column min-width="100px" align="center" label="开户名称" prop="accountName" show-overflow-tooltip/>
      <el-table-column min-width="200px" align="center" label="开户银行" prop="bankName" show-overflow-tooltip/>
      <el-table-column min-width="170px" align="center" label="银行账号" prop="accountNo" show-overflow-tooltip/>
      <el-table-column min-width="250px" align="center" label="借款原因" prop="reason" :show-overflow-tooltip="true"/>
      <el-table-column min-width="175px" align="center" label="创建日期" prop="createDate"/>
      <el-table-column class-name="wrap-line-table-cell" min-width="175px" align="center" label="支付日期"
                       prop="payDateStr"/>
      <el-table-column fixed="right" align="center" label="操作" min-width="320px">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.status === 0 || scope.row.status === -1) && scope.row.borrower==userId" size="mini" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="(scope.row.status === 0 || scope.row.status === -1) && scope.row.borrower==userId" size="mini" type="info" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-if="(scope.row.status === 0 || scope.row.status === -1) && scope.row.borrower==userId" type="warning" v-waves @click="submit(scope.row.id)" size="mini">提交</el-button>
          <el-button v-if="scope.row.auditor === true" type="primary" v-waves @click="handleAudit(scope.row)" size="mini">审批</el-button>
          <el-button v-if="scope.row.auditor === false" type="danger" v-waves @click="handleAudit(scope.row)" size="mini">查看</el-button>
          <el-button v-if="(scope.row.status === 7 || scope.row.status === 10) && loanApply_btn_updateStatus" type="primary" size="mini" v-waves @click="handleUpdateStatus(scope.row)">更新支付状态</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    </div>

    <!-- 新建、编辑对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialog-drag top="6vh">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="组别" prop="teamId">
          <el-select v-model="form.teamId" placeholder="请选择" @change="changeTeam">
            <el-option v-for="(item,index) in teamList" :label="item.team" :key="index" :value="item.id"/>
          </el-select>
          本次可借款最大金额：{{allowBorrowAmount}}元
        </el-form-item>
        <el-form-item label="借款人" prop="borrowerName">
          <el-input v-model="form.borrowerName" placeholder="请输入借款人" disabled/>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-select v-model="form.currency" placeholder="请选择" disabled>
            <el-option label="CNY" :value="'CNY'"/>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentMode">
          <el-select v-model="form.paymentMode" placeholder="请选择">
            <el-option label="转账" :value="1"/>
            <el-option label="现金" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开户名称" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入开户名称"/>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户银行"/>
        </el-form-item>
        <el-form-item label="银行账号" prop="accountNo">
          <el-input v-model="form.accountNo" placeholder="请输入银行账号"/>
        </el-form-item>
        <el-form-item label="金额" prop="total">
          <el-input v-model="form.total" placeholder="请输入金额"/>
          金额：{{isNaN(form.total) ? 0 : form.total/10000}}万
        </el-form-item>
        <el-form-item label="借款原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入借款原因" :autosize="{ minRows: 4, maxRows: 5}"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更新支付状态对话框 -->
    <el-dialog title="更新支付状态" :visible.sync="updateStatusDialogVisible" :before-close="cancelUpdateStatusAfterPaying" v-dialog-drag>
      <el-form :model="updateStatusForm" ref="updateStatusForm" :rules="updateStatusAfterPayingRules" style="display: flex; flex-wrap: wrap;">
        <el-form-item :label="'本次支付金额' + '(' + selectedRow.currency + ')'" prop="havePayTotal" label-width="150px">
          <el-input v-model="updateStatusForm.havePayTotal" placeholder="请输入" clearable/>
        </el-form-item>
      </el-form>
      <div style="padding-bottom: 10px; padding-left: 150px">尚未支付金额为{{' ' + (selectedRow.total-selectedRow.havePayTotal+0.0001).toFixed(2) + ' ' + selectedRow.currency}}</div>
      <div align="center">
        <el-button type="primary" v-waves @click="updateStatusAfterPaying">更新支付状态</el-button>
        <el-button type="primary" v-waves @click="cancelUpdateStatusAfterPaying">取消</el-button>
      </div>
    </el-dialog>

    <!-- 审批对话框 -->
    <el-dialog title="审批" :visible.sync="auditDialogVisible" v-loading="fullScreenLoading" :before-close="cancelAudit" width="60%" v-dialog-drag top="4vh">
      <div style="margin-bottom: 20px">
        <el-steps v-if="this.selectedRow.total > 100000" :active="activeStep" finish-status="success" style="margin-top: 20px" align-center>
          <el-step title="待提交"/>
          <el-step title="待部门负责人审批"/>
          <el-step title="待事业群负责人审批"/>
          <el-step title="待轮值COO审批"/>
          <el-step title="待会计审批"/>
          <el-step title="待高级财务经理审批"/>
          <el-step title="待总经办审批"/>
        </el-steps>
        <el-steps v-else :active="activeStep" finish-status="success" style="margin-top: 20px" align-center>
          <el-step title="待提交"/>
          <el-step title="待部门负责人审批"/>
          <el-step title="待事业群负责人审批"/>
          <el-step title="待会计审批"/>
          <el-step title="待高级财务经理审批"/>
          <el-step title="待总经办审批"/>
        </el-steps>
      </div>
      <el-form v-model="auditForm" v-if="selectedRow.auditor === true">
        <el-form-item label="审批结果" prop="isPass" label-width="100px">
          <el-select v-model="auditForm.isPass" placeholder="请选择" clearable>
            <el-option label="审批通过" :value="1"/>
            <el-option label="审批不通过" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见" prop="auditRemark" label-width="100px">
          <el-input type="textarea" v-model="auditForm.auditRemark" :autosize="{ minRows: 4, maxRows: 5}" placeholder="请输入"/>
        </el-form-item>
      </el-form>
        <el-table :data="auditLogList" fit highlight-current-row align="center"
                  :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
          <el-table-column align="center" label="节点" prop="nodeName"/>
          <el-table-column align="center" label="操作人" prop="userName"/>
          <el-table-column align="center" label="审批备注" prop="remark"/>
          <el-table-column align="center" label="操作时间" prop="createDate"/>
        </el-table>
        <div v-show="!fullScreenLoading" class="pagination-container">
          <el-pagination @size-change="handleAuditLogSizeChange" @current-change="handleAuditLogCurrentChange"
                         :current-page.sync="auditLogForm.page" :page-sizes="[10,20,30,50]" :page-size="auditLogForm.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="auditLogTotal"/>
        </div>
        <div v-if="selectedRow.auditor === true" style="text-align: center;margin-top: 10px">
          <el-button type="primary" v-waves @click="audit">确定</el-button>
          <el-button type="primary" v-waves @click="cancelAudit">取消</el-button>
        </div>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog title="Export" :visible.sync="exportDialogVisible" v-dialog-drag>
      <div style="margin-bottom: 10px; font-size: 14px">请确认查询条件，点击按钮将导出符合查询条件的所有数据</div>
      <div align="center" style="padding-top: 20px">
        <el-button type="primary" v-waves @click="this.export">导出</el-button>
        <el-button type="primary" v-waves style="margin-left: 10px;" @click="exportDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getObj,
    delObj,
    getList,
    edit,
    create,
    submit,
    audit,
    updateStatusAfterPaying,
    getAuditLog
  } from '../../api/finance/loanApply';
  import {getTeamListByUserId} from "../../api/finance/loanTeam";
  import {mapGetters} from 'vuex';
  import Cookies from 'js-cookie';

  export default {
    name: 'loanApply',
    data() {
      return {
        form: {
          teamId: undefined,
          loanDate: undefined,
          currency: 'CNY',
          borrowerName: undefined,
          paymentMode: undefined,
          accountName: undefined,
          bankName: undefined,
          accountNo: undefined,
          reason: undefined,
          total: undefined
        },
        auditForm: {
          id: undefined,
          loanNo: undefined,
          isPass: undefined,
          auditRemark: undefined,
          procInstId: undefined
        },
        updateStatusForm: {
          applyId: undefined,
          havePayTotal: undefined
        },
        rules: {
          teamId: [{required: true, message: '请输入组别', trigger: 'blur'}],
          paymentMode: [{required: true, message: '请输入付款方式', trigger: 'blur'}],
          accountName: [{required: true, message: '请输入开户名称', trigger: 'blur'}],
          bankName: [{required: true, message: '请输入开户银行', trigger: 'blur'}],
          accountNo: [{required: true, message: '请输入银行账号', trigger: 'blur'}],
          reason: [{required: true, message: '请输入借款原因', trigger: 'blur'}],
          total: [{required: true, message: '请输入金额', trigger: 'blur'}, {pattern: /^\d+(\.\d+){0,1}$/, message: '请正确输入数值', trigger: 'blur'}]
        },
        updateStatusAfterPayingRules: {
          havePayTotal: [{required: true, message: '请输入本次支付金额', trigger: 'blur'}, {pattern: /^\d+(\.\d{1,2}){0,1}$/, message: '请正确输入数值', trigger: 'blur'}]
        },
        list: null,
        total: null,
        listLoading: true,
        fullScreenLoading: false,
        loanDate: undefined,
        listQuery: {
          page: 1,
          limit: 10,
          loanNo: undefined,
          status: undefined,
          borrowerName: undefined,
          bankName: undefined,
          accountName: undefined,
          accountNo: undefined,
          loanDateStart: undefined,
          loanDateEnd: undefined
        },
        dialogFormVisible: false,
        auditDialogVisible: false,
        exportDialogVisible: false,
        updateStatusDialogVisible: false,
        dialogStatus: '',
        textMap: {update: '编辑', create: '创建'},
        tableHeight: undefined,
        statusOptions: [
          {label:'审批被打回', value:'-1'},
          {label:'新建', value:'0'},
          {label:'待部门负责人审批', value:'1'},
          {label:'待事业群负责人审批', value:'2'},
          {label:'待轮值COO审批', value:'3'},
          {label:'待会计审批', value:'4'},
          {label:'待高级财务经理审批', value:'6'},
          {label:'待总经办审批', value:'65'},
          {label:'待支付', value:'7'},
          {label:'部分支付', value:'10'},
          {label:'支付成功', value:'8'},
          {label:'支付失败', value:'9'}
        ],
        pickerOptions: {
          shortcuts: [{
            text: '当前月',
            onClick (picker) {
              const start = new Date();
              start.setDate(1);
              const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上一个月',
            onClick (picker) {
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              start.setDate(1);
              const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
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
        selectedRow: {},
        userId: undefined,
        teamList: undefined,
        allowBorrowAmount: 0,
        loanApply_btn_updateStatus: false,
        activeStep: 0,
        auditLogList: [],
        auditLogTotal: undefined,
        auditLogForm: {
          id: undefined,
          type: 1,
          page: 1,
          limit: 10
        }
      }
    },
    created() {
      this.userId =this.getUserId();
      this.getTeamListByUserId();
      this.getList();
      this.loanApply_btn_updateStatus = this.elements['loanApply:btn_updateStatus'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    mounted() {
      this.tableHeight = window.innerHeight * 0.65;
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.loanDateStart = this.loanDate ? (this.loanDate[0] ? this.changeDate(this.loanDate[0]) : undefined) : undefined;
        this.listQuery.loanDateEnd = this.loanDate ? (this.loanDate[1] ? this.changeDate(this.loanDate[1]) : undefined) : undefined;
        getList(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      getTeamListByUserId() {
        getTeamListByUserId(this.userId).then(response => {
          if (response.resCode === 200) {
            this.teamList = response.data;
          } else {
            this.$message.error("获取组别信息失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        })
      },
      handleFilter() {
        this.getList();
      },
      handleClear() {
        this.loanDate = undefined;
        this.listQuery = {
          page: 1,
          limit: 10
        };
        this.getList();
      },
      export() {
        this.fullScreenLoading = true;
        this.listQuery.loanDateStart = this.loanDate ? (this.loanDate[0] ? this.changeDate(this.loanDate[0]) : undefined) : undefined;
        this.listQuery.loanDateEnd = this.loanDate ? (this.loanDate[1] ? this.changeDate(this.loanDate[1]) : undefined) : undefined;
        let originalPage = this.listQuery.page;
        let originalLimit = this.listQuery.limit;
        this.listQuery.page = 1;
        this.listQuery.limit = 999999;
        getList(this.listQuery).then(response => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['借款单号','状态','提交日期','组别','借款人','币种','金额','已支付金额','付款方式','开户名称','开户银行','银行账号','借款原因','创建日期','支付日期'];
            const filterVal = ['loanNo','statusStr','loanDateStr','teamName','borrowerName','currency','total','havePayTotal','paymentModeStr','accountName','bankName','accountNo','reason','createDate','payDateStr'];
            const list = response.data.rows;
            const data = this.formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'loanApply',
              autoWidth: true,
              bookType: 'xlsx'
            });
            this.listQuery.page = originalPage;
            this.listQuery.limit = originalLimit;
            this.exportDialogVisible = false;
            this.fullScreenLoading = false;
          });
        }).catch(error => {
          this.listQuery.page = originalPage;
          this.listQuery.limit = originalLimit;
          this.fullScreenLoading = false;
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
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleAuditLogSizeChange(val) {
        this.auditLogForm.limit = val;
        this.handleAudit(this.selectedRow);
      },
      handleAuditLogCurrentChange(val) {
        this.auditLogForm.page = val;
        this.handleAudit(this.selectedRow);
      },
      changeTeam(value) {
        let teamList = this.teamList;
        for (let i = 0, length = teamList.length; i <= length - 1; i++) {
          if (teamList[i].id === value) {
            let team = teamList[i];
            // 可借额度 = 每月总额度 + 临时额度 - 本月净借款金额 - 审批中金额;
            let canLoanCurrentMonth = team.amountTotal + team.amountTemporary - team.loanCurrentMonth - team.amountAuditing < 0 ? 0 : team.amountTotal + team.amountTemporary - team.loanCurrentMonth - team.amountAuditing;
            // 单次借款额度 = 借款限额 - 待核销额度 - 审批中金额;
            let canLoanEachTime = team.amountPerTime - team.amountBorrowed - team.amountAuditing < 0 ? 0 : team.amountPerTime - team.amountBorrowed - team.amountAuditing;
            // 取上述较小的值
            this.allowBorrowAmount = canLoanCurrentMonth > canLoanEachTime ? canLoanEachTime : canLoanCurrentMonth;
            this.allowBorrowAmount = (this.allowBorrowAmount+0.0001).toFixed(2);
          }
        }
      },
      handleCreate() {
        this.allowBorrowAmount = 0;
        this.form = {
          currency: 'CNY',
          borrowerName: this.getUserName()
        };
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.form = response.data;
            this.form.borrowerName = this.getUserName();
            let teamList = this.teamList;
            for (let i = 0, length = teamList.length; i <= length - 1; i++) {
              if(teamList[i].id === this.form.teamId) {
                let team = teamList[i];
                // 可借额度 = 每月总额度 + 临时额度 - 本月净借款金额 - 审批中金额;
                let canLoanCurrentMonth = team.amountTotal + team.amountTemporary - team.loanCurrentMonth - team.amountAuditing < 0 ? 0 : team.amountTotal + team.amountTemporary - team.loanCurrentMonth - team.amountAuditing;
                // 单次借款额度 = 借款限额 - 待核销额度 - 审批中金额;
                let canLoanEachTime = team.amountPerTime - team.amountBorrowed - team.amountAuditing < 0 ? 0 : team.amountPerTime - team.amountBorrowed - team.amountAuditing;
                // 取上述较小的值，加上临时额度
                this.allowBorrowAmount = canLoanCurrentMonth > canLoanEachTime ? canLoanEachTime : canLoanCurrentMonth;
                this.allowBorrowAmount = (this.allowBorrowAmount+0.0001).toFixed(2);
              }
            }
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(row.id)
              .then(() => {
                this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000});
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      },
      submit(id) {
        this.$confirm('是否确认提交单据?', '提交确认',{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.fullScreenLoading = true;
          submit({id: id}).then(response => {
            if (response.resCode == 200) {
              this.$message.success("提交成功");
              this.getList();
            } else {
              this.$alert(response.resDes, "提交失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error(JSON.stringify(error));
          });
        }).catch(action => {});
      },
      handleAudit(row) {
        this.selectedRow = row;
        this.auditLogForm.id = row.id;
        this.auditLogForm.type = 1;
        getAuditLog(this.auditLogForm).then(response => {
          this.auditLogList = response.data.rows;
          this.auditLogTotal = response.data.total;
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });

        this.selectedRow = row;
        this.auditForm = {};
        // 高亮的审批节点
        if (row.status === -1 || row.status === 0) {
          //待提交
          this.activeStep = 0;
        } else if (row.status === 1) {
          //待部门负责人审批
          this.activeStep = 1;
        } else if (row.status === 2) {
          //待事业群负责人审批
          this.activeStep = 2;
        } else if (row.status === 3) {
          //轮值COO审批
          this.activeStep = 3;
        } else if (row.status === 4) {
          //待会计审批
          this.activeStep = 4;
          if(this.selectedRow.total <= 100000) {
            this.activeStep = 3;
          }
        } else if (row.status === 6) {
          //待高级财务经理审批
          this.activeStep = 5;
          if(this.selectedRow.total <= 100000) {
            this.activeStep = 4;
          }
        } else if (row.status === 65) {
          //待高级财务经理审批
          this.activeStep = 6;
          if(this.selectedRow.total <= 100000) {
            this.activeStep = 5;
          }
        } else {
          this.activeStep = 7;
        }
        this.auditDialogVisible = true;
      },
      audit() {
        this.auditForm.id = this.selectedRow.id;
        this.auditForm.procInstId = this.selectedRow.procInstId;
        this.auditForm.loanNo = this.selectedRow.loanNo;
        if (!this.auditForm.id || this.auditForm.isPass === undefined) {
          this.$message.error("请选择审批结果");
          return false;
        }
        if (!this.auditForm.isPass && !this.auditForm.auditRemark) {
          this.$message.error("请输入审批意见");
          return false;
        }
        this.fullScreenLoading = true;
        audit(this.auditForm).then(response => {
          if (response.resCode === 200) {
            this.$message.success("审批成功");
            this.auditDialogVisible = false;
            this.getList();
          } else {
            this.$alert(response.resDes, "审批失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      cancelAudit() {
        this.selectedRow = {};
        this.auditDialogVisible = false;
      },
      handleUpdateStatus(row) {
        this.selectedRow = row;
        this.updateStatusDialogVisible = true;
      },
      cancelUpdateStatusAfterPaying() {
        this.updateStatusDialogVisible = false;
        this.updateStatusForm = {};
      },
      updateStatusAfterPaying() {
        this.$refs['updateStatusForm'].validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            this.updateStatusForm.applyId = this.selectedRow.id;
            updateStatusAfterPaying(this.updateStatusForm).then(response => {
              if (response.resCode === 200) {
                this.$message.success("更新成功");
                this.getList();
                this.updateStatusDialogVisible = false;
                this.updateStatusForm = {};
              } else {
                this.$alert(response.resDes, "更新失败");
              }
              this.fullScreenLoading = false;
            }).catch(error => {
              this.fullScreenLoading = false;
              this.$message.error(JSON.stringify(error));
            })
          }
        });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            create(this.form).then(response => {
              if (response.resCode !== 200) {
                this.$message.error(response.resDes, "添加失败");
              } else {
                this.$message.success("添加成功");
                this.dialogFormVisible = false;
                this.getList();
              }
              this.fullScreenLoading = false;
            }).catch(error => {
              this.fullScreenLoading = false;
              this.$message.error(JSON.stringify(error));
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
            this.fullScreenLoading = true;
            edit(this.form).then(response => {
              if(response.resCode !== 200) {
                this.$message.error(response.resDes);
              } else {
                this.$message.success("编辑成功");
                this.dialogFormVisible = false;
                this.getList();
              }
                this.fullScreenLoading = false;
            }).catch(error => {
              this.fullScreenLoading = false;
              this.$message.error(JSON.stringify(error));
            });
          } else {
            return false;
          }
        });
      },
      changeDate(date) {
        return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      getUserId() {
        return Cookies.get('UserId');
      },
      getUserName() {
        return Cookies.get('UserName');
      }
    }
  }
</script>
<style lang="scss" scoped>
  .dataTableClass /deep/ .wrap-line-table-cell .cell {
    white-space: pre-line;
  }

  .filter-container {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
</style>
