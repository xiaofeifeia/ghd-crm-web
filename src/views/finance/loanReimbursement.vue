<template>
  <div class="app-container calendar-list-container fixed_table">
    <div class="filter-container">
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap">
        <el-form-item label="核销单号" label-width="100px">
          <el-input v-model="listQuery.reimbursementNo" placeholder="请输入" @keyup.enter.native="handleFilter" clearable @clear="listQuery.reimbursementNo=undefined"/>
        </el-form-item>
        <el-form-item label="状态" label-width="70px">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable @clear="listQuery.status=undefined">
            <el-option v-for="(item,index) in statusOptions" :label="item.label" :key="index" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报销部门" label-width="100px">
          <el-select v-model="listQuery.teamId" placeholder="请选择" clearable @clear="listQuery.teamId=undefined">
            <el-option v-for="(item,index) in teamList" :label="item.team" :key="index" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报销人" label-width="80px">
          <el-input v-model="listQuery.claimerName" placeholder="请输入" @keyup.enter.native="handleFilter" clearable @clear="listQuery.claimerName=undefined"/>
        </el-form-item>
        <el-form-item label="提交日期" label-width="100px">
          <el-date-picker v-model="claimDate" type="daterange" range-separator=" - " start-placeholder="开始日期" end-placeholder="结束日期"
                          unlink-panels :picker-options="pickerOptions" clearable @clear="claimDate=listQuery.claimDateStart=listQuery.claimDateEnd=undefined"/>
        </el-form-item>
        <el-form-item label="核销完成日期" label-width="120px">
          <el-date-picker v-model="finishDate" type="daterange" range-separator=" - " start-placeholder="开始日期" end-placeholder="结束日期"
                          unlink-panels :picker-options="pickerOptions" clearable @clear="finishDate=listQuery.finishDateStart=listQuery.finishDateEnd=undefined"/>
        </el-form-item>
        <el-form-item label="明细亚马逊订单号" label-width="150px">
          <el-input v-model="listQuery.orderId" placeholder="请输入" @keyup.enter.native="handleFilter" clearable @clear="listQuery.orderId=undefined"/>
        </el-form-item>
      </el-form>

      <div align="center">
        <el-button type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" v-waves icon="el-icon-remove-outline" @click="handleClear">重置</el-button>
        <el-button type="primary" v-waves icon="el-icon-plus" @click="handleCreate">添加</el-button>
        <el-button type="primary" v-waves icon="el-icon-download" @click="handleExport(1)">导出review费用</el-button>
        <el-button type="primary" v-waves icon="el-icon-download" @click="handleExport(2)">导出非review费用</el-button>
        <el-button type="primary" v-waves icon="el-icon-download" @click="handleExport(4)">导出giftCard费用</el-button>
        <el-button type="primary" v-waves icon="el-icon-download" @click="handleExport(3)">导出pz费用</el-button>
      </div>
    </div>
    <el-table :data="list" v-loading.body="listLoading" fit highlight-current-row style="width: 100%"
              :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
      <el-table-column type="index" align="center" min-width="65px"/>
      <el-table-column min-width="120px" align="center" label="核销单号" prop="reimbursementNo"/>
      <el-table-column min-width="140px" align="center" label="状态" prop="statusStr"/>
      <el-table-column min-width="100px" align="center" label="报销部门" prop="teamName"/>
      <el-table-column min-width="120px" align="center" label="报销人" prop="claimerName"/>
      <el-table-column min-width="100px" align="center" label="提交日期" prop="claimDateStr"/>
      <el-table-column min-width="60px" align="center" label="币种" prop="currency"/>
      <el-table-column min-width="130px" align="center" label="总额(review+非review+giftCard)" prop="total"/>
      <el-table-column min-width="90px" align="center" label="review费用">
        <template slot-scope="scope"><span style="color: deepskyblue; cursor: pointer" @click="openDialog(scope.row, 1)">{{scope.row.reviewTotal}}</span></template>
      </el-table-column>
      <el-table-column min-width="90px" align="center" label="非review费用">
        <template slot-scope="scope"><span style="color: deepskyblue; cursor: pointer" @click="openDialog(scope.row, 2)">{{scope.row.norReviewTotal}}</span></template>
      </el-table-column>
      <el-table-column min-width="90px" align="center" label="giftCard费用">
        <template slot-scope="scope"><span style="color: deepskyblue; cursor: pointer" @click="openDialog(scope.row, 3)">{{scope.row.giftCardTotal}}</span></template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="pz费用">
        <template slot-scope="scope"><span style="color: deepskyblue; cursor: pointer" @click="openDialog(scope.row, 4)">{{scope.row.otherForUsdTotalStr}}</span></template>
      </el-table-column>
      <el-table-column min-width="170px" align="center" label="备注" prop="remark" show-overflow-tooltip/>
      <el-table-column min-width="160px" align="center" label="创建日期" prop="createDate"/>
      <el-table-column min-width="160px" align="center" label="核销完成日期" prop="finishDate"/>
      <el-table-column fixed="right" align="center" label="操作" min-width="290px">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.status == 0 || scope.row.status == -1) && scope.row.claimerId==userId" size="mini" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="(scope.row.status == 0 || scope.row.status == -1) && scope.row.claimerId==userId" size="mini" type="info" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-if="(scope.row.status == 0 || scope.row.status == -1) && scope.row.claimerId==userId" type="warning" v-waves @click="handleSubmit(scope.row)" size="mini">提交</el-button>
          <el-button v-if="scope.row.auditor == true" type="primary" v-waves @click="handleAudit(scope.row)" size="mini">审批</el-button>
          <el-button v-if="scope.row.auditor == false" type="danger" v-waves @click="handleAudit(scope.row)" size="mini">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-loading="fullScreenLoading" v-dialogDrag>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="报销部门" prop="teamId">
          <el-select v-model="form.teamId" placeholder="请选择">
            <el-option v-for="(item,index) in teamList" :label="item.team" :key="index" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报销人" prop="claimerName">
          <el-input :value="getUserName()" disabled/>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" disabled/>
        </el-form-item>
        <el-form-item label="总额" prop="total">
          <el-input v-model="form.total" disabled/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 5}" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <review-dialog :visible="reviewVisible" :selected-row="this.selectedRow" @change-review-visible="changeReviewVisible"/>

    <nor-review-dialog :visible="norReviewVisible" :selected-row="this.selectedRow" @change-nor-review-visible="changeNorReviewVisible"/>

    <gift-card-dialog :visible="giftCardVisible" :selected-row="this.selectedRow" @change-gift-card-visible="changeGiftCardVisible"/>

    <other-for-usd-dialog :visible="otherForUsdVisible" :selected-row="selectedRow" @change-otherForUsd-visible="changeOtherForUsdVisible"/>

    <!-- 审批对话框 -->
    <el-dialog title="审批" :visible.sync="auditDialogVisible" :before-close="cancelAudit" v-loading="fullScreenLoading" v-dialogDrag top="6vh">
      <div style="margin-bottom: 20px">
        <el-steps :active="activeStep" finish-status="success" style="margin-top: 20px" align-center>
          <el-step title="待提交"/>
          <el-step title="待部门负责人审批"/>
          <el-step title="待事业群负责人审批"/>
          <el-step title="待会计审批"/>
          <el-step title="待提交人确认金额"/>
        </el-steps>
      </div>
      <el-form v-model="auditForm">
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
        <el-table-column align="center" label="审批备注">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.remark" placement="top">
              <div style="overflow: hidden; text-overflow: ellipsis;white-space: nowrap;">{{ scope.row.remark }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间" prop="createDate"/>
      </el-table>
      <div v-show="!fullScreenLoading" class="pagination-container">
        <el-pagination @size-change="handleAuditLogSizeChange" @current-change="handleAuditLogCurrentChange"
                       :current-page.sync="auditLogForm.page" :page-sizes="[10,20,30,50]" :page-size="auditLogForm.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="auditLogTotal"/>
      </div>
      <div style="text-align: center; margin-top: 10px">
        <el-button v-if="selectedRow.auditor == true" type="primary" v-waves @click="audit">确定</el-button>
        <el-button type="primary" v-waves @click="cancelAudit">取消</el-button>
      </div>
    </el-dialog>

    <!-- 导出明细提示框 -->
    <el-dialog title="导出" :visible.sync="exportDialogVisible" v-loading="fullScreenLoading" :before-close="closeExportDialog" v-dialog-drag>
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap">
        <el-form-item label="费用明细日期" label-width="120px">
          <el-date-picker v-model="detailDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"
                           :picker-options="pickerOptions" clearable @clear="detailDate=listQuery.detailDateStart=listQuery.detailDateEnd=undefined"/>
        </el-form-item>
      </el-form>
      <span style="font-weight: 900">可利用单据页面上方的查询条件筛选报销单，利用上述的查询条件筛选明细</span>
      <div align="center" style="padding-top: 10px">
        <el-button v-waves type="primary" @click="exportDetail">导出</el-button>
        <el-button v-waves type="primary" @click="closeExportDialog">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getObj,
    getList,
    create,
    edit,
    deleteData,
    submit,
    audit,
    exportDetail
  } from '../../api/finance/loanReimbursement';
  import {getAuditLog} from '../../api/finance/loanApply';
  import {getTeamListByUserId} from "../../api/finance/loanTeam";
  import {mapGetters} from 'vuex';
  import reviewDialog from './reimbursementComponents/reviewDialog';
  import norReviewDialog from './reimbursementComponents/norReviewDialog';
  import Cookies from 'js-cookie';
  import otherForUsdDialog from './reimbursementComponents/otherForUsdDialog';
  import giftCardDialog from "./reimbursementComponents/giftCardDialog";
  import mixins from '@/mixins';

  export default {
    name: 'loanReimbursement',
    components: {
      otherForUsdDialog,
      reviewDialog,
      norReviewDialog,
      giftCardDialog
    },
    data() {
      return {
        form: {
          teamId: undefined,
          currency: undefined,
          total: undefined,
          remark: undefined
        },
        rules: {
          teamId: [{required: true, message: '请选择报销部门', trigger: 'blur'}],
          currency: [{required: true, message: '请输入币种，如USD', trigger: 'blur'}, {min: 3, max: 3, message: '长度为3个字符', trigger: 'blur'}],
          total: [{required: true, message: '请输入总额', trigger: 'blur'}, {pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入数值'}],
          remark: [{max: 128, message: '最大长度为128个字符', trigger: 'blur'}]
        },
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
        list: null,
        total: null,
        listLoading: true,
        fullScreenLoading: false,
        claimDate: undefined,
        finishDate: undefined,
        detailDate: undefined,
        listQuery: {
          page: 1,
          limit: 10,
          reimbursementNo: undefined,
          claimDateStart: undefined,
          claimDateEnd: undefined,
          finishDateStart: undefined,
          finishDateEnd: undefined,
          detailDateStart: undefined,
          detailDateEnd: undefined,
          teamId: undefined,
          claimerName: undefined,
          status: undefined,
          orderId: undefined
        },
        dialogFormVisible: false,
        auditDialogVisible: false,
        otherForUsdVisible: false,
        reviewVisible: false,
        norReviewVisible: false,
        giftCardVisible: false,
        exportDialogVisible: false,
        dialogStatus: '',
        textMap: {update: '编辑', create: '创建'},
        tableHeight: undefined,
        teamList: undefined,
        statusOptions: [
          {label:'审批被打回', value:'-1'},
          {label:'新建', value:'0'},
          {label:'待部门负责人审批', value:'1'},
          {label:'待事业群负责人审批', value:'2'},
          {label:'待会计审批', value:'3'},
          {label:'待提交人确认金额', value:'4'},
          {label:'核销成功', value:'5'}
        ],
        selectedRow: {},
        auditLogList: [],
        auditLogTotal: undefined,
        auditLogForm: {
          id: undefined,
          type: 2,
          page: 1,
          limit: 10
        },
        activeStep: 0,
        auditForm: {
          id: undefined,
          reimbursementNo: undefined,
          isPass: undefined,
          auditRemark: undefined,
          procInstId: undefined
        },
        userId: undefined
      }
    },
    created() {
      this.userId = this.getUserId();
      this.getTeamListByUserId(this.userId);
      this.getList();
    },
    mounted() {
      this.tableHeight = window.innerHeight * 0.65;
    },
    mixins: [mixins],
    watch: {
      claimDate() {
        this.listQuery.claimDateStart = this.claimDate ? (this.claimDate[0] ? this.changeDate(this.claimDate[0]) : undefined) : undefined;
        this.listQuery.claimDateEnd = this.claimDate ? (this.claimDate[1] ? this.changeDate(this.claimDate[1]) : undefined) : undefined;
      },
      finishDate() {
        this.listQuery.finishDateStart = this.finishDate ? (this.finishDate[0] ? this.changeDate(this.finishDate[0]) : undefined) : undefined;
        this.listQuery.finishDateEnd = this.finishDate ? (this.finishDate[1] ? this.changeDate(this.finishDate[1]) : undefined) : undefined;
      },
      detailDate() {
        this.listQuery.detailDateStart = this.detailDate ? (this.detailDate[0] ? this.changeDate(this.detailDate[0]) : undefined) : undefined;
        this.listQuery.detailDateEnd = this.detailDate ? (this.detailDate[1] ? this.changeDate(this.detailDate[1]) : undefined) : undefined;
      }
    },
    computed: {
      ...mapGetters([
        'elements'
      ]),
      headers() {
        return {
          'Authorization': Cookies.get('Admin-Token')
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        getList(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      changeDate(date) {
        return this.$moment(date).format("YYYY-MM-DD");
      },
      handleFilter() {
        this.getList();
      },
      handleClear() {
        this.claimDate = undefined;
        this.finishDate = undefined;
        this.listQuery = {
          limit: 10,
          page: 1
        };
        this.getList();
      },
      openDialog(row, type) {
        this.selectedRow = row;
        if (type === 1) {
          this.reviewVisible = !this.reviewVisible;
        } else if (type === 2) {
          this.norReviewVisible = !this.norReviewVisible;
        } else if (type === 3) {
          this.giftCardVisible = !this.giftCardVisible;
        } else if (type === 4) {
          this.otherForUsdVisible = !this.otherForUsdVisible;
        }
      },
      changeOtherForUsdVisible(visible) {
        this.otherForUsdVisible = visible;
        if(visible === false) {
          this.getList();
        }
      },
      changeReviewVisible(visible) {
        this.reviewVisible = visible;
        if(visible === false) {
          this.getList();
        }
      },
      changeNorReviewVisible(visible) {
        this.norReviewVisible = visible;
        if(visible === false) {
          this.getList();
        }
      },
      changeGiftCardVisible(visible) {
        this.giftCardVisible = visible;
        if(visible === false) {
          this.getList();
        }
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
      handleCreate() {
        this.form = {currency: 'CNY', total: 0};
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.selectedRow = row;
        getObj(row.id).then(response => {
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
        }).then(() => {
          this.fullScreenLoading = true;
          deleteData(row).then(response => {
            if (response.resCode !== 200) {
              this.$alert(response.resDes, "删除失败");
            } else {
              this.$message.success("删除成功");
              this.getList();
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error(JSON.stringify(error));
          });
        });
      },
      handleExport(type) {
        // type 类型 1导出review, 2导出非review, 3评价帮，4 giftCard
        this.listQuery.type = type;
        this.exportDialogVisible = true;
      },
      async exportDetail() {
        const loading = this.$loading({
          lock: true,
          text: '下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        // type 类型 1导出review, 2导出非review, 3评价帮，4 giftCard
        const res = await exportDetail(this.listQuery).catch(() => loading.close());
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
        });
        this.exportDialogVisible = false;
      },
      closeExportDialog() {
        this.exportDialogVisible = false;
      },
      handleSubmit(row) {
        this.$confirm('是否提交该单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullScreenLoading = true;
          let submitForm = {id: row.id};
          submit(submitForm).then(response => {
            if (response.resCode !== 200) {
              this.$alert(response.resDes, "提交失败");
            } else {
              this.$message.success("提交成功");
              this.getList();
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error(JSON.stringify(error));
          });
        })
      },
      handleAudit(row) {
        this.auditLogForm.id = row.id;
        this.auditLogForm.type = 2;
        getAuditLog(this.auditLogForm).then(response => {
          this.auditLogList = response.data.rows;
          this.auditLogTotal = response.data.total;
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });

        this.selectedRow = row;
        this.auditForm = {};
        this.auditDialogVisible = true;
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
          //待会计审批
          this.activeStep = 3;
        } else if (row.status === 4) {
          //待部门负责人确认
          this.activeStep = 4;
        } else {
          this.activeStep = 5;
        }
      },
      cancelAudit() {
        this.selectedRow = {};
        this.auditDialogVisible = false;
      },
      audit() {
        this.auditForm.id = this.selectedRow.id;
        this.auditForm.procInstId = this.selectedRow.procInstId;
        this.auditForm.reimbursementNo = this.selectedRow.reimbursementNo;
        if (!this.auditForm.id || this.auditForm.isPass == undefined) {
          this.$message.error("请选择审批结果");
          return false;
        }
        if (!this.auditForm.isPass && !this.auditForm.auditRemark) {
          this.$message.error("请输入审批意见");
          return false;
        }
        this.fullScreenLoading = true;
        this.auditDialogVisible = false;
        audit(this.auditForm).then(response => {
          if (response.resCode == 200) {
            this.$message.success("审批成功");
            this.fullScreenLoading = false;
            this.getList();
          } else {
            this.fullScreenLoading = false;
            this.$alert(response.resDes, "审批失败");
          }}).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            create(this.form).then(response => {
              if (response.resCode == 200) {
                this.$message.success("创建成功");
                this.dialogFormVisible = false;
                this.getList();
              } else {
                this.$message.error(response.resDes, "创建失败");
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
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.form.id = this.selectedRow.id;
            edit(this.form).then(response => {
              if (response.resCode !== 200) {
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
      getTeamListByUserId() {
        getTeamListByUserId(this.userId).then(response => {
          if (response.resCode == 200) {
            this.teamList = response.data;
          } else {
            this.$message.error("获取组别信息失败");
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        })
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
  .filter-container {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
</style>
