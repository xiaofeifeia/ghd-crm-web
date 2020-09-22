<template>
  <div class="app-container bg-white" ref="appContainer">
    <div class="table-tools mb10">
      <div class="left">
        <span class="selected">已选择<span class="num">0</span>项目</span>
        <el-button type="primary" size="mini" @click="handleBatchUpdate">批量通过</el-button>
        <!-- <el-button type="danger" size="mini" @click="handleBatchReject">批量驳回</el-button> -->
      </div>
      <div class="right">
        <el-tooltip class="item" effect="dark" content="全屏" placement="top">
          <a @click="toggleFullScreen">
            <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'"/>
          </a>
        </el-tooltip>
      </div>
    </div>

    <div class="filters">
      <el-form :model="formData" inline>
        <el-form-item>
          <el-select size="mini" v-model="formData.createUserNames" multiple collapse-tags clearable placeholder="请选择创建人" @change="getList">
            <el-option v-for="item in createUserList" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select size="mini" v-model="formData.models" multiple collapse-tags clearable placeholder="请选择Model" @change="getList">
            <el-option v-for="item in modelList" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="Activation time" align="center" prop="activationDate" min-width="140px"></el-table-column>
        <el-table-column align="center" prop="type" min-width="140px">
          <template slot="header">
            <el-select size="mini" v-model="formData.types" placeholder="Type" @change="getList">
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
        <el-table-column label="创建人" align="center" prop="createUserName" sortable="custom"  min-width="120px"></el-table-column>
        <el-table-column label="Model" align="center" prop="model" sortable="custom"  min-width="120px"></el-table-column>
        <el-table-column label="E-mail" align="center" prop="email" sortable="custom"  min-width="120px"></el-table-column>
        <el-table-column label="激活码" align="center" prop="activationCodeNo" sortable="custom"  min-width="120px"></el-table-column>
        <el-table-column label="有效期" align="center" min-width="120px">
          <template slot-scope="{row}">{{row.startDate}} - {{row.endDate}}</template>
        </el-table-column>
        <el-table-column label="面额" align="center" prop="price" sortable="custom" min-width="120px"></el-table-column>
        <el-table-column label="Amazon Order ID" align="center" prop="amazonOrderId" sortable="custom"  min-width="160px">
          <template slot-scope="{row}">
            <template v-if="row.amazonOrderId">{{row.amazonOrderId}}</template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="Link" align="center" prop="videoLink" sortable="custom" min-width="140px">
          <template slot-scope="{row}">
            <a v-if="row.videoLink" :href="row.videoLink" class="link" target="_blank">{{row.videoLink}}</a>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="Picture" align="center" prop="imageS3Key" sortable="custom" min-width="120px">
          <template slot-scope="{row}">
            <template v-if="row.imageS3Key">
              <el-image
                style="width: 50px; height: 50px"
                :src="row.url"
                fit="cover"
                :preview-src-list="row.srcList"
              ></el-image>
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" align="center" prop="status" min-width="120px">
          <template slot="header">
            <el-select size="mini" v-model="formData.status" placeholder="Status" @change="getList">
              <el-option :value="1" label="已通过"></el-option>
              <el-option :value="0" label="待审核"></el-option>
              <el-option :value="2" label="已驳回"></el-option>
            </el-select>
          </template>
          <template slot-scope="{row}">
            <el-tag v-if="row.status === 0" type="info">待审核</el-tag>
            <el-tag v-if="row.status === 1" type="success">已通过</el-tag>
            <el-tag v-else-if="row.status === 2" type="info">已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="160px" fixed="right">
          <template slot-scope="{row}">
            <el-button type="success" size="mini" v-if="row.status === 0" @click="handleThrough(row)">通过</el-button>
            <el-button type="danger" size="mini" v-if="row.status === 0" @click="handleReject(row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="pages.total" :page.sync="pages.pageNum" :limit.sync="pages.pageSize" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import fullScreenForContainer from '@/mixins/fullScreenForContainer'

import Pagination from '@/components/Pagination'

import mixins from '@/mixins'

// api
import {
  getGiftCartApplyList,
  updateBindStatus,
  getModelList,
  getCreateUserList
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
        status: null,
        createUserNames: [],
        models: []
      },
      tableDataList: [],
      modelList: [],
      createUserList: [],
      loading: false,
      createCodeVisible: false,
      multipleSelection: []
    }
  },
  mixins: [fullScreenForContainer, mixins],
  created() {
    this.getCreateUserList()
    this.getModelList()
    this.getList()
  },

  methods: {
    handleTabelSort({ prop, order }) {
      this.pages.sortName = prop
      this.pages.sortType = order === 'ascending' ? 'asc' : 'desc'
      this.getList()
    },
    async getModelList() {
      const { data } = await getModelList()
      this.modelList = data
    },
    async getCreateUserList() {
      const { data } = await getCreateUserList()
      this.createUserList = data
    },
    // 获取额度列表
    async getList() {
      const params = {
        ...this.pages,
        ...this.formData
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量通过
    async handleBatchUpdate() {
      this.$confirm('是否批量通过', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await updateBindStatus({
          activationCodeNo: this.multipleSelection.map(item => item.activationCodeNo).join(','),
          status: 1
        })
        if (res.resCode !== 200) {
          return this.$message.error(res.resDes)
        }
        this.$message.success('已批量通过')
        this.getList()
      })
    },
    // 批量驳回
    async handleBatchReject() {
      const res = await updateBindStatus({
        activationCodeNo: this.multipleSelection.map(item => item.activationCodeNo).join(','),
        status: 2
      })
      if (res.resCode !== 200) {
        return this.$message.error(res.resDes)
      }
      this.$message.success('已批量驳回')
      this.getList()
    },
    // 通过
    async handleThrough(row) {
      this.$confirm('是否通过', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await updateBindStatus({
          activationCodeNo: row.activationCodeNo,
          status: 1
        })
        if (res.resCode !== 200) {
          return this.$message.error(res.resDes)
        }
        this.$message.success('已通过')
        this.getList()
      })
    },
    // 驳回
    async handleReject(row) {
      this.$confirm('是否通过', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await updateBindStatus({
          activationCodeNo: row.activationCodeNo,
          status: 2
        })
        if (res.resCode !== 200) {
          return this.$message.error(res.resDes)
        }
        this.$message.success('已驳回')
        this.getList()
      })
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

