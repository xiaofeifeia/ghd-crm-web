export default {
  methods: {
    funDownload({ content, filename }) {
      // 创建隐藏的可下载链接
      const eleLink = document.createElement('a')
      eleLink.download = filename
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      const blob = new window.Blob([content])
      eleLink.href = window.URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    }
  }
}
