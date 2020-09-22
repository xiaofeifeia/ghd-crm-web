<template>
  <div class="app-centre">
    <span>Gift Card 部门详情</span>
    <div class="formleft">
      <el-form ref="form" :model="formData" inline :rules="formRules">
        <el-form-item label="事业部:">
          <span>{{ $route.query.name || ''}}</span>
        </el-form-item>
        <el-form-item label="Gifr Card 申请人:" prop="applicantId">
          <el-select
            size="mini"
            filterable
            :disabled="!quotaManagement_btn_redact"
            clearable
            v-model="formData.applicantId"
            placeholder="请选择申请人"
          >
            <el-option
              v-for="(item, index) in applicantList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="quotaManagement_btn_redact"
            type="primary"
            size="mini"
            @click="handleSave"
          >保存</el-button>
        </el-form-item>
        <el-form-item label="每月额度:" prop="totalQuota">
          <el-input
            v-model="formData.totalQuota"
            type="Number"
            :disabled="!quotaManagement_btn_redact"
            size="mini"
            placeholder="请输入额度"
          >
            <span slot="prefix">¥</span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="quotaManagement_btn_redact"
            type="primary"
            size="mini"
            @click="handleSave"
          >保存</el-button>
        </el-form-item>
        <el-form-item>
          <a class="link underline" @click="lookClick">查看汇率</a>
          <!-- <router-link class="link underline" to="/financeManager/currencyRate" >查看汇率</router-link> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="box">
      <ul>
        <li>
          <p>当前可用额度</p>
          <span>¥ {{ quotaDetail.freeQuota || 0 | filterToFixed }}</span>
        </li>
        <li>
          <p>本月已用额度</p>
          <span>¥ {{ quotaDetail.usedQuota || 0 | filterToFixed }}</span>
        </li>
        <li>
          <p>审批中 Gift Card 金额</p>
          <span>¥ {{ quotaDetail.auditingQuota || 0 | filterToFixed }}</span>
        </li>
        <li>
          <p>待领取 Gift Card 金额</p>
          <span>¥ {{ quotaDetail.unclaimedQuota || 0 | filterToFixed }}</span>
        </li>
      </ul>
    </div>
    <div class="centent-header">
      <div></div>
      <div>
        <a @click="toggleFullScreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />全屏展示
        </a>
        <el-divider direction="vertical" />
        <i class="el-icon-time" style="font-size: 16px" /> 时间段选择
        <el-date-picker
          class="timeDate" v-model="time"
          :disabled="activeName!=='applyHistory' && activeName!=='getReceiveLog'"
          size="mini" type="daterange" range-separator="-"
          value-format="yyyy-MM-dd" @change="changeTime"
          :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"/>
        <el-divider direction="vertical" />
        <span>总共{{ pages.total }}条数据</span>
      </div>
    </div>
    <div class="table">
      <el-card>
        <div class="download">
          <el-button
            size="mini"
            type="primary"
            :loading="downloadLoading"
            @click="handleDownload"
          >导出表格</el-button>
        </div>
        <div class="tabs">
          <el-tabs
            v-model="activeName"
            :before-leave="handleToggleBefore"
            @tab-click="handleToggle"
          >
            <el-tab-pane label="每月额度使用情况" name="quatoUsage">
              <quato-usage
                v-if="activeName==='quatoUsage'"
                :loading="loading"
                :data="tableDataList"
                @on-pagination="onPagination"
                :total="pages.total"
              />
            </el-tab-pane>
            <el-tab-pane label="申请记录" name="applyHistory">
              <apply-history
                v-if="activeName==='applyHistory'"
                :loading="loading"
                :data="tableDataList"
                @on-pagination="onPagination"
                :total="pages.total"
              />
            </el-tab-pane>
            <el-tab-pane label="领用明细" name="getReceiveLog">
              <applyReceive
                v-if="activeName==='getReceiveLog'"
                :loading="loading"
                :data="tableDataList"
                @on-pagination="onPagination"
                :total="pages.total"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
// mixin
import fullScreenForContainer from '@/mixins/fullScreenForContainer'

// api
import {
  getQuotaLogById,
  getApplyLog,
  getUsers,
  modifyQuota,
  getDeptQuotaById,
  getReceiveLog,
  exportReceiveLog,
  exportQuotaLog,
  exportApplyLog
} from '@/api/finance/giftCard'

// component
import quatoUsage from './component/quatoUsage';
import applyHistory from './component/applyHistory';
import applyReceive from './component/applyReceive';
import { mapGetters } from 'vuex';
import mixins from '@/mixins';
export default {
  components: {
    quatoUsage,
    applyHistory,
    applyReceive
  },
  data() {
    return {
      quotaManagement_btn_redact: false,
      pages: {
        page: 1,
        limit: 10
      },
      department: '',
      formData: {
        applicantId: null,
        totalQuota: '1000'
      },
      formRules: {
        applicantId: [
          {
            required: true, message: '请选择申请人', trigger: 'change'
          }
        ],
        totalQuota: [
          {
            required: true, min: 0, message: '请输入额度', trigger: 'blur'
          }
        ]
      },
      tableDataList: [],
      loading: false,
      time: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      applicantList: [
      ],
      quotaDetail: {},
      activeName: 'quatoUsage',
      getListHandlers: {
        quatoUsage: getQuotaLogById,
        applyHistory: getApplyLog,
        getReceiveLog: getReceiveLog
      },

      autoWidth: true,
      bookType: 'xlsx',
      downloadLoading: false
    }
  },
  mixins: [fullScreenForContainer, mixins],
  created() {
    this.init();
    this.getUserList();
    this.getList();
    this.getDeptQuotaById();
    this.quotaManagement_btn_redact = this.elements['quotaManagement:btn_redact'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
  },
  methods: {
    init() {
      if (Object.keys(this.$route.query).length === 0) {
        return;
      }
      this.formData.applicantId = +this.$route.query.applicantId;
      this.formData.totalQuota = this.$route.query.totalQuota;
    },
    // 获取申请人列表
    async getUserList() {
      const { data } = await getUsers()
      this.applicantList = data
    },
    // 获取部门额度
    async getDeptQuotaById() {
      const { data } = await getDeptQuotaById({
        quotaId: this.$route.params.quotaId
      });
      this.quotaDetail = data
    },
    // 导出报表
    async handleDownload() {
      this.downloadLoading = true;
      let form = {};
      let data;
      switch (this.activeName) {
        case 'quatoUsage':
          form = {quotaId: this.$route.params.quotaId};
          data = await exportQuotaLog(form);
          break;
        case 'applyHistory':
          form = {
            quotaId: this.$route.params.quotaId,
            startDate: this.time ? this.time[0] : undefined,
            endDate: this.time ? this.time[1] : undefined
          };
          data = await exportApplyLog(form);
          break;
        case 'getReceiveLog':
          form = {
            quotaIds: [this.$route.params.quotaId],
            startDate: this.time ? this.time[0] : undefined,
            endDate: this.time ? this.time[1] : undefined
          };
          data = await exportReceiveLog(form);
          break;
        default:
          this.$message.error("导出异常");
          return;
      }
      let filename = decodeURI(data.headers['content-disposition'].split('filename=')[1]);
      this.downloadLoading = false;
      if (!data.data) {
        return this.$message.error('导出错误，请重试');
      }
      this.funDownload({
        content: data.data,
        filename: filename
      });
    },
    // 提交保存额度
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确定要保存吗？')
            .then(async () => {
              const res = await modifyQuota({
                ...this.formData,
                totalQuota: +this.formData.totalQuota,
                quotaIdList: [+this.$route.params.quotaId]
              })
              if (res.resCode !== 200) {
                return this.$message.error(res.resDes)
              }
              this.$message.success('保存成功！')
              this.getList()
            })
        } else {
          return false;
        }
      });
    },
    handleToggleBefore() {
      return !this.loading
    },
    // 获取每月额度使用情况/申请记录
    async getList() {
      const params = {
        ...this.pages,
        quotaId: this.$route.params.quotaId,
        startDate: this.time ? this.time[0] : undefined,
        endDate: this.time ? this.time[1] : undefined
      };
      this.loading = true;
      const res = await this.getListHandlers[this.activeName](params);
      this.tableDataList = res.data.rows;
      this.pages.total = res.data.total;
      this.loading = false;
    },
    onPagination(pages) {
      this.pages = pages;
      this.getList();
    },
    // 查看详情
    handleViewDetail(data) {
      console.log(data)
    },
    // 停用
    handlePause(data) {
      console.log(data)
    },
    handleToggle() {
      this.pages = {page: 1, limit: 10};
      this.getList();
    },
    lookClick() {
      const router = this.$router.resolve({ path: '/financeManager/currencyRate' });
      window.open(window.origin + '/' + router.href, '_blank');
    },
    changeTime(val) { // 时间选择
      this.pages = {page: 1, limit: 10};
      this.getList();
    },
  }
}
</script>
<style lang="scss">
.tabs {
  .el-tabs .el-tabs__active-bar {
    display: none !important;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.app-centre {
  .formleft {
    margin-top: 20px;
    margin-bottom: -10px;
    .el-form-item {
      margin-bottom: 5px;
    }
  }
  .box {
    margin-bottom: -26px;
    ul {
      display: flex;
      padding-left: 0;
      li {
        list-style: none;
        border: 1px solid #dad7d7;
        margin: 0 5px;
        width: 270px;
        height: 120px;
        padding: 10px 30px;
        p {
          color: #999;
        }
        span {
          font-size: 28px;
        }
        &:hover {
          box-shadow: 0 0 0 3px #1abc9c;
        }
      }
    }
  }
  .centent-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 12px;
    i.my-filter {
      width: 14px;
      height: 14px;
      display: inline-block;
      background: url("../../../../assets/img/icon-filter.png");
      background-size: contain;
    }
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
    position: relative;
    .download {
      position: absolute;
      right: 20px;
      z-index: 999;
    }
  }
}
</style>
