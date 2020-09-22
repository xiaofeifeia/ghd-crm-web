<template>
  <div class="app-container calendar-list-container" v-loading="fullscreenLoading">
    <div style="margin-bottom: 10px;">
      <el-form v-model="listQuery" style="display: flex; flex-wrap: wrap;" label-width="100px">
        <el-form-item label="站点" v-if="isAdmin">
          <el-select v-model="listQuery.serverName" clearable placeholder="请选择">
            <el-option v-for="item in websiteOptions" :key="item.serverName" :label="item.websiteName" :value="item.serverName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" >
          <el-input v-model="listQuery.campaignNo" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="活动编号" >
          <el-input v-model="listQuery.customizeCampaignNo" clearable placeholder="自定义活动编号" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="ASIN" >
          <el-input v-model="listQuery.asin" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable>
            <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论类型">
          <el-select v-model="listQuery.reviewFlag" placeholder="请选择" clearable>
            <el-option v-for="item in reviewType" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组别">
          <el-input v-model="listQuery.salesGroup" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="组别">
          <el-select v-model="listQuery.salesGroup" clearable placeholder="请选择" class="filter-item">
            <el-option v-for="item in teamOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卖家名称" >
          <el-input v-model="listQuery.sellerName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="产品标题">
          <el-input v-model="listQuery.shortName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="listQuery.createUserName" clearable placeholder="请输入" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div align="center" style="margin-bottom: 10px;">
      <el-button type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="primary" v-waves icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button type="primary" v-waves icon="el-icon-download"  @click="exportTpl">下载模版</el-button>
      <el-upload ref="uploadFile" :before-upload="beforeUpload" action="/api/reviewer/reviewerCampaignAssign/importCampaign"
                 :headers="headers" name="excel" :auto-upload='true' :data="{userId: userId}" :limit="1"
                 :on-success="uploadSuccess" :on-error="uploadError" style="display: inline-block"
                 accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
        <el-button type="primary" v-waves icon="el-icon-upload" style="margin-left: 10px">导入</el-button>
      </el-upload>
      <el-button type="primary" v-waves  icon="el-icon-download" style="margin-left: 10px" @click="exportList">导出</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-upload" @click="importImgdialogVisible=true">上传图片</el-button>
      <el-button type="primary" v-waves icon="el-icon-share" @click="handleAssign" v-if="campaignAssign_btn_assign">发布活动</el-button>
    </div>

    <el-table :key='tableKey' :data="list" ref="elementTable" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="tableHeight" @cell-click="viewImg">
      <el-table-column type="selection" align="center" fixed="left"></el-table-column>
        <el-table-column width="80px" align="center" label="图片" fixed="left">
        <template slot-scope="scope">
          <img :src="scope.row.imgThumbUrl" width="60px" height="60px">
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="序号" tooltip-effect="系统自动生成" >
        <template slot-scope="scope" >
          <el-link type="success" @click="handleView(scope.row)">{{scope.row.campaignNo}}</el-link>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="活动编号" >
        <template slot-scope="scope" >
          <el-link type="success" @click="handleView(scope.row)">{{scope.row.customizeCampaignNo}}</el-link>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="站点" :v-if="isAdmin">
        <template slot-scope="scope">
          <span>{{scope.row.website}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态" :formatter="formatCampStatus">
      </el-table-column>
            <el-table-column width="100px" align="center" label="国家">
        <template slot-scope="scope">
          <span>{{scope.row.country}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="渠道">
        <template slot-scope="scope">
          <span>{{scope.row.channel}}</span>
        </template>
      </el-table-column>
          <el-table-column width="150px" align="center" label="组别">
        <template slot-scope="scope">
          <span>{{scope.row.salesGroup}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="组长">
        <template slot-scope="scope">
          <span>{{scope.row.teamLeader}}</span>
        </template>
      </el-table-column>
            <el-table-column width="150px" align="center" label="Asin">
        <template slot-scope="scope">
          <span>{{scope.row.asin}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="Sku">
        <template slot-scope="scope">
          <span>{{scope.row.sku}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="搜索关键词" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.searchKeyword}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="站外链接" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.accessLink}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="产品标题" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="售价">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="Asin现有review数量">
        <template slot-scope="scope">
          <span>{{scope.row.reviewQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="品牌名">
        <template slot-scope="scope">
          <span>{{scope.row.campaignBrand}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="卖家名称">
        <template slot-scope="scope">
          <span>{{scope.row.sellerName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="卖家ID">
        <template slot-scope="scope">
          <span>{{scope.row.sellerId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="Bullet Point" :show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.amzBulletPoint}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.fromDateStr}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.toDateStr}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="活动数量">
        <template slot-scope="scope">
          <span>{{scope.row.campaignQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="每日限量">
        <template slot-scope="scope">
          <span>{{scope.row.dailyCampaignQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="已领取数量">
        <template slot-scope="scope">
          <span>{{scope.row.receivedQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="奖励">
        <template slot-scope="scope">
          <span>{{scope.row.bonus}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="评论类型">
        <template slot-scope="scope">
          <span>{{scope.row.reviewFlagStr}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0 && (userId == scope.row.createBy || isAdmin)" size="mini" type="primary"
            @click="handleUpdate(scope.row)" title="编辑" icon="el-icon-edit" circle ></el-button>
          <el-button v-if="scope.row.status === 0 && (userId == scope.row.createBy || isAdmin)" size="mini" type="success"
            @click="updateStatus(scope.row,'确认',2)"  title="确认" icon="el-icon-check" circle></el-button>
          <el-button v-if="scope.row.status === 1 && (userId == scope.row.createBy || isAdmin)" size="mini" type="info"
            @click="updateStatus(scope.row,'暂停', 4)" title="暂停" icon="el-icon-video-pause" circle></el-button>
          <el-button v-if="scope.row.status === 4 && (userId == scope.row.createBy || isAdmin)" size="mini" type="warning"
            @click="updateStatus(scope.row,'开启',1)"  title="开启" icon="el-icon-video-play" circle></el-button>
          <el-button v-if="(scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 4) && (userId == scope.row.createBy || isAdmin)" size="mini" type="danger"
            @click="updateStatus(scope.row,'结束',3)"  title="结束" icon="el-icon-close" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- 新增/查看弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @closed="cancel" v-dialogDrag>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item >
          <el-col :span="11">
            <el-form-item label="产品图片">
              <div class="demo-image__placeholder">
                <div class="block">
                  <el-image :src="form.imgThumbUrl" style="width: 150px; height: 150px">
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
            <el-form-item label="序号" prop="campaignNo">
              <el-input v-model="form.campaignNo" placeholder="序号" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="活动编号" prop="customizeCampaignNo">
              <el-input v-model="form.customizeCampaignNo" placeholder="自定义活动编号"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
           <el-form-item label="国家" prop="country">
                <el-select v-model="form.country" clearable placeholder="请选择" class="filter-item">
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.countryCode"
                    :label="item.countryCode"
                    :value="item.countryCode"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="渠道" prop="channel">
              <el-input v-model="form.channel" placeholder="请输入渠道"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="组别" prop="salesGroup">
              <el-select v-model="form.salesGroup" clearable placeholder="请输入组别" class="filter-item">
                <el-option
                  v-for="item in teamOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
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
           <el-form-item label="asin" prop="asin">
              <el-input v-model="form.asin" placeholder="请输入asin"></el-input>
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
           <el-form-item label="售价" prop="price">
              <el-input v-model="form.price" placeholder="请输入售价"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="奖励" prop="bonus">
              <el-input v-model="form.bonus" placeholder="请输入奖励"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="Review数量" prop="reviewQty">
              <el-input v-model="form.reviewQty" placeholder="请输入Asin现有review数量"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="品牌名" prop="campaignBrand">
              <el-input v-model="form.campaignBrand" placeholder="请输入品牌名"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-form-item label="卖家名称" prop="sellerName">
              <el-input v-model="form.sellerName" placeholder="请输入卖家名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="卖家ID" prop="sellerId">
              <el-input v-model="form.sellerId" placeholder="请输入卖家ID"></el-input>
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
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="结束时间" prop="toDate">
              <el-date-picker
                v-model="form.toDate"
                type="date"
                placeholder="选择结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item>
           <el-col :span="11">
            <el-form-item label="活动数量" prop="campaignQty">
              <el-input v-model="form.campaignQty" placeholder="请输入活动数量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
           <el-form-item label="每日限量" prop="dailyCampaignQty">
              <el-input v-model="form.dailyCampaignQty" placeholder="请输入每日限量"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- <el-form-item>
          <el-col :span="11">
           <el-form-item label="已领取数量" prop="receivedQty" >
              <el-input v-model="form.receivedQty" placeholder="请输入已领取数量" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item> -->
        <el-form-item>
            <el-col :span="11">
            <el-form-item label="评论类型" prop="reviewFlag">
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
          <!-- <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="11">
              <el-form-item label="状态" prop="campaignBrand">
                <el-select v-model="form.status" placeholder="请选择" clearable :disabled="true">
                  <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
              <el-form-item label="是否返仓" prop="isReturnWarehouse">
                <el-select v-model="form.isReturnWarehouse" placeholder="请选择" clearable >
                  <el-option v-for="item in returnWhOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="22">
            <el-form-item label="产品标题" prop="shortName">
              <el-input v-model="form.shortName" type="textarea" :rows="2" placeholder="不允许出现卖家名、品牌名和ASIN"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="22">
            <el-form-item label="站外链接" prop="accessLink">
              <el-input v-model="form.accessLink"  type="textarea" :rows="3" placeholder="不允许填写AMZ站内链接，多个站外链接用“;”分号隔开(示例: http://www.youtube.com/xxx;https://www.dealnews.com/xxx;...)，每次随机展示一个，请确保通过链接能找到产品"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
           <el-col :span="22">
            <el-form-item label="搜索关键词" prop="searchKeyword">
              <el-input   type="textarea" :rows="3" v-model="form.searchKeyword" placeholder="不允许出现卖家名、品牌名和ASIN，多组关键词用“;”分号隔开(示例: Running Headphones;Bluetooth Headphones;...),每次随机展示一组，请确保通过关键词在前三页能搜到"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item >
          <el-col :span="22">
            <el-form-item label="Bullet Point" prop="amzBulletPoint">
              <el-input   type="textarea" :rows="4" v-model="form.amzBulletPoint" placeholder="不允许出现卖家名、品牌名和ASIN，每行末尾以“;”分号隔开(示例: RICHER BASS HD STEREO SOUND;IPX7 waterproof shell and interior Nano-coating; With built-in CVC 6.0 noise canceling microphones;....)"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 需求分配 start -->
    <el-dialog title="活动发布" :visible.sync="campaignAssignDialogVisible"  v-dialogDrag>
      <el-form>
        <el-form-item label="站点">
          <el-select v-model="assignForm.serverName" placeholder="请选择">
            <el-option v-for="item in websiteOptions" :label="item.websiteName" :key="item.serverName" :value="item.serverName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" v-waves @click="assignCampaign">确定</el-button>
        <el-button type="primary" v-waves @click="campaignAssignDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 需求分配 end -->
    <!-- 导入失败提醒框start -->
    <el-dialog title="导入失败" :visible.sync="uploadDialogVisible" width="90%">
      <el-table :data="importErrorList" border fit highlight-current-row>
        <el-table-column width="200px" align="center" label="错误信息" fixed="left">
          <template slot-scope="scope"><span>{{scope.row.errorRemark}}</span></template>
        </el-table-column>
           <el-table-column width="200px" align="center" label="国家">
          <template slot-scope="scope"><span>{{scope.row.country}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="渠道">
          <template slot-scope="scope"><span>{{scope.row.channel}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="组别">
          <template slot-scope="scope"><span>{{scope.row.salesGroup}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="组长">
          <template slot-scope="scope"><span>{{scope.row.teamLeader}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="Asin">
          <template slot-scope="scope"><span>{{scope.row.asin}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="Sku">
          <template slot-scope="scope"><span>{{scope.row.sku}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="搜索关键词" show-overflow-tooltip ="true">
          <template slot-scope="scope"><span>{{scope.row.searchKeyword}}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="站外链接" show-overflow-tooltip ="true">
          <template slot-scope="scope"><span>{{scope.row.accessLink}}</span></template>
        </el-table-column>
      <el-table-column width="200px" align="center" label="产品标题" show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="售价">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="Asin现有review数量">
        <template slot-scope="scope">
          <span>{{scope.row.reviewQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="品牌名">
        <template slot-scope="scope">
          <span>{{scope.row.campaignBrand}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="卖家名称">
        <template slot-scope="scope">
          <span>{{scope.row.sellerName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="卖家ID">
        <template slot-scope="scope">
          <span>{{scope.row.sellerId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="Bullet Point" show-overflow-tooltip ="true">
        <template slot-scope="scope">
          <span>{{scope.row.amzBulletPoint}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.fromDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.toDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="活动数量">
        <template slot-scope="scope">
          <span>{{scope.row.campaignQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="每日限量">
        <template slot-scope="scope">
          <span>{{scope.row.dailyCampaignQty}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="奖励">
        <template slot-scope="scope">
          <span>{{scope.row.bonus}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="评论类型">
        <template slot-scope="scope">
          <span>{{scope.row.reviewFlag}}</span>
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 导入失败提醒框end -->

    <!-- 上传产品图片start -->
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
        :on-success="batchUploadImgSuccess"
        list-type="picture"
        :auto-upload="false"
         name="proImg"
        >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件</div>
      </el-upload>
    </el-dialog>
    <!-- 上传产品图片end -->

    <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj,
    listCampaignAssign,
    assignCampaign,
    add,
    update,
    updateStatus,
    getSellerDeptGroups
  } from 'api/reviewer/common/reviewerCampaignAssign';
  import {
    getWebsiteList,
    formatJson,
    countryPage,
    getUserRoles,
    formatCampStatus,
    reviewType
  } from "api/reviewer/reviewCommon";
  import {mapGetters} from 'vuex';
  import Cookies from 'js-cookie';

  export default {
    name: 'reviewerCampaignAssign',
    data() {
      return {
        form: {
          brand: undefined,
          productName: undefined,
          shortName: undefined,
          asin: undefined,
          sku: undefined,
          model: undefined,
          country: undefined,
          campaignQty: undefined,
          receivedQty: undefined,
          dailyCampaignQty: undefined,
          imgUrl: undefined,
          price: undefined,
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
          channel: undefined,
          remark: undefined,
          imgThumbUrl: undefined,
          customizeCampaignNo: undefined,
          isReturnWarehouse: 0
        },
        countryOptions: [],
        reviewType: [],
        rules: {
          country: [
            {
              required: true,
              message: '请选择国家'
            }
          ],  channel: [
          {
            required: true,
            message: '请输入渠道',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 128,
            message: '长度在 1 到 128 个字符',
            trigger: 'blur'
          }
        ],
          shortName: [
            {
              required: true,
              message: '请输入产品简称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 255,
              message: '长度在 1 到 255 个字符',
              trigger: 'blur'
            }
          ], asin: [
            {
              required: true,
              message: '请输入Asin',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 64 个字符',
              trigger: 'blur'
            }
          ], sku: [
            {
              required: true,
              message: '请输入sku',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 16,
              message: '长度在 1 到 16 个字符',
              trigger: 'blur'
            }
          ], model: [
            {
              required: true,
              message: '请输入model',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 16,
              message: '长度在 1 到 32 个字符',
              trigger: 'blur'
            },
          ],
          salesGroup: [
            {
              required: true,
              message: '请选择组别',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 64 个字符',
              trigger: 'blur'
            }
          ],sellerId: [
            {
              required: true,
              message: '请输入卖家Id',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 255,
              message: '长度在 1 到 255 个字符',
              trigger: 'blur'
            }
          ],sellerName: [
            {
              required: true,
              message: '请输入卖家名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 64 个字符',
              trigger: 'blur'
            }
          ],
          campaignQty: [
            {
              required: true,
              message: '请输入预期领取量',
              trigger: 'blur'
            },{
              pattern: /^(0|\+?[1-9][0-9]*)$/,
              message: '活动数量不正确'
            }
          ], price: [
            {
              required: true,
              message: '请输入售价',
              trigger: 'blur'
            }, {
              pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,
              message: '售价不正确'
          }
          ], bonus: [
             {
              pattern: /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/,
              message: '奖励不正确'
          }
          ], fromDate: [
            {
              required: true,
              message: '请输入活动开始时间',
              trigger: 'blur'
            }
          ], toDate: [
            {
              required: true,
              message: '请输入活动结束时间',
              trigger: 'blur'
            }
          ], teamLeader: [
            {
              required: true,
              message: '请输入组长',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 64 个字符',
              trigger: 'blur'
            }
          ], needInvoice: [
            {
              required: true,
              message: '请输入是否需要发票',
              trigger: 'blur'
            }
          ], reviewFlag: [
            {
              required: true,
              message: '请选择评论类型',
              trigger: 'blur'
            }
          ], campaignBrand: [
            {
              required: true,
              message: '请输入品牌',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 128,
              message: '长度在 1 到 128 个字符',
              trigger: 'blur'
            }
          ], reviewQty: [
            {
              required: true,
              message: '请输入Review数量',
              trigger: 'blur'
            },{
              pattern: /^(0|\+?[1-9][0-9]*)$/,
              message: 'Review数量不正确'
            }
          ], dailyCampaignQty: [
            {
              pattern: /^(0|\+?[1-9][0-9]*)$/,
              message: '请输入整数'
            }
          ],amzBulletPoint: [
            {
              required: true,
              message: '请输入Bullet Point',
              trigger: 'blur'
            }
          ],customizeCampaignNo: [
            {
              max: 500,
              message: '长度在 1 到 500 个字符',
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
          status: undefined,
          asin: undefined,
          reviewFlag: undefined,
          country: undefined,
          salesGroup: undefined,
          sellerName: undefined,
          shortName: undefined,
          website: undefined,
          createUserName: undefined,
          customizeCampaignNo: undefined
        },
        dialogFormVisible: false,
        campaignAssignDialogVisible: false,
        uploadDialogVisible: false,
        importErrorList: undefined,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建',
          view: '查看'
        },
        tableKey: 0,
        tableHeight: undefined,
        statusOptions: [
          {label: '新建', value: 0},
          {label: '已确认', value: 2},
          {label: '已发布', value: 1},
          {label: '已暂停', value: 4},
          {label: '已结束（手动）', value: 3},
          {label: '已结束（售完）', value: 31},
          {label: '已结束（到期）', value: 32}
        ],
        websiteOptions: undefined,
        assignForm: {
          serverName: undefined,
          ids: undefined
        },
        fullscreenLoading: false,
        imgList: [],
        importImgdialogVisible: false,
        uploadImgUrl: '/api/reviewer/reviewerCampaignAssign/uploadProImg',
        imgDialogVisible: false,
        uploadImgName: undefined,
        dialogImageUrl: undefined,
        campaignAssign_btn_assign: false,
        userId: undefined,
        isAdmin: false,
        teamOptions: undefined,
        returnWhOptions: [
          {label: '否', value: 0},
          {label: '是', value: 1}
        ]
      }
    },
    created() {
      this.campaignAssign_btn_assign = this.elements['reviewerCampaignAssign:btn_assign'];
      this.isWebsiteAdmin();
      this.getList();
      this.getCountryList();
      this.getSellerDeptGroups();
      this.reviewType = reviewType;
    },
    computed: {
      ...mapGetters([
        'elements'
      ]),
      headers(){
        return {
          'Authorization': Cookies.get('Admin-Token')
        }
      }
    },
    mounted: function () {
      this.tableHeight = window.innerHeight * 0.85;
      this.getUserId();
    },
    methods: {
      getList() {
        this.listLoading = true;
        listCampaignAssign(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleClear() {
        this.listQuery.campaignNo = undefined;
        this.listQuery.brand = undefined;
        this.listQuery.productName = undefined;
        this.listQuery.asin = undefined;
        this.listQuery.sku = undefined;
        this.listQuery.status = undefined;
        this.listQuery.website = undefined;
        this.listQuery.createUserName = undefined;
        this.getList();
      },
      handleAssign() {
        this.assignForm.serverName = undefined;
        this.campaignAssignDialogVisible = true;
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
        getObj(row.id).then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
        });
      },
      handleView(row) {
        getObj(row.id).then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'view';
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            delObj(row.id).then(() => {
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
        this.fullscreenLoading = true;
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            if (!this.form.searchKeyword && !this.form.accessLink) {
               this.$message.error('搜索关键词和站外链接不能同时为空!');
               return false;
            }
            if (this.uploadImgName) {
              this.form.imgUrl = this.uploadImgName; // 图片地址
            } else {
              this.form.imgUrl = null;
            }
            this.form.fromDate = this.form.fromDate + ' 00:00:00';
            this.form.toDate = this.form.toDate + ' 00:00:00';
            add(this.form).then(response => {
              if (response.resCode != 200) {
                this.$alert(response.resDes, "添加失败");
              } else {
                this.dialogFormVisible = false;
                this.$message.success("添加成功");
                this.getList();
              }
              this.fullscreenLoading = false;
            }).catch(error => {
              // this.dialogFormVisible = false;
              this.fullscreenLoading = false;
              this.$message.error(JSON.stringify(error));
            })
          } else {
            this.fullscreenLoading = false;
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set.upload.clearFiles();
        this.uploadImgName = undefined;
      },
      update(formName) {
        this.fullscreenLoading = true;
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            if (!this.form.searchKeyword && !this.form.accessLink) {
               this.$message.error('搜索关键词和站外链接不能同时为空!');
               return false;
            }
            if (this.uploadImgName) {
              this.form.imgUrl = this.uploadImgName; // 图片地址
            }
            update(this.form).then(response => {
              if (response.resCode != 200) {
                this.$alert(response.resDes, "编辑失败");
              } else {
                this.$message.success("编辑成功");
                this.dialogFormVisible = false;
                this.getList();
              }
              this.fullscreenLoading = false;
            }).catch(error => {
              this.fullscreenLoading = false;
              this.$message.error(JSON.stringify(error));
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
      getWebsiteList() {
        getWebsiteList().then(response => {
          this.websiteOptions = response.data.rows;
        }).catch(error => {
          this.$message.error(JSON.stringify(error));
        });
      },
      // 分配活动需求
      assignCampaign() {
        let selection = this.$refs.elementTable.selection;
        let length = selection.length;
        if(length < 1) {
          this.fullscreenLoading = false;
          this.$message.error("操作失败，请勾选单据！");
          return false;
        }
        if(!this.assignForm.serverName) {
          this.fullscreenLoading = false;
          this.$message.error("操作失败，请选择站点！");
          return false;
        }
        let idArray = [];
        let flag = false;
        let country;
        let websiteCountry = undefined;
        for (let i = 0; i < this.websiteOptions.length; i++) {
          let obj = this.websiteOptions[i];
          if (obj.serverName === this.assignForm.serverName) {
            websiteCountry = obj.country;
            break;
          }
        }
        for (let i = 0; i <= length - 1; i++) {
          if (selection[i].status !== 2) {
            this.$message.error("操作失败，请选择已确认状态需求进行分配！");
            return false;
          }
          if (!country) {
             country = selection[i].country;
          } else if (country !== selection[i].country) {
            this.$message.error("操作失败，所选活动需求必须为同一国家！");
            return false;
          }
          if (!selection[i].imgUrl || selection[i].imgUrl === '') {
            this.$message.error("操作失败，请先上传活动产品图片！");
            return false;
          }
          if (country !== websiteCountry) {
            this.$notify({
              title: "失败",
              message: "活动国家和站点国家不匹配！",
              type: "error"
            });
            return false;
          }
          idArray.push(selection[i].id);
        }
        this.assignForm.ids = idArray.join();
        this.fullscreenLoading = true;
        assignCampaign(this.assignForm).then(response => {
          if (response.resCode != 200) {
            this.$alert(response.resDes, "分配失败");
          } else {
            this.campaignAssignDialogVisible = false;
            this.$message.success("分配成功");
            this.getList();
          }
          this.fullscreenLoading = false;
        }).catch(error => {
          this.campaignAssignDialogVisible = false;
          this.fullscreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      uploadSuccess(response) {
        this.$refs.uploadFile.clearFiles();
        this.fullscreenLoading = false;
        if (response.resCode != 200) {
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
      beforeUpload(file) {
        console.log('file type:', file.type);
        // 32位系统读取不到文件内容类型不做校验，文件类型检验
        if (file.type && file.type.length > 1 && !(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
          this.$message.error('请上传excel文件');
          return false;
        }
      },
      exportTpl() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ["活动编号（请勿重复输入）","国家","渠道","组别","组长","Asin","Sku","搜索关键词","站外链接","产品标题","售价","asin现有review数量","品牌名","卖家名称","卖家ID","Bullet Point","开始时间","结束时间","活动数量","每日限送量","奖励","评论类型(免评/文本/图片/视频/图片+视频)",'是否返仓(否/是)',"备注"];
          const data = [];
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'campaignAssign-tpl',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
      },
      exportList() {
        let exportQuery = this.listQuery;
        exportQuery.page = 1;
        exportQuery.limit = 6000;
        this.fullscreenLoading = true;
        listCampaignAssign(exportQuery).then(response => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['序号',"活动编号",'状态','品牌', '名称(展示)','国家',"渠道",'Asin','Sku','组别','组长','开始时间','结束时间','活动数量','已领数量','每日限量','价格','奖励','评论类型','站外链接','卖家ID','卖家名称','搜索关键词','评论数量','备注','Bullet Point','是否返仓'];
            const filterVal = ['campaignNo','customizeCampaignNo','statusStr','campaignBrand','shortName','country','channel','asin','sku','salesGroup','teamLeader','fromDate','toDate','campaignQty','receivedQty','dailyCampaignQty','price','bonus','reviewFlagStr','accessLink','sellerId','sellerName','searchKeyword','reviewQty','remark','amzBulletPoint','isReturnWhStr'];
            const list = response.data.rows;
            const data = formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'campaignAssign-list',
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
      // 查询国家
      getCountryList() {
        countryPage().then(response => {
          this.countryOptions = response.data.rows;
        });
      },
      // 修改活动状态
      updateStatus (row, actionType,status) {
        if (status === 2) { // 确认需求
          if (!row.imgUrl || row.imgUrl === '') {
            this.$message.error("操作失败，请先上传活动产品图片！");
            return false;
          }
        }
        this.$confirm('此操作将'+actionType+'活动需求, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let obj = {
              id: row.id,
              status: status
            };
          this.fullscreenLoading = true;
          updateStatus(obj).then(resp => {
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
              this.getList();
            }
            this.fullscreenLoading = false;
          }).catch(error => {
            this.$message.error(JSON.stringify(error));
            this.fullscreenLoading = false;
          })
        });
      },
      handleImgPreview(file) {
      },
      handleImgRemove(file, imgList) {
      },
      submitUpload() {
        this.$refs.uploadImg.submit();
        this.getList();
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.imgDialogVisible = true;
      },
      handleRemove(file, fileList) {
        this.uploadImgName = undefined;
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
      batchUploadImgSuccess(response, file, fileList) {
         this.getList();
      },
      getUserId() {
        this.userId = Cookies.get('UserId');
      },
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
             // 如果是管理员显示站点查询条件
            if (this.isAdmin) {
              this.getWebsiteList();
            }
          }
        });
      },
      formatCampStatus (row, column) {
        return formatCampStatus(row, column);
      },
      getSellerDeptGroups() {
        getSellerDeptGroups().then(response => {
          this.teamOptions = response.data;
        })
      },
      // 点击单元格查看原图
      viewImg(row, column, cell, event) {
        if (column.label=='图片' && row.imgUrl) {
          this.imgDialogVisible = true;
          this.dialogImageUrl = row.imgUrl;
        }
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
