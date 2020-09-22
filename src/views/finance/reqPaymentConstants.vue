<template>
  <div class="app-container fixed_table">
    <div class="filter-container">
      <el-form :v-model="listQuery" style="display: flex; flex-wrap: wrap">
        <el-form-item label="类型" label-width="100px">
          <el-select v-model="listQuery.type" placeholder="请选择" clearable @clear="listQuery.type = undefined">
            <el-option label="组别" :key="0" :value="0"/>
            <el-option label="币别" :key="2" :value="2"/>
            <el-option label="渠道" :key="3" :value="3"/>
            <el-option label="国家" :key="4" :value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="常量值" label-width="100px">
          <el-input v-model="listQuery.name" placeholder="请输入" clearable @clear="listQuery.name=undefined"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button v-waves type="primary" icon="el-icon-remove-outline" @click="reset">重置</el-button>
      </div>
    </div>

    <!--数据列表-->
    <div align="center">
      <el-table :data="list.list" highlight-current-row fit :max-height="tableHeight" v-loading="fullScreenLoading"
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
        <el-table-column type="index" align="center"/>
        <el-table-column label="常量值" prop="name" align="center"/>
        <el-table-column label="类型" prop="typeStr" align="center"/>
        <el-table-column label="操作" fixed="right" align="center"/>
      </el-table>
    </div>
    <div v-show="!fullScreenLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,50,100,500]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="list.total"/>
    </div>

  </div>
</template>

<script>
  import {
    getList
  } from '../../api/finance/reqPaymentConstants';
  import {mapGetters} from 'vuex';
  import Cookies from 'js-cookie';

    export default {
      name: "reqPaymentConstants",
      data() {
        return {
          fullScreenLoading: false,
          listQuery: {
            type: undefined,
            name: undefined,
            page: 1,
            limit: 10
          },
          list: {list: [], total: 0},
          createForm: {
            name: undefined,
            type: undefined
          },
          createRules: {
            name: [{required: true, message: '请输入常量名', trigger: 'blur'}],
            type: [{required: true, message: '请选择类型', trigger: 'change'}]
          },
          tableHeight: undefined
        }
      },
      created() {
        this.getList();
      },
      mounted() {
        this.tableHeight = window.innerHeight * 0.70;
      },
      methods: {
        getList() {
          this.fullScreenLoading = true;
          getList(this.listQuery).then(response => {
            if(response.status === 200) {
              this.list.total = response.data.total;
              this.list.list = response.data.rows;
            } else {
              this.$message.error("查询失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error(JSON.stringify(error));
          });
        },
        reset() {
          this.listQuery = {page: 1, limit: 10};
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

<style lang="scss" scoped>
  .filter-container {
  .el-form-item {
    margin-bottom: 5px;
  }
  }
</style>
