let qiniu = require('qiniu')
//URL 列表
var urlsToRefresh = []

class Refresh {
  async config (option) {
    refresh.option = option
  }
  async run (list) {
    return new Promise((resolve, reject) => {
      let mac = new qiniu.auth.digest.Mac(refresh.option.ak, refresh.option.sk)
      let cdnManager = new qiniu.cdn.CdnManager(mac)
      urlsToRefresh = [...list]
      //刷新链接，单次请求链接不可以超过100个，如果超过，请分批发送请求
      cdnManager.refreshUrls(urlsToRefresh, (err, respBody, respInfo) => {
        if (err) {
          throw err;
        }
        if (respInfo.statusCode == 200) {
          let jsonBody = JSON.parse(respBody)
          resolve(jsonBody)
        } else {
          console.log('刷新失败')
          console.log(respBody)
        }
      })
    })
  }
}
let refresh = new Refresh()
module.exports = refresh