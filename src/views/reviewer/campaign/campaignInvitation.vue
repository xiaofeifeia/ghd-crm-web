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
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="活动ID">
        <template slot-scope="scope">
          <span>{{scope.row.campaignId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="用户ID(领取人ID)">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邀请码">
        <template slot-scope="scope">
          <span>{{scope.row.invitationCode}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邀请码过期时间">
        <template slot-scope="scope">
          <span>{{scope.row.expiredDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="活动链接">
        <template slot-scope="scope">
          <span>{{scope.row.campaignLink}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邀请码状态#0：首次生成活动链接；1：用户接受了活动邀请">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="活动参与时间">
        <template slot-scope="scope">
          <span>{{scope.row.receiveDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邮件发送标记#0：未发送；1：已发送">
        <template slot-scope="scope">
          <span>{{scope.row.emailSend}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="邮件发送时间">
        <template slot-scope="scope">
          <span>{{scope.row.emailSendDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="campaignInvitationManager_btn_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="campaignInvitationManager_btn_del"
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="活动ID" prop="campaignId">
          <el-input v-model="form.campaignId" placeholder="请输入活动ID"></el-input>
        </el-form-item>
        <el-form-item label="用户ID(领取人ID)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID(领取人ID)"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入邀请码"></el-input>
        </el-form-item>
        <el-form-item label="邀请码过期时间" prop="expiredDate">
          <el-input v-model="form.expiredDate" placeholder="请输入邀请码过期时间"></el-input>
        </el-form-item>
        <el-form-item label="活动链接" prop="campaignLink">
          <el-input v-model="form.campaignLink" placeholder="请输入活动链接"></el-input>
        </el-form-item>
        <el-form-item label="邀请码状态#0：首次生成活动链接；1：用户接受了活动邀请" prop="status">
          <el-input v-model="form.status" placeholder="请输入邀请码状态#0：首次生成活动链接；1：用户接受了活动邀请"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="活动参与时间" prop="receiveDate">
          <el-input v-model="form.receiveDate" placeholder="请输入活动参与时间"></el-input>
        </el-form-item>
        <el-form-item label="邮件发送标记#0：未发送；1：已发送" prop="emailSend">
          <el-input v-model="form.emailSend" placeholder="请输入邮件发送标记#0：未发送；1：已发送"></el-input>
        </el-form-item>
        <el-form-item label="邮件发送时间" prop="emailSendDate">
          <el-input v-model="form.emailSendDate" placeholder="请输入邮件发送时间"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入创建人"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="form.createDate" placeholder="请输入创建时间"></el-input>
        </el-form-item>
        <el-form-item label="更新人" prop="updateBy">
          <el-input v-model="form.updateBy" placeholder="请输入更新人"></el-input>
        </el-form-item>
        <el-form-item label="更新时间" prop="updateDate">
          <el-input v-model="form.updateDate" placeholder="请输入更新时间"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
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
  putObj
} from "api/reviewer/campaign/campaignInvitation";
import {
  getWebsiteList,
  checkServerSelected,
  itemTypeOptions
} from "api/reviewer/reviewCommon";
import { mapGetters } from "vuex";
export default {
  name: "campaignInvitation",
  data() {
    return {
      form: {
        campaignId: undefined,
        userId: undefined,
        invitationCode: undefined,
        expiredDate: undefined,
        campaignLink: undefined,
        status: undefined,
        remark: undefined,
        receiveDate: undefined,
        emailSend: undefined,
        emailSendDate: undefined,
        createBy: undefined,
        createDate: undefined,
        updateBy: undefined,
        updateDate: undefined
      },
      rules: {
        campaignId: [
          {
            required: true,
            message: "请输入活动ID",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        userId: [
          {
            required: true,
            message: "请输入用户ID(领取人ID)",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        invitationCode: [
          {
            required: true,
            message: "请输入邀请码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        expiredDate: [
          {
            required: true,
            message: "请输入邀请码过期时间",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        campaignLink: [
          {
            required: true,
            message: "请输入活动链接",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message:
              "请输入邀请码状态#0：首次生成活动链接；1：用户接受了活动邀请",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        receiveDate: [
          {
            required: true,
            message: "请输入活动参与时间",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        emailSend: [
          {
            required: true,
            message: "请输入邮件发送标记#0：未发送；1：已发送",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        emailSendDate: [
          {
            required: true,
            message: "请输入邮件发送时间",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        createBy: [
          {
            required: true,
            message: "请输入创建人",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        createDate: [
          {
            required: true,
            message: "请输入创建时间",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        updateBy: [
          {
            required: true,
            message: "请输入更新人",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        updateDate: [
          {
            required: true,
            message: "请输入更新时间",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
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
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      campaignInvitationManager_btn_edit: false,
      campaignInvitationManager_btn_del: false,
      campaignInvitationManager_btn_add: false,
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
    this.campaignInvitationManager_btn_edit = this.elements[
      "campaignInvitationManager:btn_edit"
    ];
    this.campaignInvitationManager_btn_del = this.elements[
      "campaignInvitationManager:btn_del"
    ];
    this.campaignInvitationManager_btn_add = this.elements[
      "campaignInvitationManager:btn_add"
    ];
  },
  computed: {
    ...mapGetters(["elements"])
  },
  methods: {
    getList() {
     if (!checkServerSelected(this.serverName)) {
        this.$message.warning("操作失败，目标站点不能为空！");
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
          putObj(this.form.id, this.form).then(() => {
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