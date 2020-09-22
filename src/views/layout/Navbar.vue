<template>
  <div>
    <div>
      <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <levelbar/>
        <tabs-view/>
        <div style="display: inline; position: absolute; right: 300px">
          <span>{{this.$moment(this.currentTime).format("YYYY-MM-DD HH:mm:ss")}}</span>
        </div>
        <div class="feedback-container">
          <el-button type="info" plain @click="feedbackFormVisible=true">网站反馈</el-button>
        </div>

    <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
    <!-- <screenfull class='screenfull'></screenfull> -->
     <div class="name-container"> {{name}}</div>

    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper"> <img class="user-avatar" :src="avatar"> <i class="el-icon-caret-bottom"></i></div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class='inlineBlock' to="/">
          <el-dropdown-item> 首页 </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided><span @click="changePassword" style="display:block;">修改密码</span></el-dropdown-item>
        <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
  </div>
  <div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" size="tiny">
      <el-form   ref="form" label-width="100px" >
        <el-form-item label="旧密码" prop="name">
          <el-input type="password" v-model="oldPassword" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item  label="新密码" prop="name">
          <el-input type="password" v-model="newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item  label="确认新密码" prop="name">
          <el-input type="password" v-model="confirmPassword" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
     <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button  type="primary" @click="updatePassword">确 定</el-button>
    </div>
  </el-dialog>
    <el-dialog title="网站反馈" :visible.sync="feedbackFormVisible">
      <div v-loading="feedbackLoading">
        <el-form ref="feedbackForm" label-width="100px">
          <el-form-item label="主题" prop="subject">
            <el-input v-model="feedbackForm.subject" placeholder="请输入主题"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="feedbackForm.content" :autosize="{ minRows: 4, maxRows: 8}"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <el-button @click="cancel('feedbackForm')">取 消</el-button>
          <el-button type="primary" @click="sendFeedback">发 送</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import Levelbar from './Levelbar';
import TabsView from './TabsView';
import Hamburger from 'components/Hamburger';
import Screenfull from 'components/Screenfull';
import ErrorLog from 'components/ErrLog';
import errLogStore from 'store/errLog';
import fetch from 'utils/fetch';
export default {
  components: {
    Levelbar,
    TabsView,
    Hamburger,
    ErrorLog,
    Screenfull
  },
  data() {
    return {
      currentTime: undefined,
      log: errLogStore.state.errLog,
      dialogFormVisible: false,
      feedbackFormVisible: false,
      oldPassword:'',
      newPassword:'',
      confirmPassword:'',
      feedbackForm: {
        subject: undefined,
        content: undefined
      },
      feedbackLoading: false
    }
  },
  computed: { ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  mounted() {
    this.currentTime = new Date($.ajax({async: false}).getResponseHeader("Date"));
    this.currentTime = this.$moment(this.currentTime).utc().add(8, 'hours');
    this.timer = setInterval(() => {
      this.currentTime = this.$moment(this.currentTime).add(1,"seconds");
    },1000);
  },
  beforeDestroy: function() {
    //实例销毁前清楚定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    // 修改密码
    changePassword() {
      this.dialogFormVisible = true;
    },
    // 修改密码
    updatePassword () {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.$message.error('操作失败，请输入旧密码和新密码！');
        return false;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.$message.error('操作失败，新密码和确认新密码不一致！');
        return false;
      }
      if (this.newPassword.length < 5) {
        this.$message.error('操作失败，新密码至少为五个字符！');
        return false;
      }
      let obj = {oldPassword: this.oldPassword, newPassword: this.newPassword};
      let params ={
        url: '/api/admin/user/updatePassword',
        method: 'post',
        data: obj
      };
      fetch(params).then(() => {
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        });
      }).catch(error => {
        console.log(error);
        this.$message.error(error);
      });
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    sendFeedback () {
      this.feedbackLoading = true;
      if (!this.feedbackForm.subject || !this.feedbackForm.content) {
        this.feedbackLoading = false;
        this.$message.error('操作失败，请输入主题和内容！');
        return false;
      }
      let params ={
        url: '/api/admin/feedback/sendFeedback',
        method: 'post',
        data: this.feedbackForm
      };
      fetch(params).then((response) => {
        this.feedbackLoading = false;
        if (response.resCode != 200) {
          this.$message.error(response.resDes);
        } else {
          this.feedbackFormVisible = false;
          this.feedbackForm.subject = undefined;
          this.feedbackForm.content = undefined;
          this.$message.success("反馈成功");
        }
      }).catch(error => {
        this.feedbackLoading = false;
        console.log(error);
        this.$message.error(error);
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" slot-scope>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .feedback-container {
      display: inline-block;
      position: absolute;
      right: 180px;
      cursor: pointer;
    }
    .name-container {
      display: inline-block;
      position: absolute;
      right: 85px;
      cursor: pointer;
    }
    .errLog-container {
        display: inline-block;
        position: absolute;
        right: 300px;
    }
    .screenfull {
        position: absolute;
        right: 90px;
        top: 16px;
        color: red;
    }
    .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 35px;
        .avatar-wrapper {
            cursor: pointer;
            margin-top: 5px;
            position: relative;
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }
            .el-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }
}
</style>
