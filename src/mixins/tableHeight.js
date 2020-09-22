export default {
  data() {
    return {

    }
  },
  watch: {
    tableHeight(val) {
      if (!this.timer) {
        this.tableHeight = val
        this.timer = true
        const that = this
        setTimeout(function () {
          that.timer = false
        }, 500)
      }

    }
  },
  mounted() {
    const that = this
    window.onresize = () => (() => {
      window.tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      that.tableHeight = window.tableHeight - that.topHeight
    })()
  },
}
