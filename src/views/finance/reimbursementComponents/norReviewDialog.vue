<template>
  <div class="fixed_table">
    <!-- 非review费用 输入dialog-->
    <el-dialog title="非review费用" :visible.sync="inputDialogVisible" width="90%" :before-close="closeDialog" v-loading="fullScreenLoading" v-dialogDrag top="6vh">
      <el-form :model="norReviewForm" :rules="rules" ref="norReviewForm">
        <el-table class="inputMainClass" :data="norReviewForm.norReviewList" highlight-current-row
                  :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
          <el-table-column label="#" type="index" align="center" width="65px" fixed="left"/>
          <el-table-column width="80px" align="center" label="付款截图">
            <template slot-scope="scope">
              <el-image v-if="scope.row.thumbImgUrl" fit="fill" style="width:33px; height: 33px" :src="scope.row.thumbImgUrl" :preview-src-list="[scope.row.imgUrl]"/>
            </template>
          </el-table-column>
          <el-table-column label="付款截图命名" align="center" width="230px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.paymentScreenshot'" :rules="rules.paymentScreenshot">
                <el-input v-model="scope.row.paymentScreenshot" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="日期" align="center" width="230px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.date'" :rules="rules.date">
                <el-date-picker v-model="scope.row.date" size="mini" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="平台/支付方式" align="center" width="130px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.paymentMode'" :rules="rules.paymentMode">
                <el-input v-model="scope.row.paymentMode" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="用途" align="center" width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.useFor'" :rules="rules.useFor">
                <el-input v-model="scope.row.useFor" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" width="100px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.quantity'" :rules="rules.quantity">
                <el-input v-model="scope.row.quantity" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Model" align="center" width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.model'" :rules="rules.model">
                <el-input v-model="scope.row.model" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="SKU" align="center" width="170px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.sku'" :rules="rules.sku">
                <el-input v-model="scope.row.sku" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="国家" align="center" width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.country'" :rules="rules.country">
                <el-input v-model="scope.row.country" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="渠道" align="center" width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.channel'" :rules="rules.channel">
                <el-input v-model="scope.row.channel" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="主管" align="center" width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.leader'" :rules="rules.leader">
                <el-input v-model="scope.row.leader" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="组别" align="center" width="180px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.team'" :rules="rules.team">
                <el-input v-model="scope.row.team" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="币种" align="center" width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.currency'" :rules="rules.currency">
                <el-input v-model="scope.row.currency" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="BU推广费(人民币)" align="center" width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.total'" :rules="rules.total">
                <el-input v-model="scope.row.total" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="汇率" align="center" width="100px" prop="rate"/>
          <el-table-column label="BU推广费(USD)" align="center" width="150px" prop="totalUsd"/>
          <el-table-column label="备注" align="center" width="200px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.remark'" :rules="rules.remark">
                <el-input v-model="scope.row.remark" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="花费人" align="center" width="170px">
            <template slot-scope="scope">
              <el-form-item :prop="'norReviewList.' + scope.$index + '.applicant'">
                <el-input v-model="scope.row.applicant" size="mini" placeholder="请输入" @input="changeList(scope.row)"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="驳回理由" align="center" min-width="200px" prop="subtractRemark" show-tooltip-when-overflow/>
          <el-table-column label="操作" align="center" width="160px" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="selectedRow.claimerId == userId" size="mini" type="danger" @click="deleteList(scope.row, 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div v-show="!fullScreenLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="getNorReviewForm.page" :page-sizes="[10, 20, 30, 50, 100, 500]" :page-size="getNorReviewForm.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="norReviewForm.norReviewTotal"/>
      </div>
      <div align="middle" style="margin-top: 15px">
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="addFormColumn">新增行</el-button>
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="clearDetail(2)">清空费用明细</el-button>
        <el-button type="primary" v-waves @click="downloadTemplate">下载模版</el-button>
        <el-button type="primary" v-waves @click="exportNorReviewDetail">导出</el-button>
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="openImportDialog">导入</el-button>
        <el-button v-if="selectedRow.claimerId == userId" type="primary" v-waves @click="openImageDialog(2)">上传付款截图</el-button>
        <el-button v-waves @click="closeDialog">取消</el-button>
        <el-button v-if="selectedRow.claimerId == userId" v-waves @click="saveNorReviewDetail">保存</el-button>
      </div>
    </el-dialog>

    <!-- 非review费用 查询dialog-->
    <el-dialog title="非review费用" :visible.sync="queryDialogVisible" width="90%" :before-close="closeDialog" v-loading="fullScreenLoading" v-dialogDrag top="2vh">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="非review费用" name="allNorReviews">
          <el-table :data="norReviewForm.norReviewList" ref="norReviewQueryForm" fit highlight-current-row
                    :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
            <el-table-column type="selection" align="center" width="65px" fixed="left"/>
            <el-table-column label="#" type="index" align="center" width="65px" fixed="left"/>
            <el-table-column label="审批备注" align="center" width="200px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.subtractRemark" size="mini" placeholder="请输入"/>
              </template>
            </el-table-column>
            <el-table-column width="80px" align="center" label="付款截图">
              <template slot-scope="scope">
                <el-image v-if="scope.row.thumbImgUrl" fit="fill" style="width:33px; height: 33px" :src="scope.row.thumbImgUrl" :preview-src-list="[scope.row.imgUrl]"/>
              </template>
            </el-table-column>
            <el-table-column label="付款截图命名" align="center" width="230px">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click="viewSameImage(scope.row)" v-if="scope.row.sameImageNum >= 2">{{scope.row.paymentScreenshot}}</el-button>
                <span v-else>{{scope.row.paymentScreenshot}}</span>
              </template>
            </el-table-column>
            <el-table-column label="日期" align="center" width="130px">
              <template slot-scope="scope"><span>{{$moment(scope.row.date).format("YYYY-MM-DD")}}</span></template>
            </el-table-column>
            <el-table-column label="平台/支付方式" align="center" width="130px" prop="paymentMode"/>
            <el-table-column label="用途" align="center" width="160px" prop="useFor"/>
            <el-table-column label="数量" align="center" width="100px" prop="quantity"/>
            <el-table-column label="Model" align="center" width="130px" prop="model"/>
            <el-table-column label="SKU" align="center" width="140px" prop="sku"/>
            <el-table-column label="国家" align="center" width="150px" prop="country"/>
            <el-table-column label="渠道" align="center" width="150px" prop="channel"/>
            <el-table-column label="主管" align="center" width="150px" prop="leader"/>
            <el-table-column label="组别" align="center" width="150px" prop="team"/>
            <el-table-column label="币种" align="center" width="150px" prop="currency"/>
            <el-table-column label="BU推广费(人民币)" align="center" width="150px" prop="total"/>
            <el-table-column label="汇率" align="center" width="100px" prop="rate"/>
            <el-table-column label="BU推广费(USD)" align="center" width="150px" prop="totalUsd"/>
            <el-table-column label="备注" align="center" width="200px" prop="remark" show-overflow-tooltip/>
            <el-table-column label="花费人" align="center" width="150px" prop="applicant"/>
          </el-table>
          <div v-show="!fullScreenLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="getNorReviewForm.page" :page-sizes="[10, 20, 30, 50, 100, 500]" :page-size="getNorReviewForm.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="norReviewForm.norReviewTotal"/>
          </div>
          <div align="middle" style="margin-top: 15px">
            <el-button type="primary" v-waves @click="exportNorReviewDetail">导出</el-button>
            <el-button v-if="selectedRow.claimerId == userId && selectedRow.status != 5" type="primary" v-waves @click="openImageDialog(2)">上传付款截图</el-button>
            <el-button type="primary" v-waves @click="closeDialog">取消</el-button>
            <el-button v-if="selectedRow.status != 5" type="primary" v-waves @click="addFeeSubtract">加入扣减</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="费用扣减" name="feeSubtract">
          <el-form :model="feeSubtractForm">
            <el-table :data="feeSubtractForm.feeSubtractList" ref="feeSubtractForm" fit highlight-current-row
                      :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
              <el-table-column label="#" type="index" align="center" width="65px" fixed="left"/>
              <el-table-column type="selection" align="center" width="65px" fixed="left"/>
              <el-table-column label="审批备注" align="center" width="200px">
                <template slot-scope="scope">
                  <el-form-item :prop="'feeSubtractList.' + scope.$index + '.subtractRemark'">
                    <el-input v-model="scope.row.subtractRemark" placeholder="请输入"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="日期" align="center" width="130px">
                <template slot-scope="scope"><span>{{$moment(scope.row.date).format("YYYY-MM-DD")}}</span></template>
              </el-table-column>
              <el-table-column label="平台/支付方式" align="center" width="130px" prop="paymentMode"/>
              <el-table-column label="用途" align="center" width="160px" prop="useFor"/>
              <el-table-column label="数量" align="center" width="100px" prop="quantity"/>
              <el-table-column label="Model" align="center" width="130px" prop="model"/>
              <el-table-column label="SKU" align="center" width="140px" prop="sku"/>
              <el-table-column label="国家" align="center" width="150px" prop="country"/>
              <el-table-column label="渠道" align="center" width="150px" prop="channel"/>
              <el-table-column label="主管" align="center" width="150px" prop="leader"/>
              <el-table-column label="组别" align="center" width="150px" prop="team"/>
              <el-table-column label="币种" align="center" width="150px" prop="currency"/>
              <el-table-column label="BU推广费(人民币)" align="center" width="150px" prop="total"/>
              <el-table-column label="汇率" align="center" width="100px" prop="rate"/>
              <el-table-column label="BU推广费(USD)" align="center" width="150px" prop="totalUsd"/>
              <el-table-column label="备注" align="center" width="200px" prop="remark" show-overflow-tooltip/>
              <el-table-column label="花费人" align="center" width="150px" prop="applicant"/>
              <el-table-column label="操作" align="center" width="150px" fixed="right">
                <template slot-scope="scope">
                  <el-button v-if="loanReimbursement_btn_cancelFeeSubtract" type="primary" v-waves size="small" @click="cancelFeeSubtract(scope.row)">取消扣除</el-button>
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

    <!-- review费用 查重dialog-->
    <el-dialog title="相同付款截图的非Review费用" :visible.sync="duplicateNorReviewVisible" width="90%" v-loading="fullScreenLoading" v-dialogDrag>
      <div align="center">总金额为{{sameImageTotal}}元</div>
      <el-table :data="duplicateNorReviewList" fit highlight-current-row
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
        <el-table-column label="#" type="index" align="center" width="65px" fixed="left"/>
        <el-table-column width="80px" align="center" label="付款截图">
          <template slot-scope="scope">
            <el-image v-if="scope.row.thumbImgUrl" fit="fill" style="width:33px; height: 33px" :src="scope.row.thumbImgUrl" :preview-src-list="[scope.row.imgUrl]"/>
          </template>
        </el-table-column>
        <el-table-column label="付款截图命名" align="center" width="200px" prop="paymentScreenshot"/>
        <el-table-column label="日期" align="center" width="130px">
          <template slot-scope="scope"><span>{{$moment(scope.row.date).format("YYYY-MM-DD")}}</span></template>
        </el-table-column>
        <el-table-column label="平台/支付方式" align="center" width="130px" prop="paymentMode"/>
        <el-table-column label="用途" align="center" width="160px" prop="useFor"/>
        <el-table-column label="数量" align="center" width="100px" prop="quantity"/>
        <el-table-column label="Model" align="center" width="130px" prop="model"/>
        <el-table-column label="SKU" align="center" width="140px" prop="sku"/>
        <el-table-column label="国家" align="center" width="150px" prop="country"/>
        <el-table-column label="渠道" align="center" width="150px" prop="channel"/>
        <el-table-column label="主管" align="center" width="150px" prop="leader"/>
        <el-table-column label="组别" align="center" width="150px" prop="team"/>
        <el-table-column label="币种" align="center" width="150px" prop="currency"/>
        <el-table-column label="BU推广费(人民币)" align="center" width="150px" prop="total"/>
        <el-table-column label="汇率" align="center" width="100px" prop="rate"/>
        <el-table-column label="BU推广费(USD)" align="center" width="150px" prop="totalUsd"/>
        <el-table-column label="备注" align="center" width="200px" prop="remark" show-overflow-tooltip/>
        <el-table-column label="花费人" align="center" width="150px" prop="applicant"/>
      </el-table>
    </el-dialog>

    <!-- 导入明细 -->
    <el-dialog title="导入" :visible.sync="importDialogVisible" :before-close="closeImportDialog" v-loading="fullScreenLoading" v-dialogDrag>
      <div style="margin-bottom: 20px">若有改动内容，请先保存后再导入数据。点击取消可返回并进行保存操作。</div>
      <div align="center">
        <el-upload style="display: inline-block;margin-left: 10px;margin-right: 10px" ref="uploadFile"
                   action="/api/finance/financeLoanReimbursement/importNorReviewData" name="excel" :headers="headers" :auto-upload='true' :limit="1"
                   :data="{userId: this.userId, reimbursementId: this.selectedRow.id}" :on-success="uploadSuccess" :on-error="uploadError"
                   accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button type="primary" v-waves>导入</el-button>
        </el-upload>
        <el-button type="primary" v-waves @click="closeImportDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- 导入失败提醒框 -->
    <el-dialog :title="importErrorTitle" :visible.sync="importErrorDialogVisible" width="90%" v-loading="fullScreenLoading" v-dialogDrag top="6vh">
      <el-table :data="importErrorList" fit highlight-current-row style="width: 100%"
                :header-cell-style="{ background: '#f2f2f2', color: '#333',fontSize:'14px'}" :height="tableHeight">
        <el-table-column v-if="importErrorFrom == 'import'" width="50px" align="center" label="行数" fixed="left" prop="index"/>
        <el-table-column width="200px" align="center" label="错误信息" fixed="left" prop="errorMsg"/>
        <el-table-column width="120px" align="center" label="日期">
          <template slot-scope="scope"><span>{{isNaN(Number(scope.row.date))?$moment(scope.row.date).format("YYYY-MM-DD"):$moment("1900-1-1").add(Number(scope.row.date)-2,'days').format("YYYY-MM-DD")}}</span></template>
        </el-table-column>
        <el-table-column width="130px" align="center" label="平台/支付方式" prop="paymentMode"/>
        <el-table-column width="200px" align="center" label="用途" prop="useFor"/>
        <el-table-column width="100px" align="center" label="数量" prop="quantity"/>
        <el-table-column width="130px" align="center" label="Model" prop="model"/>
        <el-table-column width="140px" align="center" label="sku" prop="sku"/>
        <el-table-column width="100px" align="center" label="国家" prop="country"/>
        <el-table-column width="130px" align="center" label="渠道" prop="channel"/>
        <el-table-column width="130px" align="center" label="主管" prop="leader"/>
        <el-table-column width="130px" align="center" label="组别" prop="team"/>
        <el-table-column width="100px" align="center" label="币种" prop="currency"/>
        <el-table-column width="100px" align="center" label="BU推广费(人民币)" prop="total"/>
        <el-table-column width="100px" align="center" label="汇率" prop="rate"/>
        <el-table-column width="100px" align="center" label="BU推广费(USD)" prop="totalUsd"/>
        <el-table-column width="200px" align="center" label="备注" prop="remark" show-overflow-tooltip/>
        <el-table-column width="130px" align="center" label="花费人" prop="applicant"/>
        <el-table-column width="200px" align="center" label="付款截图命名" prop="paymentScreenshot"/>
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
    saveNorReviewDetail,
    getFeeSubtract,
    updateFeeSubtract,
    sendEmail,
    confirmFeeSubtract,
    addFeeSubtract,
    findSameImageDetail,
    exportByReimbursementId,
    exportFeeSubtract
  } from '../../../api/finance/loanReimbursement';
  import Cookies from 'js-cookie';
  import {mapGetters} from 'vuex';
  import mixins from '@/mixins';

  export default {
    name: "norReviewDialog",
    props: {
      selectedRow: {type: Object, required: true, default: {}},
      visible: {type: Boolean, default: false}
    },
    data() {
      return {
        loanReimbursement_btn_cancelFeeSubtract: undefined,
        loanReimbursement_btn_sendEmail: undefined,
        userId: undefined,
        fullScreenLoading: false,
        tableHeight: undefined,
        dialogVisible: false,
        inputDialogVisible: false,
        queryDialogVisible: false,
        importDialogVisible: false,
        importErrorDialogVisible: false,
        importImgdialogVisible: false,
        duplicateNorReviewVisible: false,
        rules: {
          date: [{required: true, message: '请输入日期', trigger: 'blur'}],
          paymentMode: [{required: true, message: '请输入平台/支付方式', trigger: 'blur'}, {max: 32, message: '最大长度为32个字符', trigger: 'blur'}],
          useFor: [{required: true, message: '请输入用途', trigger: 'blur'}, {max: 16, message: '最大长度为16个字符', trigger: 'blur'}],
          quantity: [{required: true, message: '请输入数量', trigger: 'blur'}, {pattern: /^[0-9]+$/, message: '请输入数值'}],
          model: [{max: 64, message: '最大长度为64个字符', trigger: 'blur'}],
          sku: [{max: 128, message: '最大长度为128个字符', trigger: 'blur'}],
          country: [{required: true, message: '请输入国家', trigger: 'blur'}, {min: 2,max: 3, message: '请输入2或3个字符', trigger: 'blur'}],
          channel: [{required: true, message: '请输入渠道', trigger: 'blur'}, {max: 20, message: '最大长度为20个字符', trigger: 'blur'}],
          leader: [{required: true, message: '请输入主管', trigger: 'blur'}, {max: 32, message: '最大长度为32个字符', trigger: 'blur'}],
          team: [{required: true, message: '请输入组别', trigger: 'blur'}, {max: 64, message: '最大长度为64个字符', trigger: 'blur'}],
          currency: [{required: true, message: '请输入币种', trigger: 'blur'}, {min: 3,max: 3, message: '长度为3个字符', trigger: 'blur'}],
          total: [{required: true, message: '请输入BU推广费(人民币)', trigger: 'blur'}, {pattern: /^-?[0-9]+(\.[0-9]+)?$/, message: '请输入数值'}],
          remark: [{required: true, message: '请输入备注', trigger: 'blur'}, {max: 255, message: '最大长度为255个字符', trigger: 'blur'}],
          paymentScreenshot: [{max: 128, message: '最大长度为128个字符', trigger: 'blur'}]
        },
        norReviewForm: {
          reimbursementId: this.selectedRow.id,
          norReviewList: [],
          changeList: [],
          deleteList: [],
          norReviewTotal: undefined
        },
        getNorReviewForm: {
          reimbursementId: this.selectedRow.id,
          type: 2,
          page: 1,
          limit: 10
        },
        feeSubtractForm: {
          feeSubtractList: undefined
        },
        importErrorTitle: undefined,
        importErrorFrom: '',
        importErrorList: [],
        uploadImageType: undefined,
        imgList: [],
        activeTabName: 'allNorReviews',
        duplicateNorReviewList: [],
        sameImageTotal: 0
      }
    },
    mixins: [mixins],
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (this.selectedRow.status == -1 || this.selectedRow.status == 0) {
          this.inputDialogVisible = val;
        } else {
          this.activeTabName = 'allNorReviews';
          this.queryDialogVisible = val;
        }
        if(val === true) {
          this.getNorReviewDetail();
        }
      },
      dialogVisible(val) {
        if (val === false) {
          this.norReviewForm = {reimbursementId: this.selectedRow.id, norReviewList: [], changeList: [], deleteList: [], norReviewTotal: undefined};
        }
        this.$emit('change-nor-review-visible', val);
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
    created() {
      this.userId = this.getUserId();
      this.loanReimbursement_btn_cancelFeeSubtract = this.elements['loanReimbursement:btn_cancelFeeSubtract'];
      this.loanReimbursement_btn_sendEmail = this.elements['loanReimbursement:btn_sendEmail'];
    },
    mounted() {
      this.tableHeight = window.innerHeight * 0.65;
    },
    methods: {
      getNorReviewDetail() {
        this.getNorReviewForm.reimbursementId = this.selectedRow.id;
        this.getNorReviewForm.type = 2;
        this.fullScreenLoading = true;
        getReimbursementItemDetail(this.getNorReviewForm).then(response => {
          this.norReviewForm.norReviewList = response.data.rows;
          this.norReviewForm.norReviewTotal = response.data.total;
          this.sortIndex();
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        })
      },
      saveNorReviewDetail() {
        this.$refs['norReviewForm'].validate(valid => {
          if (valid) {
            this.fullScreenLoading = true;
            this.norReviewForm.reimbursementId = this.selectedRow.id;
            saveNorReviewDetail(this.norReviewForm).then(response => {
              if (response.resCode === 200) {
                this.$message.success("保存成功");
                this.norReviewForm.changeList = [];
                this.norReviewForm.deleteList = [];
                this.getNorReviewDetail();
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
        this.inputDialogVisible = false;
        this.queryDialogVisible = false;
      },
      changeList(row) {
        let repeat = false;
        let changeList = this.norReviewForm.changeList;
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
        let form = this.norReviewForm;
        let list = this.norReviewForm.norReviewList;
        for (let i = 0, length = list.length; i <= length - 1; i++) {
          if (list[i].index === row.index) {
            list.splice(i, 1);
            if (row.id) {
              form.deleteList.push(row);
            }
          }
        }
      },
      handleTabClick(tab,event) {
        if (tab.label == '非review费用') {
          this.getNorReviewDetail();
        } else if (tab.label == '费用扣减') {
          this.getFeeSubtract();
        }
      },
      getFeeSubtract() {
      // type 类型，1 review ，2 非review
        let form = {reimbursementId: this.selectedRow.id, type: 2};
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
      cancelFeeSubtract(row) {
        this.fullScreenLoading = true;
        row.needSubtract = 0;
        row.subtractRemark = '';
        // type 类型，1 review ，2 非review
        let form = {feeSubtractList: [row], type: 2};
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
      async exportFeeSubtract() {
        const loading = this.$loading({
          lock: true,
          text: '下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        // type 1 review, 2 非review, 3 对公, 4 gift card
        const res = await exportFeeSubtract({type: 2, reimbursementId: this.selectedRow.id}).catch(() => loading.close());
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
          type: 2,
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
        let form = {feeSubtractList: this.feeSubtractForm.feeSubtractList, type: 2};
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
      },
      sortIndex() {
        let list = this.norReviewForm.norReviewList;
        for (let i = 0, length = list.length; i <= length - 1; i++) {
          list[i].index = i + 1;
        }
      },
      addFormColumn() {
        this.norReviewForm.norReviewList.push({});
        this.sortIndex();
      },
      viewSameImage(row) {
        if (!row.sameImageNum || row.sameImageNum < 2) {
          return;
        }
        //type 类型 1 review 2非review
        let query = {
          reimbursementId: row.reimbursementId,
          paymentScreenshot: row.paymentScreenshot,
          type: 2
        };
        this.fullScreenLoading = true;
        findSameImageDetail(query).then(response => {
          if (response.resCode === 200) {
            this.duplicateNorReviewList = response.data;
            this.sameImageTotal = 0;
            for (let i = 0, length = this.duplicateNorReviewList.length; i <= length - 1; i++) {
              this.sameImageTotal += this.duplicateNorReviewList[i].total;
            }
            this.sameImageTotal = (this.sameImageTotal+0.0001).toFixed(2);
            this.duplicateNorReviewVisible = true;
          } else {
            this.$message.alert(response.ResDes, "查询失败");
          }
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      clearDetail(type) {
        this.$confirm("是否清空费用明细?","清空确认",{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.fullScreenLoading = true;
          let form = {
            type: type,
            reimbursementId: this.selectedRow.id
          };
          clearDetail(form).then(response => {
            if (response.resCode == 200) {
              this.$message.info("删除成功");
              this.getNorReviewDetail();
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
      uploadSuccess(response) {
        this.$refs.uploadFile.clearFiles();
        this.fullScreenLoading = false;
        if (response.resCode === 200) {
          this.$message.success("导入成功");
          this.importDialogVisible = false;
          this.getNorReviewDetail();
        } else if(!!response.data) {
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
      downloadTemplate() {
        this.fullScreenLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['日期', '平台/支付方式', '用途', '数量', 'model', 'SKU', '国家', '渠道', '主管', '组别', '币种', 'BU推广费(人民币)', '汇率(系统生成)', 'BU推广费(USD)(系统生成)', '备注', '花费人', '付款截图命名'];
          const data = [];
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'norReviewTemplate',
            autoWidth: true,
            bookType: 'xlsx'
          });
          this.fullScreenLoading = false;
        }).catch(error => {
          this.fullScreenLoading = false;
          this.$message.error(JSON.stringify(error));
        });
      },
      async exportNorReviewDetail() {
        const loading = this.$loading({
          lock: true,
          text: '下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        // type 1 review, 2 非review, 3 gift card, 4 对公
        const res = await exportByReimbursementId({type: 2, reimbursementId: this.selectedRow.id}).catch(() => loading.close());
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
      addFeeSubtract() {
        let selection = this.$refs.norReviewQueryForm.selection;
        if (selection == undefined || selection.length == 0) {
          this.$message.info("请选择单据");
          return false;
        }
        this.fullScreenLoading = true;
        let feeSubtractList = [];
        for (let i = 0, length = selection.length; i <= length - 1; i++) {
          let norReview = {
            id: selection[i].id,
            subtractRemark: selection[i].subtractRemark
          };
          feeSubtractList.push(norReview);
        }
        // type 类型，1 review ，2 非review
        let form = {type: 2, feeSubtractList: feeSubtractList};
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
      openImportDialog() {
        this.importDialogVisible = true;
      },
      closeImportDialog() {
        this.importDialogVisible = false;
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
          this.getNorReviewDetail();
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
      getUserId() {
        return Cookies.get('UserId');
      },
      handleSizeChange(val) {
        this.getNorReviewForm.limit = val;
        this.getNorReviewDetail();
      },
      handleCurrentChange(val) {
        this.getNorReviewForm.page = val;
        this.getNorReviewDetail();
      },
    }
  }
</script>
<style scoped>
  .inputMainClass .el-form-item {
    margin-bottom: 15px;
  }
</style>
