<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form class="form-el-all" v-model="listQuery">
        <el-form-item label="分类" label-width="100px">
          <el-select v-model="listQuery.groupBy" placeholder="请选择" clearable @clear="listQuery.groupBy = undefined">
            <el-option label="事业群" :key="'businessGroup'" :value="'businessGroup'"/>
            <el-option label="事业部" :key="'department'" :value="'department'"/>
          </el-select>
        </el-form-item>
        <el-form-item label="事业部" label-width="90px">
          <el-select v-model="listQuery.department" multiple placeholder="请选择" clearable @clear="listQuery.department = []">
            <el-option v-for="item in departmentOptions" :label="item.name" :key="item.name" :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="sku" label-width="70px">
          <el-input v-model="listQuery.sku" placeholder="请输入" clearable @clear="listQuery.sku=undefined"/>
        </el-form-item>
        <el-form-item label="统计周期" label-width="120px">
          <el-date-picker v-model="finishDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                          :picker-options="pickerOptions" clearable/>
        </el-form-item>
        <el-form-item label="查询排名数" label-width="100px">
          <el-input v-model="listQuery.topNumber" placeholder="请输入" clearable @clear="listQuery.topNumber=undefined"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" v-waves icon="el-icon-search" @click="getList">搜索</el-button>
        <el-button type="primary" v-waves icon="el-icon-remove-outline" @click="handleClear">重置</el-button>
      </div>
    </div>

    <el-table :data="list" v-loading="fullScreenLoading" border fit highlight-current-row :height="tableHeight" style="width: 100%"
              row-key="index" :cell-style="changeCellStyle">
      <el-table-column label="序号" prop="index" align="center"/>
      <el-table-column label="组别" prop="teamName" align="center"/>
      <el-table-column label="sku" prop="sku" align="center"/>
      <el-table-column label="总费用(美元)" prop="total" align="center"/>
      <el-table-column label="pp费用(美元)" prop="paypalFee" align="center"/>
      <el-table-column label="核销费用(美元)" prop="reimbursementFee" align="center"/>
      <el-table-column label="评价帮费用(美元)" prop="pingJiaBangFee" align="center"/>
    </el-table>
  </div>
</template>

<script>
  import {getList} from '../../api/finance/SkuFeeSort';
  import {getBaseGroupsByType} from '../../api/finance/loanTeam';

  export default {
    name: "SkuFeeSort",
    data() {
      return {
        fullScreenLoading: false,
        tableHeight: undefined,
        finishDate: undefined,
        listQuery: {
          groupBy: 'department',
          department: [],
          sku: undefined,
          topNumber: 10,
          finishDateStart: undefined,
          finishDateEnd: undefined
        },
        list: [],
        departmentOptions: [],
        pickerOptions: {
          shortcuts: [
            {
              text: '当前月',
              onClick(picker) {
                const start = new Date();
                start.setDate(1);
                const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '上一个月',
              onClick(picker) {
                const start = new Date();
                start.setMonth(start.getMonth() - 1);
                start.setDate(1);
                const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }}
          ]
        }
      }
    },
    watch: {
      finishDate() {
        this.listQuery.finishDateStart = this.finishDate? this.changeDate(this.finishDate[0]) :undefined;
        this.listQuery.finishDateEnd = this.finishDate? this.changeDate(this.finishDate[1]) :undefined;
      }
    },
    created() {
      this.getBaseGroupsByType();
    },
    mounted() {
      this.tableHeight = window.innerHeight * 0.85;
    },
    methods: {
      getList() {
        if(!this.listQuery.groupBy) {
          this.$message.info("请选择分类");
          return false;
        }
        if(!this.listQuery.topNumber) {
          this.$message.info("请输入SKU排名数");
          return false;
        }
        this.fullScreenLoading = true;
        getList(this.listQuery).then(response => {
          if (response.resCode === 200) {
            this.list = response.data;
          } else {
            this.$message.error("查询失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      handleClear() {
        this.finishDate = undefined;
        this.listQuery = {
          groupBy: 'department',
          department: [],
          topNumber: 10
        };
      },
      getBaseGroupsByType() {
        this.fullScreenLoading = true;
        // type 1事业群 2事业部 3小组
        getBaseGroupsByType({type: 2}).then(response => {
          if(response.resCode === 200) {
            this.departmentOptions = response.data;
          } else {
            this.$message.error("查询事业部错误");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      changeCellStyle(row) {
        let reg = RegExp(/^[0-9]+-[0-9]+$/);
        if(reg.test(row.row.index)) {
          return 'background-color: #ecf5ff';
        }
      },
      changeDate(date) {
        return this.$moment(date).format("YYYY-MM-DD");
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
  }
</style>
