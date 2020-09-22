<template>
  <div class="app-container bg-white" ref="appContainer">
    <!-- 额度汇总 -->
    <div class="summary-data mb20">
      <div class="item">
        <p class="title">本月已生成 Activation Code 数</p>
        <p class="value">{{ summaryData.methodTotal || 0 | filterToInt }}</p>
      </div>
      <div class="item">
        <p class="title">累计生成Activation Code 数</p>
        <p class="value">{{ summaryData.allTotal || 0 | filterToInt }}</p>
      </div>
      <div class="item">
        <p class="title">累计使用 Activation Code 数</p>
        <p class="value">{{ summaryData.activationCount || 0 | filterToInt }}</p>
      </div>
    </div>
    <div class="table-tools mb10">
      <div class="left">
        <el-button type="primary" size="mini" @click="createCodeVisible = true">生成激活码</el-button>
      </div>
      <div class="right">
        <el-tooltip class="item" effect="dark" content="全屏" placement="top">
          <a @click="toggleFullScreen">
            <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'"/>
          </a>
        </el-tooltip>
      </div>
    </div>
    <div class="table-tools mb10">
      <div class="left">
        <span class="selected">已选择<span class="num">0</span>项目</span>
        <!-- <el-button type="primary" size="mini" @click="handleExport">批量导出</el-button> -->
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
          :default-sort = "{prop: 'createDate', order: 'descending'}"
          @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="创建单号" align="center" prop="activationCodeBatchNo"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createDate" sortable="custom"></el-table-column>
        <el-table-column label="操作人" align="center" prop="createUserName"></el-table-column>
        <el-table-column label="生成数量" align="center" prop="createCount" sortable="custom"></el-table-column>
        <el-table-column label="适用面额" align="center" prop="price" sortable="custom"></el-table-column>
        <el-table-column label="Model" align="center" prop="model" sortable="custom"></el-table-column>
        <el-table-column label="激活数量" align="center" prop="activationCount" sortable="custom"></el-table-column>
        <el-table-column label="有效期" align="center" min-width="120px" sortable="custom">
          <template slot-scope="{row}">{{row.startDate}} - {{row.endDate}}</template>
        </el-table-column>
        <el-table-column label="当前状态" align="center" prop="status" sortable="custom">
          <template slot="title">
            <el-select v-model="formData.status" placeholder="请选择状态" @change="getList">
              <el-option :value="1" label="正常"></el-option>
              <el-option :value="0" label="失效"></el-option>
            </el-select>
          </template>
          <template slot-scope="{row}">
            <el-tag v-if="row.status" type="success">正常</el-tag>
            <el-tag v-else type="info">失效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="80px">
          <template slot-scope="{row}">
            <el-button type="success" size="mini" @click="exeportQrCodeExcel(row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="pages.total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize" @pagination="getList" />
    </div>

    <!-- 创建 -->
    <create-code
      v-model="createCodeVisible"
      @onOk="getList"
    />
  </div>
</template>

<script>
import fullScreenForContainer from '@/mixins/fullScreenForContainer'

import CreateCode from './component/CreateCode'

import Pagination from '@/components/Pagination'

import mixins from '@/mixins'


// api
import {
  getBatchCodeList,
  exeportQrCodeExcel,
  getMethodQuery
} from '@/api/meetdeal'
export default {
  components: {
    CreateCode,
    Pagination
  },
  data() {
    return {
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        sortName: 'createDate',
        sortType: 'desc'
      },
      formData: {
        searchText: null
      },
      tableDataList: [],
      loading: false,
      createCodeVisible: false,
      summaryData: {},
      multipleSelection: []
    }
  },
  mixins: [fullScreenForContainer, mixins],
  created() {
    this.getList()
    this.getMethodQuery()
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
        ...this.formData
      }
      const res = await getBatchCodeList(params)
      this.tableDataList = res.data.list
      this.pages.total = res.data.total
      // console.log(res)
    },
    // 获取额度列表
    async getMethodQuery() {
      const { data } = await getMethodQuery()
      this.summaryData = data
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量导出
    async handleExport() {
      const res = await exeportQrCodeExcel({
        activationCodeBatchNo: this.multipleSelection.map(item => item.activationCodeBatchNo).join(',')
      })
      if (!res.data) return this.$message.error('导出错误，请重试')
      const filename = decodeURI(res.headers['content-disposition'].split('fileName=')[1])

      this.funDownload({
        content: res.data.data,
        filename: `${filename}`
      })
    },
    // 导出
    async exeportQrCodeExcel(row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const res = await exeportQrCodeExcel({
        activationCodeBatchNo: row.activationCodeBatchNo
      }).catch(() => {
        loading.close()
      })
      loading.close()
      if (!res.data) return this.$message.error('导出错误，请重试')

      const filename = decodeURI(res.headers['content-disposition'].split('fileName=')[1])
      // download(res.data, filename);
      // import('@/vendor/Export2Zip').then(zip => {
      //   zip.export_blob_to_zip(res.data, filename)
      // })

      this.funDownload({
        content: res.data,
        filename: `${filename}`
      })
      // console.log(res.data instanceof Blob)
      // this.funDownload({
      //   content: res.data,
      //   filename: `${filename}`
      // })
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

