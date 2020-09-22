<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form v-model="listQuery"  label-width="100px" class="form-el-all" @keyup.enter.native="handleFilter">
        <el-form-item label="站点">
          <font color="red">*</font>
          <el-select v-model="serverName" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in websiteOptions"
              :key="item.websiteName"
              :label="item.websiteName"
              :value="item.serverName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            v-waves
            icon="search"
            @click="handleFilter"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="100px" align="center" label="Buyer ID">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="全名">
        <template slot-scope="scope">
          <span>{{scope.row.fullName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="会员等级">
        <template slot-scope="scope">
          <span>{{scope.row.level}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="总积分">
        <template slot-scope="scope">
          <span>{{scope.row.totalPoints}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="总消费积分">
        <template slot-scope="scope">
          <span>{{scope.row.expandPoints}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="可用积分">
        <template slot-scope="scope">
          <span>{{scope.row.remainPoints}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.statusStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  getWebsiteList,
  checkServerSelected
} from "api/reviewer/points/memberPointsAccount";
import { mapGetters } from "vuex";
export default {
  name: "memberPointsAccount",
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      serverName: undefined,
      websiteOptions: undefined
    };
  },
  created() {
    this.getWebsiteList();
  },
  computed: {
    ...mapGetters(["elements"])
  },
  methods: {
    getList() {
      if (!checkServerSelected(this.serverName)) {
        this.$message.warning('操作失败，目标站点不能为空！');
        return false;
      }
      this.listLoading = true;
      page(this.serverName, this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
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
    },
    resetTemp() {
      this.form = {
        username: undefined,
        name: undefined,
        sex: "男",
        password: undefined,
        description: undefined
      };
    },
    getWebsiteList() {
      getWebsiteList().then(response => {
        this.websiteOptions = response.data.rows;
      });
    }
  }
};
</script>
<style scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
</style>