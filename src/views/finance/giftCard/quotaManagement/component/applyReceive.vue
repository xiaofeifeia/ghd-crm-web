<template>
  <div>
    <el-table
      v-loading="loading"
      :data="data"
      :height="tableHeight"
      :header-cell-style="{background: '#f2f2f2',color: '#333',fontSize: '14px',}"
      class="data-table"
      style="width: 100%;"
    >
      <el-table-column label="领用时间" align="center" prop="receiveDate" />
      <el-table-column label="领用人" align="center" prop="receiverName" />
      <el-table-column label="领用面额" align="center" prop="unitPrice" />
      <el-table-column label="币种" align="center" prop="currency" />
      <el-table-column label="数量" align="center" prop="totalAmount" />
      <el-table-column label="预计金额（人民币）" align="center" prop="total" />
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

    <applyReceiveDetail :visible.sync="showDetail" :applyId="applyId" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import applyReceiveDetail from './applyReceiveDetail'
import tableHeight from '@/mixins/tableHeight'
export default {
  components: {
    Pagination,
    applyReceiveDetail
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
  mixins: [tableHeight],
  methods: {
    onPagination() {
      this.$emit('on-pagination', this.pages);
    },
    // 查看详情
    handleToViewDetail(row) {
      console.log(row);
      this.applyId = row.receiveNo
      this.showDetail = true
    }
  }
};
</script>
