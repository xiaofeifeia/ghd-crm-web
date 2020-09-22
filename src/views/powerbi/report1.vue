<template>
  <div class="powerbi-container">
    <div ref="reportContainer" style="height:100%"></div>
  </div>
</template>

<script>
// 引入包
import PowerBi from '@/utils/powerbi'
export default {
  name: 'PowerBiReport1',
  data() {
    return {
      powerbi: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 初始化powerbi
      this.powerbi = new PowerBi(this.$refs.reportContainer, {
        // 测试
        // reportId: 'b1fe70ef-979a-4ac9-b797-6b0df9f5ea10',
        // dataSetId: '7de2e240-1e48-4b24-a31f-c83bfdb557e5'
        // 生产环境id
        reportId: 'e3c00134-d0a1-48ce-b3bc-01680e555dea',
        dataSetId: 'e46d4502-6932-4a77-b5da-53fbe4f178e1'
      })
    },
    handleRefresh() {
      // 刷新
      this.powerbi.refresh()
    },
    handleFull() {
      // 全屏
      this.powerbi.fullscreen()
    }
  }
};
</script>

<style lang="scss">
html,body {
  height: 100%;
  #app {
    height: 100%;
    .powerbi-container {
      height: calc(100vh - 50px);
      padding: 0;
    }
  }
}
</style>
