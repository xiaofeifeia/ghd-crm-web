<template>
  <div class="app-centre bg-white" ref="appContainer">
    <span>Gift Card 额度管理</span>
    <div class="centent-header">
      <div></div>
      <div>
        <a @click="toggleFullScreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />全屏展示
        </a>
        <el-divider direction="vertical" />
        <span>总共{{ pages.total }}条数据</span>
      </div>
    </div>
    <div class="table">
      <el-card>
        <div class="search">
          <div style="font-size:14PX">
            已选择<span style="color:#f00">{{multipleSelection.length}}</span>项目
            <el-button v-if="quotaManagement_btn_redact" type="primary" size="mini" @click="handleEdit(1)">修改额度</el-button>
            <el-button v-if="quotaManagement_btn_redact" type="success" size="mini" @click="handleEdit(2)">修改临时额度</el-button>
            <el-button type="warning" size="mini" @click="exportDialogVisible=true">导出领取明细</el-button>
          </div>
          <div></div>
        </div>
        <div class="data">
          <el-table v-loading="loading" :data="tableDataList" :height="tableHeight" row-key="id"
            :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
            class="data-table" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55px" reserve-selection></el-table-column>
            <el-table-column label="事业部" align="center" prop="name"></el-table-column>
            <el-table-column label="状态" align="center" prop="statusStr" width="90px"></el-table-column>
            <el-table-column label="Gift Card申请人" align="center" prop="applicantName"></el-table-column>
            <el-table-column label="本月额度(¥)" align="center" prop="totalQuota"></el-table-column>
            <el-table-column label="本月已使用额度(¥)" align="center" prop="usedQuota"></el-table-column>
            <el-table-column label="本月临时额度(¥)" align="center" prop="temporaryQuota"></el-table-column>
            <el-table-column label="操作" align="center" width="160px">
              <template slot-scope="{row}">
                <el-button type="success" size="mini" @click="handleViewDetail(row)">详情</el-button>
                <template v-if="quotaManagement_btn_redact">
                  <el-button v-if="row.status === 1" type="danger" size="mini" @click="handlePause(row, 0)">停用</el-button>
                  <el-button v-else type="primary" size="mini" @click="handlePause(row, 1)">启用</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="pages.total"
            :page.sync="pages.page"
            :limit.sync="pages.limit"
            @pagination="getQuotaList"
          />
        </div>
      </el-card>
    </div>

    <!-- 修改额度/临时额度  -->
    <el-dialog
      :title="editType === 1 ? '修改额度' : '修改临时额度'"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div>
        <el-form :model="editForm" label-width="130px">
          <el-form-item :label="editType === 1 ? '修改额度' : '修改临时额度'">
            <el-input type="Number" clearable v-model="editForm.value" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer center">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitBtnLoading" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible="exportDialogVisible" :before-close="()=>{this.exportDialogVisible=false}" v-dialog-drag>
      <span>选择你想要导出的时间段</span>
        <el-date-picker v-model="exportDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
                        range-separator=" - " :picker-options="pickerOptions" size="mini" unlink-panels/>
      <div style="text-align: center; margin-top: 10px">
        <el-button v-waves type="primary" @click="exportReceiveLog" size="mini">导出</el-button>
        <el-button v-waves @click="exportDialogVisible=false" size="mini">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fullScreenForContainer from '@/mixins/fullScreenForContainer';
import Pagination from '@/components/Pagination';
import tableHeight from '@/mixins/tableHeight';
import { mapGetters } from 'vuex';
import mixins from '@/mixins';
// api
import {
  getGiftcardQuotaList,
  switchQuatoStatus,
  modifyQuota,
  exportReceiveLog
} from '@/api/finance/giftCard';
export default {
  components: {
    Pagination
  },
  data() {
    return {
      exportDialogVisible: false,
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 330,
      topHeight: 330,//除表格高度外的内容高度
      quotaManagement_btn_redact: false,
      pages: {
        page: 1,
        limit: 30,
        total: 0
      },
      formData: {
        searchText: null
      },
      tableDataList: [],
      loading: false,
      multipleSelection: [],
      // 修改额度/临时额度
      dialogVisible: false,
      exportDate: [],
      editForm: {
        value: '0'
      },
      editType: 1, // 修改类型
      submitBtnLoading: false,
      pickerOptions: {
        disabledDate(date) {
          return date.getTime() > Date.now() - 8.64e6;
        }
      }
    }
  },
  mixins: [fullScreenForContainer, tableHeight, mixins],
  created() {
    this.getQuotaList()
    this.quotaManagement_btn_redact = this.elements['quotaManagement:btn_redact'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
  },
  methods: {
    // 获取额度列表
    async getQuotaList() {
      const params = {
        ...this.pages
      };
      const { data } = await getGiftcardQuotaList(params);
      this.tableDataList = data.rows;
      this.pages.total = data.total;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查看详情
    handleViewDetail({ id, name, applicantId, totalQuota }) {
      const router = this.$router.resolve({path: `quotaDetail/${id}`, query: {name, applicantId, totalQuota}});
      window.open(router.href, '_blank');
    },
    // 触发修改额度/临时额度
    handleEdit(type) {
      if (this.multipleSelection.length === 0) return this.$message.info('请选择需要修改的项');
      this.editType = type;
      this.dialogVisible = true;
    },
    // 提交修改额度/临时额度
    async handleSubmit() {
      const params = {
        quotaIdList: this.multipleSelection.map(item => item.id),
        [this.editType === 1 ? 'totalQuota' : 'temporaryQuota']: +this.editForm.value
      };
      this.submitBtnLoading = true;
      const res = await modifyQuota(params);
      if (res.resCode !== 200) {
        return this.$message.error(res.resDes);
      }
      this.$message.success('保存成功！');
      this.dialogVisible = false;
      this.getQuotaList();
      this.submitBtnLoading = false;
    },
    // 停用/启用
    handlePause({ id }, type) { // type 1 启用 0 停用
      this.$confirm(`是否${type === 1 ? '启用' : '停用'}?`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await switchQuatoStatus({
          quotaId: id,
          type});
        if (res.resCode !== 200) this.$message.info(res.resDec);
        this.$message.success(`${type === 1 ? '启用' : '停用'}成功`);
        this.getQuotaList();
      })
    },
    // 导出领取明细
    async exportReceiveLog() {
      if(this.multipleSelection.length === 0) {
        this.$message.error("请勾选单据");
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
      let quotaIds = [];
      for(let i = 0,length = this.multipleSelection.length;i<=length-1;i++) {
        quotaIds.push(this.multipleSelection[i].id);
      }
      let form = {
        quotaIds: quotaIds,
        startDate: this.exportDate ? this.exportDate[0] : undefined,
        endDate: this.exportDate ? this.exportDate[1] : undefined
      };
      const res = await exportReceiveLog(form).catch(() => loading.close());
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
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .table-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .num {
      color: red;
    }
  }
}
.centent-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  height: 19px;
  font-size: 12px;
  & >>> .filter .fil-w {
    right: 0px;
  }
  & >>> .handle-btn {
    color: #333333;
    font-size: 12px;
  }
  .timeDate {
    width: 210px;
  }
}
.table {
  .search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .pagination {
    text-align: right;
    margin: 10px 0;
  }
}
</style>

