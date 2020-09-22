<template>
  <div>
    <el-table
      v-loading="loading"
      :data="data"
      :height="tableHeight"
      :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
      class="data-table"
      style="width: 100%"
    >
      <el-table-column label="月份" align="center" prop="months"></el-table-column>
      <el-table-column label="额度" align="center" prop="totalQuota" width="90"></el-table-column>
      <el-table-column label="临时额度" align="center" prop="temporaryQuota"></el-table-column>
      <el-table-column label="实际发生金额(人民币)" align="center" prop="usedQuota"></el-table-column>
      <!-- <el-table-column label="额度利用率" align="center" prop=""></el-table-column>
      <el-table-column label="额度变化" align="center" prop=""></el-table-column>-->
      <el-table-column label="当月领取情况" align="center" prop="receivePercentStr"></el-table-column>
      <el-table-column label="Gift Card 申请人" align="center" prop="applicantName"></el-table-column>
    </el-table>
    <pagination
      :total="pages.total"
      :page.sync="pages.page"
      :limit.sync="pages.limit"
      @pagination="onPagination"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import tableHeight from '@/mixins/tableHeight';
export default {
  components: {
    Pagination
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
  data() {
    return {
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 510,
      topHeight: 510,//除表格高度外的内容高度
      pages: {
        total: 0,
        page: 1,
        limit: 10
      }
    }
  },
  watch: {
    total(val) {
      this.pages.total = val;
    }
  },
  methods: {
    onPagination() {
      this.$emit('on-pagination', this.pages);
    }
  }
}
</script>
