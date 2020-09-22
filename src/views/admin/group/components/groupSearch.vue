<template>
  <div v-loading="fullScreenLoading">
    <div style="margin-bottom: 10px;">
      <el-form v-model="listQuery" label-width="100px" class="form-el-all" @keyup.enter.native="handleFilter">
        <el-form-item label="用户名" label-width="80px">
          <el-input v-model="listQuery.userName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="组别" label-width="80px">
          <el-input v-model="listQuery.groupName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="组别类型" label-width="90px">
          <el-select v-model="listQuery.groupType" clearable placeholder="请选择">
            <el-option key="1" label="角色类型" value="1"></el-option>
            <el-option key="2" label="部门类型" value="2"></el-option>
            <el-option key="3" label="自定义类型" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织架构层级" label-width="120px">
          <el-select v-model="listQuery.orgLevel" clearable placeholder="请选择">
            <el-option key="1" label="1" value="1"></el-option>
            <el-option key="2" label="2" value="2"></el-option>
            <el-option key="3" label="3" value="3"></el-option>
            <el-option key="4" label="4" value="4"></el-option>
            <el-option key="5" label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-remove-outline" @click="handleClear">重置</el-button>
      </div>
    </div>

    <div>
      <el-table :key="0" :data="list" ref="elementTable" border fit highlight-current-row style="width: 100%" :height="tableHeight">
        <el-table-column type="index" width="80" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="用户名">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组别">
          <template slot-scope="scope">
            <span>{{scope.row.groupName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组别类型">
          <template slot-scope="scope">
            <span>{{scope.row.groupTypeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组织架构层级">
          <template slot-scope="scope">
            <span>{{scope.row.orgLevel}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    listGroupMember
  } from 'api/admin/groupMember/groupMember';
  export default {
    name: "groupSearch",
    data() {
      return {
        list: undefined,
        total: undefined,
        listQuery: {
          userName: undefined,
          groupName: undefined,
          groupType: undefined,
          orgLevel: undefined,
          page: 1,
          pageSize: 20
        },
        tableHeight: undefined,
        fullScreenLoading: false,
      }
    },
    created() {
    },
    mounted: function () {
      this.tableHeight = window.innerHeight * 0.65;
    },
    methods: {
      getList() {
        this.fullScreenLoading = true;
        listGroupMember(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      handleFilter() {
        this.getList();
      },
      handleClear() {
        this.listQuery.userName = undefined;
        this.listQuery.groupName = undefined;
        this.listQuery.groupType = undefined;
        this.listQuery.orgLevel = undefined;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      }
    }
  }
</script>

<style scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
  }
</style>
