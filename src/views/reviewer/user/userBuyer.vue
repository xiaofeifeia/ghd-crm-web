<template>
  <div class="app-container calendar-list-container" v-loading="fullScreenLoading">
   <div class="filter-container">
      <el-form
        v-model="listQuery"
        label-width="100px"
        class="form-el-all"
        @keyup.enter.native="handleFilter">
        <el-form-item label="站点" style="margin-bottom: 0px;">
          <font color="red">*</font>
          <el-select v-model="serverName" clearable placeholder="请选择" class="filter-item" @change="changeWebsite">
            <el-option v-for="item in websiteOptions" :key="item.websiteName" :label="item.websiteName" :value="item.serverName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="listQuery.userName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="listQuery.email" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="paypal账号">
          <el-input v-model="listQuery.paypalAccount" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="账号权限" >
          <el-select v-model="listQuery.reviewPermissions" clearable placeholder="请选择">
            <el-option v-for="item in reviewPermissionOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="邀请用户" >
          <el-select v-model="listQuery.inviteUserPermissions" clearable placeholder="请选择">
            <el-option v-for="item in enableOrDisable" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
         <el-form-item label="返仓活动">
          <el-select v-model="listQuery.isReturnWarehouse" clearable placeholder="请选择">
            <el-option v-for="item in enableOrDisable" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
          <el-form-item>
          <div align="center" style="margin-bottom: 10px">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
        </el-form-item>

      </el-form>
    </div>
    <el-table :key="tableKey" ref="topictable" :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="tableHeight" >
      <el-table-column type="index" align="center" width="80px"></el-table-column>
      <el-table-column width="150px" align="center" label="名字">
        <template slot-scope="scope">
          <span>{{scope.row.firstName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="姓氏">
        <template slot-scope="scope">
          <span>{{scope.row.lastName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="200px" align="center" label="Amazon个人链接" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.amzProfileLink}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="PayPal账号">
        <template slot-scope="scope">
          <span>{{scope.row.paypalAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="账号权限">
        <template slot-scope="scope">
          <span>{{scope.row.reviewPermissionsStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="邀请用户权限">
        <template slot-scope="scope">
          <span>{{scope.row.inviteUserPermissionsStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="返仓活动" :formatter="formatReturnWhPermission"></el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
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
    <el-drawer
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      >
      <div class="demo-drawer__content">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="名字" prop="firstName" >
            <el-input v-model="form.firstName" placeholder="请输入名字"></el-input>
          </el-form-item>
          <el-form-item label="姓氏" prop="lastName">
            <el-input v-model="form.lastName" placeholder="请输入姓氏"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="form.email" readonly></el-input>
          </el-form-item>

          <el-form-item label="账号权限" prop="reviewPermissions" >
            <el-select v-model="form.reviewPermissions" clearable placeholder="请选择">
              <el-option v-for="item in reviewPermissionOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀请用户权限" prop="inviteUserPermissions" >
            <el-select v-model="form.inviteUserPermissions" clearable placeholder="请选择">
              <el-option v-for="item in inviteUserPermissionsType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="返仓活动" prop="isReturnWarehouse" >
            <el-select v-model="form.isReturnWarehouse" clearable placeholder="请选择">
              <el-option v-for="item in enableOrDisable" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Profile Link" prop="amzProfileLink" >
            <el-input type="textarea" v-model="form.amzProfileLink" placeholder="请输入Amazon个人链接"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="margin-left: 20px;" type="primary" @click="update('form')">确 定</el-button>
          <el-button @click="cancel('form')">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  listUserBuyer,
  updateUserBuyer
} from "api/reviewer/user/userBuyer";
import {
  getWebsiteList,
  checkServerSelected,
  itemTypeOptions,
  reviewPermissionOptions,
  enableOrDisable
} from "api/reviewer/reviewCommon";
import { mapGetters } from "vuex";
export default {
  name: "userBuyer",
  data() {
    return {
      form: {
        id: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        amzProfileLink: undefined,
        // paypalAccount: undefined,
        reviewPermissions: undefined,
        campaignPermission: undefined
      },
      reviewPermissionOptions: [],
      rules: {
        firstName: [
          {
            required: true,
            message: "请输入名字",
            trigger: "blur"
          }
        ],
        lastName: [
          {
            required: true,
            message: "请输入姓氏",
            trigger: "blur"
          }
        ],
        amzProfileLink: [
          {
            required: true,
            message: "请输入Amazon个人链接",
            trigger: "blur"
          }
        ],
        reviewPermissions: [
          {
            required: true,
            message: "请选择账号权限",
            trigger: "blur"
          }
        ]
      },
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        userName: undefined,
        email: undefined,
        paypalAccount: undefined,
        reviewPermissions: undefined,
        isReturnWarehouse: undefined,
        inviteUserPermissions: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      serverName: undefined,
      reserveServerName: undefined,
      websiteOptions: undefined,
      tableHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 100,
      fullScreenLoading: false,
      // 评论类型
      inviteUserPermissionsType: [{
        value: 0,
        label: '禁用'
      },{
        value: 1,
        label: '启用'
      }],
      // 评论类型
      enableOrDisable: []
    };
  },
  mounted: function(){
    this.tableHeight = window.innerHeight * 0.85;
    // this.tableHeight = window.innerHeight - this.$refs.topictable.$el.offsetTop - 50;
  },
  created() {
    this.getWebsiteList();
    this.reviewPermissionOptions = reviewPermissionOptions;
    this.enableOrDisable = enableOrDisable;
  },
  computed: {
    ...mapGetters(["elements"])
  },
  methods: {
    getList() {
      if (!checkServerSelected(this.serverName)) {
        this.$notify({
          title: "失败",
          message: '请选择目标站点',
          type: "error"
        });
        return false;
      }
      this.listLoading = true;
      this.reserveServerName = this.serverName;
      listUserBuyer(this.reserveServerName, this.listQuery).then(response => {
      this.list = response.data.rows;
      this.total = response.data.total;
      this.listLoading = false;
    });
    },
    handleFilter() {
      this.getList();
    },
    handleClear() {
      this.listQuery.userName = undefined;
      this.listQuery.email = undefined;
      this.listQuery.paypalAccount = undefined;
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
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(this.reserveServerName, row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    update(formName) {
      this.fullScreenLoading = true;
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          updateUserBuyer(this.reserveServerName, this.form).then(response => {
            this.fullScreenLoading = false;
            if(response.resCode != 200) {
              this.$alert(response.resDes, "编辑失败");
            } else {
              this.$message.success("编辑成功");
              this.dialogFormVisible = false;
              this.getList();
            }
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error(JSON.stringify(error));
          });
        } else {
          this.fullScreenLoading = false;
          return false;
        }
      });
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
      }).catch(error => {
        this.$message.error(JSON.stringify(error));
      });
    },
    // 改变站点时清空数据
    changeWebsite () {
      this.list = [];
    },
    formatReturnWhPermission (row,column) {
      switch(row.isReturnWarehouse){
          case 0:
            return '禁用';
            break;
          case 1:
            return '启用';
            break;
          default:
            return '';
      }
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
    margin-bottom: 10px;
  }
</style>
