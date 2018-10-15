let qiniu = require('qiniu')
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
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;
class UploadFn {
  config(option) {
    qiniuConfig.ak = option.ak
    qiniuConfig.sk = option.sk
    qiniuConfig.scope = option.scope
    qiniuConfig.zone = option.zone || 'Zone_z1'
    let accessKey = qiniuConfig.ak
    let secretKey = qiniuConfig.sk
    upload.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    upload.configObj = new qiniu.conf.Config()
    // 空间对应的机房
    upload.configObj.zone = qiniu.zone[qiniuConfig.zone]
  }

  CDN({data, index, cb, next}) {
    // 如果索引大于data.length
    if (index >= data.length) {
      next()
      return
    }
    let localFile = data[index].fileOriginPath
    let formUploader = new qiniu.form_up.FormUploader(upload.configObj)
    let putExtra = new qiniu.form_up.PutExtra()
    // 开头不能为/
    let key = data[index].relativePath
    let options = {
      scope: `${qiniuConfig.scope}:${key}`
    }
    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(upload.mac)
    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        throw respErr
      }
      if (respInfo.statusCode == 200) {
        console.log(`[CDN Uploaded] ${respBody.key}`)
        cb({index: index + 1})
      } else {
        console.log(`[CDN Upload Error] statusCode:${respInfo.statusCode}`)
      }
    })
  }

  // 持续性上传
  async continuityUpload(fileList) {
    console.log(`[CDN Upload Start] 准备上传`)
    return new Promise((resolve, reject) => {
      let nextFn = () => {
        console.log(`[CDN Upload End] 上传成功 共${fileList.length}个文件上传成功`)
        resolve()
      }
      let callback = ({index}) => {
        upload.CDN({data: fileList, index: index, cb: callback, next: nextFn})
      }
      upload.CDN({data: fileList, index: 0, cb: callback, next: nextFn})
    })
  }
}

let upload = new UploadFn()

module.exports = upload



