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
          <el-button v-if="serverName" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
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
      <el-table-column width="200px" align="center" label="类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" disabled>
            <el-option v-for="item in itemTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="项目">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="400px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="分值">
        <template slot-scope="scope">
          <span>{{scope.row.points}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="状态">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" disabled>
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
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
        <el-form-item label="类型" prop="type">
           <el-select v-model="form.type" clearable>
            <el-option v-for="item in itemTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="分值" prop="points">
          <el-input v-model="form.points" placeholder="请输入分值"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
           <el-select v-model="form.status" clearable>
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
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
} from "api/reviewer/points/memberPointsItem";
import {
  getWebsiteList,
  checkServerSelected
} from "api/reviewer/points/memberPointsAccount";
import { mapGetters } from "vuex";
export default {
  name: "memberPointsItem",
  data() {
    return {
      form: {
        type: undefined,
        code: undefined,
        name: undefined,
        description: undefined,
        points: undefined,
        status: undefined,
        remark: undefined,
        createDate: undefined,
        createBy: undefined,
        updateDate: undefined,
        updateBy: undefined
      },
      rules: {
        type: [{
            required: true,
            message: "请选择积分类型",
            trigger: "blur"
          }],
        name: [ {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur"
          }
        ],
        description: [{
            required: true,
            message: "请输入描述",
            trigger: "blur"
          },
          {
            min: 1,
            max: 255,
            message: "长度在 1 到 255 个字符",
            trigger: "blur"
          }
        ],
        points: [{
            required: true,
            message: "请输入分值",
            trigger: "blur"
          },{
            pattern: /^-?[1-9]\d*$/,
            message: '只能输入整数！'
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
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      memberPointsItemManager_btn_edit: false,
      memberPointsItemManager_btn_del: false,
      memberPointsItemManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      serverName: undefined,
      websiteOptions: undefined,
      status: [{
        value: -1,
        label: '禁用'
      }, {
        value: 1,
        label: '启用'
      }],
      itemTypes: [{
        value: 1,
        label: '获取'
      }, {
        value: 2,
        label: '消费'
      }]
    };
  },
  created() {
    this.getWebsiteList();
    this.memberPointsItemManager_btn_edit = this.elements[
      "memberPointsItemManager:btn_edit"
    ];
    this.memberPointsItemManager_btn_del = this.elements[
      "memberPointsItemManager:btn_del"
    ];
    this.memberPointsItemManager_btn_add = this.elements[
      "memberPointsItemManager:btn_add"
    ];
  },
  computed: {
    ...mapGetters(["elements"])
  },
  methods: {
    getList() {
      if (!checkServerSelected(this.serverName)) {
        this.$message.warning('操作失败，目标站点不能为空！');
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
      if (!checkServerSelected(this.serverName)) {
        this.$message.error('操作失败，目标站点不能为空！');
        return false;
      }
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      if (!checkServerSelected(this.serverName)) {
        this.$message.error('操作失败，目标站点不能为空！');
        return false;
      }
      getObj(this.serverName, row.id).then(response => {
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
        delObj(this.serverName, row.id).then(() => {
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
          addObj(this.serverName, this.form).then(() => {
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
          putObj(this.serverName, this.form.id, this.form).then(() => {
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
        type: undefined,
        code: undefined,
        name: undefined,
        description: undefined,
        points: undefined,
        status: undefined,
        remark: undefined,
        createDate: undefined,
        createBy: undefined,
        updateDate: undefined,
        updateBy: undefined
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
</style>