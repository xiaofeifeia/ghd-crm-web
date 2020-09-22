<template>
  <div class="app-container bg-white" ref="appContainer">
    <!-- 面额汇总 -->
    <div class="summary-data mb20">
      <div class="item">
        <p class="title">本月已发送面额</p>
        <p class="value">{{ summaryData.monthTotal || 0 | filterToFixed }}</p>
      </div>
      <div class="item">
        <p class="title">累计已发送面额</p>
        <p class="value">{{ summaryData.allTotal || 0 | filterToFixed }}</p>
      </div>
    </div>
    <div class="table-tools mb10">
      <div class="left">
        <span class="selected">已选择<span class="num">0</span>项目</span>
        <!-- <el-button type="primary" size="mini" :loading="batchSendBtnLoading" @click="handleBatchSend">批量发送</el-button> -->
      </div>
      <div class="right">
        <el-tooltip class="item" effect="dark" content="全屏" placement="top">
          <a @click="toggleFullScreen">
            <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'"/>
          </a>
        </el-tooltip>
      </div>
    </div>

    <div class="data">
      <el-table
          v-loading="loading"
          :data="tableDataList"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          style="width: 100%"
          @sort-change="handleTabelSort"
          @selection-change="handleSelectionChange"
        >
        <!-- <el-table-column
          type="selection"
          width="55">
        </el-table-column> -->
        <el-table-column label="Activation time" align="center" prop="activationDate" min-width="140px"></el-table-column>
        <el-table-column align="center" prop="type" min-width="140px">
          <template slot="header">
            <el-select size="mini" clearable v-model="formData.types" placeholder="Type"  @change="getList">
              <el-option :value="1" label="YouTube"></el-option>
              <el-option :value="2" label="Review"></el-option>
              <el-option :value="3" label="Facebook"></el-option>
            </el-select>
          </template>
          <template slot-scope="{row}">
            {{ row.type | typeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="Recipient Name" align="center" prop="recipientName"  min-width="130px"></el-table-column>
        <el-table-column label="Phone" align="center" prop="phone" sortable="custom"  min-width="110px"></el-table-column>
        <el-table-column label="E-mail" align="center" prop="email" sortable="custom"  min-width="120px"></el-table-column>
        <el-table-column label="激活码" align="center" prop="activationCodeNo" sortable="custom"  min-width="120px"></el-table-column>
        <el-table-column label="有效期" align="center" min-width="120px">
          <template slot-scope="{row}">{{row.startDate}} - {{row.endDate}}</template>
        </el-table-column>
        <el-table-column label="面额" align="center" prop="price" sortable="custom" min-width="120px"></el-table-column>
        <el-table-column label="当前状态" align="center" prop="status" min-width="120px">
          <template slot="header">
            <el-select size="mini" clearable v-model="formData.sendStatuses"  placeholder="Status" @change="getList">
              <el-option :value="0" label="待发送"></el-option>
              <el-option :value="1" label="已发送"></el-option>
              <el-option :value="2" label="发送失败"></el-option>
            </el-select>
          </template>
          <template slot-scope="{row}">
            <el-tag v-if="row.sendStatus === 0 || !row.sendStatus" type="primary">待发送</el-tag>
            <el-tag v-if="row.sendStatus === 1" type="success">已发送</el-tag>
            <el-tag v-else-if="row.sendStatus === 2" type="danger">发送失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="160px" fixed="right">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleToView(row)">详情</el-button>
            <el-button type="success" :loading="row.sendLoading" size="mini" v-if="!row.sendStatus" @click="handleSend(row, 1)">发送</el-button>
            <el-button type="success" size="mini" v-if="row.sendStatus === 2" @click="handleSend(row, 2)">再次发送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="pages.total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize" @pagination="getList" />
    </div>


    <!-- 发送 -->
    <el-dialog 
      :visible.sync="dialogFormVisible"
      width="600px"
      :title="currentData.sendStatus === 2 ? '再次发送' : '发送'">
      <div class="send-box">
        <el-form ref="sendForm" :model="sendFormData" :rules="sendFormRules">
          <el-form-item label="请输入Gift Card Code" prop="giftCardCode">
            <el-input v-model="sendFormData.giftCardCode" placeholder="请输入相应面额的Gift Card Code"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSend">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog 
      :visible.sync="dialogDetailVisible"
      width="600px"
      title="用户详情">
      <div class="detail-box">
        <div class="gift-img">
          <img :src="currentData.giftImgUrl" alt="">
        </div>
        <el-form label-width="200px">
          <el-form-item v-if="currentData.giftCardCode" label="Amazon Gift Card Code：">
            <p class="view">{{currentData.giftCardCode}}</p>
          </el-form-item>
          <el-form-item label="Activation Time：">
            <p class="view">{{currentData.activationDate}}</p>
          </el-form-item>
          <el-form-item label="Type：">
            <p class="view">{{currentData.type | typeFilter}}</p>
          </el-form-item>
          <el-form-item label="Recipient Name：">
            <p class="view">{{currentData.recipientName}}</p>
          </el-form-item>
          <el-form-item label="Activation Time：">
            <p class="view">{{currentData.activationDate}}</p>
          </el-form-item>
          <el-form-item label="Phone：">
            <p class="view">{{currentData.phone}}</p>
          </el-form-item>
          <el-form-item label="Email：">
            <p class="view">{{currentData.email}}</p>
          </el-form-item>
          <el-form-item label="激活码：">
            <p class="view">{{currentData.activationCodeNo}}</p>
          </el-form-item>
          <el-form-item label="有效期：">
            <p class="view">{{currentData.startDate}} - {{currentData.endDate}}</p>
          </el-form-item>
          <el-form-item v-if="currentData.amazonOrderId" label="Amazon Order ID：">
            <p class="view">{{currentData.amazonOrderId}}</p>
          </el-form-item>
          <el-form-item v-if="currentData.videoLink" label="Link：">
            <p class="view">{{currentData.videoLink}}</p>
          </el-form-item>
          <el-form-item v-if="currentData.url" label="Picture：">
            <p class="view">
              <el-image
                style="width: 50px; height: 50px"
                :src="currentData.url"
                fit="cover"
                :preview-src-list="currentData.srcList"
              ></el-image>
            </p>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fullScreenForContainer from '@/mixins/fullScreenForContainer'


import Pagination from '@/components/Pagination'

import mixins from '@/mixins'

import gift1 from '@/assets/img/dollar10.jpg'
import gift2 from '@/assets/img/dollar20.jpg'

// api
import {
  getGiftCartApplyList,
  sendEmail,
  getSumPrice
} from '@/api/meetdeal'
export default {
  components: {
    Pagination
  },
  filters: {
    typeFilter(type) {
      switch (type) {
        case 1:
          return 'YouTube'
        case 2:
          return 'Review'
        case 3:
          return 'Facebook'

        default:
          break;
      }
      return '-'
    }
  },
  data() {
    const validateGiftCardCode = (rule, value, callback) => {
      const reg = /[\da-zA-Z]{4}-[\da-zA-Z]{6}-[\da-zA-Z]{4}/
      if (value === '' || !value) {
        return callback(new Error('请输入Gift Card Code'));
      } else if (!reg.test(value)) {
        return callback(new Error('请输入正确的Gift Card Code'));
      } else {
        callback();
      }
    }
    return {
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        sortName: '',
        sortType: ''
      },
      formData: {
        types: null,
        sendStatuses: null
      },
      tableDataList: [],
      loading: false,
      summaryData: {},
      multipleSelection: [],
      batchSendBtnLoading: false,

      dialogFormVisible: false,
      sendFormData: {
        giftCardCode: null
      },
      currentData: {},
      sendFormRules: {
        giftCardCode: [
          { validator: validateGiftCardCode, trigger: 'blur' }
        ]
      },
      dialogDetailVisible: false
    }
  },
  mixins: [fullScreenForContainer, mixins],
  created() {
    this.getList()
    this.getSumPrice()
  },

  methods: {
    handleTabelSort({ prop, order }) {
      this.pages.sortName = prop
      this.pages.sortType = order === 'ascending' ? 'asc' : 'desc'
      this.getList()
    },
    // 获取额度列表
    async getList() {
      const params = {
        ...this.pages,
        ...this.formData,
        status: 1
      }
      if (this.formData.sendStatuses || this.formData.sendStatuses === 0) params.sendStatuses = `${this.formData.sendStatuses}`
      if (this.formData.types || this.formData.types === 0) params.types = `${this.formData.types}`
      const res = await getGiftCartApplyList(params)
      res.data.list.forEach(item => {
        if (item.imageS3Key) {
          item.url = `http://data-file.hootoo.com/s3/${item.imageS3Key}`
          item.srcList = [item.url]
        }
      })
      this.tableDataList = res.data.list
      this.pages.total = res.data.total
      // console.log(res)
    },
    // 获取面额统计
    async getSumPrice() {
      const { data } = await getSumPrice()
      this.summaryData = data
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量发送
    async handleBatchSend() {
      this.batchSendBtnLoading = true
      const res = await sendEmail({
        activationCodeNo: this.multipleSelection.map(item => item.activationCodeNo).join(',')
      })
      if (res.resCode !== 200) {
        return this.$message.error(res.resDes)
      }
      this.$message.success('已批量发送')
      this.getList()
      this.batchSendBtnLoading = false
    },
    // 查看
    handleToView(row) {
      this.currentData = row
      this.currentData.giftImgUrl = row.price === 10 ? gift1 : gift2
      this.dialogDetailVisible = true
    },
    // 发送
    async handleSend(row) {
      this.currentData = row
      this.dialogFormVisible = true
    },
    // 提交发送
    handleSubmitSend() {
      this.$refs.sendForm.validate(async valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.2)'
          })
          const res = await sendEmail({
            activationCodeNo: this.currentData.activationCodeNo,
            ...this.sendFormData
          }).catch(() => loading.close())
          if (res.resCode !== 200) {
            return this.$message.error(res.resDes)
          }
          this.$message.success('已发送')
          loading.close()
          this.getList()
        }
      })
    },
    // 驳回
    async handleReject(row) {
      const res = await updateBindStatus({
        activationCodeNo: row.activationCodeNo,
        status: 2
      })
      if (res.resCode !== 200) {
        return this.$message.error(res.resDes)
      }
      this.$message.success('已驳回')
      this.getList()
    },
    // 查看详情
    handleViewDetail(data) {
      console.log(data)
    },
    // 停用
    handlePause(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .summary-data {
    display: flex;
    height: 100px;
    .item {
      height: 100%;
      width: 265px;
      border: 2px solid #F2F6FC;
      padding: 20px;
      margin-right: 10px;
      transition: all .2s;
      &:hover {
        border: 2px solid #67C23A;
      }
      p {
        margin: 0;
        color: #999;
        &.value {
          margin-top: 10px;
          color: #303133;
          font-size: 20px;
        }
      }
    }
  }
  .table-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>

<style lang="scss">
.detail-box {
  .gift-img {
    height: 160px;
    display: flex;
    justify-content: center;
    img {
      height: 100%;
      display: block;
    }
  }
  p {
    margin: 0;
    color: #999;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>

