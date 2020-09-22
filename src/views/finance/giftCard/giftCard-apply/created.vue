<template>
  <div class="appGift">
    <el-dialog :visible.sync="dialogTableVisible" width="60%" class="dialog">
      <div slot="title" class="title flex">
        <span>新建 Gift Card 申请</span>
        <span>
          <el-tooltip placement="bottom">
            <div slot="content">
              所有的额度指的是人民币额度。
              <br />每次申请不同币种的 Gift Card 金额都会
              <br />根据财务所配置的汇率转化成人民币的，
              <br />并在可用额度中减去想要金额的额度。
              <br />额度的实际大小会随着财务对
              <br />汇率的调整而变化。
              一般而言，财务每
              <br />月月初更新一次汇率。
            </div>
            <div>
              <i class="el-icon-warning-outline"></i>
              <span class="limit">额度说明</span>
            </div>
          </el-tooltip>
        </span>
      </div>
      <div class="flex">
        <span>
          <el-button size="mini" type="primary" @click="add">新增</el-button>
        </span>
        <span>
          <span style="margin-right: 20px;">本月可用额度：￥{{freeQuota}}</span>本次预计使用额度：
          <span style="color:#37c4a8">￥{{amount.toFixed(2)}}</span>
        </span>
      </div>
      <div class="table">
        <el-table
          v-loading="loading"
          :data="tableDataList"
          max-height="450"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" />
          <el-table-column label="使用站点">
            <template slot-scope="scope">
              <el-select
                size="mini"
                v-model="scope.row.createDate"
                placeholder="请选择"
                @change="createChange"
              >
                <el-option
                  v-for="(item ,indexs) in allCountryList"
                  :key="indexs"
                  :label="item.countryCode"
                  :value="item.currency+','+item.countryCode+','+item.cnyRate"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Gift Card 币种" width="130">
            <template slot-scope="scope">{{scope.row.createDate.split(',')[0]}}</template>
          </el-table-column>
          <el-table-column label="Gift Card 面额">
            <template slot-scope="scope">
              <el-autocomplete
                class="inline-input"
                size="mini"
                v-model="scope.row.unitPrices"
                :fetch-suggestions="querySearch"
                placeholder="请选择或输入数字"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <el-input-number size="mini" :min="1" v-model="scope.row.totalAmount"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="金额（站点）" width="120">
            <template slot-scope="scope">
              <span
                v-if="scope.row.unitPrices"
              >{{(scope.row.unitPrices * scope.row.totalAmount).toFixed(2)}}</span>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column label="参考汇率" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.createDate.split(',')[2]">{{scope.row.createDate.split(',')[2]}}</span>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column label="使用额度（人民币）" width="150">
            <template slot-scope="scope">
              <span
                v-if="scope.row.createDate.split(',')[2]&&scope.row.unitPrices"
              >{{((scope.row.unitPrices * scope.row.totalAmount)*scope.row.createDate.split(',')[2]).toFixed(2)}}</span>
              <span v-else>---</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <a @click="dele(scope)">
                <i class="el-icon-delete-solid icon"></i>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foold">
        <el-button
          size="mini"
          type="primary"
          @click="submit"
          :disabled="this.loading || this.tableDataList.length===0"
        >提交</el-button>
        <el-button size="mini" @click="dialogTableVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseCountryGetList, addApply } from '@/api/finance/giftCard'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    freeQuota: {
      type: Number,
      default: 0
    },
    quotaId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      conditionVisible: false,
      loading: false,
      tableDataList: [{
        createDate: '',
        unitPrices: '',
        totalAmount: 1,
      }],
      allCountryList: [],
      issubmit: true
      // amount:0
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogTableVisible = this.visible
        if (val) {

        }
      }
    },
    dialogTableVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  computed: {
    amount() {
      let tolt = 0
      this.issubmit = true
      this.tableDataList.forEach(val => {
        if (val.createDate.split(',')[2] * val.totalAmount * val.unitPrices) {
          tolt += val.createDate.split(',')[2] * val.totalAmount * val.unitPrices
          return tolt
        } else {
          this.issubmit = false
          return tolt
        }
      })
      return tolt
    }
  },
  created() {
    this.baseCountryGetList()
  },
  methods: {
    querySearch(queryString, cb) {
      const arr = [
        { value: '25', address: 25 },
        { value: '50', address: 50 },
        { value: '75', address: 75 },
        { value: '100', address: 100 },
        { value: '150', address: 150 },
        { value: '200', address: 200 },
      ]
      cb(arr);
    },
    async baseCountryGetList() {
      const res = await baseCountryGetList();
      this.allCountryList = res.data;
      // 目前只能采购到US的礼品卡，故暂时只能选择US
      // if(res.data) {
      //   for(let i =0,size = res.data.length;i<=size-1;i++) {
      //     if(res.data[i].countryCode === 'US') {
      //       this.allCountryList = [res.data[i]];
      //     }
      //   }
      // }
    },
    add() {//添加
      const num = this.tableDataList.length - 1
      this.tableDataList.push({
        createDate: this.tableDataList[num].createDate,
        totalAmount: 1,
      })
    },
    createChange(val) {
      if (val.split(',')[2] == 0) {
        this.$message.error('请联系财务相关人员更新汇率');
      }
    },
    dele(scope) {//删除
      this.tableDataList.splice(scope.$index, 1)
    },
    getClick() {
      this.conditionVisible = true
    },
    async submit() {//提交
      if (this.tableDataList.length !== 0 && this.issubmit) {
        let arr = []
        this.tableDataList.forEach(val => {
          arr.push({
            country: val.createDate.split(',')[1],
            currency: val.createDate.split(',')[0],
            unitPrice: val.unitPrices,
            totalAmount: val.totalAmount,
            rate: val.createDate.split(',')[2]
          })
        })
        this.loading = true
        const res = await addApply({ itemList: arr, quotaId: this.quotaId })
        if (res.resCode == 400) {
          this.$message.error(res.resDes)
        } else {
          this.$message.success(res.resDes)
          this.dialogTableVisible = false
          this.$emit('succeedCreated')
        }
        this.loading = false
      } else {
        this.$message.error('面额或汇率不能为0');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.appGift {
  .flex {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
  }
  .title {
    .limit {
      text-decoration: underline;
      color: #1890ff;
      margin-right: 20px;
      font-size: 12px;
    }
  }

  .table {
    .icon {
      color: #f00;
      font-size: 18px;
    }
  }
  .foold {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
