<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="userOpLogManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="id" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="邮箱">
      <template slot-scope="scope">
        <span>{{scope.row.email}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="用户id">
      <template slot-scope="scope">
        <span>{{scope.row.userId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="用户类型：1=买家；2=卖家">
      <template slot-scope="scope">
        <span>{{scope.row.userType}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="ip地址">
      <template slot-scope="scope">
        <span>{{scope.row.ipAddr}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="操作类型">
      <template slot-scope="scope">
        <span>{{scope.row.opType}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="操作详情">
      <template slot-scope="scope">
        <span>{{scope.row.opDepict}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="备注">
      <template slot-scope="scope">
        <span>{{scope.row.remark}}</span>
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
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
        <el-button v-if="userOpLogManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="userOpLogManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
        <el-form-item label="用户id" prop="userId">
      <el-input v-model="form.userId" placeholder="请输入用户id"></el-input>
    </el-form-item>
        <el-form-item label="用户类型：1=买家；2=卖家" prop="userType">
      <el-input v-model="form.userType" placeholder="请输入用户类型：1=买家；2=卖家"></el-input>
    </el-form-item>
        <el-form-item label="ip地址" prop="ipAddr">
      <el-input v-model="form.ipAddr" placeholder="请输入ip地址"></el-input>
    </el-form-item>
        <el-form-item label="操作类型" prop="opType">
      <el-input v-model="form.opType" placeholder="请输入操作类型"></el-input>
    </el-form-item>
        <el-form-item label="操作详情" prop="opDepict">
      <el-input v-model="form.opDepict" placeholder="请输入操作详情"></el-input>
    </el-form-item>
        <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
    </el-form-item>
        <el-form-item label="创建人" prop="createBy">
      <el-input v-model="form.createBy" placeholder="请输入创建人"></el-input>
    </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
      <el-input v-model="form.createDate" placeholder="请输入创建时间"></el-input>
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
  } from 'api/reviewer/user/userOpLog';
  import { mapGetters } from 'vuex';
  export default {
    name: 'userOpLog',
    data() {
      return {
        form: {
        email : undefined,        userId : undefined,        userType : undefined,        ipAddr : undefined,        opType : undefined,        opDepict : undefined,        remark : undefined,        createBy : undefined,        createDate : undefined          },
        rules: {
    email: [
  {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   userId: [
  {
    required: true,
    message: '请输入用户id',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   userType: [
  {
    required: true,
    message: '请输入用户类型：1=买家；2=卖家',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   ipAddr: [
  {
    required: true,
    message: '请输入ip地址',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   opType: [
  {
    required: true,
    message: '请输入操作类型',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   opDepict: [
  {
    required: true,
    message: '请输入操作详情',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   remark: [
  {
    required: true,
    message: '请输入备注',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   createBy: [
  {
    required: true,
    message: '请输入创建人',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   createDate: [
  {
    required: true,
    message: '请输入创建时间',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
]        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        userOpLogManager_btn_edit: false,
        userOpLogManager_btn_del: false,
        userOpLogManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.userOpLogManager_btn_edit = this.elements['userOpLogManager:btn_edit'];
      this.userOpLogManager_btn_del = this.elements['userOpLogManager:btn_del'];
      this.userOpLogManager_btn_add = this.elements['userOpLogManager:btn_add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
            .then(response => {
          this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
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
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
            .then(response => {
          this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
          delObj(row.id)
      .then(() => {
          this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
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
        addObj(this.form)
        .then(() => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
        });
        })
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
        title: '成功',
        message: '创建成功',
        type: 'success',
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
          sex: '男',
          password: undefined,
          description: undefined
        };
      }
    }
  }
</script>
