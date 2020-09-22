<template>
  <div ref="container" class="filter-wrapper">
    <div class="search-box">
      <!-- <el-button type="primary" icon="el-icon-time" plain @click="isShow = true">时间范围</el-button> -->
      <span @click="isShow = true"><slot /></span>
    </div>
    <transition name="el-zoom-in-top">
      <div v-if="isShow" class="fil-w" :class="{right: isRight}" :style="{width}">
        <div class="filter-dialog-content">
          <el-tabs v-model="activeName">
            <el-tab-pane v-for="(item, index) in options" :key="index" :label="item.label" :name="item.value">
              <el-cascader-panel
                v-model="item.checkedList"
                :options="item.data"
                :props="{ multiple: true }"
                collapse-tags
              />
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="footer">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" @click="enter">确定</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    width: {
      required: false,
      type: String,
      default: '500px'
    },
    currentTab: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      activeName: '',
      isRight: false
    }
  },
  watch: {
    activeName(val) {
      this.$emit('update:activeName', val)
    },
    currentTab: {
      immediate: true,
      handler(val) {
        this.activeName = val
      }
    }
  },
  mounted() {
    if (document.body.clientWidth - this.$refs.container.offsetLeft < parseInt(this.width)) {
      this.isRight = true
    }
    // 初始化事件
    document.addEventListener('click', this.init)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.init)
  },

  methods: {
    init(e) {
      if (!this.$el.contains(e.target)) {
        this.isShow = false
      }
    },
    enter() {
      this.$emit('change')
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-wrapper {
  display: inline-block;
  position: relative;
  background: #fff;
  .fil-w{
    // width: 200px;
    position: absolute;
    max-height: 400px;
    overflow: auto;
    z-index: 999;
    top: 100%;
    color: #606266;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    background: #fff;
    border-radius: 4px;
    line-height: 30px;
    margin: 5px 0;
    padding: 10px;
    &.right {
      right: 0;
    }
    .date-picker{
      display: flex;
      & /deep/ .el-select{
        position: relative;
        z-index: 9999;
        width: 145px;
      }
    }
    .label {
      color: #999;
      font-size: 18px;
      padding-right: 20px;
    }
  }
  .quickly-select-list {
    display: flex;
    flex-wrap: wrap;
  }
  .footer{
    border-top: 1px solid #DCDFE6;
    padding-top: 20px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
