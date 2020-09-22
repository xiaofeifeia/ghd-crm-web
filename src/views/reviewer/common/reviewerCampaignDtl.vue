<template>
  <div class="app-container calendar-list-container" v-loading="fullscreenLoading">
    <div>
      <el-form v-model="listQuery" label-width="85px" style="display: flex; flex-wrap: wrap" @keyup.enter.native="handleFilter">
        <el-form-item label="站点" prop="website" v-if="isAdmin">
          <el-select v-model="listQuery.serverName" clearable placeholder="请选择">
            <el-option v-for="item in websiteOptions" :key="item.serverName" :label="item.websiteName" :value="item.serverName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" >
          <el-input v-model="listQuery.campaignNo" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="活动编号" >
          <el-input v-model="listQuery.customizeCampaignNo" clearable placeholder="请输入自定义编号" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>

        <el-form-item label="Asin">
          <el-input @keyup.enter.native="handleFilter" clearable placeholder="请输入" v-model="listQuery.asin"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input @keyup.enter.native="handleFilter" clearable placeholder="请输入" v-model="listQuery.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" clearable placeholder="请选择">
            <el-option
              v-for="item in campaignDtlStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论类型">
          <el-select v-model="listQuery.reviewFlag" clearable placeholder="请选择">
            <el-option v-for="item in reviewType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家" >
          <el-input v-model="listQuery.country" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="组别">
          <el-input v-model="listQuery.salesGroup" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="活动创建人">
          <el-input @keyup.enter.native="handleFilter" clearable placeholder="请输入" v-model="listQuery.createUserName"></el-input>
        </el-form-item>
        <el-form-item label="是否返仓">
          <el-select v-model="listQuery.isReturnWarehouse" placeholder="请选择" clearable >
            <el-option v-for="item in returnWhOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div align="center" style="margin-bottom: 10px">
            <el-button type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button type="primary" v-waves icon="el-icon-check" @click="handleSubmit">提交</el-button>
            <el-button type="primary" v-waves  icon="el-icon-download" style="margin-left: 10px" @click="exportList">导出</el-button>
          </div>
        </el-form-item>
      </el-form>

    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" border fit highlight-current-row
      ref="multipleTable" style="width: 100%" :height="tableHeight" @cell-click="viewImg">
      <el-table-column type="selection" align="center" fixed="left"></el-table-column>
      <el-table-column width="80px" align="center" label="图片" fixed="left">
        <template slot-scope="scope">
          <img :src="scope.row.imgThumbUrl" width="60px" height="60px"/>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.campaignNo}}</span>
        </template>
      </el-table-column>
         <el-table-column width="150px" align="center" label="活动编号">
        <template slot-scope="scope">
          <span>{{scope.row.customizeCampaignNo}}</span>
        </template>
      </el-table-column>
       <el-table-column width="180px" align="center" label="订单号">
        <template slot-scope="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="站点" :v-if="isAdmin">
        <template slot-scope="scope">
          <span>{{scope.row.website}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column width="120px" align="center" label="Asin">
        <template slot-scope="scope">
          <span>{{scope.row.asin}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="发票">
        <template slot-scope="scope">
          <a :href="scope.row.invoiceFileName" target="_blank" v-if="scope.row.invoiceFileName"><el-link>查看<i class="el-icon-view el-icon--right"></i></el-link></a>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="评论类型" :formatter="formatReviewFlag">
      </el-table-column>
      <el-table-column width="100px" align="center" label="星级">
        <template slot-scope="scope">
          <el-button  plain size="small" @click="viewReviewCheck(scope.row)" v-if="scope.row.reviewStar"><span>{{scope.row.reviewStar}} <i class="el-icon-star-off"></i></span></el-button>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="评论截图" >
        <template slot-scope="scope">
          <img :src="scope.row.reviewThumbImg" width="60px" height="60px"/>
        </template>
      </el-table-column>
        <el-table-column width="80px" align="center" label="是否返仓" :formatter="formatReturnWhOption"></el-table-column>
            <el-table-column width="150px" align="center" label="review存活状态" :formatter="formatSurvivalState">
      </el-table-column>
      <el-table-column width="160px" align="center" label="review检测日期">
        <template slot-scope="scope">
          <span>{{scope.row.reviewCheckDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="币别">
        <template slot-scope="scope">
          <span>{{scope.row.currency}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="产品售价">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="订单金额">
        <template slot-scope="scope">
          <span v-if="scope.row.grandTotal - scope.row.price >= 10" > <el-button plain type="danger">{{scope.row.grandTotal}}</el-button></span>
          <span v-else > {{scope.row.grandTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="佣金">
        <template slot-scope="scope">
          <span>{{scope.row.bonus}}</span>
        </template>
      </el-table-column>
         <el-table-column width="100px" align="center" label="手续费">
        <template slot-scope="scope">
          <span>{{scope.row.serviceFee}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="总金额">
        <template slot-scope="scope">
          <span>{{scope.row.totalAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="收款账号" v-if="isAdmin">
        <template slot-scope="scope">
          <span>{{scope.row.paymentAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center"  label="留评日期" :formatter="dateFormat">
      </el-table-column>
      <el-table-column width="120px" align="center" label="申请退款日期" :formatter="dateFormat">
      </el-table-column>
      <el-table-column width="120px" align="center"  label="退款日期" :formatter="dateFormat">
      </el-table-column>
          <el-table-column width="80px" align="center" label="物流单照片" >
        <template slot-scope="scope">
          <img :src="scope.row.courierPicFileNameThumb" width="60px" height="60px"/>
        </template>
      </el-table-column>
          <el-table-column width="80px" align="center" label="Drop Off 照片" >
        <template slot-scope="scope">
          <img :src="scope.row.dropOffPicFileNameThumb" width="60px" height="60px"/>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="国家">
        <template slot-scope="scope">
          <span>{{scope.row.country}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="渠道">
        <template slot-scope="scope">
          <span>{{scope.row.channel}}</span>
        </template>
      </el-table-column>
        <el-table-column width="100px" align="center" label="组别">
        <template slot-scope="scope">
          <span>{{scope.row.salesGroup}}</span>
        </template>
      </el-table-column>
        <el-table-column width="100px" align="center" label="组长">
        <template slot-scope="scope">
          <span>{{scope.row.teamLeader}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Sku">
        <template slot-scope="scope">
          <span>{{scope.row.sku}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="付款账号">
        <template slot-scope="scope">
          <span>{{scope.row.payer}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="活动创建人">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.syncDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="订单打回理由">
        <template slot-scope="scope">
          <span>{{scope.row.rejectionReason}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="120px">
        <template  slot-scope="scope">
          <el-button size="small" type="danger" v-if="scope.row.status === 4" @click="showOpDialog(scope.row,'return')" circle title="打回订单给站点管理员处理"  icon='el-icon-remove-outline'></el-button>
          <el-button size="small" type="danger" v-if="scope.row.status === 11 && isAdmin"  @click="showOpDialog(scope.row,'back')"  circle title="退回订单给客人修改" icon='el-icon-refresh-right'></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" v-if="scope.row.status === 11 && isAdmin"  @click="showOpDialog(scope.row,'cancel')" circle title="取消客人订单"></el-button>
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

     <!-- 订单打回 -->
    <el-dialog :title="opTextMap[opDialogStatus]" :visible.sync="auditFormVisible" :before-close="handleClose">
      <div>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入原因"
          v-model="orderObj.remark"
           style="width:80%"
        ></el-input>
        <el-button size="small" type="danger"   @click="updateOrder()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 提交财务请款 start -->
    <el-dialog title="提交财务付款审批" :visible.sync="submitDialogVisible">
      <el-form>
        <el-form-item label="付款账号">
          <el-select v-model="subimitForm.paypalAccount" placeholder="请选择">
            <el-option v-for="item in payerOptions" :label="item" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" v-waves @click="submitOrder">确定</el-button>
        <el-button type="primary" v-waves @click="submitDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 提交财务请款 end -->

     <el-dialog :visible.sync="dialogImageVisible">
      <img width="80%" :src="dialogImageUrl" alt="">
    </el-dialog>


  <!-- review check dialog star -->
    <el-dialog
    title="Review检测明细"
    :visible.sync="reviewCheckFormVisible"
    width="80%"
    v-dialogDrag>
    <el-table
        :key="reviewTableKey"
        :data="reviewCheckList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="200px" align="center" label="remark">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="check time">
          <template slot-scope="scope">
            <span>{{scope.row.reviewCrawlTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="reviewer name">
          <template slot-scope="scope">
            <span>{{scope.row.reviewerName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="220px" align="center" label="profile link" >
          <template slot-scope="scope">
            <span>{{scope.row.profileLink}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="review star">
          <template slot-scope="scope">
            <span>{{scope.row.reviewStar}}</span>
          </template>
        </el-table-column>
        <el-table-column width="220px" align="center" label="review title" >
          <template slot-scope="scope">
            <span>{{scope.row.reviewTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="review date">
          <template slot-scope="scope">
             <span>{{scope.row.reviewDate}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="review type">
          <template slot-scope="scope">
             <span>{{scope.row.reviewType}}</span>
          </template>
        </el-table-column>

        <el-table-column width="345px" align="center" label="review content" >
          <template slot-scope="scope">
            <span>{{scope.row.reviewContent}}</span>
          </template>
        </el-table-column>
        <el-table-column width="250px" align="center" label="review image">
          <template slot-scope="scope">
             <span>{{scope.row.reviewImage}}</span>
          </template>
        </el-table-column>
            <el-table-column width="250px" align="center" label="review video">
          <template slot-scope="scope">
             <span>{{scope.row.reviewVideo}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- review check dialog end -->

  </div>
</template>

<script>
  import {
    page,
    getObj,
    delObj,
    putObj,
    getList,
    updateOrder,
    submitOrder,
    reviewCheckPage
  } from 'api/reviewer/common/reviewerCampaignDtl';
  import {
    formatJson,
    reviewType,
    getPayerList,
    campaignDtlStatus,
    getUserRoles,
    getWebsiteList,
    formatReviewType,
    returnWhOptions,
    returnWhOptionsFn
  } from "api/reviewer/reviewCommon";
  import {mapGetters} from 'vuex';

  export default {
    name: 'reviewerCampaignDtl',
    data() {
      return {
        rules: {
          grandTotal: [
            {
              required: true,
              message: '请输入订单发票上Grand Total数值',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          campaignNo: undefined,
          asin: undefined,
          orderNo: undefined,
          status: undefined,
          reviewFlag: undefined,
          country: undefined,
          salesGroup: undefined,
          sellerName: undefined,
          createUserName: undefined,
          serverName: undefined,
          customizeCampaignNo: undefined,
          isReturnWarehouse: null
        },
        dialogFormVisible: false,
        dialogStatus: '',
        tableHeight: undefined,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        campaignDtlStatus: [],
        reviewType: [],
        auditFormVisible: false,
        opDialogStatus: '',
        opTextMap: {
          return: '订单打回',
          cancel: '取消订单',
          back: '订单打回至待申请退款'
        },
        orderObj: {
            id: undefined,
            status: undefined,
            remark: undefined
        },
        subimitForm: {
          ids: undefined,
          paypalAccount: undefined
        },
        payerOptions: [],
        submitDialogVisible: false,
        fullscreenLoading: false,
        isAdmin: false,
        dialogImageUrl: undefined,
        dialogImageVisible: false,
        websiteOptions: undefined,
        reviewCheckFormVisible: false,
        reviewCheckList: null,
        reviewTableKey: 0,
        returnWhOptions: []
      }
    },
    created() {
      this.getList();
      this.reviewType = reviewType;
      this.getPayerList();
      this.campaignDtlStatus = campaignDtlStatus;
      this.returnWhOptions = returnWhOptions;
      this.isWebsiteAdmin();
    },
    mounted: function(){
      this.tableHeight = window.innerHeight * 0.85;
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        getList(this.listQuery)
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
      },
      formatStatus (row, column) {
        switch(row.status){
            case 1:
              return '待上传订单号';
              break;
            case 9:
              return '待上传订发票';
              break;
            case 2:
              return '待评论';
              break;
            case 3:
              return '待申请退款';
              break;
            case 4:
              return '待退款';
              break;
            case 10:
              return '提交财务请款';
              break;
            case 5:
              return '已退款';
              break;
            case 6:
              return '管理员退款';
              break;
            case -1:
              return '取消';
              break;
            case -2:
              return '管理员取消';
              break;
            case 11:
              return '打回';
              break;
            default:
              return '未知';
        }
      },
      formatReviewFlag (row, column) {
        return formatReviewType(row, column)
      },
      formatSurvivalState (row, column) {
        switch(row.reviewSurvivalState){
            case -1:
              return '链接有误';
              break;
            case 0:
              return '未检测';
              break;
            case 1:
              return '存活';
              break;
            case 2:
              return 'listing异常';
              break;
            default:
              return '';
        }
      },
      /**
       * 日期格式化
       */
      dateFormat (row,column){   
        var date = ''; 
        var type = column.label;
        if (type === '留评日期') {
          date = row.reviewDate;
        } else if (type === '申请退款日期') {
          date = row.reqRefundDate;
        } else if (type === '退款日期') {
          date = row.refundDate;
        } else {
          return '';
        }
        if (!date || date === '') {
          return '';
        }
        return this.$moment(date).format("YYYY-MM-DD")    
      },
      handleSelectionChange () {
      },
      /**
       * 更新订单
       */
      updateOrder (row) {
        if (!this.orderObj.remark || !this.orderObj.status === -3) {
          this.$notify({
            title: '失败',
            message: '原因不能为空！',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.fullscreenLoading = true;
        updateOrder(this.orderObj).then(resp => {
          if (resp.resCode != 200) {
            this.$notify({
              title: '失败',
              message: resp.resDes,
              type: 'error',
              duration: 2000
            });
          } else {
            this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              });
            this.handleClose();
            this.getList();
          }
          this.fullscreenLoading = false;
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
          this.handleClose();
          this.fullscreenLoading = false;
        })
      },
      /**
       * 显示订单操作对话框
       */
      showOpDialog(row, type) {
        this.opDialogStatus = type;
        this.orderObj.id = row.id;
        // 订单打回至站点站点管理员
        if (type === 'return') {
          this.orderObj.status = 11;
        } else if (type === 'cancel') {
          // 站点管理员取消订单
          this.orderObj.status = -2;
        } else if (type === 'back') {
          // 站点管理员退回订单
          this.orderObj.status = -3;
        }
        this.auditFormVisible=true;
      },
      handleClose () {
        this.orderObj = {
            id: undefined,
            status: undefined,
            remark: undefined
        }
        this.auditFormVisible = false;
      },
      handleSubmit() {
        this.subimitForm.paypalAccount = undefined;
        this.submitDialogVisible = true;
      },
      // 分配活动需求
      submitOrder() {
        let selection = this.$refs.multipleTable.selection;
        let length = selection.length;
        if(length < 1) {
          this.$notify({
            title: '失败',
            message: '请勾选需要提交的单据！',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        if(!this.subimitForm.paypalAccount) {
          this.$notify({
            title: '失败',
            message: '付款账号不能为空！',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        let idArray = [];
        let flag = false;
        let country;
        for (let i = 0; i <= length - 1; i++) {
          if (selection[i].status !== 4) {
              this.$notify({
                title: '失败',
                message: '请选择待付款状态数据进行提交！',
                type: 'error',
                duration: 2000
              });
            return false;
          }
          idArray.push(selection[i].id);
        }
        this.subimitForm.ids = idArray.join();
        this.fullscreenLoading = true;
        submitOrder(this.subimitForm).then(response => {
          if (response.resCode != 200) {
            this.$alert(response.resDes, "提交失败！");
          } else {
            this.submitDialogVisible = false;
            this.$notify({
              title: '成功',
              message: '提交成功！',
              type: 'success',
              duration: 2000
            });
            this.getList();
          }
          this.fullscreenLoading = false;
        }).catch(error => {
          this.submitDialogVisible = false;
          this.fullscreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      // 付款账号列表
      getPayerList() {
        getPayerList().then(response => {
          this.payerOptions = response.data;
        });
      },
      // 判断是否是管理员/站点管理员
      isWebsiteAdmin () {
        getUserRoles().then(resp => {
          if (resp && resp.length > 0) {
            let obj;
            for (let i = 0; i < resp.length; i++) {
              obj = resp[i];
              if (obj.code === 'WEBSITE_ADMIN' || obj.code === 'administrator') {
                this.isAdmin = true;
                break;
              }
            }
          }
          // 如果是管理员显示站点查询条件
          if (this.isAdmin) {
             this.getWebsiteList();
          }
        });
      },
      // 导出列表
      exportList() {
        let exportQuery = this.listQuery;
        exportQuery.page = 1;
        exportQuery.limit = 6000;
        this.fullscreenLoading = true;
        getList(exportQuery).then(response => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['序号','活动编号','订单号','状态','Asin','币别','售价','发票','评论类型','星级','评论截图','订单金额','佣金','手续费','总金额','收款账号','留评日期','申请退款日期','退款日期','国家','渠道','组别','组长','Sku','付款账号','活动创建人','活动创建时间','订单打回理由','remark'];
            const filterVal = ['campaignNo','customizeCampaignNo','orderNo','status','asin','currency','price','invoiceFileName','reviewFlag','reviewStar','reviewImg','grandTotal','bonus','serviceFee','totalAmount','paymentAccount','reviewDate','reqRefundDate','refundDate','country','channel','salesGroup','teamLeader','sku','payer','username','syncDate','rejectionReason','remark'];
            const list = response.data.rows;
            const data = formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'campaign-order-list',
              autoWidth: true,
              bookType: 'xlsx'
            });
          });
          this.fullscreenLoading = false;
        }).catch(error => {
          this.fullscreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      // 点击单元格查看原图
      viewImg(row, column, cell, event) {
        if (column.label=='评论截图' && row.reviewImg) {
          this.dialogImageVisible = true;
          this.dialogImageUrl = row.reviewImg;
        }
        if (column.label=='图片' && row.imgUrl) {
          this.dialogImageVisible = true;
          this.dialogImageUrl = row.imgUrl;
        }
        if (column.label=='物流单照片' && row.courierPicFileName) {
          this.dialogImageVisible = true;
          this.dialogImageUrl = row.courierPicFileName;
        }
        if (column.label=='Drop Off 照片' && row.dropOffPicFileName) {
          this.dialogImageVisible = true;
          this.dialogImageUrl = row.dropOffPicFileName;
        }
      },
      /**
       * 查询站点列表
       */
      getWebsiteList() {
        getWebsiteList().then(response => {
          this.websiteOptions = response.data.rows;
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
      },
      viewReviewCheck (row) {
        this.reviewCheckFormVisible = true;
      },
      formatReturnWhOption (row, column) {
        return returnWhOptionsFn(row, column);
      }
    }
  }
</script>
<style scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
</style>
