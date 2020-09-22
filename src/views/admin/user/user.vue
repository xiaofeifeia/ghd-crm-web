<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item"  v-if="userManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" fit highlight-current-row style="width: 100%"
            :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
    <el-table-column align="center" label="序号">
      <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
    </el-table-column>
    <el-table-column align="center" label="姓名">
      <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
    </el-table-column>
    <el-table-column align="center" label="账户">
      <template slot-scope="scope"><span>{{scope.row.username}}</span></template>
    </el-table-column>
       <el-table-column align="center" label="邮箱" width="200px">
         <template slot-scope="scope"><span>{{scope.row.email}}</span></template>
       </el-table-column>
    <el-table-column align="center" label="性别">
      <template slot-scope="scope"><span>{{scope.row.sex}}</span></template>
    </el-table-column>
    <el-table-column align="center" label="备注" width="250px">
      <template slot-scope="scope"><span>{{scope.row.description}}</span></template>
    </el-table-column>
    <el-table-column align="center" label="最后时间">
      <template slot-scope="scope"><span>{{scope.row.updTime}}</span></template>
    </el-table-column>
    <el-table-column align="center" label="最后更新人">
      <template slot-scope="scope"><span>{{scope.row.updName}}</span></template>
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <el-button v-if="userManager_btn_edit" size="mini" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button v-if="userManager_btn_del" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="用户管理" name="first">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="账户" prop="username">
            <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
            <el-input v-else v-model="form.username" placeholder="请输入账户" readonly></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-if="dialogStatus == 'create'" v-model="form.email" placeholder="请输入邮箱"></el-input>
            <el-input v-else v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
              <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.description"> </el-input>
          </el-form-item>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="修改密码" name="second" v-if="dialogStatus ==='update' || dialogStatus ==='changePassword'">
        <el-form  ref="form1" label-width="100px" >
          <el-form-item  label="新密码" prop="name">
            <el-input type="password" v-model="newPassword" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item  label="确认新密码" prop="name">
            <el-input type="password" v-model="confirmPassword" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus == 'create'" type="primary" @click="create('form')">确定</el-button>
      <el-button v-else-if="dialogStatus == 'changePassword'" type="primary" @click="changePassword()">确定</el-button>
      <el-button v-else type="primary" @click="update('form')">确定</el-button>
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
} from 'api/admin/user/user';
import { mapGetters } from 'vuex';
import fetch from 'utils/fetch';
export default {
  name: 'user',
  data() {
    return {
      form: {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined,
        email: undefined
      },
      rules: {
        name: [{required: true, message: '请输入用户', trigger: 'blur'}, {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}],
        username: [{required: true, message: '请输入账户', trigger: 'blur'}, {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'}, {min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur'},{pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, message: '您的电子邮件格式不正确，请重新输入！'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}, {min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: false,
      userManager_btn_del: false,
      userManager_btn_add: false,
      textMap: {update: '编辑', create: '创建'},
      tableKey: 0,
      tableHeight: undefined,
      activeName: "first",
      newPassword:'',
      confirmPassword:''
    }
  },
  created() {
    this.getList();
    this.userManager_btn_edit = this.elements['userManager:btn_edit'];
    this.userManager_btn_del = this.elements['userManager:btn_del'];
    this.userManager_btn_add = this.elements['userManager:btn_add'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  mounted() {
    this.tableHeight = window.innerHeight * 0.76;
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
      this.$refs[formName].resetFields();
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
              message: '修改成功',
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
    },
    handleTabClick(tab, event) {
      if (this.activeName === 'second') {
        this.dialogStatus = 'changePassword';
        this.newPassword = '';
        this.confirmPassword = '';
      } else if (this.activeName === 'first') {
        if (this.dialogStatus !== 'create' ) {
           this.dialogStatus = 'update';
        }
      }
    },
    // 修改密码
    changePassword () {
      if (!this.newPassword || !this.confirmPassword || this.newPassword !== this.confirmPassword) {
        this.$message.error('操作失败，两次输入的密码不一致！');
        return false;
      }
      if (this.newPassword.length < 5) {
        this.$message.error('操作失败，新密码至少为五个字符！');
        return false;
      }
      let obj = {
        newPassword: this.newPassword,
        targetUserId: this.form.id
      }
      let params ={
        url: '/api/admin/user/updatePassword',
        method: 'post',
        data: obj
      }
      fetch(params).then(() => {
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        });
      }).catch(error => {
        console.log(error);
        this.$message.error(error);
      });
    }
  }
}
</script>
