module.exports = {
  dealBody(option) {
    return Object.assign({
      code: 0,
      message: '',
      data: ''
    }, option)
  },
  arrIn(value, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        return true
      }
    }
    return false
  },
  filterXSS (str) {
    str = str + ''
    return str.replace(/[<>"']/g, target => {       /* 特殊符号过滤 */
      return {
        '<': '&lt;',
        '"': '&quot;',
        '>': '&gt;',
        "'": '&#39;'
      }[target]
    })
  }
}
