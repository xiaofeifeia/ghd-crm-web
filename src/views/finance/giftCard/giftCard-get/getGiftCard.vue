<template>
  <div class="appGift">
    <el-dialog :visible.sync="dialogTableVisible" width="90%" :close-on-click-modal="false" v-loading="loading">
      <div slot="title" class="titleGift">
        <div>
          <span>领用 Gift Card</span>
          <span class="x-title" v-if="StepsActive===1">当前可领用数量：{{total.totalAmount}}</span>
        </div>
        <div class="button" v-if="StepsActive===1">
          <el-upload
            action="/api/finance/giftcardReceive/getOrderIdFromExcel"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            name="excel"
            :key="uploaKey"
            :show-file-list="false"
            :limit="1"
            :headers="headers"
            :data="{userId: getUserId()}"
            :before-upload="handleBeforeUpload"
            :on-error="uploadError"
            :on-success="uploadSuccess"
          >
            <el-button size="mini" type="success">模板导入</el-button>
          </el-upload>
          <!-- <el-button size="mini" type="success" @click="aaaa">模板导入</el-button> -->
          <el-button size="mini" type="primary" @click="exportExcel">下载模板</el-button>
        </div>
      </div>
      <div class="Steps">
        <el-steps :active="StepsActive" align-center>
          <el-step title="录入订单号"></el-step>
          <el-step title="完善相关信息"></el-step>
          <el-step title="领取"></el-step>
        </el-steps>
      </div>
      <div class="content">
        <div class="NO1" v-if="StepsActive===1">
          <span>当前领用部门：{{quotaName}}</span>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入亚马逊订单号，多个订单号用英文 ','隔开"
            v-model="orderNumber"
          ></el-input>
        </div>
        <div class="NO2" v-if="StepsActive!==1">
          <div class="No2-title">
            <div style="color: #f00">
              <span v-if="overstepList.length!=0">标红的订单号为超过最大领取次数（3次）的订单</span>
            </div>
            <div>
              <span class="x-title">当前可领用数量：{{total.totalAmount}}</span>
              <span class="d-title">
                本次预计领取数量：
                <span>{{tableDataList.length}}</span>
              </span>
            </div>
          </div>
          <orderImgTable
            :tableDataList.sync="tableDataList"
            :StepsActive="StepsActive"
            @overstepGet="overstepGet"
          ></orderImgTable>
        </div>
      </div>
      <div class="foold">
        <el-button
          size="mini"
          type="primary"
          v-if="StepsActive!==3"
          @click="nextStep"
          :disabled="isNextStep"
        >下一步</el-button>
        <el-button size="mini" type="primary" v-if="StepsActive===3" @click="submit">提交</el-button>
        <el-button size="mini" v-if="StepsActive!==1" @click="lastStep">上一步</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单号最大领用次数提示" :visible.sync="overstepVisible" width="40%">
      <div>
        <p>以下订单超过了最大可领用 Code 数，请确认后重试</p>
        <el-table
          :data="overstepList"
          max-height="450"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          style="width: 100%"
        >
          <el-table-column label="订单号" min-width="120" prop="orderId" />
          <el-table-column label="可领用数" min-width="120" prop="freeTime" />
          <el-table-column label="本次领用数" min-width="120" prop="receive" />
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="23%" :before-close="handleClose">
      <div class="succeed">
        <p class="title">
          <i class="el-icon-success"></i> 领取成功
        </p>
        <p>
          Gift Card名额：
          <span>${{total.unitPrice}}</span>
        </p>
        <p>
          适用站点：
          <span>{{total.country}}</span>
        </p>
        <p>
          领取数量：
          <span>{{tableDataList.length}}</span>
        </p>
      </div>
      <div class="code">
        <span>请妥善保管并使用Code码</span>
        <div>
          <ul>
            <li v-for="(item ,index) in CodeList" :key="index">{{item}}</li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <el-button
          type="primary"
          size="mini"
          v-clipboard:copy="copyCode"
          v-clipboard:success="copyClick"
        >复制所有 Code码</el-button>
        <p>
          右上角“视图”中选择 "
          <a>
            <span @click="myGiftCard">我领用的Gift Card</span>
          </a>" 可查看相关 Code 码
        </p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getOrderInfo, receiveGiftCard, exportReceiveTemplate} from '@/api/finance/giftCard'
import orderImgTable from '../component/orderImgTable'
import Cookies from 'js-cookie';
import mixins from '@/mixins';

export default {
  components: {
    orderImgTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    quotaId: {
      type: Number
    },
    total: {
      type: Object,
      default: () => ({})
    },
    quotaName: {
      type: String,
      default: ''
    }
  },
  mixins: [mixins],
  data() {
    return {
      loading: false,
      dialogVisibleImg: false,
      dialogVisible: false,
      isNextStep: false,
      overstepVisible: false,
      copyCode: '',
      tableDataList: [],
      dialogTableVisible: false,
      StepsActive: 1,
      orderNumber: '',
      accountNumber: '',
      CodeList: [],
      excelRows: [],
      overstepList: [],
      uploadLoading: false,
      uploaKey: new Date().getTime()
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogTableVisible = this.visible
        if (val) {
          this.StepsActive = 1
          this.orderNumber = ''
        }
      }
    },
    dialogTableVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  computed: {
    headers() {
      return {
        Authorization: Cookies.get('Admin-Token')
      }
    }
  },
  methods: {
    async getOrderInfo() { // 表格数据
      const res = await getOrderInfo({ orderIds: this.orderNumber })
      if (res.resCode !== 200) {
        this.$message.error(res.resDes);
      } else {
        this.excelRowsPayeeEmail(res.data)
        this.StepsActive++
      }
    },
    async receiveGiftCard() { // 领取
      this.loading = true;
      const data = {
        country: this.total.country,
        unitPrice: this.total.unitPrice,
        receiveList: this.tableDataList,
        quotaId: this.quotaId
      }
      const res = await receiveGiftCard(data)
      if (res.resCode !== 200) {
        this.$message.error(res.resDes);
        this.loading = false;
        return;
      }
      this.dialogVisible = true;
      this.dialogTableVisible = false;
      this.CodeList = res.data.giftCodeList;
      this.copyCode = res.data.giftCodeList.join(',');
      this.loading = false;
    },
    uploadSuccess(res) { // 导入模板
      if (res.resCode === 200) {
        this.orderNumber = res.data.orderIds
        this.excelRows = res.data.excelRows
        this.$message.success('导入成功');
      } else {
        this.$message.error(res.resDes);
      }
      this.uploaKey = new Date().getTime()
      this.uploadLoading.close()
    },
    excelRowsPayeeEmail(dataList) { // 配备导入的邮箱、渠道、主管
      dataList.forEach(val => {
        this.excelRows.forEach(item => {
          if (item.orderId === val.orderId) {
            if (item.payeeEmail) {
              val.payeeEmail = item.payeeEmail;
            }
            if (item.leader) {
              val.leader = item.leader;
            }
            if (item.channel) {
              val.channel = item.channel;
            }
            if (item.country) {
              val.country = item.country;
            }
            if (item.sku) {
              val.sku = item.sku;
            }
            if (item.asin) {
              val.asin = item.asin;
            }
          }
        })
      })
      this.tableDataList = dataList;
    },
    uploadError() {
      this.uploadLoading.close()
    },
    overstepGet(dataList) {
      this.overstepList = dataList
    },
    handleBeforeUpload(file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.error('上传失败，请上传正确的Excel文件');
        return false
      }
      this.uploadLoading = this.$loading({
        lock: true,
        text: '导入中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
    },
    async exportExcel() {
      // 下载模板
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
      const res = await exportReceiveTemplate({}).catch(() => loading.close());
      if(res.data.type === 'application/json') {
        // 导出报错
        loading.close();
        const reader = new FileReader();
        reader.onload = function () {
          let baseReturnVO = JSON.parse(reader.result);
          alert(baseReturnVO.resDes);
        };
        reader.readAsText(res.data);
        return;
      }
      const filename = decodeURI(res.headers['content-disposition'].split('filename=')[1]);
      loading.close();
      this.funDownload({
        content: res.data,
        filename: filename
      });
    },
    nextStep() { // 下一步
      if (this.StepsActive === 1) {
        this.getOrderInfo()
      } else {
        if (this.overstepList.length != 0) {
          this.overstepVisible = true
          return
        }
        let isActive = true
        this.tableDataList.forEach(val => {
          if (!val.payeeEmail || val.payeeEmail === '' || val.channel === '' || val.leader === '') {
            isActive = false
          }
        })
        if (this.tableDataList.length !== 0) {
          isActive ? this.StepsActive++ : this.$message.error('有未填项，请检查')
        }
      }
    },
    lastStep() { // 上一步
      this.StepsActive--
      this.isNextStep = false
    },
    submit() { // 提交==
      this.receiveGiftCard()
    },
    copyClick() { // 复制
      this.$message({
        showClose: true,
        message: '已成功复制到剪切板',
        type: 'success'
      });
    },
    handleClose(done) {
      this.$emit('myGiftCard', 'refresh')
      done()
    },
    myGiftCard() {
      this.dialogVisible = false
      this.$emit('myGiftCard', '')
    },
    getUserId() {
      const userId = Cookies.get('UserId');
      return userId;
    }
  }
}
</script>
<style lang="scss" scoped>
.appGift {
  .el-dialog .el-dialog__header {
    .titleGift {
      display: flex;
      justify-content: space-between;
      .button {
        margin-right: 40px;
        display: flex;
        div {
          margin-right: 10px;
        }
      }
    }
  }

  .x-title {
    color: #999;
    font-size: 12px;
    margin-left: 20px;
  }
  .d-title {
    color: #000;
    font-size: 14px;
    span {
      color: #1abc9c;
    }
  }
  .content {
    .No2-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
  .icon {
    color: #f00;
    font-size: 16px;
  }
  .foold {
    margin-top: 20px;
    text-align: center;
  }
  .succeed {
    text-align: center;
    span {
      color: #666;
    }
    .title {
      font-size: 22px;
      i {
        color: #13b25c;
        font-size: 26px;
      }
    }
  }
  .code {
    div {
      border: 1px solid #ccc;
      padding: 0 20px;
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-left: 0;
        li {
          list-style: none;
          margin-bottom: 10px;
        }
      }
    }
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    font-size: 12px;
    color: rgb(167, 164, 164);
    span {
      text-decoration: underline;
      color: #1890ff;
    }
  }
}
a {
  text-decoration: underline;
  color: #1890ff;
}
</style>
