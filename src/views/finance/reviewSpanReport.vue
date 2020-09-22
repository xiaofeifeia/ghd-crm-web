<template>
  <div class="dashboard-editor-container">
    <el-form v-model="listQuery" label-width="80px" class="form-el-all">
      <el-form-item label="分类">
        <el-select v-model="listQuery.groupBy" clearable placeholder="请选择" @clear="listQuery.groupBy = undefined">
          <el-option v-for="item in groupByOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="事业群">
        <el-select v-model="listQuery.businessGroup" multiple clearable placeholder="请选择" @change="changeOriganizationOptions" @clear="listQuery.groupBy = undefined">
          <el-option v-for="item in businessGroupOptions" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="事业部">
        <el-select v-model="listQuery.department" multiple clearable placeholder="请选择" @change="changeOriganizationOptions" @clear="listQuery.groupBy = undefined">
          <el-option v-for="item in departmentOptions" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="组别">
        <el-select v-model="listQuery.team" multiple clearable placeholder="请选择" @change="changeOriganizationOptions" @clear="listQuery.groupBy = undefined">
          <el-option v-for="item in teamOptions" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="统计周期">
        <el-date-picker v-model="applyDate" type="daterange" range-separator=" - " unlink-panels start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="pickerOptions" @change="changeApplyDate" @clear="listQuery.groupBy = undefined"/>
        <el-radio-group v-model="listQuery.period">
          <el-radio-button label="week">周</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div style="text-align: center; margin-bottom: 10px">
          <el-button type="primary" v-waves @click="getLineChart(1)">搜索</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 数据栏 -->
    <el-row v-loading="fullScreenLoading">
    <panel-group :total="summary.total" :order-qty="summary.orderQty" :review-qty="summary.reviewQty" :survival="summary.survival"
                 @handleSetLineChartData="handleSetLineChartData"/>
    </el-row>

    <!-- 折线图 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" v-loading="fullScreenLoading">
      <div align="center" style="padding-bottom: 10px;font-size: 18px; font-weight: 600">{{lineChartTitle}}</div>
      <line-chart :xAxis="lineChartData.xAxis" :legend="lineChartData.legend" :series="lineChartData.series" width="100%"/>
    </el-row>

    <el-container style="background:#fff">
      <!-- paypal折线图 -->
      <el-aside width="50%" style="padding: 20px">
          <div align="center" style="font-size: 18px; font-weight: 600">{{lineChartTitle + '(paypal)'}}</div>
          <line-chart :xAxis="lineChartData.xAxis" :legend="lineChartData.legend" :series="lineChartData.paypalSeries"/>
      </el-aside>
      <!-- 核销折线图 -->
      <el-main>
          <div align="center" style="font-size: 18px; font-weight: 600">{{lineChartTitle + '(核销)'}}</div>
          <line-chart :xAxis="lineChartData.xAxis" :legend="lineChartData.legend" :series="lineChartData.reimbursementSeries"/>
      </el-main>
    </el-container>

    <!--    <el-row :gutter="32">-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <raddar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <pie-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <bar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
  import PanelGroup from './reportcomponents/PanelGroup';
  import LineChart from './reportcomponents/LineChart';
  import RaddarChart from './reportcomponents/RaddarChart';
  import PieChart from './reportcomponents/PieChart';
  import BarChart from './reportcomponents/BarChart';
  import TransactionTable from './reportcomponents/TransactionTable';
  import {
    getOrganizationOptions,
    getLineChart,
    getStatistics
  } from 'src/api/finance/reviewSpanReport';

  export default {
    name: 'Dashboard',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      BarChart,
      TransactionTable
    },
    data() {
      return {
        fullScreenLoading: false,
        lineChartData: {},
        lineChartTitle: '总花费',
        groupByOptions: [{value: 'businessGroup', label: '事业群'}, {value: 'department', label: '事业部'}, {value: 'team', label: '小组'}],
        businessGroupOptions: [],
        departmentOptions: [],
        teamOptions: [],
        summary: {
          total: 0,
          orderQty: 0,
          reviewQty: 0,
          survival: 0
        },
        listQuery: {
          chartType: 1,
          groupBy: 'businessGroup',
          applyDateStart: undefined,
          applyDateEnd: undefined,
          period: 'week',
          businessGroup: [],
          department: [],
          team: []
        },
        applyDate: undefined,
        pickerOptions: {
          shortcuts: [{
            text: '当前月',
            onClick (picker) {
              const start = new Date();
              start.setDate(1);
              const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上一个月',
            onClick (picker) {
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
            }
          }]
        }
      }
    },
    created() {
      this.changeOriganizationOptions();
    },
    methods: {
      changeFullScreenLoading(val) {
        this.fullScreenLoading = val;
      },
      handleSetLineChartData(type) {
        if (type === 'total') {
          this.lineChartTitle = '总花费';
          this.getLineChart(1);
        } else if (type === 'orderQty') {
          this.lineChartTitle = '订单数';
          this.getLineChart(2);
        } else if (type === 'reviewQty') {
          this.lineChartTitle = 'Review数量';
          this.getLineChart(3);
        } else if (type === 'survival') {
          this.lineChartTitle = 'Review存活数';
          this.getLineChart(4);
        }
      },
      changeOriganizationOptions() {
        if (this.listQuery.businessGroup.length === 0) {
          this.getBusinessGroupOptions();
        }
        if (this.listQuery.department.length === 0) {
          this.getDepartmentOptions();
        }
        if (this.listQuery.team.length === 0) {
          this.getTeamOptions();
        }
      },
      getBusinessGroupOptions() {
        let form = {
          businessGroup: this.listQuery.businessGroup,
          department: this.listQuery.department,
          team: this.listQuery.team,
          groupBy: 'businessGroup'
        };
        this.fullScreenLoading = true;
        //事业群
        getOrganizationOptions(form).then(response => {
          if (response.resCode === 200) {
            this.businessGroupOptions = response.data;
          } else {
            this.$message.error("查询组织架构失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      getDepartmentOptions() {
        let form = {
          businessGroup: this.listQuery.businessGroup,
          department: this.listQuery.department,
          team: this.listQuery.team,
          groupBy: 'department'
        };
        this.fullScreenLoading = true;
        //事业部
        getOrganizationOptions(form).then(response => {
          if (response.resCode === 200) {
            this.departmentOptions = response.data;
          } else {
            this.$message.error("查询组织架构失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      getTeamOptions() {
        let form = {
          businessGroup: this.listQuery.businessGroup,
          department: this.listQuery.department,
          team: this.listQuery.team,
          groupBy: 'team'
        };
        this.fullScreenLoading = true;
        //小组
        getOrganizationOptions(form).then(response => {
          if (response.resCode === 200) {
            this.teamOptions = response.data;
          } else {
            this.$message.error("查询组织架构失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      changeApplyDate() {
        if (this.applyDate != null) {
          this.listQuery.applyDateStart = this.$moment(this.applyDate[0]).format("YYYY-MM-DD HH:mm:ss");
        } else {
          this.listQuery.applyDateStart = undefined;
        }
        if (this.applyDate != null) {
          this.listQuery.applyDateEnd = this.$moment(this.applyDate[1]).format("YYYY-MM-DD HH:mm:ss");
        } else {
          this.listQuery.applyDateEnd = undefined;
        }
      },
      getLineChart(chartType) {
        if (this.listQuery.groupBy === undefined) {
          this.$message.info("分类不能为空");
          return false;
        }
        if (this.applyDate === undefined) {
          this.$message.info("请款日期不能为空");
          return false;
        }
        this.fullScreenLoading = true;
        this.listQuery.chartType = chartType;
        this.getStatistics();
        getLineChart(this.listQuery).then(response => {
          if (response.resCode === 200) {
            this.lineChartData = response.data;
          } else {
            this.$message.error("查询图表数据失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      getStatistics() {
        if (this.listQuery.groupBy === undefined) {
          this.$message.info("分类不能为空");
          return false;
        }
        if (this.applyDate === undefined) {
          this.$message.info("请款日期不能为空");
          return false;
        }
        this.fullScreenLoading = true;
        getStatistics(this.listQuery).then(response => {
          if (response.resCode === 200) {
            this.summary = response.data;
          } else {
            this.$message.error("查询数据总量概述失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>

<style scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
  }
</style>
