<template>
  <div class="table">
    <el-table
      v-loading="loading"
      :data="tableDataList"
      max-height="450"
      :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
      class="data-table"
      style="width: 100%"
    >
      <el-table-column label="亚马逊订单" min-width="120" prop="orderId">
        <template slot-scope="{row}">
          <span v-if="row.hadReceived===1" @click="orderDetailsClick(row)">
            <a :class="row.freeTime-row.receive<0?'reds':'blue'">{{row.orderId}}</a>
          </span>
          <span v-else :class="row.freeTime-row.receive<0?'red':''">{{row.orderId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="80" prop="orderStatus" />
      <el-table-column label="国家" min-width="50" prop="country" />
      <el-table-column label="ERP SKU" min-width="90" prop="sku" />
      <el-table-column label="ASIN" min-width="90" prop="asin" />
      <el-table-column label="品牌" min-width="90" prop="brand" />
      <el-table-column label="渠道" min-width="130">
        <template slot-scope="scope">
          <el-input
            size="mini"
            placeholder="请输入使用渠道"
            v-model="scope.row.channel "
            clearable
            v-if="StepsActive===2"
          />
          <span v-else>{{scope.row.channel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="主管" min-width="110">
        <template slot-scope="scope">
          <el-input
            size="mini"
            placeholder="请输入主管"
            v-model="scope.row.leader"
            clearable
            v-if="StepsActive===2"
          />
          <span v-else>{{scope.row.leader}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收卡人账号/邮箱" min-width="120">
        <template slot-scope="scope">
          <el-input
            size="mini"
            placeholder="请输入收卡人账号/邮箱"
            v-model.trim="scope.row.payeeEmail"
            clearable
            v-if="StepsActive===2"
          />
          <span v-else>{{scope.row.payeeEmail}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Review 链接（选填）" min-width="140">
        <template slot-scope="scope">
          <el-input
            size="mini"
            placeholder="请输入Review 链接"
            v-model="scope.row.link"
            clearable
            v-if="StepsActive===2"
          />
          <a class="blue" :href="'http://'+scope.row.link" target="_blank" v-else>{{scope.row.link}}</a>
        </template>
      </el-table-column>
      <el-table-column label="Review 截图（选填）" v-show="StepsActive===2" min-width="140">
        <template slot-scope="scope">
          <template v-if="isShowUploadImg">
            <uploadImg
              :key="scope.$index"
              :orderId="scope.row.orderId"
              :disabled="StepsActive===2"
              v-model="scope.row.fileName"
              @preview="preview"
            />
          </template>
          <template v-else>
            <uploadImg
              v-if="scope.row.imgPath!==''"
              class="show-img"
              :disabled="false"
              :imgDisabled="false"
              :filelist="[{url:scope.row.imgPath}]"
              @preview="preview"
            />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="备注（选填）" min-width="100">
        <template slot-scope="scope">
          <el-input
            size="mini"
            placeholder="请输入备注"
            v-model="scope.row.remark "
            clearable
            v-if="StepsActive===2"
          />
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column width="40" v-if="StepsActive===2">
        <template slot-scope="scope">
          <a @click="deleteClick(scope)">
            <i class="el-icon-delete-solid icon"></i>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisibleImg" width="500" append-to-body>
      <div class="img">
        <img :src="dialogImageUrl" alt />
      </div>
    </el-dialog>
    <el-dialog title="订单重复领用详情" :visible.sync="orderDetails" width="75%" append-to-body>
      <div class="order-titlet">
        <span>
          亚马逊订单号：
          <b>{{foin.orderId}}</b>
        </span>
        <span>
          订单状态：
          <b>{{foin.orderStatus}}</b>
        </span>
        <span>
          国家：
          <b>{{foin.country}}</b>
        </span>
      </div>
      <div class="table">
        <el-table
          v-loading="loading"
          :data="orderDetailsList"
          max-height="450"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          style="width: 100%"
        >
          <el-table-column label="使用时间" prop="receiveDate" />
          <el-table-column label="使用类型" prop="type" />
          <el-table-column label="部门" prop="teamName" />
          <el-table-column label="使用人" prop="receiverName" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import uploadImg from "./uploadImg";
import { getDuplicateOrder } from '@/api/finance/giftCard'
export default {
  components: {
    uploadImg
  },
  props: {
    StepsActive: {
      type: Number,
      default: 2
    },
    tableDataList: {
      type: Array,
      default: () => []
    },
    isShowUploadImg: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    tableDataList: {
      immediate: true,
      handler(val) {
        this.filtrationoOrderId(val)
      }
    }
  },
  data() {
    return {
      orderDetails: false,
      loading: false,
      dialogVisibleImg: false,
      foin: {},
      orderDetailsList: [],
      dialogImageUrl: ""
    };
  },
  methods: {
    preview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    deleteClick(scope) {
      // 删除
      this.tableDataList.splice(scope.$index, 1);
      this.tableDataList.length > 0 ? (this.isNextStep = false) : (this.isNextStep = true);
      this.filtrationoOrderId(this.tableDataList)
    },
    async getDuplicateOrder(orderId) {
      const res = await getDuplicateOrder({ orderId })
      this.orderDetailsList = res.data
    },
    orderDetailsClick(row) {
      this.getDuplicateOrder(row.orderId)
      this.orderDetails = true
      this.foin = row
    },
    filtrationoOrderId(data) {
      let oids = {}
      let sum = []
      let obj = {}
      data.forEach(val => {
        if (!oids[val.orderId]) {
          oids[val.orderId] = 1
        } else {
          oids[val.orderId]++
        }
      })
      data.forEach(item => {
        item.receive = oids[item.orderId]
        if (item.freeTime - item.receive < 0) {
          if (!obj[item.orderId]) {
            obj[item.orderId] = 1
            sum.push({ orderId: item.orderId, freeTime: item.freeTime, receive: item.receive })
          } else {
          }
        }
      })
      this.$emit('overstepGet', sum)
    },
  }
};
</script>script>
<style lang="scss" scoped>
.icon {
  color: #f00;
  font-size: 16px;
}
.blue {
  color: #1890ff;
  text-decoration: underline;
}
.reds {
  color: #f00;
  text-decoration: underline;
}
.red {
  color: #f00;
}
.img {
  width: 100%;
  text-align: center;
  img {
    max-width: 100%;
  }
}
.order-titlet {
  span {
    margin-right: 20px;
  }
}
</style>
