<template>
  <div>
    <el-table
      v-loading="loading"
      :data="data"
      :header-cell-style="{
        background: '#f2f2f2',
        color: '#333',
        fontSize: '14px',
      }"
      :height="tableHeight"
      class="data-table"
      style="width: 100%;"
    >
      <el-table-column label="申请单号" align="center" prop="applyNo"></el-table-column>
      <el-table-column label="申请时间" align="center" prop="applyDate"></el-table-column>
      <el-table-column label="状态" align="center" prop="statusStr" width="120"></el-table-column>
      <el-table-column label="当前未操作人" align="center" prop="currentAuditor"></el-table-column>
      <el-table-column label="使用额度" align="center" prop="total"></el-table-column>
      <el-table-column label="适用站点" align="center" prop="country"></el-table-column>
      <el-table-column label="领取情况" align="center" prop="receivePercentStr"></el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleToViewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="pages.total"
      :page.sync="pages.page"
      :limit.sync="pages.limit"
      @pagination="onPagination"
    />
    <application-detail :visible.sync="showDetail" :applyId="applyId" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

import ApplicationDetail from './applicationDetail'
import tableHeight from '@/mixins/tableHeight'
export default {
  components: {
    Pagination,
    ApplicationDetail
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mixins: [tableHeight],
  watch: {
    total(val) {
      this.pages.total = val;
    }
  },
  data() {
    return {
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 510,
      topHeight: 510,//除表格高度外的内容高度
      pages: {
        total: 0,
        page: 1,
        limit: 10
      },
      showDetail: false,
      detailLoading: false,
      applyId: null,
      detailData: []
    };
  },
  methods: {
    onPagination() {
      this.$emit('on-pagination', this.pages);
    },
    // 查看详情
    handleToViewDetail(row) {
      console.log(row)
      this.applyId = row.id
      this.showDetail = true
    }
  }
};
</script>
