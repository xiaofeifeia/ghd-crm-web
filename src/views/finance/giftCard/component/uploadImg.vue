<template>
  <div class="get-img">
    <el-upload
      action="/api/finance/giftcardReceive/uploadImage"
      class="ImgUpload"
      list-type="picture-card"
      :disabled="false"
      accept="image/*"
      name="image"
      :limit="1"
      :class="[isimgDisabled?'showUpload':'noUpload',disabled?'showRemove':'noRemove']"
      :headers="headers"
      :on-success="imgUploadSuccess"
      :on-remove="onRemove"
      :before-upload="handleBeforeUpload"
      :on-error="uploadError"
      :file-list="filelist"
      :data="{userId: getUserId(),orderId:orderId}"
      :on-preview="preview"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
export default {
  props: {
    orderId: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    filelist: {
      type: Array,
      default: () => []
    },
    imgDisabled: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    disabled(val) {
      if (!val && this.isimgDisabled) {
        this.isimgDisabled = false
      } else if (this.isimgDisabled && val) {
        this.isimgDisabled = true
      }
    }
  },
  created() {
    this.isimgDisabled = this.imgDisabled
  },
  data() {
    return {
      imglist: [],
      uploadLoading: false,
      isimgDisabled: false
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': Cookies.get('Admin-Token')
      }
    }
  },
  methods: {
    preview(file) {
      this.$emit('preview', file)
    },
    imgUploadSuccess(res, file, fileList, ss) {//图片上传成功
      if (res.resCode === 200) {
        this.$emit('input', res.data.fileName)
        this.isimgDisabled = false
      }
      this.uploadLoading.close()
    },
    uploadError() {
      this.uploadLoading.close()
    },
    handleBeforeUpload(file) {
      if (file.type.indexOf('image') !== 0) {
        this.$message.error('上传失败，请上传正确的图片格式');
        return false
      }
      this.uploadLoading = this.$loading({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
    },
    onRemove() {//移除
      this.isimgDisabled = true
      this.$emit('input', '')
    },
    getUserId() {
      let userId = Cookies.get('UserId');
      return userId;
    }
  }
}
</script>

<style lang="scss">
.get-img {
  height: 40px;
  .el-upload-list__item {
    transition: none !important;
  }
  .noUpload .el-upload {
    display: none;
  }
  .showUpload .el-upload {
    display: inline-block;
  }
  .showRemove .el-upload-list__item-delete {
    display: inline-block !important;
  }
  .noRemove .el-upload-list__item-delete {
    display: none !important;
  }
  .ImgUpload {
    .el-upload--picture-card {
      width: 40px;
      height: 40px;
      line-height: 42px;
      i {
        font-size: 20px;
      }
    }
    .el-upload-list__item-status-label {
      display: none !important;
    }
    .el-upload-list__item {
      width: 40px;
      height: 40px;
      .el-upload-list__item-actions {
        text-align: center;

        i {
          font-size: 12px;
        }
        .el-upload-list__item-delete {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>