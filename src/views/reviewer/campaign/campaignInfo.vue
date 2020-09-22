<template>
  <div class="app-container calendar-list-container" v-loading="fullscreenLoading">
    <div class="filter-container">
      <el-form
        v-model="listQuery"
        class="form-el-all"
        label-width="100px"
        style="display: flex; flex-wrap: wrap"
        @keyup.enter.native="handleFilter"
      >
        <el-form-item label="站点">
          <font color="red">*</font>
          <el-select
            v-model="serverName"
            clearable
            placeholder="请选择"
            class="filter-item"
            @change="changeWebsite"
          >
            <el-option
              v-for="item in websiteOptions"
              :key="item.websiteName"
              :label="item.websiteName"
              :value="item.serverName"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Model">
          <el-input
            @keyup.enter.native="handleFilter"
            class="filter-item"
            placeholder="请输入"
            clearable
            v-model.trim="listQuery.model"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="Asin">
          <el-input
            @keyup.enter.native="handleFilter"
            class="filter-item"
            placeholder="请输入"
            clearable
            v-model.trim="listQuery.asin"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动编号">
          <el-input
            @keyup.enter.native="handleFilter"
            class="filter-item"
            placeholder="请输入"
            clearable
            v-model.trim="listQuery.campaignNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="组别">
          <el-select v-model="listQuery.salesGroup" clearable placeholder="请选择" class="filter-item">
            <el-option v-for="item in teamOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" clearable placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in campaignStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="留评类型" label-width="100px">
          <el-select v-model="listQuery.reviewFlag" placeholder="请选择" clearable>
            <el-option v-for="item in reviewType" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卖家名称" label-width="100px">
          <el-input v-model="listQuery.sellerName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="产品标题" label-width="100px">
          <el-input v-model="listQuery.shortName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item>
        <div style="text-align: center">
          <el-button
            class="filter-item"
            type="primary"
            v-waves
            icon="search"
            @click="handleFilter"
          >搜索</el-button>
          <el-button class="filter-item" v-waves type="primary" icon="el-icon-upload" @click="exportList">导出</el-button>
          <el-button class="filter-item" v-waves type="primary" icon="el-icon-message" @click="sendEmailDialogVisible = true">发送活动邀请邮件</el-button>
        </div>
        </el-form-item>
      </el-form>

    </div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      ref="elementTable"
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column width="80px" align="center" label="图片" fixed="left">
        <template slot-scope="scope">
          <img :src="scope.row.imgThumbUrl" width="60px" height="60px">
        </template>
      </el-table-column>
      <el-table-column
        width="100px"
        align="center"
        label="状态"
        :formatter="formatCampStatus"
        fixed="left"
      ></el-table-column>
      <el-table-column width="120px" align="center" label="编号">
        <template slot-scope="scope">
          <span>{{scope.row.campaignNo}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="100px" align="center" label="获取方式">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="200px" align="center" label="品牌名">
        <template slot-scope="scope">
          <span>{{scope.row.campaignBrand}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="Asin">
        <template slot-scope="scope">
          <span>{{scope.row.asin}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="Sku">
        <template slot-scope="scope">
          <span>{{scope.row.sku}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="小组">
        <template slot-scope="scope">
          <span>{{scope.row.salesGroup}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="组长">
        <template slot-scope="scope">
          <span>{{scope.row.teamLeader}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="产品标题" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="Model">
        <template slot-scope="scope">
          <span>{{scope.row.model}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="国家">
        <template slot-scope="scope">
          <span>{{scope.row.countryCode}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="数量">
        <template slot-scope="scope">
          <span>{{scope.row.campaignQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="每日限量">
        <template slot-scope="scope">
          <span>{{scope.row.dailyCampaignQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="已领数量">
        <template slot-scope="scope">
          <span>{{scope.row.receivedQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.fromDateStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.toDateStr}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="200px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="80px" align="center" label="奖励">
        <template slot-scope="scope">
          <span>{{scope.row.bonus}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="留评类型" :formatter="formatReviewFlag"></el-table-column>
      <el-table-column width="200px" align="center" label="分享链接" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.accessLink}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="卖家名称">
        <template slot-scope="scope">
          <span>{{scope.row.sellerName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="SellerId">
        <template slot-scope="scope">
          <span>{{scope.row.sellerId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="关键词" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.searchKeyword}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="评论数">
        <template slot-scope="scope">
          <span>{{scope.row.reviewQty}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="渠道">
        <template slot-scope="scope">
          <span>{{scope.row.channel}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createUser}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="60px">
        <template slot-scope="scope">
           <el-button type="warning" icon="el-icon-star-off" circle title="置顶" v-if="scope.row.status == 1" @click="topping(scope.row)"></el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @closed="cancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item >
          <el-col :span="11">
            <el-form-item label="产品图片">
              <div class="demo-image__placeholder">
                <div class="block">
                  <el-image :src="form.imgUrl" style="width: 150px; height: 150px">
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item>
              <el-upload
                :action="uploadImgUrl"
                 :data="{type: 1}"
                list-type="picture-card"
                ref="upload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :headers="headers"
                :on-success="uploadImgSuccess"
                :limit="1"
                name="proImg"
                >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="活动编号" prop="campaignNo">
              <el-input v-model="form.campaignNo" placeholder="请输入活动编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
              <el-form-item label="品牌" prop="campaignBrand">
                <el-input v-model="form.campaignBrand" placeholder="请输入当前活动品牌，用户买家搜索"></el-input>
              </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名称(展示)" prop="shortName">
              <el-input v-model="form.shortName" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="国家" prop="countryId">
                <el-select v-model="form.countryId" clearable placeholder="请选择" class="filter-item">
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.countryId"
                    :label="item.countryCode"
                    :value="item.countryId"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="活动数量" prop="campaignQty">
              <el-input v-model="form.campaignQty" placeholder="请输入活动预期领取量"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="Asin" prop="asin">
              <el-input v-model="form.asin" placeholder="请输入Amazon Asin"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="sku" prop="sku">
              <el-input v-model="form.sku" placeholder="请输入sku"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="已领数量" prop="receivedQty">
              <el-input v-model="form.receivedQty" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="每日限量" prop="dailyCampaignQty">
              <el-input v-model="form.dailyCampaignQty" placeholder="请输入每日活动数量"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" placeholder="价格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="奖励" prop="bonus">
              <el-input v-model="form.bonus" placeholder="请输入额外奖励金额"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" clearable placeholder="请选择" class="filter-item">
                <el-option
                  v-for="item in campaignStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="留评类型" prop="reviewFlag">
                <el-select v-model="form.reviewFlag" clearable placeholder="请选择" class="filter-item">
                  <el-option
                    v-for="item in reviewType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="开始时间" prop="fromDate">
              <el-date-picker
                v-model="form.fromDate"
                type="date"
                placeholder="选择开始日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="结束时间" prop="toDate">
              <el-date-picker
                v-model="form.toDate"
                type="date"
                placeholder="选择结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="组别">
              <el-select v-model="form.salesGroup" clearable placeholder="请选择" class="filter-item">
                <el-option v-for="item in teamOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="组长" prop="teamLeader">
              <el-input v-model="form.teamLeader" placeholder="请输入组长"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="渠道" prop="channel">
              <el-input v-model="form.channel" placeholder="请输入渠道"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="model" prop="model">
              <el-input v-model="form.model" placeholder="请输入Model"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
           <el-col :span="11">
            <el-form-item label="活动入口" prop="brandId">
                <el-select v-model="form.brandId" clearable placeholder="请选择" class="filter-item">
                  <el-option
                    v-for="item in brandOptions"
                    :key="item.id"
                    :label="item.brandName"
                    :value="item.id"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="分享链接" prop="accessLink">
              <el-input v-model="form.accessLink" placeholder="请输入第三方分享链接"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="卖家ID" prop="sellerId">
              <el-input v-model="form.sellerId" placeholder="请输入卖家id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="卖家名称" prop="sellerName">
              <el-input v-model="form.sellerName" placeholder="请输入卖家名称"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="搜索关键词" prop="searchKeyword">
              <el-input v-model="form.searchKeyword" placeholder="请输入搜索关键词"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="评论数量" prop="reviewQty">
              <el-input v-model="form.reviewQty" placeholder="请输入产品评论数量"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item >
          <el-col :span="22">
            <el-form-item label="Bullet Point" prop="amzBulletPoint">
              <el-input   type="textarea" :rows="4" v-model="form.amzBulletPoint" placeholder="产品亮点"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

  <!-- 导入失败提醒框 -->
    <el-dialog title="导入失败" :visible.sync="uploadDialogVisible" width="90%">
      <el-table :data="importErrorList" border fit highlight-current-row>
        <el-table-column width="200px" align="center" label="错误信息" fixed="left">
          <template slot-scope="scope"><span>{{scope.row.errorRemark}}</span></template>
        </el-table-column>
        <el-table-column width="80px" align="center" label="ID">
          <template slot-scope="scope"><span>{{scope.row.id}}</span></template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="活动编号" >
          <template slot-scope="scope"><span>{{scope.row.campaignNo}}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="状态">
          <template slot-scope="scope"><span>{{scope.row.status}}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="品牌">
          <template slot-scope="scope"><span>{{scope.row.campaignBrand}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="产品名称">
          <template slot-scope="scope"><span>{{scope.row.productName}}</span></template>
        </el-table-column>
         <el-table-column width="150px" align="center" label="名称(展示)">
          <template slot-scope="scope"><span>{{scope.row.shortName}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="国家">
          <template slot-scope="scope"><span>{{scope.row.country}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="渠道">
          <template slot-scope="scope"><span>{{scope.row.channel}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="Model">
          <template slot-scope="scope"><span>{{scope.row.model}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="Asin">
          <template slot-scope="scope"><span>{{scope.row.asin}}</span></template>
        </el-table-column>
            <el-table-column width="200px" align="center" label="Sku">
          <template slot-scope="scope"><span>{{scope.row.sku}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="组别">
          <template slot-scope="scope"><span>{{scope.row.salesGroup}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="组长">
          <template slot-scope="scope"><span>{{scope.row.teamLeader}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="开始时间">
          <template slot-scope="scope"><span>{{scope.row.fromDate}}</span></template>
        </el-table-column>
            <el-table-column width="200px" align="center" label="结束时间">
          <template slot-scope="scope"><span>{{scope.row.toDate}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="活动数量">
          <template slot-scope="scope"><span>{{scope.row.campaignQty}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="已领数量">
          <template slot-scope="scope"><span>{{scope.row.receivedQty}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="每日限量">
          <template slot-scope="scope"><span>{{scope.row.dailyCampaignQty}}</span></template>
        </el-table-column>
                <el-table-column width="200px" align="center" label="价格">
          <template slot-scope="scope"><span>{{scope.row.price}}</span></template>
        </el-table-column>
            <el-table-column width="200px" align="center" label="奖励">
          <template slot-scope="scope"><span>{{scope.row.bonus}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="留评类型">
          <template slot-scope="scope"><span>{{scope.row.reviewFlag}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="活动入口">
          <template slot-scope="scope"><span>{{scope.row.brandId}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="分享链接">
          <template slot-scope="scope"><span>{{scope.row.accessLink}}</span></template>
        </el-table-column>
         <el-table-column width="200px" align="center" label="卖家ID">
          <template slot-scope="scope"><span>{{scope.row.sellerId}}</span></template>
        </el-table-column>
         <el-table-column width="200px" align="center" label="卖家名称">
          <template slot-scope="scope"><span>{{scope.row.sellerName}}</span></template>
        </el-table-column>
         <el-table-column width="200px" align="center" label="搜索关键词">
          <template slot-scope="scope"><span>{{scope.row.searchKeyword}}</span></template>
        </el-table-column>
         <el-table-column width="200px" align="center" label="评论数">
          <template slot-scope="scope"><span>{{scope.row.reviewQty}}</span></template>
        </el-table-column>
         <el-table-column width="200px" align="center" label="备注">
          <template slot-scope="scope"><span>{{scope.row.remark}}</span></template>
        </el-table-column>
         <el-table-column width="200px" align="center" label="Bullet Point">
          <template slot-scope="scope"><span>{{scope.row.bulletPoint}}</span></template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog :visible.sync="importImgdialogVisible">
      <el-upload
        class="upload-demo"
        ref="uploadImg"
        :action="uploadImgUrl"
        :data="{type: 2}"
        :on-preview="handleImgPreview"
        :on-remove="handleImgRemove"
        :file-list="imgList"
        :headers="headers"
        :multiple="true"
        list-type="picture"
        :auto-upload="false"
         name="proImg"
        >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件</div>
      </el-upload>
    </el-dialog>

    <el-dialog :visible.sync="sendEmailDialogVisible">
      <div style="margin-bottom: 30px">请确认是否要向所选站点内所有用户发送活动邀请邮件？</div>
      <div align="center">
        <el-button size="small" type="primary" @click="sendEmail">确定</el-button>
        <el-button style="margin-left: 10px;" size="small" type="primary" @click="sendEmailDialogVisible = false">取消</el-button>
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
  update,
  sendInvitationEmail,
  topping
} from "api/reviewer/campaign/campaignInfo";
import {
  getWebsiteList,
  checkServerSelected,
  itemTypeOptions,
  brandPage,
  countryPage,
  reviewType,
  getSalesGroups,
  formatJson,
  formatCampStatus,
  formatReviewType
} from "api/reviewer/reviewCommon";
import { mapGetters } from "vuex";
import Cookies from 'js-cookie';
export default {
  name: "campaignInfo",
  data() {
    return {
      form: {
        campaignNo: undefined,
        brandId: undefined,
        productName: undefined,
        shortName: undefined,
        asin: undefined,
        sku: undefined,
        model: undefined,
        countryId: undefined,
        campaignQty: undefined,
        receivedQty: undefined,
        dailyCampaignQty: undefined,
        imgUrl: undefined,
        price: undefined,
        status: undefined,
        fromDate: undefined,
        toDate: undefined,
        amzBulletPoint: undefined,
        description: undefined,
        salesGroup: undefined,
        teamLeader: undefined,
        needInvoice: undefined,
        bonus: undefined,
        reviewFlag: undefined,
        accessLink: undefined,
        sellerName: undefined,
        sellerId: undefined,
        searchKeyword: undefined,
        reviewQty: undefined,
        campaignBrand: undefined,
        payer: undefined,
        channel: undefined,
        requestNo: undefined,
        remark: undefined,
        createBy: undefined,
        createDate: undefined,
        updateBy: undefined,
        updateDate: undefined
      },
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        model: undefined,
        asin: undefined,
        campaignNo: undefined,
        salesGroup: undefined,
        status: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      uploadImgUrl: '',
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      serverName: undefined,
      websiteOptions: undefined,
      tableHeight: undefined,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadImgName: undefined,
      campaignStatus: [
        { value: 1, label: "进行中"},
        {label: '已暂停', value: 4},
        {label: '已结束（手动）', value: 3},
        {label: '已结束（售完）', value: 31},
        {label: '已结束（到期）', value: 32},
        {label: '已删除', value: 2}
      ],
      brandOptions: [],
      countryOptions: [],
      reviewType: [],
      rules: {
        campaignNo: [
          {
            required: true,
            message: "请输入活动编号",
            trigger: "blur"
          }, {
            min: 3,
            max: 32,
            message: "长度在 3 到 32 个字符",
            trigger: "blur"
          }
        ],
        brandId: [
          {
            required: true,
            message: "请选择活动入口",
            trigger: "blur"
          }
        ],
        sku: [
         {
            required: true,
            message: "请输入展示名称",
            trigger: "blur"
          }, {
            min: 3,
            max: 128,
            message: "长度在 3 到 16 个字符",
            trigger: "blur"
          }
        ],
        countryId: [
          {
            required: true,
            message: "请选择国家",
            trigger: "blur"
          }
        ],
        campaignQty: [
          {
            required: true,
            message: "请输入活动数量",
            trigger: "blur"
          },{
              pattern: /^(0|\+?[1-9][0-9]*)$/,
              message: '活动数量不正确'
          }
        ],
        asin: [
         {
            required: true,
            message: "请输入ASIN",
            trigger: "blur"
          }, {
            min: 3,
            max: 64,
            message: "长度在 3 到 64 个字符",
            trigger: "blur"
          }
        ],
        shortName: [
         {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }, {
            min: 3,
            max: 64,
            message: "长度在 3 到 128 个字符",
            trigger: "blur"
          }
        ],
        receivedQty: [
          {
            required: true,
            message: "请输入已领数量",
            trigger: "blur"
          },{
              pattern: /^(0|\+?[1-9][0-9]*)$/,
              message: '已领数量不正确'
          }
        ],
        dailyCampaignQty: [
         {
              pattern: /^(0|\+?[1-9][0-9]*)$/,
              message: '每日活动数量不正确'
          }
        ],
        price: [
          {
            required: true,
            message: "请输入价格",
            trigger: "blur"
          }, {
              pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,
              message: '价格不正确'
          }
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ],
        channel: [
         {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }, {
            min: 3,
            max: 128,
            message: "长度在 3 到 128 个字符",
            trigger: "blur"
          }
        ],
        fromDate: [
         {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        toDate: [
         {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        salesGroup: [
         {
            required: true,
            message: "请输入组别",
            trigger: "blur"
          }, {
            min: 3,
            max: 64,
            message: "长度在 3 到 64 个字符",
            trigger: "blur"
          }
        ],
        teamLeader: [
         {
            required: true,
            message: "请输入组长",
            trigger: "blur"
          }, {
            min: 3,
            max: 64,
            message: "长度在 3 到 64 个字符",
            trigger: "blur"
          }
        ],
        bonus: [
          {
            required: true,
            message: "请输入奖励金额",
            trigger: "blur"
          }, {
              pattern: /^(0|\+?[1-9][0-9]*)+(.[0-9]{1,2})?$/,
              message: '奖励金额不正确'
          }
        ],
        reviewFlag: [
          {
            required: true,
            message: "请选择留评类型",
            trigger: "blur"
          }
        ],
        reviewQty: [
         {
              pattern: /^(0|\+?[1-9][0-9]*)$/,
              message: '当前评论数量不正确'
          }
        ],
        campaignBrand: [
         {
            required: true,
            message: "请输入品牌(展示)",
            trigger: "blur"
          }, {
            min: 3,
            max: 128,
            message: "长度在 3 到 128 个字符",
            trigger: "blur"
          }
        ]
      },
      teamOptions: undefined,
      teamLeader: undefined,
      importCampaignUrl: '',
      fullscreenLoading: false,
      importErrorList: [],
      uploadDialogVisible: false,
      imgList: [],
      importImgdialogVisible: false,
      sendEmailDialogVisible: false,
      sendEmailForm: {
        serverName: undefined
      }
    };
  },
  created() {
    this.getWebsiteList();
    this.getsalesGroups();
    this.reviewType = reviewType;
  },
  mounted: function() {
    // this.tableHeight = window.innerHeight - this.$refs.elementTable.$el.offsetTop - 80;
    this.tableHeight = window.innerHeight * 0.85;
  },
  computed: {
    ...mapGetters(["elements"]),
    headers(){
      return {
        'Authorization': Cookies.get('Admin-Token')
      }
    }
  },
  methods: {
    getList() {
      if (!checkServerSelected(this.serverName)) {
        this.$notify({
          title: '失败',
          message: '请选择目标站点！',
          type: 'error'
        });
        return false;
      }
      this.listLoading = true;
      page(this.serverName, this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
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
      if (!checkServerSelected(this.serverName)) {
        this.$message.error("操作失败，目标站点不能为空！");
        return false;
      }
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    // 产品图片
    handleUpdate(row) {
      getObj(this.serverName, row.id).then(response => {
        this.form = response.data;
        if (response.data.imgUrl) { // 产品图片路径
          let website = '';
          if (this.serverName === 'panda') {
            website = 'https://www.pandagiftstar.com';
          } else if (this.serverName === 'dealants') {
            website = 'https://www.dealants.com';
          }
          this.form.imgUrl =  website + '/media/pic/product/' + response.data.imgUrl;
        }
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
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
          if (this.uploadImgName) {
            this.form.imgUrl = this.uploadImgName; // 图片地址
          }
          this.form.id = undefined;
          addObj(this.serverName, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      })
    },
    // 更新
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          if (this.uploadImgName) {
            this.form.imgUrl = this.uploadImgName; // 图片地址
          } else {
            this.form.imgUrl = undefined;
          }
          update(this.serverName, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set.upload.clearFiles();
      this.uploadImgName = undefined;
    },
    checkCampaign () {
    },
    resetTemp() {
      this.form = {
      };
    },
    // 站点列表
    getWebsiteList() {
      getWebsiteList().then(response => {
        this.websiteOptions = response.data.rows;
      });
    },
    // 查询国家
    getCountryList() {
      if (!this.serverName) {
        this.brandOptions = [];
        return false;
      }
      countryPage(this.serverName).then(response => {
        this.countryOptions = response.data.rows;
      });
    },
    // 查询品牌
    getBrandList() {
      if (!this.serverName) {
        this.brandOptions = [];
        return false;
      }
      brandPage(this.serverName).then(response => {
        this.brandOptions = response.data.rows;
      });
    },
    // 改变站点时清空数据
    changeWebsite() {
      this.list = [];
      this.uploadImgUrl = '/api/' + this.serverName + '/campaignInfo/uploadProImg';
      this.importCampaignUrl = '/api/'+this.serverName+'/campaignInfo/importCampaign';
      this.getCountryList();
      this.getBrandList();
    },
    formatCampStatus (row, column) {
        return formatCampStatus(row, column);
    },
    formatReviewFlag(row, column) {
     return formatReviewType(row, column);
    },
    handleRemove(file, fileList) {
      this.uploadImgName = undefined;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadImgSuccess (response, file, fileList) {
      if (response.resCode === 200 && response.data) {
        this.uploadImgName = response.data;
      } else {
        this.uploadImgName = undefined;
        this.$notify({
          title: "失败",
          message: "图片上传失败，请联系技术IT支持！</br>" + resultVo.resDes,
          type: "error",
          duration: 2000
        });
      }
    },
    getsalesGroups() {
      getSalesGroups().then(response => {
        this.teamOptions = response.data;
      })
    },
    exportTpl()  {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID','活动编号','状态','品牌','产品名称', '名称(展示)','国家','渠道','Model','Asin','Sku','组别','组长','开始时间','结束时间','活动数量','已领数量','每日限量','价格','奖励','留评类型','活动入口','分享链接','卖家ID','卖家名称','搜索关键词','评论数量','备注','Bullet Point'];
        const data = [];
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'campaign-tpl',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    beforeUpload(file) {
      // 文件类型检验
      if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
        this.$message.error('请上传excel文件');
        return false;
      }
    },
    uploadSuccess(response) {
      this.$refs.uploadFile.clearFiles();
      this.fullscreenLoading=false;
      if (response.resCode != 200) {
        this.$message.error(response.resDes);
        this.importErrorList = response.data;
        this.uploadDialogVisible = true;
      } else {
        this.$message.success("导入成功");
        this.getList();
      }
    },
    uploadError(error) {
      this.fullscreenLoading = false;
      this.$message.error('导入失败，请检查excel或联系IT人员');
    },
    getUserId() {
      let userId = Cookies.get('UserId');
      return userId;
    },
    exportList () {
      let exportQuery = this.listQuery;
      exportQuery.page = 1;
      exportQuery.limit = 6000;
      this.fullscreenLoading = true;
      page(this.serverName, exportQuery).then(response => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID','活动编号','状态','品牌','产品名称', '名称(展示)','国家','渠道','Model','Asin','Sku','组别','组长','开始时间','结束时间','活动数量','已领数量','每日限量','价格','奖励','留评类型','活动入口','分享链接','卖家ID','卖家名称','搜索关键词','评论数量','备注','Bullet Point'];
          const filterVal = ['id','campaignNo','statusStr','campaignBrand','productName','shortName','countryCode','channel','model','asin','sku','salesGroup','teamLeader','fromDate','toDate','campaignQty','receivedQty','dailyCampaignQty','price','bonus','reviewFlagStr','brandName','accessLink','sellerId','sellerName','searchName','reviewQty','remark','amzBulletPoint'];
          const list = response.data.rows;
          const data = formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'campaign-list',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
        this.fullscreenLoading = false;
      });
    },
    submitUpload() {
      this.$refs.uploadImg.submit();
    },
    handleImgRemove(file, imgList) {
      console.log(file, imgList);
    },
    handleImgPreview(file) {
      console.log(file);
    },
    sendEmail() {
      this.fullscreenLoading = true;
      if (!this.serverName) {
        this.fullscreenLoading = false;
        this.$message.error("操作失败，请先选择站点");
        return false;
      }
      this.sendEmailForm.serverName = this.serverName;
      // 耗时较长，直接返回成功
      sendInvitationEmail(this.serverName, this.sendEmailForm);
      this.fullscreenLoading = false;
      this.sendEmailDialogVisible = false;
      this.$message.success("发送成功");
    },
    // 置顶
    topping (row) {
      if (!this.serverName) {
        this.$notify({
          title: '失败',
          message: '请选择目标站点！',
          type: 'error'
        });
        return false;
      }
      this.fullscreenLoading = true;
      topping(this.serverName, row).then(resp => {
        this.fullscreenLoading = false;
        if (resp.resCode == 200) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success"
          });
        } else {
           this.$notify({
            title: "失败",
            message: resp.resDes,
            type: "error"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
  .form-el-all {
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
</style>
