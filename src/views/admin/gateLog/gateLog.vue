<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="操作人姓名" v-model="listQuery.crtName"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" fit highlight-current-row
              :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight" style="width: 100%">
      <el-table-column align="center" label="id" prop="id"/>
      <el-table-column align="center" label="菜单" prop="menu"/>
      <el-table-column align="center" label="操作" prop="opt"/>
      <el-table-column align="center" label="资源路径" prop="uri"/>
      <el-table-column align="center" label="操作时间" prop="crtTime"/>
      <el-table-column align="center" label="操作人ID" prop="crtUser"/>
      <el-table-column align="center" label="操作人" prop="crtName"/>
      <el-table-column align="center" label="操作主机" prop="crtHost"/>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  page
} from 'api/admin/gateLog/gateLog';
export default {
  name: 'gateLog',
  data() {
    return {
      tableHeight: undefined,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        crtName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      gateLogManager_btn_edit: '1',
      gateLogManager_btn_del: '1',
      gateLogManager_btn_add: '1',
      textMap: {update: '编辑', create: '创建'},
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.tableHeight = window.innerHeight * 0.77;
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
}
</script>
