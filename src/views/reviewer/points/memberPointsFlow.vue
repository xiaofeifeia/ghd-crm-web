<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form
        v-model="listQuery"
        label-width="100px"
        class="form-el-all"
        @keyup.enter.native="handleFilter"
      >
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
         <el-form-item label="类型">
          <el-select v-model="listQuery.type" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in itemTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input @keyup.enter.native="handleFilter" class="filter-item" placeholder="请输入" v-model="listQuery.email"></el-input>
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
      <el-table-column width="100px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.itemType}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="项目">
        <template slot-scope="scope">
          <span>{{scope.row.itemName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="分值">
        <template slot-scope="scope">
          <span>{{scope.row.points}}</span>
        </template>
      </el-table-column>
      <el-table-column width="500px" align="center" label="描述">
        <template slot-scope="scope">
           <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
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
  page
} from "api/reviewer/points/memberPointsFlow";
import {
  getWebsiteList,
  checkServerSelected,
  itemTypeOptions
} from "api/reviewer/points/memberPointsAccount";
import { mapGetters } from "vuex";
export default {
  name: "memberPointsItem",
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        type: null,
        name: null,
        email: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableKey: 0,
      serverName: undefined,
      websiteOptions: undefined,
      itemTypeOptions: undefined
    };
  },
  created() {
    this.getWebsiteList();
    this.itemTypeOptions = itemTypeOptions;
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
</style>