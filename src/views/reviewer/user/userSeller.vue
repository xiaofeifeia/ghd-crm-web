<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="userSellerManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="id" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="卖家类型[0:普通卖家;1:管理员]">
      <template slot-scope="scope">
        <span>{{scope.row.sellerType}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="用户ID：关联user_info表的id">
      <template slot-scope="scope">
        <span>{{scope.row.userId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="名字">
      <template slot-scope="scope">
        <span>{{scope.row.firstName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="姓">
      <template slot-scope="scope">
        <span>{{scope.row.lastName}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="邮箱">
      <template slot-scope="scope">
        <span>{{scope.row.email}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="国家ID">
      <template slot-scope="scope">
        <span>{{scope.row.countryId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="电话">
      <template slot-scope="scope">
        <span>{{scope.row.phone}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="卖家的店铺名称">
      <template slot-scope="scope">
        <span>{{scope.row.sellerName}}</span>
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
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
        <el-button v-if="userSellerManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="userSellerManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="卖家类型[0:普通卖家;1:管理员]" prop="sellerType">
      <el-input v-model="form.sellerType" placeholder="请输入卖家类型[0:普通卖家;1:管理员]"></el-input>
    </el-form-item>
        <el-form-item label="用户ID：关联user_info表的id" prop="userId">
      <el-input v-model="form.userId" placeholder="请输入用户ID：关联user_info表的id"></el-input>
    </el-form-item>
        <el-form-item label="名字" prop="firstName">
      <el-input v-model="form.firstName" placeholder="请输入名字"></el-input>
    </el-form-item>
        <el-form-item label="姓" prop="lastName">
      <el-input v-model="form.lastName" placeholder="请输入姓"></el-input>
    </el-form-item>
        <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
        <el-form-item label="国家ID" prop="countryId">
      <el-input v-model="form.countryId" placeholder="请输入国家ID"></el-input>
    </el-form-item>
        <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
    </el-form-item>
        <el-form-item label="卖家的店铺名称" prop="sellerName">
      <el-input v-model="form.sellerName" placeholder="请输入卖家的店铺名称"></el-input>
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
  } from 'api/reviewer/user/userSeller';
  import { mapGetters } from 'vuex';
  export default {
    name: 'userSeller',
    data() {
      return {
        form: {
        sellerType : undefined,        userId : undefined,        firstName : undefined,        lastName : undefined,        email : undefined,        countryId : undefined,        phone : undefined,        sellerName : undefined,        createBy : undefined,        createDate : undefined,        updateBy : undefined,        updateDate : undefined          },
        rules: {
    sellerType: [
  {
    required: true,
    message: '请输入卖家类型[0:普通卖家;1:管理员]',
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
    message: '请输入用户ID：关联user_info表的id',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   firstName: [
  {
    required: true,
    message: '请输入名字',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   lastName: [
  {
    required: true,
    message: '请输入姓',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   email: [
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
],   countryId: [
  {
    required: true,
    message: '请输入国家ID',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   phone: [
  {
    required: true,
    message: '请输入电话',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   sellerName: [
  {
    required: true,
    message: '请输入卖家的店铺名称',
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
],   updateBy: [
  {
    required: true,
    message: '请输入更新人',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   updateDate: [
  {
    required: true,
    message: '请输入更新时间',
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
        userSellerManager_btn_edit: false,
        userSellerManager_btn_del: false,
        userSellerManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.userSellerManager_btn_edit = this.elements['userSellerManager:btn_edit'];
      this.userSellerManager_btn_del = this.elements['userSellerManager:btn_del'];
      this.userSellerManager_btn_add = this.elements['userSellerManager:btn_add'];
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
