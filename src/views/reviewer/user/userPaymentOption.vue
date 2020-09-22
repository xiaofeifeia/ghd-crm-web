<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="userPaymentOptionManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="id" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="用户id">
      <template slot-scope="scope">
        <span>{{scope.row.userId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="支付id">
      <template slot-scope="scope">
        <span>{{scope.row.paymentId}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="账号">
      <template slot-scope="scope">
        <span>{{scope.row.account}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="状态[-1:禁用;1:禁用]">
      <template slot-scope="scope">
        <span>{{scope.row.status}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="是否为默认收款方式[0:否;1:是]">
      <template slot-scope="scope">
        <span>{{scope.row.isDefault}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="">
      <template slot-scope="scope">
        <span>{{scope.row.createBy}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="">
      <template slot-scope="scope">
        <span>{{scope.row.createDate}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="">
      <template slot-scope="scope">
        <span>{{scope.row.updateBy}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="">
      <template slot-scope="scope">
        <span>{{scope.row.updateDate}}</span>
      </template>
    </el-table-column>
        <el-table-column width="200px" align="center" label="">
      <template slot-scope="scope">
        <span>{{scope.row.remark}}</span>
      </template>
    </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
        <el-button v-if="userPaymentOptionManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="userPaymentOptionManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户id" prop="userId">
      <el-input v-model="form.userId" placeholder="请输入用户id"></el-input>
    </el-form-item>
        <el-form-item label="支付id" prop="paymentId">
      <el-input v-model="form.paymentId" placeholder="请输入支付id"></el-input>
    </el-form-item>
        <el-form-item label="账号" prop="account">
      <el-input v-model="form.account" placeholder="请输入账号"></el-input>
    </el-form-item>
        <el-form-item label="状态[-1:禁用;1:禁用]" prop="status">
      <el-input v-model="form.status" placeholder="请输入状态[-1:禁用;1:禁用]"></el-input>
    </el-form-item>
        <el-form-item label="是否为默认收款方式[0:否;1:是]" prop="isDefault">
      <el-input v-model="form.isDefault" placeholder="请输入是否为默认收款方式[0:否;1:是]"></el-input>
    </el-form-item>
        <el-form-item label="" prop="createBy">
      <el-input v-model="form.createBy" placeholder="请输入"></el-input>
    </el-form-item>
        <el-form-item label="" prop="createDate">
      <el-input v-model="form.createDate" placeholder="请输入"></el-input>
    </el-form-item>
        <el-form-item label="" prop="updateBy">
      <el-input v-model="form.updateBy" placeholder="请输入"></el-input>
    </el-form-item>
        <el-form-item label="" prop="updateDate">
      <el-input v-model="form.updateDate" placeholder="请输入"></el-input>
    </el-form-item>
        <el-form-item label="" prop="remark">
      <el-input v-model="form.remark" placeholder="请输入"></el-input>
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
  } from 'api/reviewer/user/userPaymentOption';
  import { mapGetters } from 'vuex';
  export default {
    name: 'userPaymentOption',
    data() {
      return {
        form: {
        userId : undefined,        paymentId : undefined,        account : undefined,        status : undefined,        isDefault : undefined,        createBy : undefined,        createDate : undefined,        updateBy : undefined,        updateDate : undefined,        remark : undefined          },
        rules: {
    userId: [
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
],   paymentId: [
  {
    required: true,
    message: '请输入支付id',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   account: [
  {
    required: true,
    message: '请输入账号',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   status: [
  {
    required: true,
    message: '请输入状态[-1:禁用;1:禁用]',
    trigger: 'blur'
  },
  {
    min: 3,
    max: 20,
    message: '长度在 3 到 20 个字符',
    trigger: 'blur'
  }
],   isDefault: [
  {
    required: true,
    message: '请输入是否为默认收款方式[0:否;1:是]',
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
    message: '请输入',
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
    message: '请输入',
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
    message: '请输入',
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
    message: '请输入',
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
    message: '请输入',
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
        userPaymentOptionManager_btn_edit: false,
        userPaymentOptionManager_btn_del: false,
        userPaymentOptionManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      this.userPaymentOptionManager_btn_edit = this.elements['userPaymentOptionManager:btn_edit'];
      this.userPaymentOptionManager_btn_del = this.elements['userPaymentOptionManager:btn_del'];
      this.userPaymentOptionManager_btn_add = this.elements['userPaymentOptionManager:btn_add'];
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
