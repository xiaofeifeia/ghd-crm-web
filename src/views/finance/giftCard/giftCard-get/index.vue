<template>
  <div class="app-centre">
    <span>Gift Card 领取</span>
    <div class="centent-header">
      <div>
        <el-button v-if="screenGiftCard==='2' || screenGiftCard==='3'" style="margin-right: 20px"
                   size="mini" type="primary" @click="exportReceiveLog">导出领取记录</el-button>
      </div>
      <div>
        <a @click="toggleFullScreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />全屏展示
        </a>
        <template v-if="quotaList.length>1">
          <el-divider direction="vertical" />
          <i class="el-icon-notebook-2" style="font-size:16px;"></i>组别
          <el-select v-model="quotaId" placeholder="请选择" size="mini" @change="quotaChange">
            <el-option v-for="(item , index) in quotaList"
                       :key="index" :label="item.name" :value="item.id"/>
          </el-select>
        </template>
        <span v-if="screenGiftCard==='2' || screenGiftCard==='3'">
          <el-divider direction="vertical" />
          <i class="el-icon-time" style="font-size: 16px;"></i> 时间段选择
          <el-date-picker v-model="date" size="mini" type="daterange" range-separator="," style="width: 210px"
                          value-format="yyyy-MM-dd" picker-options="pickerOptions" @change="getList"
                          start-placeholder="开始日期" end-placeholder="结束日期"/>
        </span>
        <el-divider direction="vertical" />
        <i class="el-icon-date" style="font-size:16px;"></i>视图
        <el-select v-model="screenGiftCard" placeholder="请选择" size="mini">
          <el-option label="可领用的 Gift Card" value="1"></el-option>
          <el-option label="我的领取记录" value="2"></el-option>
          <el-option label="我的领取明细" value="3"></el-option>
        </el-select>
      </div>
    </div>
    <div class="table">
      <el-card>
        <el-table key="1" v-if="screenGiftCard==='1'" v-loading="loading" :data="tableDataList" :height="tableHeight"
          :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
          class="data-table" style="width: 100%">
          <el-table-column label="适用站点" prop="country" >
            <template slot="header">
                <el-select v-model="country" placeholder="请选择" size="mini" @change="getFreeList">
                  <el-option label="适用站点" value="" />
                  <el-option v-for="(item,index) in allCountryList" :key="index" :label="item.countryCode" :value="item.countryCode"/>
                </el-select>
            </template>
          </el-table-column>
          <el-table-column label="币种" prop="currency" />
          <el-table-column label="Gift Card面额" prop="unitPrice" />
          <el-table-column label="申请中的数量" prop="auditingQuantity" />
          <el-table-column label="可领用数量" prop="totalAmount" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="success" v-if="screenGiftCard==='1'&&scope.row.totalAmount>0" @click="getClick(scope.row)">领用</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table key="2" v-else-if="screenGiftCard==='2'" v-loading="loading" :data="tableDataList" :height="tableHeight"
                  :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
                  class="data-table" style="width: 100%">
          <el-table-column label="领取时间" prop="receiveDate" />
          <el-table-column label="适用站点" prop="country" />
          <el-table-column label="币种" prop="currency" />
          <el-table-column label="Gift Card面额" prop="unitPrice" />
          <el-table-column label="领取数量" prop="totalAmount" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="codeClick(scope.row)">查看 Code</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-else>
          <div style="justify-content: space-between; display: flex; margin-bottom: 5px">
            <div style="color: #D9001B; font-size: 14px">
              <span style="margin-top: 10px">此处的 Code 和订单号、SKU的对应关系仅做参考，在实际操作过程中可能不一定是按照此对应关系来处理的</span>
            </div>
            <div style="display: flex">
              <el-select v-model="searchType" size="mini" placeholder="请选择" style="width: 190px">
                <el-option label="订单号" value="orderId"/>
                <el-option label="ERP SKU" value="sku"/>
                <el-option label="ASIN" value="asin"/>
                <el-option label="收卡人账号/邮箱" value="payeeEmail"/>
                <el-option label="Code" value="giftCode"/>
              </el-select>
              <el-input v-model.trim="search" @keyup.native.enter="getList" size="mini" placeholder="请输入搜索关键字"
                        clearable style="width: 300px">
                <el-button slot="append" icon="el-icon-search" @click="getList" size="mini"/>
              </el-input>
            </div>
          </div>
          <el-table key="3" v-loading="loading" :data="tableDataList" :height="tableHeight"
                    :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}"
                    class="data-table" style="width: 100%">
            <el-table-column label="领取时间" prop="receiveDate" min-width="150px"/>
            <el-table-column label="币种" prop="currency" min-width="60px"/>
            <el-table-column label="面额" prop="unitPrice" min-width="60px"/>
            <el-table-column label="亚马逊订单号" prop="orderId" min-width="205px"/>
            <el-table-column label="国家" prop="country" min-width="60px"/>
            <el-table-column label="ERP SKU" prop="sku" min-width="135px"/>
            <el-table-column label="ASIN" prop="asin" min-width="130px"/>
            <el-table-column label="品牌" prop="brand" min-width="100px"/>
            <el-table-column label="渠道" prop="channel" min-width="130px"/>
            <el-table-column label="收卡人账号/邮箱" prop="payeeEmail" show-overflow-tooltip/>
            <el-table-column label="Review 链接" prop="link" show-overflow-tooltip/>
            <el-table-column min-width="80px" align="center" label="Review 截图">
              <template slot-scope="scope">
                <el-image v-if="scope.row.thumbPath!==''" fit="fill" style="width:33px; height: 33px"
                          :src="scope.row.thumbPath" :preview-src-list="[scope.row.imgPath]"/>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" show-overflow-tooltip/>
            <el-table-column label="Code" prop="giftCode" min-width="180px"/>
          </el-table>
        </div>

        <div class="pagination">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-size.sync="pages.limit"
            :current-page.sync="pages.page"
            :total="pages.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      <getGiftCard
        :visible.sync="indicatorDialog"
        :total="total"
        :quotaId="quotaId"
        :quotaName="quotaName"
        @myGiftCard="myGiftCard"
      ></getGiftCard>
      <examineCode :visible.sync="CodeDialog" :CodeData="CodeData" />
    </div>
  </div>
</template>
<script>
import getGiftCard from './getGiftCard';
import examineCode from './examineCode';
import {
  getFreeList,
  getReceivedList,
  getReceivedDetail,
  getCode,
  getQuotaListByUserId,
  exportMyReceiveLogSummary,
  exportMyReceiveLogDetail,
  baseCountryGetList
} from '@/api/finance/giftCard';
import fullScreenForContainer from '@/mixins/fullScreenForContainer';
import tableHeight from '@/mixins/tableHeight';
import mixins from '@/mixins';
export default {
  components: {
    getGiftCard,
    examineCode
  },
  mixins: [fullScreenForContainer, tableHeight, mixins],
  data() {
    return {
      tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 240) - 270,
      topHeight: 250,
      indicatorDialog: false,
      CodeDialog: false,
      isFullscreen: false,
      pages: {
        total: 0,
        page: 1,
        limit: 10
      },
      tableDataList: [],
      date: [],
      search: '',
      searchType: 'orderId',
      loading: false,
      screenGiftCard: '1',
      currentTab: 'group',
      filterOptions: [
        {
          label: 'Group',
          value: 'group',
          checkedList: [],
          data: []
        },
        {
          label: 'CM',
          value: 'cm',
          checkedList: [],
          data: []
        },
        {
          label: '国家',
          value: 'countrys',
          checkedList: [],
          data: []
        },
        {
          label: '产品线',
          value: 'ca',
          checkedList: [],
          data: []
        }
      ],
      pickerOptions: {
        disabledDate(date) {
          return date.getTime() > Date.now() - 8.64e6;
        }
      },
      CodeData: {},
      total: {},
      quotaId: null,
      quotaList: [],
      quotaName: '',
      allCountryList: [],
      country: ""
    }
  },
  watch: {
    screenGiftCard(val) {
      this.pages.page = 1;
      this.pages.limit = 10;
      this.getList();
    }
  },
  created() {
    this.getQuotaListByUserId();
    this.baseCountryGetList();
  },
  methods: {
    handleFilterChange() {

    },
    getList() {
      if (this.screenGiftCard === '1') {
        this.getFreeList();
      } else if (this.screenGiftCard === '2') {
        this.getReceivedList();
      } else {
        this.getReceivedDetail();
      }
    },
    async getFreeList() {//可领用
      const res = await getFreeList({ ...this.pages, quotaId: this.quotaId, country: this.country })
      this.tableDataList = res.data.rows
      this.pages.total = res.data.total
    },
    async getReceivedList() {//我领用
      let form = {
        ...this.pages,
        quotaId: this.quotaId,
        startDate: this.date ? this.date[0] : undefined,
        endDate: this.date ? this.date[1] : undefined
      };
      const res = await getReceivedList(form);
      this.tableDataList = res.data.rows;
      this.pages.total = res.data.total;
    },
    async getReceivedDetail() {//我领用
      let form = {
        ...this.pages,
        quotaId: this.quotaId,
        searchType: this.searchType,
        search: this.search,
        startDate: this.date ? this.date[0] : undefined,
        endDate: this.date ? this.date[1] : undefined
      };
      const res = await getReceivedDetail(form);
      this.tableDataList = res.data.rows;
      this.pages.total = res.data.total;
    },
    async baseCountryGetList() {
      const res = await baseCountryGetList();
      this.allCountryList = res.data;
    },
    async getQuotaListByUserId() {
      const res = await getQuotaListByUserId({});
      this.quotaList = res.data;
      this.quotaId = res.data[0].id;
      this.quotaName = res.data[0].name;
      this.getFreeList();
    },
    myGiftCard(refresh) {//领取成功 切换“我领用的GiftCard 回调
      if (refresh === 'refresh') {
        this.getFreeList()
      } else {
        this.screenGiftCard = '2'
      }
    },
    quotaChange() {
      this.getList();
      this.quotaList.forEach(val => {
        if (val.id === this.quotaId) {
          this.quotaName = val.name
        }
      })
    },
    getClick(row) {//领取
      this.total = row
      this.indicatorDialog = true
    },
    async codeClick(row) {//查看code
      const res = await getCode({ receiveNo: row.receiveNo })
      this.CodeData = { ...row, codeList: res.data }
      this.CodeDialog = true
    },
    // 数据分页每页数据变化
    handleSizeChange(pageSize) {
      this.pages.limit = pageSize;
      this.pages.page = 1;
      this.getList();
    },
    // 选择第几页
    handleCurrentChange(currentPage) {
      this.pages.page = currentPage
      this.getList();
    },
    async exportReceiveLog() {
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      });
      let form = {
        quotaId: this.quotaId,
        searchType: this.searchType,
        search: this.search,
        startDate: this.date ? this.date[0] : undefined,
        endDate: this.date ? this.date[1] : undefined
      };
      let res;
      if (this.screenGiftCard === '2') {
        res = await exportMyReceiveLogSummary(form);
      } else if (this.screenGiftCard === '3') {
        res = await exportMyReceiveLogDetail(form);
      }
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
      const filename = decodeURI(res.headers['content-disposition'].split('filename=')[1])
      loading.close();
      this.funDownload({
        content: res.data,
        filename: filename
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-centre {
  .centent-header {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 12px;
    i.my-filter {
      width: 14px;
      height: 14px;
      display: inline-block;
      background: url("../../../../assets/img/icon-filter.png");
      background-size: contain;
    }
    & >>> .filter .fil-w {
      right: 0px;
    }
    & >>> .handle-btn {
      color: #333333;
      font-size: 12px;
    }
  }
  .table {
    .pagination {
      text-align: right;
      margin: 10px 0;
    }
    /deep/ .el-card__body {
      padding: 10px;
    }
  }
}
</style>
