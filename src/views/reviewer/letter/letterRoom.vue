<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
      站点
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
  </div>

  <el-row>
    <el-col :span="8" style='margin-top:15px;'>
      <el-card class="box-card" style="height: 720px;">
        <el-input
          placeholder="输入邮箱/客人姓名"
          v-model="filterText">
        </el-input>
         <!-- start talk-list -->
        <div class="talk-list"  v-loading.body="loadingTalkList">
          <ul class="list-unstyled" id="letterRoomMsg">
            <li v-for="item in roomList " v-bind:key="item.index" @click="getLetterMsgList(item)">
                <div class="list-name">
                  <el-badge :value="item.unReadNum" :max="99" class="item" v-if="item.unReadNum > 0">
                    <el-button size="small" v-if="item.fullName" >{{item.fullName}}</el-button>
                    <el-button size="small" v-else >{{item.email}}</el-button>
                  </el-badge>
                  <span v-else>
                    <el-button size="small" v-if="item.fullName" >{{item.fullName}}</el-button>
                    <el-button size="small" v-else >{{item.email}}</el-button>
                  </span>
                  <div class="list-time" >{{item.createDate}}</div>
                </div>
                <div class="list-info"><span v-html="item.content"></span></div>
            </li>
          </ul>
        </div>
			  <!-- END talk-list -->
      </el-card>
    </el-col>
    <el-col :span="16" style='margin-top:15px;'>
      <el-card class="box-card" style="height: 720px;" v-loading.body="listLoading">
        <el-button type="primary" size="small" round plain v-if="this.form.receiveUserId">{{letterUserName}}</el-button>
        <el-button type="info" size="small" round plain icon="el-icon-edit" @click="unReadMsg" v-if="this.form.receiveUserId">未读</el-button>
        <div id="customer_talk" class="customer-talk" style="height: 550px;">
            <div class="talk-box">
              <div id="pageLine" style="display:none;"></div>
               <div v-for="data in contentList " v-bind:key="data.id">
              <div class="time-box">{{data.createDate}} </div>
              <!-- 当前用户 start -->
              <div class="talkB" v-if="data.userId === data.currentUserId">
                <div class="avatar"></div>
                <div class="talk-name">
                  {{data.email}}
                </div>
                <div style="float:right;"><i class="el-icon-delete" @click="deleteMsg(data.id,data.userId)"></i></div>
                <div class="block" v-if="data.contentType === 1" @click="handlePicPreview(data.picUrl)">
                  <el-image
                  style="width: 320px;"
                  :src="data.thumbPicUrl"
                  fit="fill"></el-image>
                </div>
                <div class="talk-info" v-html="data.content" v-else>
                </div>
              </div>

              <!-- 当前用户 end -->
              <!-- 对方 start -->
              <div class="talkA" v-else>
                <div class="avatar"></div>
                <div class="talk-name">
                   {{data.fullName}}
                </div>
                <div class="block" v-if="data.contentType === 1" @click="handlePicPreview(data.picUrl)">
                  <el-image
                  style="width: 320px;"
                  :src="data.thumbPicUrl"
                  fit="fill"></el-image>
                </div>
                <div class="talk-info" v-html="data.content" v-else>
                </div>
              </div>
              <!-- 对方 end -->
            </div>
          </div>
        </div>
        <el-form ref="form"  label-width="80px" :rules="rules" :model="form" @keyup.enter.native="sendMsg" v-if="form.currentUserId && form.receiveUserId" >
          <div>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入聊天信息"
              v-model="form.content"
              style="width:65%">
            </el-input>
            <el-button type="success" size="small" icon="el-icon-message"  @click="sendMsg()">发送</el-button>
            <el-button type="danger"  size="small" icon="el-icon-delete"  @click="form.content = ''">清空</el-button>
           <el-button type="primary"  size="small" icon="el-icon-picture-outline" @click="imgdialogVisible = true">图片</el-button>
      
          </div>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  
    <el-dialog :visible.sync="imgdialogVisible">
      <el-upload
        class="upload-demo"
        ref="uploadImg"
        :action="uploadImgUrl"
        :data="{currentUserId: form.currentUserId, receiveUserId: form.receiveUserId}"
        :before-upload="beforeUpload"
        :headers="headers"
        :on-success="uploadImgSuccess"
        :multiple="true"
        list-type="picture"
        name="img" 
        >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png文件</div>
      </el-upload>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" >
      <img width="90%"  :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>

<script>
import {
  getLetterRoomList,
  getLetterMsgList,
  sendMsg,
  deleteMsg,
  unReadMsg
} from 'api/reviewer/letter/letterRoom';
import {
  getWebsiteList,
  checkServerSelected
} from "api/reviewer/reviewCommon";
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie';
export default {
  name: 'menu',
  data() {
    return {
      filterText: '',
      serverName: undefined,
      websiteOptions: undefined,
      roomList: [],
      listQuery: {
        page: 1,
        limit: 200,
        roomCode: undefined
      },
      contentList:[],
      rules: {
        content: [
          {
            required: true,
            message: "请输入聊天信息",
            trigger: "blur"
          }
        ]
      },
      form: {
        content: undefined,
        currentUserId: undefined,
        receiveUserId: undefined
      },
      listLoading: false,
      loadingTalkList: false,
      currentRoom: [],
      uploadImgUrl: '',
      imgdialogVisible: false,
      dialogVisible: false,
      dialogImageUrl: undefined,
      showOpBtn: false,
      letterUserName: ''
    }
  },
  watch: {
    filterText(val) {
      this.getLetterRoomList();
    },
    serverName(val) {
      if (!this.serverName) {
        this.changeWebsite();
      }
    }
  },
  created() {
    this.getWebsiteList();
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
  methods: {
    /**
     * 聊天室列表
     */
    getLetterRoomList() {
      if (!checkServerSelected(this.serverName)) {
        this.$message.error("操作失败，目标站点不能为空！");
        return false;
      }
      let query = {
        filterText: this.filterText
      }
      this.loadingTalkList = true;
      getLetterRoomList(this.serverName, query).then(res => {
        this.roomList = res.data;
        this.loadingTalkList = false;
      });
    },
    /**
     * 聊天信息列表
     */
    getLetterMsgList(roomObj) {
      if (!checkServerSelected(this.serverName)) {
        this.$message.error("操作失败，目标站点不能为空！");
        return false;
      }
      this.currentRoom = roomObj;
      this.contentList = [];
      this.listLoading = true;
      this.listQuery.roomCode = roomObj.roomCode;
      this.form.receiveUserId = roomObj.userId;
      this.form.currentUserId = roomObj.currentUserId;
      this.letterUserName = roomObj.fullName + '(' + roomObj.email + ')';
      getLetterMsgList(this.serverName, this.listQuery).then(res => {
        this.contentList = res.data.rows;
        this.$nextTick(function(){
          var div = document.getElementById('customer_talk');
          div.scrollTop = div.scrollHeight;
        })
        this.listLoading = false;
        if (roomObj.unReadNum && roomObj.unReadNum > 0) {
          this.getLetterRoomList();
        }
      });
    },
    /**
     * 改变站点时的操作
     */
    changeWebsite() {
      this.roomList = [];
      this.contentList = [];
      this.letterUserName = '';
      this.form = {
        content: undefined,
        currentUserId: undefined,
        receiveUserId: undefined
      };
      if (this.serverName) {
        this.getLetterRoomList();
        this.uploadImgUrl = '/api/' + this.serverName + '/letterMessage/uploadLetterImg';
      }
    },
    /**
     * 获取站点列表
     */
    getWebsiteList() {
      getWebsiteList().then(response => {
        this.websiteOptions = response.data.rows;
      });
    },
    /**
     * 发送消息
     */
    sendMsg () {
      if (!checkServerSelected(this.serverName)) {
        this.$message.error("操作失败，目标站点不能为空！");
        return false;
      }
      sendMsg(this.serverName, this.form).then(res => {
        if (res.resCode === 200) {
          this.getLetterMsgList(this.currentRoom);
          this.form.content = '';
        } else {
          this.$notify({
            title: "失败",
            message: '发送失败，请联系IT技术支持！',
            type: "error",
            duration: 2000
          });
        }
      });
    },
    handleRemove(file, fileList) {
      this.uploadImgName = undefined;
    },
    handlePicPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    uploadImgSuccess (response, file, fileList) {
      if (response.resCode === 200) {
        this.getLetterMsgList(this.currentRoom);
        this.imgdialogVisible = false;
      } else {
        this.$notify({
          title: "失败",
          message: "图片发送失败，请联系技术IT支持！</br>" + resultVo.resDes,
          type: "error",
          duration: 2000
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    /**
     * 撤回聊天信息
     */
    deleteMsg (id,currentUserId) {
      this.$confirm("是否确认撤回该消息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let obj = {
          id: id,
          currentUserId: currentUserId
        };
        deleteMsg(this.serverName, obj).then(res => {
          if (res.resCode === 200) {
            this.getLetterMsgList(this.currentRoom);
          } else {
            this.$notify({
              title: "失败",
              message: '撤回失败，请联系IT技术支持！',
              type: "error",
              duration: 2000
            });
          }
        });
      });
    },
    /**
     * 当前用户信息标志为未读
     */
    unReadMsg () {
      if (!this.contentList || this.contentList.length == 0) {
        return;
      }
      unReadMsg(this.serverName, this.form).then(res => {
        if (res.resCode === 200) {
          this.getLetterRoomList();
          this.$notify({
            title: "成功",
            message: '用户信息已标志为未读！',
            type: "success",
            duration: 2000
          });
        } else {
          this.$notify({
            title: "失败",
            message: res.resDes,
            type: "error",
            duration: 2000
          });
        }
      });
    }
  }
}
</script>


<style scoped>
.item {
  margin-left: 50px;
  margin-top: 10px;
  margin-right: 50px;
}
.filter-container {
  padding-bottom: 0px;
}
/*list*/
.talk-list{ width: 100%; margin: 0 auto; overflow-y: auto;height: 620px;display: block;}
.talk-list ul li { border-bottom: 1px solid #ddd; }
.talk-list ul li a { height: 52px; padding: 8px; display: block; }
.talk-list ul li a:hover { background: #f5f5f5;}
.talk-list ul li a span { font-size: 16px; color: #333; line-height: 18px; font-weight: bold; }
.talk-list ul li .list-name { margin-top: 8px;}
.talk-list ul li .list-info { color: #999;height: 16px; line-height: 16px;overflow: hidden; clear: left; text-overflow: ellipsis; white-space: nowrap;margin-top: 5px;margin-bottom: 5px;}
.talk-list ul li .list-time { width: auto; float: right; color: #999; text-align: center;}
.talk-list ul li .list-name .badge{ background: #eb5255; color: #fff; font-size: 10px;}
.item {
  margin-left: 0px;
  margin-top: -8px;
}


/*talk box*/
.talk-box .talkA,.talk-box .talkB,.talk-box .time-box,.talk-list,.talk-box,.talk-list ul,.talk-list ul li,.talk-list ul li .list-info,.talk-list ul li a,.rules-box ,.rules-box ul{ width: 100%; float: left; }
.customer-tab,.customer-tabs .nav,.customer-tabs .tab-content,.user-reply,.faq-msg .info-box ,.first-box ,.talk-box .avatar,.talk-box .talkA .talk-info,.message,.talk-list ul li{ background: #fff; } 
/*------------------------------------*\
               $talk-box
  \*------------------------------------*/
.customer-talk{ width: 100%; margin: 0 auto; overflow-y: auto;height: 828px;display: block;}
.talk-box { margin-top: 40px; position: relative; margin-bottom: 80px; height: auto; display: block;}
.talk-box .talkA,
.talk-box .talkB { margin-bottom: 20px; }
.talk-box .avatar { width: 36px; height: 36px;  border-radius: 50%; display: none; margin-right: 8px;  }
.talk-box .talkA .avatar { float: left; }
.talk-box .talkA .block { float: left; margin-top: 5px; }
.talk-box .talkB .avatar { float: right; }
.talk-box .talkB .block { float: right; margin-top: 5px; }
.talk-box .talk-info { width: auto; max-width: 80%; float: left; height: auto; min-height: 36px;padding: 6px; font-size: 14px; background: #cce6ff; border: 1px solid #f5f6f7; border-radius: 4px; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1); }
.talk-box .talkB .talk-info { float: right; border-color: #bed6ee; }
.talk-box .time-box { text-align: center; color: #aaa; font-size: 12px; margin-bottom: 10px; }
.talk-box .talk-name{ width: 100%; float: left; text-align: left; color: #999;}
.talk-box .talkB .talk-name{ text-align: right;}
.message { position: fixed; left: 20%; bottom: 0; width: 60%; padding: 10px; }
.message .test_box { width: 90%; margin-right: 1%; float: left; }
.message .btn { width:8%; height: 30px;line-height: 30px; float: left; margin-top: 18px; }
.message .form-control-feedback{ display: none;}

</style>