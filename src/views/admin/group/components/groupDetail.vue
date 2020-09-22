<template>
<el-row>
  <el-col :span="24">
    <el-button-group>
      <el-button type="primary" v-if="groupManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
      <el-button type="primary" v-if="groupManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
      <el-button type="primary" v-if="groupManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
      <el-button type="primary" v-if="groupManager_btn_resourceManager" @click="handlerAuthority">
        <icon-svg icon-class="quanxian1"></icon-svg>权限分配</el-button>
    </el-button-group>
  </el-col>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <div :style="tableHeight">
      <el-scrollbar style="height:100%;">
        <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current
                 :props="defaultProps" :filter-node-method="filterNode" ref="groupTree"
                 @node-click="getNodeData" default-expand-all> </el-tree>
      </el-scrollbar>
    </div>
  </el-col>
  <el-col :span="16" >
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" style=" border:1px solid #d1dbe5;margin-top:15px;">
      <el-form-item label="名称" style="margin-top:15px;">
        <el-input v-model="form.name" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="层级">
        <el-input v-model="form.orgLevel" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" v-if="groupManager_btn_edit" @click="update">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" v-if="groupManager_btn_add" @click="create">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <br/>
    <el-form v-if="groupManager_btn_userManager" label-width="80px" style=" border:1px solid #d1dbe5;">
      <div style="margin-top:15px;">
        <el-form-item label="组员" >
          <el-select v-model="memberIds" multiple filterable style="width: 500px"
                     placeholder="请输入关键词" :loading="loading">
            <el-option v-for="(item,index) in memberOptions" :key="index" :label="item.name" :value="item.id"> </el-option>
          </el-select>
          <el-button type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-col>
  <el-dialog title="关联资源" size="large" :visible.sync="dialogAuthorityVisible" v-dialog-drag top="5vh">
    <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
  </el-dialog>
</el-row>
</template>

<script>
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj,
  getUsers,
  modifyUsers
} from 'api/admin/group/group';
import {getAllUser} from 'api/admin/user/user';
import { mapGetters } from 'vuex';
export default {
  name: 'groupDetail',
  components: {
    'group-authority': () => import('./groupAuthority')
  },
  props: {
    type: {
      default: '1'
    }
  },
  data() {
    return {
      tableHeight: 'height: ' + window.innerHeight * 0.70 + 'px',
      filterText: '',
      list: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogUserVisible: false,
      dialogAuthorityVisible: false,
      listQuery: {
        groupType: this.type,
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      groupManager_btn_edit: false,
      groupManager_btn_del: false,
      groupManager_btn_add: false,
      groupManager_btn_userManager: false,
      groupManager_btn_resourceManager: false,
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type,
        orgLevel: undefined
      },
      currentId: -1,
      memberIds: [],
      memberOptions: [],
      loading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getAllUsers();
    this.groupManager_btn_edit = this.elements['groupManager:btn_edit'];
    this.groupManager_btn_del = this.elements['groupManager:btn_del'];
    this.groupManager_btn_add = this.elements['groupManager:btn_add'];
    this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
    this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(data => {
        this.treeData = data;
      });
    },
    getAllUsers() {
      getAllUser().then(response => {
        this.memberOptions = response;
      });
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      getObj(data.id).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;
      // 加载当前节点权限用户
      if (this.currentId) {
        this.initUsers();
      }
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = 'update';
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = 'create';
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList();
          this.resetForm();
          this.onCancel();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        });
      });
    },
    update() {
      putObj(this.form.id, this.form).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    create() {
      addObj(this.form).then(() => {
        this.getList();
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = '';
    },
    resetForm() {
      this.form = {
        parentId: this.currentId,
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      };
    },
    handlerAuthority() {
      this.dialogAuthorityVisible = true;
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId;
        this.$refs.groupAuthority.initAuthoritys();
      }
    },
    closeUserDialog() {
      this.dialogUserVisible = false;
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false;
    },
    onSubmit() {
      const vals = {};
      if (this.memberIds.length > 0) {
        vals.members = this.memberIds.join();
      }
      modifyUsers(this.currentId, vals).then(() => {
        this.$emit('closeUserDialog');
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initUsers() {
      getUsers(this.currentId).then(response => {
        let nodeUsers = response.data.members;
        this.memberIds = [];
        for (let i = 0; i < nodeUsers.length; i++) {
          if (this.memberIds.indexOf(nodeUsers[i].id) === -1) {
            this.memberIds.push(nodeUsers[i].id);
          }
        }
      });
    }
  }
}
</script>
