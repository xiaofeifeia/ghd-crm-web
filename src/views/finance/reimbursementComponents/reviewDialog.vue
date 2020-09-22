<template>
  <div class="fixed_table">
    <!-- review费用 输入dialog-->
    <el-dialog title="review费用" :visible.sync="inputDialogVisible" width="90%" :before-close="closeDialog" v-loading="fullScreenLoading" v-dialogDrag top="3vh">
      <el-form :model="reviewForm" :rules="rules" ref="reviewForm">
        <el-table class="inputMainClass" :data="reviewForm.reviewList" highlight-current-row :height="tableHeight"
                  :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
          <el-table-column label="#" type="index" align="center" min-width="65px" fixed="left"/>
          <el-table-column min-width="80px" align="center" label="付款截图" fixed="left">
            <template slot-scope="scope">
              <el-image v-if="scope.row.thumbImgUrl" fit="fill" style="width:33px; height: 33px" :src="scope.row.thumbImgUrl" :preview-src-list="[scope.row.imgUrl]"/>
            </template>
          </el-table-column>
          <el-table-column label="付款截图命名" align="center" min-width="200px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.paymentScreenshot'" :rules="rules.paymentScreenshot">
                <el-input v-model="scope.row.paymentScreenshot" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="日期" align="center" min-width="230px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.date'" :rules="rules.date">
                <el-date-picker v-model="scope.row.date" size="mini" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="亚马逊订单号" align="center" min-width="240px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.orderId'" :rules="rules.orderId">
                <el-input v-model="scope.row.orderId" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="ASIN" align="center" min-width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.asin'" :rules="rules.asin">
                <el-input v-model="scope.row.asin" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="SKU" align="center" min-width="170px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.sku'" :rules="rules.sku">
                <el-input v-model="scope.row.sku" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="收款微信ID/支付宝" align="center" min-width="210px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.payeeName'" :rules="rules.payeeName">
                <el-input v-model="scope.row.payeeName" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="付款微信ID/支付宝" align="center" min-width="210px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.payerName'" :rules="rules.payerName">
                <el-input v-model="scope.row.payerName" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="品牌" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.brand'" :rules="rules.brand">
                <el-input v-model="scope.row.brand" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="主管" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.leader'" :rules="rules.leader">
                <el-input v-model="scope.row.leader" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="组别" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.team'" :rules="rules.team">
                <el-input v-model="scope.row.team" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="渠道" align="center" min-width="190px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.channel'" :rules="rules.channel">
                <el-input v-model="scope.row.channel" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="国家" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.country'" :rules="rules.country">
                <el-input v-model="scope.row.country" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="review链接" align="center" min-width="200px" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.link'">
                <el-input v-model="scope.row.link" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.price'" :rules="rules.price">
                <el-input v-model="scope.row.price" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="价格币种" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.priceCurrency'" :rules="rules.priceCurrency">
                <el-input v-model="scope.row.priceCurrency" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="佣金" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.commission'" :rules="rules.commission">
                <el-input v-model="scope.row.commission" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="佣金币种" align="center" min-width="130px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.commissionCurrency'" :rules="rules.commissionCurrency">
                <el-input v-model="scope.row.commissionCurrency" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="手续费" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.serviceFee'" :rules="rules.serviceFee">
                <el-input v-model="scope.row.serviceFee" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="手续费币种" align="center" min-width="130px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.serviceFeeCurrency'" :rules="rules.serviceFeeCurrency">
                <el-input v-model="scope.row.serviceFeeCurrency" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="汇率" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.rate'" :rules="rules.rate">
                <el-input v-model="scope.row.rate" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="总金额(人民币)" align="center" min-width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.total'" :rules="rules.total">
                <el-input v-model="scope.row.total" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" min-width="200px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.remark'" :rules="rules.remark">
                <el-input v-model="scope.row.remark" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="花费人" align="center" min-width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'reviewList.' + scope.$index + '.applicant'" :rules="rules.applicant">
                <el-input v-model="scope.row.applicant" size="mini" placeholder="请输入" @input="changeList(scope.row, 1)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="驳回理由" align="center" min-width="200px" prop="subtractRemark" show-tooltip-when-overflow/>
          <el-table-column label="操作" align="center" min-width="160px" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="selectedRow.claimerId == userId" size="mini" type="danger" @click="deleteList(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div v-show="!fullScreenLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="getReviewForm.page" :page-sizes="[10, 20, 30, 50, 100, 500]" :page-size="getReviewForm.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="reviewForm.reviewTotal"/>
      </div>
      <div style="margin-top: 15px;text-align: center">
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="addFormColumn">新增行</el-button>
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="clearDetail">清空费用明细</el-button>
        <el-button type="primary" v-waves @click="downloadTemplate">下载模版</el-button>
        <el-button type="primary" v-waves @click="exportReviewDetail">导出</el-button>
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="openImportDialog">导入</el-button>
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="openImageDialog(1)">上传付款截图</el-button>
        <el-button v-waves @click="closeDialog">取消</el-button>
        <el-button v-if="selectedRow.claimerId == userId" v-waves @click="saveReviewDetail">保存</el-button>
      </div>
    </el-dialog>

    <!-- review费用 查询dialog -->
    <el-dialog title="review费用" :visible.sync="queryDialogVisible" width="90%" :before-close="closeDialog" v-loading="fullScreenLoading" v-dialogDrag top="3vh">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="review费用" name="allReviews">
          <el-table :data="reviewForm.reviewList" ref="reviewQueryForm" fit highlight-current-row :height="tableHeight"
                    :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}">
            <el-table-column type="selection" align="center" min-width="65px" fixed="left"/>
            <el-table-column label="#" type="index" align="center" min-width="65px" fixed="left"/>
            <el-table-column label="审批备注" align="center" min-width="200px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.subtractRemark" size="small" placeholder="请输入"/>
              </template>
            </el-table-column>
            <el-table-column min-width="80px" align="center" label="付款截图">
              <template slot-scope="scope">
                <el-image v-if="scope.row.thumbImgUrl" fit="fill" style="width:33px; height: 33px" :src="scope.row.thumbImgUrl" :preview-src-list="[scope.row.imgUrl]"/>
              </template>
            </el-table-column>
            <el-table-column label="付款截图命名" align="center" min-width="200px">
              <template slot-scope="scope">
                <el-button type="danger" plain size="small" @click="viewSameImage(scope.row)" v-if="scope.row.sameImageNum >= 2">{{scope.row.paymentScreenshot}}</el-button>
                <span v-else>{{scope.row.paymentScreenshot}}</span>
              </template>
            </el-table-column>
            <el-table-column label="日期" align="center" min-width="130px">
              <template slot-scope="scope"><span>{{$moment(scope.row.date).format("YYYY-MM-DD")}}</span></template>
            </el-table-column>
            <el-table-column label="亚马逊订单号" align="center" min-width="230px">
              <template slot-scope="scope">
                <span style="color:red; cursor:pointer; background-color:papayawhip; padding:10px" @click="viewDuplicateDetail(scope.row)" v-if="scope.row.duplicateNum >= 1">{{scope.row.orderId}}</span>
                <span v-else>{{scope.row.orderId}}</span>
              </template>
            </el-table-column>
            <el-table-column label="ASIN" align="center" min-width="150px" prop="asin"/>
            <el-table-column label="SKU" align="center" min-width="155px">
              <template slot-scope="scope">
                <span style="color:red; cursor:pointer; background-color:papayawhip; padding:10px" @click="viewDuplicateDetail(scope.row)" v-if="scope.row.duplicateNum >= 1">{{scope.row.sku}}</span>
                <span v-else>{{scope.row.sku}}</span>
              </template>
            </el-table-column>
            <el-table-column label="收款微信ID/支付宝" align="center" min-width="210px" prop="payeeName" show-overflow-tooltip/>
            <el-table-column label="付款微信ID/支付宝" align="center" min-width="210px" prop="payerName" show-overflow-tooltip/>
            <el-table-column label="品牌" align="center" min-width="150px" prop="brand"/>
            <el-table-column label="主管" align="center" min-width="150px" prop="leader"/>
            <el-table-column label="组别" align="center" min-width="150px" prop="team"/>
            <el-table-column label="渠道" align="center" min-width="160px" prop="channel"/>
            <el-table-column label="国家" align="center" min-width="100px" prop="country"/>
            <el-table-column label="review链接" align="center" min-width="130px" show-overflow-tooltip prop="link"/>
            <el-table-column label="价格" align="center" min-width="100px" prop="price"/>
            <el-table-column label="价格币种" align="center" min-width="100px" prop="priceCurrency"/>
            <el-table-column label="佣金" align="center" min-width="100px" prop="commission"/>
            <el-table-column label="佣金币种" align="center" min-width="100px" prop="commissionCurrency"/>
            <el-table-column label="手续费" align="center" min-width="100px" prop="serviceFee"/>
            <el-table-column label="手续费币种" align="center" min-width="100px" prop="serviceFeeCurrency"/>
            <el-table-column label="汇率" align="center" min-width="100px" prop="rate"/>
            <el-table-column label="总金额(人民币)" align="center" min-width="100px" prop="total"/>
            <el-table-column label="备注" align="center" min-width="200px" prop="remark"/>
            <el-table-column label="花费人" align="center" min-width="150px" prop="applicant"/>
          </el-table>
          <div v-show="!fullScreenLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="getReviewForm.page" :page-sizes="[10, 20, 30, 50, 100, 500]"
                           :page-size="getReviewForm.limit" layout="total, sizes, prev, pager, next, jumper"
                           :total="reviewForm.reviewTotal"/>
          </div>
          <div align="center">
            <el-button type="primary" v-waves @click="exportReviewDetail">导出</el-button>
            <el-button v-if="selectedRow.claimerId == userId && selectedRow.status != 5" type="primary" v-waves @click="openImageDialog(1)">上传付款截图</el-button>
            <el-button type="primary" v-waves @click="closeDialog">取消</el-button>
            <el-button v-if="selectedRow.status != 5" type="primary" v-waves @click="addCheckedOrder">加入订单抽查</el-button>
            <el-button v-if="selectedRow.status != 5" type="primary" v-waves @click="addFeeSubtract(1)">加入扣减</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单抽查" name="checkOrder">
          <el-form :model="orderCheckForm" :rules="orderCheckRules" ref="orderCheckForm">
            <el-table :data="orderCheckForm.orderCheckList" ref="orderCheckTable" highlight-current-row
                      :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
              <el-table-column type="selection" align="center" min-width="65px" fixed="left"/>
              <el-table-column label="#" type="index" align="center" min-width="65px" fixed="left"/>
              <el-table-column label="审批备注" align="center" min-width="200px">
                <template slot-scope="scope">
                  <el-form-item :prop="'orderCheckList.' + scope.$index + '.subtractRemark'">
                    <el-input v-model="scope.row.subtractRemark" placeholder="请输入" size="small" @input="changeList(scope.row, 2)"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="订单截图" align="center" min-width="80px">
                <template slot-scope="scope">
                  <el-image v-if="scope.row.thumbImgUrl" fit="fill" style="width:33px; height: 33px" :src="scope.row.thumbImgUrl" :preview-src-list="[scope.row.imgUrl]"/>
                </template>
              </el-table-column>
              <el-table-column label="订单截图命名" align="center" min-width="200px">
                <template slot-scope="scope">
                  <el-form-item :prop="'orderCheckList.' + scope.$index + '.orderScreenshot'" :rules="orderCheckRules.orderScreenshot">
                    <el-input v-model="scope.row.orderScreenshot" placeholder="请输入" @input="changeList(scope.row, 2)"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="日期" align="center" min-width="130px">
                <template slot-scope="scope"><span>{{$moment(scope.row.date).format("YYYY-MM-DD")}}</span></template>
              </el-table-column>
              <el-table-column label="亚马逊订单号" align="center" min-width="225px" prop="orderId"/>
              <el-table-column label="ASIN" align="center" min-width="140px" prop="asin"/>
              <el-table-column label="SKU" align="center" min-width="140px" prop="sku"/>
              <el-table-column label="收款微信ID/支付宝" align="center" min-width="210px" prop="payeeName" show-overflow-tooltip/>
              <el-table-column label="付款微信ID/支付宝" align="center" min-width="210px" prop="payerName" show-overflow-tooltip/>
              <el-table-column label="品牌" align="center" min-width="150px" prop="brand"/>
              <el-table-column label="主管" align="center" min-width="150px" prop="leader"/>
              <el-table-column label="组别" align="center" min-width="150px" prop="team"/>
              <el-table-column label="渠道" align="center" min-width="150px" prop="channel"/>
              <el-table-column label="国家" align="center" min-width="100px" prop="country"/>
              <el-table-column label="review链接" align="center" min-width="130px" prop="link" show-overflow-tooltip/>
              <el-table-column label="价格" align="center" min-width="100px" prop="price"/>
              <el-table-column label="价格币种" align="center" min-width="100px" prop="priceCurrency"/>
              <el-table-column label="佣金" align="center" min-width="100px" prop="commission"/>
              <el-table-column label="佣金币种" align="center" min-width="100px" prop="commissionCurrency"/>
              <el-table-column label="手续费" align="center" min-width="100px" prop="serviceFee"/>
              <el-table-column label="手续费币种" align="center" min-width="100px" prop="serviceFeeCurrency"/>
              <el-table-column label="汇率" align="center" min-width="100px" prop="rate"/>
              <el-table-column label="总金额(人民币)" align="center" min-width="100px" prop="total"/>
              <el-table-column label="备注" align="center" min-width="200px" prop="remark"/>
              <el-table-column label="花费人" align="center" min-width="150px" prop="applicant"/>
            </el-table>
          </el-form>
          <div align="center" style="margin-top: 10px">
            <el-button v-if="loanReimbursement_btn_sendEmail && selectedRow.status !== 5" type="primary" v-waves @click="sendEmail(1)">发送提醒邮件</el-button>
            <el-button v-if="selectedRow.claimerId == userId && selectedRow.status != 5" type="primary" v-waves @click="openImportCheckedOrderDialog">导入</el-button>
            <el-button type="primary" v-waves @click="exportCheckedOrder">导出</el-button>
            <el-button v-if="selectedRow.claimerId == userId && selectedRow.status != 5" type="primary" v-waves @click="openImageDialog(3)">上传订单截图</el-button>
            <el-button v-if="selectedRow.status != 5" type="primary" v-waves @click="addFeeSubtract(2)">加入扣减</el-button>
            <el-button type="primary" v-waves @click="closeDialog">取消</el-button>
            <el-button v-if="selectedRow.claimerId == userId && selectedRow.status != 5" type="primary" v-waves @click="saveCheckedReviewDetail">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="费用扣减" name="feeSubtract">
          <el-form :model="feeSubtractForm">
            <el-table :data="feeSubtractForm.feeSubtractList" ref="feeSubtractForm" highlight-current-row
                      :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
              <el-table-column label="#" type="index" align="center" min-width="65px" fixed="left"/>
              <el-table-column type="selection" align="center" min-width="65px" fixed="left"/>
              <el-table-column label="审批备注" align="center" min-width="200px">
                <template slot-scope="scope">
                  <el-form-item :prop="'feeSubtractList.' + scope.$index + '.subtractRemark'">
                    <el-input v-model="scope.row.subtractRemark" placeholder="请输入" size="small"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="日期" align="center" min-width="130px">
                <template slot-scope="scope"><span>{{$moment(scope.row.date).format("YYYY-MM-DD")}}</span></template>
              </el-table-column>
              <el-table-column label="亚马逊订单号" align="center" min-width="225px">
                <template slot-scope="scope">
                  <span style="color:red; cursor:pointer; background-color:papayawhip; padding:10px" @click="viewDuplicateDetail(scope.row)" v-if="scope.row.duplicateNum >= 1">{{scope.row.orderId}}</span>
                  <span v-else>{{scope.row.orderId}}</span>
                </template>
              </el-table-column>
              <el-table-column label="ASIN" align="center" min-width="140px" prop="asin"/>
              <el-table-column label="SKU" align="center" min-width="155px">
                <template slot-scope="scope">
                  <span style="color:red; cursor:pointer; background-color:papayawhip; padding:10px" @click="viewDuplicateDetail(scope.row)" v-if="scope.row.duplicateNum >= 1">{{scope.row.sku}}</span>
                  <span v-else>{{scope.row.sku}}</span>
                </template>
              </el-table-column>
              <el-table-column label="收款微信ID/支付宝" align="center" min-width="210px" prop="payeeName" show-overflow-tooltip/>
              <el-table-column label="付款微信ID/支付宝" align="center" min-width="210px" prop="payerName" show-overflow-tooltip/>
              <el-table-column label="品牌" align="center" min-width="150px" prop="brand"/>
              <el-table-column label="主管" align="center" min-width="150px" prop="leader"/>
              <el-table-column label="组别" align="center" min-width="150px" prop="team"/>
              <el-table-column label="渠道" align="center" min-width="150px" prop="channel"/>
              <el-table-column label="国家" align="center" min-width="100px" prop="country"/>
              <el-table-column label="review链接" align="center" min-width="130px" prop="link" show-overflow-tooltip/>
              <el-table-column label="价格" align="center" min-width="100px" prop="price"/>
              <el-table-column label="价格币种" align="center" min-width="100px" prop="priceCurrency"/>
              <el-table-column label="佣金" align="center" min-width="100px" prop="commission"/>
              <el-table-column label="佣金币种" align="center" min-width="100px" prop="commissionCurrency"/>
              <el-table-column label="手续费" align="center" min-width="100px" prop="serviceFee"/>
              <el-table-column label="手续费币种" align="center" min-width="100px" prop="serviceFeeCurrency"/>
              <el-table-column label="汇率" align="center" min-width="100px" prop="rate"/>
              <el-table-column label="总金额(人民币)" align="center" min-width="100px" prop="total"/>
              <el-table-column label="备注" align="center" min-width="200px" prop="remark"/>
              <el-table-column label="花费人" align="center" min-width="150px" prop="applicant"/>
              <el-table-column label="操作" align="center" min-width="150px" fixed="right">
                <template slot-scope="scope">
                  <el-button v-if="loanReimbursement_btn_cancelFeeSubtract" type="primary" v-waves size="mini" @click="cancelFeeSubtract(scope.row)">取消扣除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div align="center" style="margin-top: 10px">
            <el-button v-if="loanReimbursement_btn_sendEmail && selectedRow.status !== 5" type="primary" v-waves @click="sendEmail(2)">发送提醒邮件</el-button>
            <el-button type="primary" v-waves @click="exportFeeSubtract">导出</el-button>
            <el-button v-if="selectedRow.status != 5" type="primary" v-waves @click="confirmFeeSubtract">确认扣除</el-button>
            <el-button type="primary" v-waves @click="closeDialog">取消</el-button>
            <el-button v-if="selectedRow.status != 5" type="primary" v-waves @click="saveFeeSubtract">保存</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 导入明细 -->
    <el-dialog title="导入" :visible.sync="importDialogVisible" :before-close="closeImportDialog" v-loading="fullScreenLoading" v-dialogDrag>
      <div style="margin-bottom: 20px">若有改动内容，请先保存后再导入数据。点击取消可返回并进行保存操作。</div>
      <div align="center">
        <el-upload style="display: inline-block;margin-left: 10px;margin-right: 10px" ref="uploadFile"
                   action="/api/finance/financeLoanReimbursement/importReviewData" name="excel" :headers="headers" :auto-upload='true' :limit="1"
                   :data="{userId: this.userId, reimbursementId: this.selectedRow.id}" :on-success="uploadSuccess" :on-error="uploadError"
                   accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button type="primary" v-waves>导入</el-button>
        </el-upload>
        <el-button type="primary" v-waves @click="closeImportDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- 导入抽查订单 -->
    <el-dialog title="导入" :visible.sync="importCheckedOrderDialogVisible" :before-close="closeImportCheckedOrderDialog" v-loading="fullScreenLoading" v-dialogDrag>
      <div style="margin-bottom: 20px">若有改动内容，请先保存后再导入数据。点击取消可返回并进行保存操作。</div>
      <div align="center">
        <el-upload style="display: inline-block;margin-left: 10px;margin-right: 10px" ref="uploadFile"
                   action="/api/finance/financeLoanReimbursement/importCheckedOrder" name="excel" :headers="headers" :auto-upload='true' :limit="1"
                   :data="{userId: this.userId, reimbursementId: this.selectedRow.id}" :on-success="uploadCheckedOrderSuccess" :on-error="uploadError"
                   accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button type="primary" v-waves>导入</el-button>
        </el-upload>
        <el-button type="primary" v-waves @click="closeImportCheckedOrderDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- review费用 查重dialog-->
    <el-dialog :title="dialogTitle" :visible.sync="duplicateReviewVisible" width="90%" v-loading="fullScreenLoading" v-dialogDrag top="6vh">
      <div v-if="dialogTitleOptions != undefined && dialogTitle === dialogTitleOptions[1]" align="center">总金额为{{sameImageTotal}}元</div>
      <el-table :data="duplicateReviewList" border highlight-current-row
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
        <el-table-column label="#" type="index" align="center" min-width="65px" fixed="left"/>
        <el-table-column label="核销单号" align="center" min-width="150px" prop="reimbursementNo"/>
        <el-table-column min-width="80px" align="center" label="付款截图">
          <template slot-scope="scope">
            <el-image v-if="scope.row.thumbImgUrl" fit="fill" style="width:33px; height: 33px" :src="scope.row.thumbImgUrl" :preview-src-list="[scope.row.imgUrl]"/>
          </template>
        </el-table-column>
        <el-table-column label="付款截图命名" align="center" min-width="200px" prop="paymentScreenshot"/>
        <el-table-column label="日期" align="center" min-width="120px" prop="">
          <template slot-scope="scope"><span>{{$moment(scope.row.date).format("YYYY-MM-DD")}}</span></template>
        </el-table-column>
        <el-table-column label="亚马逊订单号" align="center" min-width="210px" prop="orderId"/>
        <el-table-column label="ASIN" align="center" min-width="140px" prop="asin"/>
        <el-table-column label="SKU" align="center" min-width="140px" prop="sku"/>
        <el-table-column label="状态" align="center" min-width="120px" prop="statusStr"/>
        <el-table-column label="收款微信ID/支付宝" align="center" min-width="210px" prop="payeeName" show-overflow-tooltip/>
        <el-table-column label="付款微信ID/支付宝" align="center" min-width="210px" prop="payerName" show-overflow-tooltip/>
        <el-table-column label="品牌" align="center" min-width="150px" prop="brand"/>
        <el-table-column label="主管" align="center" min-width="150px" prop="leader"/>
        <el-table-column label="组别" align="center" min-width="150px" prop="team"/>
        <el-table-column label="渠道" align="center" min-width="150px" prop="channel"/>
        <el-table-column label="国家" align="center" min-width="70px" prop="country"/>
        <el-table-column label="review链接" align="center" min-width="130px" prop="link" show-overflow-tooltip/>
        <el-table-column label="价格" align="center" min-width="100px" prop="price"/>
        <el-table-column label="价格币种" align="center" min-width="80px" prop="priceCurrency"/>
        <el-table-column label="佣金" align="center" min-width="100px" prop="commission"/>
        <el-table-column label="佣金币种" align="center" min-width="80px" prop="commissionCurrency"/>
        <el-table-column label="手续费" align="center" min-width="100px" prop="serviceFee"/>
        <el-table-column label="手续费币种" align="center" min-width="100px" prop="serviceFeeCurrency"/>
        <el-table-column label="汇率" align="center" min-width="100px" prop="rate"/>
        <el-table-column label="总金额" align="center" min-width="100px" prop="total"/>
        <el-table-column label="备注" align="center" min-width="200px" prop="remark"/>
        <el-table-column label="自定义备注" align="center" min-width="200px" prop="customNote" v-if="dialogTitle === dialogTitleOptions[0]"/>
        <el-table-column label="花销人" align="center" min-width="110px" prop="applicant" v-if="dialogTitle === dialogTitleOptions[0]"/>
        <el-table-column label="报销人" align="center" min-width="110px" prop="claimerName" v-if="dialogTitle === dialogTitleOptions[0]"/>
        <el-table-column label="来源" align="center" min-width="160px" prop="source" fixed="right" v-if="dialogTitle === dialogTitleOptions[0]"/>
      </el-table>
    </el-dialog>

    <!-- 导入失败提醒框 -->
    <el-dialog :title="importErrorTitle" :visible.sync="importErrorDialogVisible" width="90%" v-loading="fullScreenLoading" v-dialogDrag top="6vh">
      <el-table :data="importErrorList" fit highlight-current-row style="width: 100%"
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
        <el-table-column v-if="importErrorFrom == 'import'" min-width="50px" align="center" label="行数" fixed="left" prop="index"/>
        <el-table-column min-width="250px" align="center" label="错误信息" fixed="left" prop="errorMsg"/>
        <el-table-column min-width="130px" align="center" label="日期">
          <template slot-scope="scope"><span>{{isNaN(Number(scope.row.date))?$moment(scope.row.date).format("YYYY-MM-DD"):$moment("1900-1-1").add(Number(scope.row.date)-2,'days').format("YYYY-MM-DD")}}</span></template>
        </el-table-column>
        <el-table-column min-width="210px" align="center" label="亚马逊订单号" prop="orderId"/>
        <el-table-column min-width="140px" align="center" label="asin" prop="asin"/>
        <el-table-column min-width="140px" align="center" label="sku" prop="sku"/>
        <el-table-column min-width="210px" align="center" label="收款微信ID/支付宝" prop="payeeName" show-overflow-tooltip/>
        <el-table-column min-width="210px" align="center" label="付款微信ID/支付宝" prop="payerName" show-overflow-tooltip/>
        <el-table-column min-width="150px" align="center" label="品牌" prop="brand"/>
        <el-table-column min-width="150px" align="center" label="主管" prop="leader"/>
        <el-table-column min-width="150px" align="center" label="组别" prop="team"/>
        <el-table-column min-width="150px" align="center" label="渠道" prop="channel"/>
        <el-table-column min-width="100px" align="center" label="国家" prop="country"/>
        <el-table-column min-width="130px" align="center" label="review链接" prop="link" show-overflow-tooltip/>
        <el-table-column min-width="100px" align="center" label="价格" prop="price"/>
        <el-table-column min-width="100px" align="center" label="价格币种" prop="priceCurrency"/>
        <el-table-column min-width="100px" align="center" label="佣金" prop="commission"/>
        <el-table-column min-width="100px" align="center" label="佣金币种" prop="commissionCurrency"/>
        <el-table-column min-width="100px" align="center" label="手续费" prop="serviceFee"/>
        <el-table-column min-width="100px" align="center" label="手续费币种" prop="serviceFeeCurrency"/>
        <el-table-column min-width="100px" align="center" label="汇率" prop="rate"/>
        <el-table-column min-width="100px" align="center" label="总金额" prop="total"/>
        <el-table-column min-width="200px" align="center" label="备注" prop="remark"/>
        <el-table-column min-width="150px" align="center" label="花费人" prop="applicant"/>
        <el-table-column min-width="200px" align="center" label="付款截图命名" prop="paymentScreenshot"/>
      </el-table>
    </el-dialog>

    <!-- 上传付款截图 -->
    <el-dialog :visible.sync="importImgdialogVisible" v-loading="fullScreenLoading" v-dialogDrag>
      <el-upload ref="uploadImg" action="/api/finance/financeLoanReimbursement/uploadImage"
                 :data="{type: this.uploadImageType, reimbursementId: this.selectedRow.id}"
                 :file-list="imgList" :headers="headers" :multiple="true" list-type="picture" :auto-upload="false"
                 name="image" :before-upload="BeforeUploadImage" :on-success="uploadImageSuccess" :on-error="uploadImageError">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getReimbursementItemDetail,
    clearDetail,
    saveReviewDetail,
    getCheckedOrder,
    getFeeSubtract,
    findSameImageDetail,
    findDuplicateDetail,
    addCheckedOrder,
    addFeeSubtract,
    sendEmail,
    updateFeeSubtract,
    confirmFeeSubtract,
    exportByReimbursementId,
    exportCheckedOrder,
    exportFeeSubtract
  } from '../../../api/finance/loanReimbursement';
  import Cookies from 'js-cookie';
  import {mapGetters} from 'vuex';
  import mixins from '@/mixins';

  export default {
    name: "reviewDialog",
    props: {
      selectedRow: {type: Object, required: true, default: {}},
      visible: {type: Boolean, default: false}
    },
    data() {
      return {
        loanReimbursement_btn_cancelFeeSubtract: undefined,
        loanReimbursement_btn_sendEmail: undefined,
        fullScreenLoading: false,
        dialogVisible: false,
        inputDialogVisible: false,
        queryDialogVisible: false,
        importDialogVisible: false,
        importErrorDialogVisible: false,
        importImgdialogVisible: false,
        duplicateReviewVisible: false,
        importCheckedOrderDialogVisible: false,
        userId: undefined,
        rules: {
          date: [{required: true, message: '请输入日期', trigger: 'blur'}],
          orderId: [{required: true, message: '请输入亚马逊订单号', trigger: 'blur'}, {max: 32, message: '最大长度为32个字符', trigger: 'blur'}],
          asin: [{required: true, message: '请输入asin', trigger: 'blur'}, {pattern: /^[Bb].{9}$/, message: 'asin填写错误'}],
          sku: [{required: true, message: '请输入sku', trigger: 'blur'}, {max: 16, message: '最大长度为16个字符', trigger: 'blur'}],
          payeeName: [{required: true, message: '请输入收款微信ID/支付宝', trigger: 'blur'}, {max: 64, message: '最大长度为64个字符', trigger: 'blur'}],
          payerName: [{required: true, message: '请输入付款微信ID/支付宝', trigger: 'blur'}, {max: 64, message: '最大长度为64个字符', trigger: 'blur'}],
          brand: [{required: true, message: '请输入品牌', trigger: 'blur'}, {max: 16, message: '最大长度为16个字符', trigger: 'blur'}],
          leader: [{required: true, message: '请输入主管', trigger: 'blur'}, {max: 32, message: '最大长度为32个字符', trigger: 'blur'}],
          team: [{required: true, message: '请输入组别', trigger: 'blur'}, {max: 64, message: '最大长度为64个字符', trigger: 'blur'}],
          channel: [{required: true, message: '请输入渠道', trigger: 'blur'}, {max: 20, message: '最大长度为20个字符', trigger: 'blur'}],
          country: [{required: true, message: '请输入国家', trigger: 'blur'}, {min: 2, max: 3, message: '请输入2或3个字符', trigger: 'blur'}],
          price: [{required: true, message: '请输入价格', trigger: 'blur'}, {pattern: /^-?[0-9]+(\.[0-9]+)?$/, message: '请输入数值'}],
          priceCurrency: [{required: true, message: '请输入价格币种', trigger: 'blur'}, {min: 3, max: 3, message: '长度为3个字符', trigger: 'blur'}],
          commission: [{required: true, message: '请输入佣金', trigger: 'blur'}, {pattern: /^-?[0-9]+(\.[0-9]+)?$/, message: '请输入数值'}],
          commissionCurrency: [{required: true, message: '请输入佣金币种', trigger: 'blur'}, {min: 3, max: 3, message: '长度为3个字符', trigger: 'blur'}],
          serviceFee: [{required: true, message: '请输入手续费', trigger: 'blur'}, {pattern: /^-?[0-9]+(\.[0-9]+)?$/, message: '请输入数值'}],
          serviceFeeCurrency: [{required: true, message: '请输入手续费币种', trigger: 'blur'}, {min: 3, max: 3, message: '长度为3个字符', trigger: 'blur'}],
          rate: [{required: true, message: '请输入汇率', trigger: 'blur'}, {pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入数值'}],
          total: [{required: true, message: '请输入总金额', trigger: 'blur'}, {validator: this.sumTotal, trigger: 'blur'}],
          remark: [{max: 255, message: '最大长度为255个字符', trigger: 'blur'}],
          paymentScreenshot: [{max: 128, message: '最大长度为128个字符', trigger: 'blur'}, {pattern: /^(.+\..+)?$/, message: '请输入带后缀的文件名'}],
          applicant: [{max: 128, message: '最大长度为128个字符', trigger: 'blur'}, {pattern: /^(.+\..+)?$/, message: '请正确输入花费人'}]
        },
        orderCheckRules: {
          orderScreenshot: [{max: 128, message: '最大长度为128个字符', trigger: 'blur'}, {pattern: /^(.+\..+)?$/, message: '请输入带后缀的文件名'}]
        },
        reviewForm: {
          reimbursementId: this.selectedRow.id,
          reviewList: [],
          changeList: [],
          deleteList: [],
          reviewTotal: undefined
        },
        orderCheckForm: {
          orderCheckList: [],
          changeList: []
        },
        feeSubtractForm: {
          feeSubtractList: undefined
        },
        getReviewForm: {
          reimbursementId: this.selectedRow.id,
          type: 1,
          page: 1,
          limit: 10
        },
        importErrorTitle: undefined,
        importErrorFrom: '',
        importErrorList: [],
        duplicateReviewList: [],
        sameImageTotal: 0,
        dialogTitle: '',
        dialogTitleOptions: ['重复的Review费用','相同付款截图的Review费用'],
        tableHeight: undefined,
        uploadImageType: undefined,
        activeTabName: 'allReviews',
        imgList: []
      }
    },
    mixins: [mixins],
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (this.selectedRow.status == -1 || this.selectedRow.status == 0) {
          this.inputDialogVisible = val;
        } else {
          this.activeTabName = 'allReviews';
          this.queryDialogVisible = val;
        }
        if(val === true) {
          this.getReviewDetail();
        }
      },
      dialogVisible(val) {
        if (val === false) {
          this.reviewForm = {reimbursementId: this.selectedRow.id, reviewList: [], changeList: [], deleteList: [], reviewTotal: undefined};
        }
        this.$emit('change-review-visible', val);
      },
      inputDialogVisible(val) {
        this.dialogVisible = val;
      },
      queryDialogVisible(val) {
        this.dialogVisible = val;
      }
    },
    computed: {
      headers() {
        return {
          'Authorization': Cookies.get('Admin-Token')
        }
      },
      ...mapGetters([
        'elements'
      ])
    },
    mounted() {
      this.tableHeight = window.innerHeight * 0.65;
    },
    created() {
      this.userId = this.getUserId();
      this.loanReimbursement_btn_cancelFeeSubtract = this.elements['loanReimbursement:btn_cancelFeeSubtract'];
      this.loanReimbursement_btn_sendEmail = this.elements['loanReimbursement:btn_sendEmail'];
    },
    methods: {
      changeList(row, type) {
        let repeat = false;
        let changeList;
        if (type === 1) {
          changeList = this.reviewForm.changeList;
        } else if (type === 2) {
          changeList = this.orderCheckForm.changeList;
        }
        for (let i = 0, length = changeList.length; i <= length - 1; i++) {
          if (changeList[i].index === row.index) {
            changeList[i] = row;
            repeat = true;
          }
        }
        if (!repeat) {
          changeList.push(row);
        }
      },
      deleteList(row) {
        let form = this.reviewForm;
        let list = this.reviewForm.reviewList;
        for (let i = 0, length = list.length; i <= length - 1; i++) {
          if (list[i].index === row.index) {
            list.splice(i, 1);
            if (row.id) {
              form.deleteList.push(row);
            }
          }
        }
      },
      getReviewDetail() {
        this.getReviewForm.reimbursementId = this.selectedRow.id;
        this.getReviewForm.type = 1;
        this.fullScreenLoading = true;
        getReimbursementItemDetail(this.getReviewForm).then(response => {
          this.reviewForm.reviewList = response.data.rows;
          this.reviewForm.reviewTotal = response.data.total;
          this.sortIndex(1);
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      clearDetail() {
        this.$confirm("是否清空费用明细?", "清空确认", {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.fullScreenLoading = true;
          let form = {
            type: 1,
            reimbursementId: this.selectedRow.id
          };
          clearDetail(form).then(response => {
            if (response.resCode == 200) {
              this.$message.info("删除成功");
              this.getReviewDetail();
            } else {
              this.$alert(response.resDes, "删除失败");
            }
            this.fullScreenLoading = false;
          }).catch(error => {
            this.fullScreenLoading = false;
            this.$message.error(JSON.stringify(error));
          });
        });

      },
      handleSizeChange(val) {
        this.getReviewForm.limit = val;
        this.getReviewDetail();
      },
      handleCurrentChange(val) {
        this.getReviewForm.page = val;
        this.getReviewDetail();
      },
      addFormColumn() {
        this.reviewForm.reviewList.push({});
        this.sortIndex(1);
      },
      sortIndex(type) {
        let list;
        if (type === 1) {
          list = this.reviewForm.reviewList;
        } else if (type === 2) {
          list = this.orderCheckForm.orderCheckList;
        }
        for (let i = 0, length = list.length; i <= length - 1; i++) {
          list[i].index = i + 1;
        }
      },
      downloadTemplate() {
        this.fullScreenLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['日期', '亚马逊订单号', 'ASIN', 'SKU', '收款微信ID/支付宝', '付款微信ID/支付宝', '品牌', '主管', '组别', '渠道', '国家', 'review链接', '价格', '价格币种', '佣金', '佣金币种', '手续费', '手续费币种', '汇率', '总金额(人民币)', '备注', '花费人', '付款截图命名'];
          const data = [];
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'reviewTemplate',
            autoWidth: true,
            bookType: 'xlsx'
          });
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      openImportDialog() {
        this.importDialogVisible = true;
      },
      closeImportDialog() {
        this.importDialogVisible = false;
      },
      getUserId() {
        return Cookies.get('UserId');
      },
      uploadSuccess(response) {
        this.$refs.uploadFile.clearFiles();
        this.fullScreenLoading = false;
        if (response.resCode === 200) {
          this.$message.success("导入成功");
          this.importDialogVisible = false;
          this.getReviewDetail();
        } else if(!!response.data){
          this.importErrorTitle = '导入失败';
          this.importErrorFrom = 'import';
          this.importErrorList = response.data;
          this.importErrorDialogVisible = true;
        } else {
          this.$message.error("导入失败，请检查excel或联系IT人员!");
        }
      },
      uploadError(error) {
        this.fullScreenLoading = false;
        this.$message.error('导入失败，请检查excel或联系IT人员!');
      },
      saveReviewDetail() {
        this.$refs['reviewForm'].validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            this.reviewForm.reimbursementId = this.selectedRow.id;
            saveReviewDetail(this.reviewForm).then(response => {
              if (response.resCode === 200) {
                this.$message.success("保存成功");
                this.reviewForm.changeList = [];
                this.reviewForm.deleteList = [];
              } else {
                this.importErrorTitle = '保存失败';
                this.importErrorFrom = 'edit';
                this.importErrorList = response.data;
                this.importErrorDialogVisible = true;
              }
              this.fullScreenLoading = false;
            }).catch(error => {
              this.fullScreenLoading = false;
              this.$message.error(JSON.stringify(error));
            })
          }
        })
      },
      closeDialog() {
        this.inputDialogVisible=false;
        this.queryDialogVisible=false;
      },
      sumTotal(rule, value, callback) {
        let index = rule.field.split('.')[1];
        let row = this.$refs.reviewForm.model.reviewList[index];
        if (row.price == undefined || row.priceCurrency == undefined || row.commission == undefined || row.commissionCurrency == undefined ||
          row.serviceFee == undefined || row.serviceFeeCurrency == undefined || row.rate == undefined) {
          callback(new Error('未填写价格、佣金、手续费、币种及汇率'));
        } else {
          let total = 0;
          if (row.priceCurrency.toUpperCase() == 'RMB' || row.priceCurrency.toUpperCase() == 'CNY') {
            total += Number(row.price);
          } else {
            total += Number(row.price) * Number(row.rate);
          }
          if (row.commissionCurrency.toUpperCase() == 'RMB' || row.commissionCurrency.toUpperCase() == 'CNY') {
            // 历史数据存在"RMB"
            total += Number(row.commission);
          } else {
            total += Number(row.commission) * Number(row.rate);
          }
          if (row.serviceFeeCurrency.toUpperCase() == 'RMB' || row.serviceFeeCurrency.toUpperCase() == 'CNY') {
            // 历史数据存在"RMB"
            total += Number(row.serviceFee);
          } else {
            total += Number(row.serviceFee) * Number(row.rate);
          }
          // toFixed() 进位方法是 四舍六入五成双，加0.0001来符合四舍五入
          if (Number(value) != (total+0.0001).toFixed(2)) {
            callback(new Error('总金额不等于价格与佣金之和'));
          }
        }
        callback();
      },
      openImageDialog(type) {
        // uploadImageType 1:review付款截图,2:非review付款截图，3:review订单截图
        this.importImgdialogVisible = true;
        this.uploadImageType = type;
      },
      BeforeUploadImage() {
        this.fullScreenLoading = true;
      },
      uploadImageSuccess(response) {
        this.$refs.uploadImg.clearFiles();
        this.fullScreenLoading = false;
        if (response.resCode === 200) {
          this.$message.success("上传成功");
          this.importImgdialogVisible = false;
          this.getReviewDetail();
        } else {
          this.$message.error(response.resDes);
        }
      },
      uploadImageError(error) {
        this.fullScreenLoading = false;
        this.$message.error('上传失败');
      },
      submitUpload() {
        this.$refs.uploadImg.submit();
      },
      handleTabClick(tab,event) {
        if (tab.label == 'review费用') {
          this.getReviewDetail();
        }else if (tab.label == '订单抽查') {
          this.getCheckedOrder();
        } else if (tab.label == '费用扣减') {
          this.getFeeSubtract();
        }
      },
      getCheckedOrder() {
        // type 类型 1.review订单抽查 2评价帮订单抽查
        let form = {reimbursementId: this.selectedRow.id, type: 1};
        this.fullScreenLoading = true;
        getCheckedOrder(form).then(response => {
          if(response.resCode == 200) {
            this.orderCheckForm.orderCheckList = response.data;
            this.sortIndex(2);
          } else {
            this.$alert(response.resDes, '查询抽查review列表失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      getFeeSubtract() {
        // type 类型，1 review ，2 非review
        let form = {reimbursementId: this.selectedRow.id, type: 1};
        this.fullScreenLoading = true;
        getFeeSubtract(form).then(response => {
          if(response.resCode == 200) {
            this.feeSubtractForm.feeSubtractList = response.data;
          } else {
            this.$alert(response.resDes, '查询费用扣除列表失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      viewSameImage(row) {
        if (!row.sameImageNum || row.sameImageNum < 2) {
          return;
        }
        //type 类型 1 review 2非review
        let query = {
          reimbursementId: row.reimbursementId,
          paymentScreenshot: row.paymentScreenshot,
          type: 1
        };
        this.fullScreenLoading = true;
        findSameImageDetail(query).then(response => {
          if (response.resCode === 200) {
            this.duplicateReviewList = response.data;
            this.sameImageTotal = 0;
            for (let i = 0, length = this.duplicateReviewList.length; i <= length - 1; i++) {
              this.sameImageTotal += this.duplicateReviewList[i].total;
            }
            this.sameImageTotal = (this.sameImageTotal+0.0001).toFixed(2);
            this.dialogTitle = this.dialogTitleOptions[1];
            this.duplicateReviewVisible = true;
          } else {
            this.$message.alert(response.ResDes, "查询失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      viewDuplicateDetail(row) {
        if (!row.duplicateNum || row.duplicateNum < 1) {
          return;
        }
        // type 类型，1 review, 2 评价帮
        let query = {
          type: 1,
          id: row.id,
          reimbursementId: row.reimbursementId,
          orderId: row.orderId,
          sku: row.sku
        };
        this.fullScreenLoading = true;
        findDuplicateDetail(query).then(response => {
          if (response.resCode === 200) {
            this.duplicateReviewList = response.data;
            this.dialogTitle = this.dialogTitleOptions[0];
            this.duplicateReviewVisible = true;
          } else {
            this.$message.alert(response.ResDes, "查询失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      addCheckedOrder() {
        let selection = this.$refs.reviewQueryForm.selection;
        if (selection == undefined || selection.length == 0) {
          this.$message.info("请选择单据");
          return false;
        }
        this.fullScreenLoading = true;
        let idList = [];
        for (let i = 0, length = selection.length; i <= length - 1; i++) {
          idList.push(selection[i].id);
        }
        // type 类型 1.review 2.评价帮
        let form = {
          idList: idList,
          reimbursementId: this.selectedRow.id,
          type: 1
        };
        addCheckedOrder(form).then(response => {
          if (response.resCode == 200) {
            this.$message.success("加入成功");
          } else {
            this.$alert(response.resDes, '加入失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      addFeeSubtract(type) {
        let selection;
        // type 1 review费用页面 2订单抽查页面
        if (type === 1) {
          selection = this.$refs.reviewQueryForm.selection;
        } else if (type === 2) {
          selection = this.$refs.orderCheckTable.selection;
        }
        if (selection == undefined || selection.length == 0) {
          this.$message.info("请选择单据");
          return false;
        }
        this.fullScreenLoading = true;
        let feeSubtractList = [];
        for (let i = 0, length = selection.length; i <= length - 1; i++) {
          let review = {
            id: selection[i].id,
            subtractRemark: selection[i].subtractRemark
          };
          feeSubtractList.push(review);
        }
        // type 类型，1 review ，2 非review
        let form = {type: 1, feeSubtractList: feeSubtractList};
        addFeeSubtract(form).then(response => {
          if (response.resCode == 200) {
            this.$message.success("加入成功");
          } else {
            this.$alert(response.resDes, '加入失败');
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      sendEmail(type) {
        // type类型，1订单抽查，2费用扣除
        let form = {
          reimbursementId: this.selectedRow.id,
          type: type
        };
        this.fullScreenLoading = true;
        sendEmail(form).then(response => {
          if (response.resCode == 200) {
            this.$message.success("发送成功");
          } else {
            this.$message.error("发送失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      openImportCheckedOrderDialog() {
        this.importCheckedOrderDialogVisible = true;
      },
      closeImportCheckedOrderDialog() {
        this.importCheckedOrderDialogVisible = false;
      },
      uploadCheckedOrderSuccess(response) {
        this.$refs.uploadFile.clearFiles();
        this.fullScreenLoading = false;
        if (response.resCode === 200) {
          this.$message.success("导入成功");
          this.importCheckedOrderDialogVisible = false;
          this.getCheckedOrder();
        } else if(!!response.data){
          this.importErrorTitle = '导入失败';
          this.importErrorFrom = 'import';
          this.importErrorList = response.data;
          this.importErrorDialogVisible = true;
        } else {
          this.$message.error("导入失败，请检查excel或联系IT人员!");
        }
      },
      async exportReviewDetail() {
        const loading = this.$loading({
          lock: true,
          text: '下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        // type 1 review, 2 非review, 3 gift card, 4 对公
        const res = await exportByReimbursementId({type: 1, reimbursementId: this.selectedRow.id}).catch(() => loading.close());
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
        })
      },
      async exportCheckedOrder() {
        const loading = this.$loading({
          lock: true,
          text: '下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        // type 1 review, 2 对公, 3 gift card
        const res = await exportCheckedOrder({type: 1, reimbursementId: this.selectedRow.id}).catch(() => loading.close());
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
      async exportFeeSubtract() {
        const loading = this.$loading({
          lock: true,
          text: '下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        // type 1 review, 2 非review, 3 对公, 4 gift card
        const res = await exportFeeSubtract({type: 1, reimbursementId: this.selectedRow.id}).catch(() => loading.close());
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
      saveCheckedReviewDetail() {
        this.$refs['orderCheckForm'].validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            saveReviewDetail(this.orderCheckForm).then(response => {
              if (response.resCode === 200) {
                this.$message.success("保存成功");
              } else {
                this.importErrorTitle = '保存失败';
                this.importErrorFrom = 'edit';
                this.importErrorList = response.data;
                this.importErrorDialogVisible = true;
              }
              this.fullScreenLoading = false;
            }).catch(error => {
              this.fullScreenLoading = false;
              this.$message.error(JSON.stringify(error));
            })
          }
        })
      },
      cancelFeeSubtract(row) {
        this.fullScreenLoading = true;
        row.needSubtract = 0;
        row.subtractRemark = '';
        // type 类型，1 review ，2 非review
        let form = {feeSubtractList: [row], type: 1};
        updateFeeSubtract(form).then(response => {
          if (response.resCode === 200) {
            this.$message.success("取消成功");
            this.getFeeSubtract();
          } else {
            this.$alert(response.resDes, "取消失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      confirmFeeSubtract() {
        let selection = this.$refs.feeSubtractForm.selection;
        if (selection == undefined || selection.length == 0) {
          this.$message.info("请选择单据");
          return false;
        }
        this.fullScreenLoading = true;
        let feeSubtractList = [];
        for (let i = 0, length = selection.length; i <= length - 1; i++) {
          feeSubtractList.push(selection[i]);
        }
        let form = {
          // type 扣减类型，1 review，2 非review
          type: 1,
          feeSubtractList: feeSubtractList,
          reimbursementId: this.selectedRow.id
        };
        confirmFeeSubtract(form).then(response => {
          if (response.resCode === 200) {
            this.$message.success("扣除成功");
            this.getFeeSubtract();
          } else {
            this.$alert(response.resDes, "扣除失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      saveFeeSubtract() {
        this.fullScreenLoading = true;
        // type 类型，1 review ，2 非review
        let form = {feeSubtractList: this.feeSubtractForm.feeSubtractList, type: 1};
        updateFeeSubtract(form).then(response => {
          if (response.resCode === 200) {
            this.$message.success("保存成功");
          } else {
            this.$alert(response.resDes, "保存失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      }
    }
  }
</script>
<style scoped>
  .inputMainClass .el-form-item {
      margin-bottom: 15px;
  }
</style>
