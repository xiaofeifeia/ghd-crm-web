<template>
  <div class="app-container calendar-list-container" v-loading="fullScreenLoading">
    <div class="filter-container">
      <el-form
        v-model="listQuery"
        label-width="80px"
        class="form-el-all"
        @keyup.enter.native="handleFilter"
      >
        <el-form-item label="站点" >
          <font color="red">*</font>
          <el-select v-model="serverName" clearable placeholder="请选择">
            <el-option v-for="item in websiteOptions" :key="item.websiteName" :label="item.websiteName" :value="item.serverName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" >
          <el-select v-model="listQuery.status" clearable placeholder="请选择" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" >
          <el-input v-model="listQuery.email" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="邀请人">
          <el-input v-model="listQuery.inviterEmail" clearable placeholder="请输入" @keyup.enter.native="handleFilter" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="createDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input v-model="listQuery.remark" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <div style="text-align: center">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-message" @click="handleSendEmail">发送邀请邮件</el-button>
            <el-button class="filter-item" v-waves type="primary" icon="el-icon-download" @click="exportUserInvitation">导出</el-button>
          </div>
        </el-form-item>
      </el-form>

    </div>
    <el-table :key="tableKey" :data="list" ref="elementTable" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="tableHeight">
      <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column width="250px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="账号权限">
        <template slot-scope="scope">
          <span>{{scope.row.reviewPermissionsStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.statusStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="邀请人邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.inviterEmail}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="profile link" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.amzProfile}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="注册链接" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.registerUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="有效期">
        <template slot-scope="scope">
          <span>{{scope.row.expiredDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" title="编辑" icon="el-icon-edit" v-if="scope.row.status == 0 || scope.row.status == 1"  @click="handleUpdate(scope.row)" circle></el-button>
          <el-button size="mini" type="success" title="复制链接" icon="el-icon-document-copy" v-if="scope.row.status == 1" @click="copyUrl(scope.row.registerUrl)" circle></el-button>
          <el-button size="mini" type="danger" title="审核不通过" icon="el-icon-close" v-if="scope.row.status == 0 || scope.row.status == 1"  @click="addToBlacklist(scope.row)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
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
        <el-form :model="form" ref="form">
          <el-form-item label="名字" label-width="100px">
            <el-input v-model="form.name" placeholder="请输入名字"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="100px">
            <el-input v-model="form.email" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="Profile Link" label-width="100px">
            <el-input type="textarea" v-model="form.amzProfile" placeholder="请输入Amazon个人链接"></el-input>
          </el-form-item>
          <el-form-item label="账号权限" label-width="100px">
            <el-select v-model="form.reviewPermissions" clearable placeholder="请选择">
              <el-option v-for="item in reviewPermissionOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div  class="demo-drawer__footer">
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
  listUserInvitation,
  sendInviteEmail,
  addToBlacklist
} from "api/reviewer/user/userInvitation";
import {
  getWebsiteList,
  checkServerSelected,
  itemTypeOptions,
  formatJson,
  reviewPermissionOptions
} from "api/reviewer/reviewCommon";
import { mapGetters } from "vuex";
export default {
  name: "userInvitation",
  data() {
    return {
      form: {
        email: undefined,
        status: undefined,
        inviterEmail: undefined,
        reviewPermissions: undefined,
        name: undefined,
        amzProfile: undefined,
        remark: undefined
      },
      list: null,
      total: null,
      listLoading: false,
      fullScreenLoading: false,
      tableHeight: undefined,
      listQuery: {
        inviterEmail: undefined,
        status: undefined,
        email: undefined,
        page: 1,
        limit: 20,
        createDateStart: undefined,
        createDateEnd: undefined
      },
      createDate: undefined,
      dialogFormVisible: false,
      dialogStatus: "",
      userInvitationManager_btn_edit: false,
      userInvitationManager_btn_del: false,
      userInvitationManager_btn_add: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      serverName: undefined,
      reserveServerName: undefined,
      websiteOptions: undefined,
      statusOptions: [
        {label: '审核不通过', value:'-3'},
        {label: "重复邀请", value: '-2'},
        {label: "新建", value: '0'},
        {label: "已邀请未注册", value: '1'},
        {label: "已注册", value: '2'},
        {label: "完成首单", value: '4'},
        {label: "奖励发放中", value: '6'},
        {label: "领取首单奖励", value: '5'}
      ],
      sendEmailForm: {
        ids: undefined,
        serverName: undefined
      },
      reviewPermissionOptions:[],
      pickerOptions: {
          shortcuts: [{
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
    };
  },
  created() {
    this.getWebsiteList();
    this.userInvitationManager_btn_edit = this.elements[
      "userInvitationManager:btn_edit"
    ];
    this.userInvitationManager_btn_del = this.elements[
      "userInvitationManager:btn_del"
    ];
    this.userInvitationManager_btn_add = this.elements[
      "userInvitationManager:btn_add"
    ];
    this.reviewPermissionOptions = reviewPermissionOptions;
  },
  mounted: function(){
    this.tableHeight = window.innerHeight * 0.85;
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
      this.listQuery.createDateStart = this.createDate ? (this.createDate[0] ? this.$moment(this.createDate[0]).format("YYYY-MM-DD")  : undefined) : undefined;
      this.listQuery.createDateEnd = this.createDate ? (this.createDate[1] ? this.$moment(this.createDate[1]).format("YYYY-MM-DD") : undefined) : undefined;
      this.reserveServerName = this.serverName;
      this.listLoading = true;
      listUserInvitation(this.serverName, this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      }).catch(error => {
        this.listLoading = false;
        this.$message.error(JSON.stringify(error));
      });
    },
    handleFilter() {
      this.getList();
    },
    handleClear() {
      this.listQuery.email = undefined;
      this.listQuery.status = undefined;
      this.listQuery.createUserName = undefined;
      this.getList();
    },
    handleSendEmail() {
      let selection = this.$refs.elementTable.selection;
      let idArray = [];
      for (let i = 0, length = selection.length; i <= length - 1; i++) {
        idArray.push(selection[i].id);
      }
      let ids = idArray.join();
      if(ids.length < 1) {
        this.$message.error("请勾选需要发送邀请邮件的数据");
        return false;
      }
      this.sendEmailForm.ids = ids;
      this.sendEmailForm.serverName = this.reserveServerName;
      this.fullScreenLoading = true;
      sendInviteEmail(this.reserveServerName, this.sendEmailForm).then(response => {
        this.fullScreenLoading = false;
        if (response.resCode != 200) {
           this.$notify({
            title: "失败",
            message: response.resDes,
            type: 'error'
          });
        } else {
          this.$notify({
            title: "成功",
            message: '发送成功！',
            type: "success"
          });
          this.getList();
        }
      }).catch(error => {
        this.fullScreenLoading = false;
        this.$message.error(JSON.stringify(error));
      })
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
      getObj(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
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
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.reserveServerName, this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    addToBlacklist (row) {
      addToBlacklist(this.reserveServerName, row.id).then(resp => {
            if (resp.resCode != 200) {
              this.$notify({
                title: '失败',
                message: resp.resDes,
                type: 'error',
                duration: 2000
              });
            } else {
              this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
              this.getList();
            }
            this.fullscreenLoading = false;
          }).catch(error => {
            this.$message.error(JSON.stringify(error));
            this.fullscreenLoading = false;
          })
    },
    /**
     * 获取站点列表
     */
    getWebsiteList() {
      getWebsiteList().then(response => {
        this.websiteOptions = response.data.rows;
      }).catch(error => {
        this.$message.error(JSON.stringify(error));
      });
    },
    /**
     * 复制注册链接
     */
    copyUrl(registerUrl) {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.setAttribute('value',registerUrl);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      document.body.removeChild(input);
      this.$message.success("复制成功！");
    },
    exportUserInvitation () {
      if (!checkServerSelected(this.serverName)) {
        this.$notify({
          title: "失败",
          message: '请选择目标站点',
          type: "error"
        });
        return false;
      }
      let exportQuery= {
        page: 1,
        limit: 6000,
        inviterEmail: this.listQuery.inviterEmail,
        status: this.listQuery.status,
        email: this.listQuery.email,
        createDateStart: this.createDate ? (this.createDate[0] ? this.$moment(this.createDate[0]).format("YYYY-MM-DD")  : undefined) : undefined,
        createDateEnd: this.createDate ? (this.createDate[1] ? this.$moment(this.createDate[1]).format("YYYY-MM-DD") : undefined) : undefined
      }
      this.fullscreenLoading = true;
      listUserInvitation(this.serverName, exportQuery).then(response => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['邮箱','留评权限','状态*','邀请人邮箱', '注册链接','有效期','创建人','创建时间'];
          const filterVal = ['email','reviewPermissionsStr','statusStr','inviterEmail','registerUrl','expiredDate','createUserName','createDate'];
          const list = response.data.rows;
          const data = formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'user-invitation-list',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
        this.fullscreenLoading = false;
      });
      this.exportDialogVisible = false;
    },
  }
};
</script>
<style lang="scss" scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
  }
  .filter-container {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
</style>
