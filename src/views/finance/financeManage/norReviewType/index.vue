<template>
  <div class="app-centre">
    <span>非Review类型设置</span>
    <div class="centent-header"/>
    <div>
      <el-card>
        <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
          <div style="font-size:14px">
            已选择<span style="color:#f00">{{$refs.dataTableRef? $refs.dataTableRef.selection.length : 0}}</span>项目
            <el-select v-model="batchOperateType" placeholder="请选择" size="mini" :disabled="!norReviewType_btn_edit">
              <el-option label="批量设置" :value="0"/>
              <el-option label="单价核销金额范围" :value="1"/>
              <el-option label="核销权限" :value="2"/>
              <el-option label="删除" :value="3"/>
            </el-select>
            <el-button size="mini" type="primary" @click="batchOperate" :disabled="batchOperateType===0">应用</el-button>
          </div>

          <div style="display: flex;">
            <el-button size="mini" type="success" @click="openEditTypeDialog({}, 1)"
                       :disabled="!norReviewType_btn_edit" style="margin-right: 10px;">新增类型</el-button>
            <el-input size="mini" placeholder="请输入类型编号、创建人或类型名称搜索"
                      @keyup.native.enter="getList" v-model.trim="search" clearable style="margin-right: 20px;width: 300px;">
              <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
            </el-input>
          </div>
        </div>

        <el-table v-loading="loading" :data="dataList.list" :height="innerHeight*0.68" ref="dataTableRef"
                  :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" style="width: 100%">
          <el-table-column type="selection" width="55px"/>
          <el-table-column label="类型编号" prop="typeNo"/>
          <el-table-column label="创建时间" prop="createDate"/>
          <el-table-column label="创建人" prop="createUserName"/>
          <el-table-column label="类型名称" prop="typeName"/>
          <el-table-column label="单价核销金额范围" prop="priceScope"/>
          <el-table-column label="核销权限" prop="reimburserStr"/>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <span v-if="row.status===1">{{row.statusStr}}</span>
              <span v-else style="color: red">{{row.statusStr}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="235px">
            <template slot-scope="{row}">
              <el-button v-if="norReviewType_btn_edit" v-waves size="mini" type="primary" @click="openEditTypeDialog(row, 2)">编辑</el-button>
              <el-button v-if="norReviewType_btn_edit" v-waves size="mini" type="danger" @click="deleteType(row)">删除</el-button>
              <el-button v-if="norReviewType_btn_edit && row.status===1" v-waves size="mini" type="info" @click="changeStatus(row, 0)">停用</el-button>
              <el-button v-if="norReviewType_btn_edit && row.status===0" v-waves size="mini" type="success" @click="changeStatus(row, 1)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
          <el-pagination style="text-align: right; margin: 10px 0"
            background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,30,50]"
            :page-size.sync="pages.limit" :current-page.sync="pages.page" :total="dataList.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
      </el-card>
    </div>

    <el-dialog title="类型编辑" :visible.sync="editTypeDialogVisible" width="500px" v-dialog-drag>
        <div style="margin-bottom: 10px">
          <span>类型名称:</span>
          <el-input v-model="norReviewType.typeName" size="mini" placeholder="请输入类型名称" style="width: 300px"/>
        </div>
        <hr/>
        <div style="margin-bottom: 10px">
          <div>请输入金额范围(人民币):</div>
          <div style="font-size: 13px;color: #FF0000">清空不填即为"无限制"</div>
          <div style="margin-bottom: 10px">最小值:<el-input v-model="norReviewType.lowestPrice" size="mini" placeholder="请输入金额最小值" style="width: 300px"/>元</div>
          <div style="margin-bottom: 10px">最大值:<el-input v-model="norReviewType.highestPrice" size="mini" placeholder="请输入金额最大值" style="width: 300px"/>元</div>
          <span style="color: dodgerblue;cursor: pointer" @click="clearPriceScope">清空数值</span>
        </div>
        <hr />
        <div style="margin-bottom: 10px">
          <div>请输入权限人:</div>
          <div style="font-size: 13px;color: #FF0000">清空不填即为"全部"人可使用</div>
          <div style="margin-bottom: 10px"><el-input v-model="norReviewType.reimburser" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"
                         placeholder="请输入需要配置权限用户的英文全名，多个用户用英文逗号隔开"/></div>
          <span style="color: dodgerblue;cursor: pointer" @click="norReviewType.reimburser=''">清空数值</span>
        </div>
        <div style="text-align: center">
          <el-button type="primary" @click="editNorReviewType">确认</el-button>
          <el-button @click="editTypeDialogVisible=false">取消</el-button>
        </div>
    </el-dialog>

    <el-dialog :visible.sync="editPriceScopeDialogVisible" width="500px" v-dialog-drag>
      <div style="margin-bottom: 10px">
        <div>请输入金额范围(人民币):</div>
        <div style="font-size: 13px;color: #FF0000">清空不填即为"无限制"</div>
        <div style="margin-bottom: 10px">最小值:<el-input v-model="norReviewType.lowestPrice" size="mini" placeholder="请输入金额最小值" style="width: 300px"/>元</div>
        <div style="margin-bottom: 10px">最大值:<el-input v-model="norReviewType.highestPrice" size="mini" placeholder="请输入金额最大值" style="width: 300px"/>元</div>
        <span style="color: dodgerblue;cursor: pointer" @click="clearPriceScope">清空数值</span>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="batchEditType">确认</el-button>
        <el-button @click="editPriceScopeDialogVisible=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editReimburserDialogVisible" width="500px" v-dialog-drag>
      <div style="margin-bottom: 10px">
        <div>请输入权限人:</div>
        <div style="font-size: 13px;color: #FF0000">清空不填即为"全部"人可使用</div>
        <div style="margin-bottom: 10px"><el-input v-model="norReviewType.reimburser" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"
                                                   placeholder="请输入需要配置权限用户的英文全名，多个用户用英文逗号隔开"/></div>
        <span style="color: dodgerblue;cursor: pointer" @click="norReviewType.reimburser=''">清空数值</span>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="batchEditType">确认</el-button>
        <el-button @click="editReimburserDialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getList,
    edit,
    batchDelete,
    batchEdit,
    changeStatus
  } from '@/api/finance/financeManage/norReviewType';
  import {mapGetters} from 'vuex';

  export default {
    name: 'norReviewType',
    data() {
      return {
        loading: false,
        editTypeDialogVisible: false,
        editPriceScopeDialogVisible: false,
        editReimburserDialogVisible: false,
        norReviewType_btn_edit: false,
        ids: [],
        operateType: 0,
        batchOperateType: 0,
        innerHeight: window.innerHeight,
        dataList: {
          total: 0,
          list: []
        },
        norReviewType: {
          typeName: '',
          lowestPrice: '',
          highestPrice: '',
          reimburser: ''
        },
        search: '',
        pages: {
          page: 1,
          limit: 10
        },
      }
    },
    watch: {},
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    created() {
      this.norReviewType_btn_edit = this.elements['norReviewType:btn_edit'];
      this.getList();
    },
    mounted() {

    },
    methods: {
      async getList() {
        let params = {
          ...this.pages,
          searchText: this.search
        };
        this.loading = true;
        const res = await getList(params);
        this.loading = false;
        this.dataList.list = res.data.rows;
        this.dataList.total = res.data.total;
      },
      async editNorReviewType() {
        let form = {
          ...this.norReviewType,
          type: this.operateType
        };
        this.loading = true;
        const res = await edit(form);
        if (res.resCode === 200) {
          this.editTypeDialogVisible = false;
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.error(res.resDes);
        }
        this.loading = false;
      },
      async batchEditType() {
        let form = {
          ...this.norReviewType,
          idList: this.ids,
          type: this.batchOperateType
        };
        this.loading = true;
        const res = await batchEdit(form);
        if (res.resCode === 200) {
          this.editPriceScopeDialogVisible = false;
          this.editReimburserDialogVisible = false;
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.error(res.resDes);
        }
        this.loading = false;
      },
      deleteType({id}) {
        this.$confirm("是否永久删除这个类型?删除后用户将无法再选择该类型。之前的历史数据不会受到影响。", "操作确认", {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.ids = [id];
          this.deleteByIds();
        }).catch(() => {});
      },
      batchOperate() {
        let selection = this.$refs.dataTableRef.selection;
        if (selection.length === 0) {
          this.$message.error("请勾选单据");
          return;
        }
        this.ids = [];
        for (let i = 0, length = selection.length; i <= length - 1; i++) {
          this.ids.push(selection[i].id);
        }

        if (this.batchOperateType === 1) {
          this.norReviewType = {};
          this.editPriceScopeDialogVisible = true;
        } else if (this.batchOperateType === 2) {
          this.norReviewType = {};
          this.editReimburserDialogVisible = true;
        } else if (this.batchOperateType === 3) {
          this.$confirm("是否永久删除这个类型?删除后用户将无法再选择该类型。之前的历史数据不会受到影响。", "操作确认", {
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(() => {
            this.deleteByIds();
          }).catch(() => {});
        }
      },
      async deleteByIds() {
        let form = {idList: this.ids};
        this.loading = true;
        const res = await batchDelete(form);
        if (res.resCode === 200) {
          this.editTypeDialogVisible = false;
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.error(res.resDes);
        }
        this.loading = false;
      },
      openEditTypeDialog(row, type) {
        this.norReviewType = Object.assign({}, row);
        this.operateType = type;
        this.editTypeDialogVisible = true;
      },
      clearPriceScope() {
        this.norReviewType.lowestPrice = '';
        this.norReviewType.highestPrice = '';
      },
      handleSizeChange(val) {
        this.pages.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.pages.page = val;
        this.getList();
      },
      async changeStatus(row, status) {
        this.loading = true;
        let form = {id: row.id, status: status};
        let response = await changeStatus(form).catch(error => this.$message.error(error));
        if (response.resCode === 200) {
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.error(res.resDes);
        }
        this.loading = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-centre {
    .centent-header {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      height: 19px;
      font-size: 12px;
      & >>> .filter .fil-w {
        right: 0px;
      }
      & >>> .handle-btn {
        color: #333333;
        font-size: 12px;
      }
      .timeDate {
        width: 210px;
      }
    }
  }
</style>
