<template>
  <div class="app-centre">
    <span>汇率管理</span>
    <div class="centent-header">
      <div>
        <el-button size="mini" v-waves type="primary" @click="getList">查询</el-button>
        <el-button size="mini" v-waves type="primary" @click="openEditRateDialog">编辑</el-button>
        <el-button size="mini" v-waves type="primary" @click="openAddRateDialog">新增</el-button>
        <h2><span style="color: #02A7F0;">最新汇率提交时间: {{latestUpdate}}</span></h2>
      </div>
      <div>
        <a @click="toggleFullScreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'"/> 全屏展示
        </a>
        <el-divider direction="vertical" />
        <span>总共{{ dataList.length }}条数据</span>
      </div>
    </div>
      <div class="table">
        <el-card>
          <el-table
            max-height="600"
            :stripe="true"
            :data="dataList"
            :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
            class="currencyRate">
            <el-table-column label="币种折换" >
              <template slot-scope="{row}">
                {{row.currencyFromName}} <span style="color:#f00">折</span>  {{row.currencyToName}}
              </template>
            </el-table-column>
            <el-table-column label="币种折换简称" >
              <template slot-scope="{row}">
                {{row.currencyFrom}} <span style="color:#f00">折</span> {{row.currencyTo}}
              </template>
            </el-table-column>
            <el-table-column label="汇率" prop="rate" />
            <el-table-column label="更新时间" prop="updateDate" />

          </el-table>
        </el-card>
    </div>
    <!--新增汇率-->
    <el-dialog title="新增汇率" :before-close="closeAddDialog" :visible.sync="addRateDialogVisible" v-dialog-drag>
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="130px">
        <el-form-item label="源币种简称" prop="currencyFrom">
          <el-input style="width: 600px" v-model="addForm.currencyFrom" placeholder="请输入源币种简称,如CNY"/>
        </el-form-item>
        <el-form-item label="源币种中文名" prop="currencyFromName">
          <el-input style="width: 600px" v-model="addForm.currencyFromName" placeholder="请输入源币种中文名,如人民币"/>
        </el-form-item>
        <el-form-item label="兑换币种简称" prop="currencyTo">
          <el-input style="width: 600px" v-model="addForm.currencyTo" placeholder="请输入兑换币种简称,如CNY"/>
        </el-form-item>
        <el-form-item label="兑换币种中文名" prop="currencyToName">
          <el-input style="width: 600px" v-model="addForm.currencyToName" placeholder="请输入兑换币种中文名,如人民币"/>
        </el-form-item>
        <el-form-item label="汇率" prop="rate">
          <el-input style="width: 600px" v-model="addForm.rate" placeholder="请输入汇率"/>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button v-waves type="primary" @click="addRate">确定</el-button>
        <el-button v-waves type="primary" @click="closeAddDialog">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="汇率管理" :before-close="closeEditDialog" :visible.sync="editRateDialogVisible" v-dialog-drag width="30%">
      <!-- <table style="border-collapse:separate;border-spacing:5px 5px; margin: 0 0 0 30px">
        <tr v-for="(item,index) in this.dataList" :key="index">
          <td style="text-align: right">{{item.currencyFromName}}折{{item.currencyToName}}汇率:</td>
          <td><input class="el-input__inner" :value="item.rate" placeholder="请输入汇率" @change="changeRate($event,item)"/></td>
          <td><el-button v-waves type="danger" size="small" @click="deleteRate(item)">删除</el-button></td>
        </tr>
      </table> -->
      <el-table
            max-height="500"
            :data="dataList"
            :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
            class="currencyRate"
            style="width: 100%">
            <el-table-column label="名称">
              <template slot-scope="{row}">
                {{row.currencyFromName}}折{{row.currencyToName}}
              </template>
            </el-table-column>
            <el-table-column label="编辑">
              <template slot-scope="{row}">
                <el-input size="mini" v-model="row.rate" placeholder="请输入汇率" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="{row}">
                <el-button size="mini" v-waves type="danger" @click="deleteRate(row)">删除</el-button>
              </template>
            </el-table-column>
      </el-table>
      <div class="center">
        <el-button size="mini" v-waves type="primary" @click="editRate">确定</el-button>
        <el-button size="mini" v-waves type="primary" @click="closeEditDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getRateList,
    addRate,
    editRate,
    deleteRate
  } from '../../api/finance/currencyRate';
import fullScreenForContainer from '@/mixins/fullScreenForContainer'
  export default {
    name: "currencyRate",
    data() {
      return {
        fullScreenLoading: false,
        addRateDialogVisible: false,
        editRateDialogVisible: false,
        dataList: [],
        latestUpdate: undefined,
        addForm: {
          currencyFrom: undefined,
          currencyFromName: undefined,
          currencyTo: undefined,
          currencyToName: undefined,
          rate: undefined
        },
        addRules: {
          currencyFrom: [{required: true, message: '请输入币种简称', trigger: 'blur'}],
          currencyFromName: [{required: true, message: '请输入币种中文名', trigger: 'blur'}],
          currencyTo: [{required: true, message: '请输入币种简称', trigger: 'blur'}],
          currencyToName: [{required: true, message: '请输入币种中文名', trigger: 'blur'}],
          rate: [{required: true, message: '请输入汇率', trigger: 'blur'}, {pattern: /^\d+(\.\d{1,4}){0,1}$/, message: '请输入最多四位小数的数值', trigger: 'blur'}]
        },
        editForm: {
          editList: []
        }
      }
    },
    mixins: [fullScreenForContainer],
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.fullScreenLoading = true;
        getRateList({}).then(response => {
          if(response.resCode === 200) {
            this.dataList = response.data.rows;
            this.latestUpdate = response.data.latestUpdate;
          } else {
            this.$message.error("查询失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("查询失败");
        });
      },
      addRate() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            addRate(this.addForm).then(response => {
              if(response.resCode === 200) {
                this.$message.success("新增汇率成功");
                this.addRateDialogVisible = false;
                this.getList();
              } else {
                this.$message.error(response.resDes);
              }
              this.fullScreenLoading = false;
            }).catch(error => {
              this.fullScreenLoading = false;
              this.$message.error("新增汇率失败");
            });
          }
        })
      },
      editRate() {
        var arr =[]
        this.dataList.forEach(val=>{
            arr.push({id: val.id, rate: val.rate})
        })
        this.fullScreenLoading = true;
        editRate({editList:arr}).then(response => {
          if(response.resCode === 200) {
            this.$message.success("编辑汇率成功");
            this.editRateDialogVisible = false;
            this.getList();
          } else {
            this.$message.error(response.resDes);
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error("编辑汇率失败");
        });
      },
      openAddRateDialog() {
        for(let key in this.addForm) {
          this.addForm[key] = undefined;
        }
        this.addRateDialogVisible = true;
      },
      closeAddDialog() {
        this.addRateDialogVisible = false;
      },
      openEditRateDialog() {
        this.editForm.editList = [];
        this.editRateDialogVisible = true;
      },
      closeEditDialog() {
        this.editRateDialogVisible = false;
      },
      deleteRate(item) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullScreenLoading = true;
          deleteRate({id: item.id}).then(response => {
            if(response.resCode === 200) {
              this.$message.success("删除汇率成功");
              this.editRateDialogVisible = false;
              this.getList();
            } else {
              this.$message.error("删除汇率失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error("删除汇率失败");
          });
        });
      }
    }
  }
</script>
<style >
.currencyRate .cell{
      text-align: center;
    }
</style>
<style lang='scss' scoped>
.app-centre{

  .centent-header{
    margin: 50px 0;
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 12px;
  }
  .center{
    margin-top: 20px;
  }
}
</style>
