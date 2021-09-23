let qiniu = require('qiniu')
const {join, normalize, relative, resolve} = require('path')
let qiniuConfig = {
  ak: '',
  sk: '',
  scope: '',
  /**
   * 机房  Zone对象
   * 华东  qiniu.zone.Zone_z0
   * 华北  qiniu.zone.Zone_z1
   * 华南  qiniu.zone.Zone_z2
   * 北美  qiniu.zone.Zone_na0
   */
  zone: '', // 默认
}
class FetchFn {
  config(option) {
    qiniuConfig = option
    let accessKey = qiniuConfig.ak
    let secretKey = qiniuConfig.sk
    fetch.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    fetch.configObj = new qiniu.conf.Config()
    // 空间对应的机房
    fetch.configObj.zone = qiniu.zone[qiniuConfig.zone]
  }
  async run(url, path) {
    let bucketManager = new qiniu.rs.BucketManager(fetch.mac, fetch.configObj)
    // let key = join(qiniuConfig.pathCDN, path)
    let key = qiniuConfig.pathCDN + '/' + path
    return new Promise((resolve, reject) => {
      bucketManager.fetch(url, qiniuConfig.scope, key, (err, respBody, respInfo) => {
        if (err) {
          resolve(false)
          throw err
        } else  {
          if (respInfo.statusCode == 200) {
            console.log(`[CDN Fetch] ${respBody.key}`)
            console.log(`[CDN Fetch End] 转储网络文件成功`)
            resolve({
              ...respBody,
              originUrl: url
            })
          } else {
            console.log(`[CDN Fetch Error] 转储网络文件失败 statusCode:${respInfo.statusCode}`)
            resolve(false)
          }
        }
      })
    })
  }
}

let fetch = new FetchFn()

module.exports = fetch
