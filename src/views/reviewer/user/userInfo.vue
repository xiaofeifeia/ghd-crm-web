<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        class="filter-item"
        placeholder="姓名或账户"
        v-model="listQuery.name"
      ></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button
        class="filter-item"
        v-if="userInfoManager_btn_add"
        style="margin-left: 10px;"
        @click="handleCreate"
        type="primary"
        icon="edit"
      >添加</el-button>
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
      <el-table-column width="200px" align="center" label="登录账号">
        <template slot-scope="scope">
          <span>{{scope.row.accountNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label>
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="登录密码">
        <template slot-scope="scope">
          <span>{{scope.row.password}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="角色类型：1=买家；2=卖家">
        <template slot-scope="scope">
          <span>{{scope.row.roleType}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="密码加密salt">
        <template slot-scope="scope">
          <span>{{scope.row.salt}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="状态：1=活跃；2=非活跃；3=待审核">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="语言[zh_CN:简体中文;en_US:英语;de:德语]">
        <template slot-scope="scope">
          <span>{{scope.row.language}}</span>
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
            v-if="userInfoManager_btn_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="userInfoManager_btn_del"
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
        <el-form-item label="登录账号" prop="accountNo">
          <el-input v-model="form.accountNo" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label prop="email">
          <el-input v-model="form.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="角色类型：1=买家；2=卖家" prop="roleType">
          <el-input v-model="form.roleType" placeholder="请输入角色类型：1=买家；2=卖家"></el-input>
        </el-form-item>
        <el-form-item label="密码加密salt" prop="salt">
          <el-input v-model="form.salt" placeholder="请输入密码加密salt"></el-input>
        </el-form-item>
        <el-form-item label="状态：1=活跃；2=非活跃；3=待审核" prop="status">
          <el-input v-model="form.status" placeholder="请输入状态：1=活跃；2=非活跃；3=待审核"></el-input>
        </el-form-item>
        <el-form-item label="语言[zh_CN:简体中文;en_US:英语;de:德语]" prop="language">
          <el-input v-model="form.language" placeholder="请输入语言[zh_CN:简体中文;en_US:英语;de:德语]"></el-input>
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
} from "api/reviewer/user/userInfo";
import { mapGetters } from "vuex";
export default {
  name: "userInfo",
  data() {
    return {
      form: {
        accountNo: undefined,
        email: undefined,
        password: undefined,
        roleType: undefined,
        salt: undefined,
        status: undefined,
        language: undefined,
        createBy: undefined,
        createDate: undefined,
        updateBy: undefined,
        updateDate: undefined
      },
      rules: {
        accountNo: [
          {
            required: true,
            message: "请输入登录账号",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        roleType: [
          {
            required: true,
            message: "请输入角色类型：1=买家；2=卖家",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        salt: [
          {
            required: true,
            message: "请输入密码加密salt",
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
            message: "请输入状态：1=活跃；2=非活跃；3=待审核",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        language: [
          {
            required: true,
            message: "请输入语言[zh_CN:简体中文;en_US:英语;de:德语]",
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      userInfoManager_btn_edit: false,
      userInfoManager_btn_del: false,
      userInfoManager_btn_add: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0
    };
  },
  created() {
    this.getList();
    this.userInfoManager_btn_edit = this.elements["userInfoManager:btn_edit"];
    this.userInfoManager_btn_del = this.elements["userInfoManager:btn_del"];
    this.userInfoManager_btn_add = this.elements["userInfoManager:btn_add"];
  },
  computed: {
    ...mapGetters(["elements"])
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
    }
  }
};
</script>
