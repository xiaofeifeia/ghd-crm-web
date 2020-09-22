<template>
  <div class="app-container calendar-list-container" v-loading="fullscreenLoading">
    <div class="filter-container" >
      <el-form
        v-model="listQuery"
        label-width="100px"
        class="form-el-all"
        @keyup.enter.native="handleFilter"
        style="display: flex; flex-wrap: wrap;margin-bottom: 10px;"
      >
        <el-form-item label="站点" prop="website" v-if="invitationManager_btn_sendEmail">
          <el-select v-model="listQuery.serverName" clearable placeholder="请选择">
            <el-option v-for="item in websiteOptions" :key="item.serverName" :label="item.websiteName" :value="item.serverName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-select v-model="listQuery.countryCode" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in countryList"
              :key="item.countryCode"
              :label="item.countryCode"
              :value="item.countryCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客人邮箱">
          <el-input
            @keyup.enter.native="handleFilter"
            clearable
            class="filter-item"
            placeholder="请输入"
            v-model="listQuery.email"
          ></el-input>
        </el-form-item>
        <el-form-item label="直接邀请人">
          <el-input
            @keyup.enter.native="handleFilter"
            clearable
            class="filter-item"
            placeholder="请输入"
            v-model="listQuery.inviterEmail"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="text-align: center">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter" >搜索</el-button>
            <el-button class="filter-item" v-waves type="primary" icon="el-icon-download" @click="exportTpl">下载模板</el-button>
            <el-upload class="filter-item"  ref="uploadFile" :before-upload="BeforeUpload" action="/api/reviewer/reviewerUserInvitation/importData"
                      :headers="headers" name="excel" :auto-upload='true' :data="{userId: getUserId()}" :limit="1" :on-success="uploadSuccess"
                      :on-error="uploadError" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
            <el-button style="margin-left: 10px;" v-waves type="primary" icon="el-icon-upload">导入</el-button>
            </el-upload>
            <el-button class="filter-item" v-if="invitationManager_btn_export" v-waves type="primary" icon="el-icon-download" @click="exportUserInvitation">导出</el-button>

            <el-button class="filter-item" type="primary" style="margin-left:10px;" v-waves icon="el-icon-plus" @click="handleCreate">添加</el-button>
            <el-button class="filter-item" v-if="invitationManager_btn_sendEmail" type="primary" v-waves icon="el-icon-share" @click="transferReviewer">调拨</el-button>
          </div>
        </el-form-item>
      </el-form>

    </div>
    <el-table :key="tableKey" :data="list" ref="elementTable" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="tableHeight">
      <el-table-column fixed="left" type="selection" width="55"></el-table-column>
      <el-table-column width="80px" align="center" label="国家">
        <template slot-scope="scope">
          <span>{{scope.row.countryCode}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
       <el-table-column width="120px" align="center" label="状态" :formatter="formatStatus"></el-table-column>
      <el-table-column width="200px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="站点" v-if="invitationManager_btn_sendEmail">
        <template slot-scope="scope">
          <span>{{scope.row.website}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邀请人">
        <template slot-scope="scope">
          <span>{{scope.row.inviterEmail}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邀请人站点" v-if="invitationManager_btn_sendEmail">
        <template slot-scope="scope">
          <span>{{scope.row.inviterWebsite}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="上级邀请人">
        <template slot-scope="scope">
          <span>{{scope.row.parentInviterEmail}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="账号权限">
        <template slot-scope="scope">
          <span>{{scope.row.reviewPermissionStr}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="amazon profile" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.amzProfile}}</span>
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
      <el-table-column width="200px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.registerDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialogDrag>
      <el-form :model="form" :rules="rules" ref="form" label-width="130px">
        <el-form-item label="国家" prop="countryCode">
          <el-select v-model="form.countryCode" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in countryList"
              :key="item.countryCode"
              :label="item.countryCode"
              :value="item.countryCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="amazon profile" prop="amzProfile">
          <el-input v-model="form.amzProfile" placeholder="请输入amazon profile"></el-input>
        </el-form-item>
        <el-form-item label="邀请人邮箱" prop="inviterEmail">
          <el-input v-model="form.inviterEmail" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="账号权限" prop="reviewPermission">
          <el-select v-model="form.reviewPermission" clearable placeholder="请选择" class="filter-item">
            <el-option v-for="item in reviewPermissionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-select v-model="form.status" clearable placeholder="请选择" class="filter-item" disabled="true">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           "
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 导入失败提醒框 -->
    <el-dialog title="导入失败" :visible.sync="uploadDialogVisible" width="80%">
      <el-table :data="importErrorList" border fit highlight-current-row>
        <el-table-column width="200px" align="center" label="错误信息" >
          <template slot-scope="scope"><span>{{scope.row.errorRemark}}</span></template>
        </el-table-column>
        <el-table-column width="80px" align="center" label="*国家">
          <template slot-scope="scope"><span>{{scope.row.countryCode}}</span></template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="*客人邮箱">
          <template slot-scope="scope"><span>{{scope.row.email}}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="客人姓名">
          <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="电话">
          <template slot-scope="scope"><span>{{scope.row.phone}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="amazon profile">
          <template slot-scope="scope"><span>{{scope.row.amzProfile}}</span></template>
        </el-table-column>
         <el-table-column width="150px" align="center" label="*邀请人邮箱">
          <template slot-scope="scope"><span>{{scope.row.inviterEmail}}</span></template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="*账号权限">
          <template slot-scope="scope"><span>{{scope.row.reviewPermissionStr}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="备注">
          <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="客人调拨" :visible.sync="sendEmailDialogVisible">
      <el-form :model="reviewerEmailForm" ref="reviewerEmailForm" :rules="sendEmailRules">
        <el-form-item label="站点" prop="website">
          <el-select v-model="reviewerEmailForm.serverName" clearable placeholder="请选择">
            <el-option v-for="item in websiteOptions" :key="item.serverName" :label="item.websiteName" :value="item.serverName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="sendEmailDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="transfer">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  transfer
} from "api/reviewer/common/reviewerUserInvitation";
import {countryPage} from "api/admin/country";
import { mapGetters } from "vuex";
import Cookies from 'js-cookie';
import {
  formatJson,
  getWebsiteList,
  reviewPermissionOptions
} from "api/reviewer/reviewCommon";
export default {
  name: "reviewerUserInvitation",
  data() {
    return {
      form: {
        countryCode: undefined,
        email: undefined,
        name: undefined,
        phone: undefined,
        amzProfile: undefined,
        inviterEmail: undefined,
        reviewPermission: undefined,
        status: undefined,
        createUserId: undefined,
        createDate: undefined,
        updateUserId: undefined,
        updateDate: undefined,
        remark: undefined
      },
      reviewerEmailForm: {
        ids: undefined,
        serverName: undefined
      },
      reviewPermissionOptions: [],
      rules: {
        countryCode: [
          {
            required: true,
            message: "请选择国家",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          }, {
            min: 3,
            max: 128,
            message: "长度在 3 到 128 个字符",
            trigger: "blur"
          },{
              pattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/,
              message: '邮箱格式不合法'
          }
        ],
        inviterEmail: [
          {
            required: true,
            message: "请输入邀请人邮箱",
            trigger: "blur"
          },{
            min: 3,
            max: 128,
            message: "长度在 3 到 128 个字符",
            trigger: "blur"
          },{
            pattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/,
            message: '邀请人邮箱格式不合法'
          }
        ],
        reviewPermission: [
          {
            required: true,
            message: "请选择是否允许留评",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ]
      },
      sendEmailRules: {
        serverName: [
          {
            required: true,
            message: "请选择站点",
            trigger: "blur"
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        email: undefined,
        inviterEmail: undefined,
        countryCode: undefined,
        serverName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      tableHeight: undefined,
      invitationManager_btn_export: false,
      invitationManager_btn_sendEmail: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      statusOptions:
      [{value: 0,label: "新建"},
      { value: 1,label: "邀请未注册" },
      { value: 2, label: "已注册"},
      { value: 4, label: "已调拨"},
      { value: -1, label: "删除"}],
      websiteOptions: undefined,
      importErrorList: [],
      uploadDialogVisible: false,
      sendEmailDialogVisible: false,
      fullscreenLoading: false,
      countryList: [],
      isWebsiteAdmin: false
    };
  },
  created() {
    this.getList();
    this.invitationManager_btn_export = this.elements['invitationManager:btn_export'];
    this.invitationManager_btn_sendEmail = this.elements['invitationManager:btn_sendEmail'];
    if (this.invitationManager_btn_sendEmail) {
      this.getWebsiteList();
    }
    this.getcountryList();
    this.reviewPermissionOptions = reviewPermissionOptions;
  },
  mounted: function(){
    this.tableHeight = window.innerHeight * 0.85;
  },
  computed: {
    ...mapGetters(['elements','groups','name']),
    headers(){
      return {
        'Authorization': Cookies.get('Admin-Token')
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
    handleClear() {
      this.listQuery.status = undefined;
      this.listQuery.email = undefined;
      this.listQuery.inviterEmail = undefined;
      this.listQuery.countryCode = undefined;
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
      this.form.status = 0;
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
    transferReviewer() {
      this.reviewerEmailForm.serverName = undefined;
      this.sendEmailDialogVisible = true;
    },
    transfer() {
      let selection = this.$refs.elementTable.selection;
      if (!selection || selection.length < 1 || !this.reviewerEmailForm.serverName) {
        this.$notify({
          title: "失败",
          message: "请选择调拨站点和勾选需要调拨的客人信息！",
          type: "error"
        });
        return false;
      }
      let websiteCountry = undefined;
      let selectWebsite = undefined;
      for (let i = 0; i < this.websiteOptions.length; i++) {
        let obj = this.websiteOptions[i];
        if (obj.serverName === this.reviewerEmailForm.serverName) {
          websiteCountry = obj.country;
          selectWebsite = obj.website;
          break;
        }
      }
      let idArray = [];
      for (let i = 0; i < selection.length; i++) {
        let obj = selection[i];
        if (obj.status != 0) {
          this.$notify({
            title: "失败",
            message: "请选择新建状态的数据进行调拨！",
            type: "error"
          });
          return false;
        }
        if (obj.inviterWebsite && obj.inviterWebsite !== selectWebsite) {
          this.$notify({
            title: "失败",
            message: "用户只能调拨到邀请人所在站点！",
            type: "error"
          });
          return false;
        }
        if (obj.countryCode !== websiteCountry) {
          this.$notify({
            title: "失败",
            message: "客人国家和站点国家不匹配！",
            type: "error"
          });
          return false;
        }
        idArray.push(obj.id);
      }
      this.reviewerEmailForm.ids = idArray.join();
      this.$refs.reviewerEmailForm.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true;
          transfer(this.reviewerEmailForm).then(response => {
            if (response.resCode === 200) {
              this.$notify({
                title: "成功",
                message: "调拨成功！",
                type: "success",
                duration: 2000
              });
              this.getList();
            } else {
              this.$notify({
                title: "失败",
                message: response.resDes,
                type: "error",
                duration: 2000
              });
            }
            this.sendEmailDialogVisible = false;
            this.fullscreenLoading = false;
          }).catch(error => {
            this.fullscreenLoading = false;
            this.$message.error(JSON.stringify(error));
          });
        }
      })
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(res => {
             if (res.resCode === 200) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
              this.dialogFormVisible = false;
            } else {
              this.$notify({
                title: "失败",
                message: res.resDes,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      if (!formName) {
        formName = 'form';
      }
      set[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(res => {
            if (res.resCode === 200) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.resDes,
                type: "error"
              });
            }
            this.dialogFormVisible = false;

          });
        } else {
          return false;
        }
      });
    },
    formatStatus(row, column) {
      switch (row.status) {
        case -1:
          return "删除";
          break;
        case 0:
          return "新建";
          break;
        case 1:
          return "邀请未注册";
          break;
        case 2:
          return "已注册";
          break;
        case 3:
          return "无兴趣";
          break;
        case 4:
          return "已调拨";
          break;
        default:
          return "未知";
      }
    },
    exportTpl()  {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['*国家','*客人邮箱','客人姓名', '电话','amazon profile','*邀请人邮箱','*账号权限(不限制/仅免评产品/仅留评产品)','备注'];
        const data = [];
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'user-invitation-tpl',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    exportUserInvitation () {
      let exportQuery= {
        page: 1,
        limit: 6000,
        status: 4,
        status: this.listQuery.status,
        email: this.listQuery.email,
        inviterEmail: this.listQuery.inviterEmail
      }
      this.fullscreenLoading = true;
      page(exportQuery).then(response => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['国家','分配站点','客人邮箱*','客人姓名', '电话','amazon profile','邀请人','上级邀请人','是否允许留评','状态','备注','创建人','创建时间'];
          const filterVal = ['countryCode','website','email','name','phone','amzProfile','inviterEmail','parentInviterEmail','reviewPermissionStr','statusStr','remark','createUserName','createDate'];
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
    BeforeUpload(file) {
      this.fullscreenLoading=true;
      // 文件类型检验
      if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
        this.$message.error('请上传excel文件');
        this.fullscreenLoading = false;
        return false;
      }
    },
    uploadSuccess(response) {
      this.$refs.uploadFile.clearFiles();
      this.fullscreenLoading=false;
      if (response.resCode != 200) {
        this.$message.error(response.resDes);
        this.importErrorList = response.data;
        this.uploadDialogVisible = true;
      } else {
        this.$message.success("导入成功");
        this.getList();
      }
    },
    uploadError(error) {
      this.fullscreenLoading = false;
      this.$message.error('导入失败，请检查excel或联系IT人员');
    },
    getUserId() {
      let userId = Cookies.get('UserId');
      return userId;
    },
    getcountryList() {
      let queryObj = {
        page: 1,
        limit: 200,
        status: 1
      }
      countryPage(queryObj).then(response => {
        this.countryList = response.data.rows;
      });
    },
    getWebsiteList() {
      getWebsiteList().then(response => {
        this.websiteOptions = response.data.rows;
      }).catch(error => {
        this.$message.error(JSON.stringify(error));
      });
    }
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
