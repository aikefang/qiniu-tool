let qiniu = require('qiniu')
let getFileList = require('../get-files-list/index')
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
class UploadFn {
  config(option) {
    qiniuConfig = option
    let accessKey = qiniuConfig.ak
    let secretKey = qiniuConfig.sk
    upload.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    upload.configObj = new qiniu.conf.Config()
    // 空间对应的机房
    upload.configObj.zone = qiniu.zone[qiniuConfig.zone]
  }
  async upload() {
    let localFile = qiniuConfig.pathLocal
    let formUploader = new qiniu.form_up.FormUploader(upload.configObj)
    let putExtra = new qiniu.form_up.PutExtra()
    // 开头不能为/
    let key = `${join(qiniuConfig.pathCDN, qiniuConfig.pathLocal.replace(qiniuConfig.root, ''))}`
    let options = {
      scope: `${qiniuConfig.scope}:${key}`
    }
    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(upload.mac)
    console.log(`[CDN Upload Start] 准备上传`)
    return new Promise((resolve, reject) => {
      // 文件上传
      formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          resolve(false)
          throw respErr
        }
        if (respInfo.statusCode == 200) {
          console.log(`[CDN Uploaded] ${respBody.key}`)
          console.log(`[CDN Upload End] 上传成功`)
          resolve(respBody)
        } else {
          console.log(`[CDN Upload Error] 上传失败 statusCode:${respInfo.statusCode}`)
          resolve(false)
        }
      })
    })

  }
}

let upload = new UploadFn()

module.exports = upload