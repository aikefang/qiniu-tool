const uuid = require('node-uuid')
const path = require('path')
const qiniu = require('qiniu')
const fnv = require('fnv-plus')

const v1 = uuid.v1()
const hash = `${fnv.hash(v1, 64).str()}`

interface Zone {
  /**
   * 机房  Zone对象
   * 华东  qiniu.zone.Zone_z0
   * 华北  qiniu.zone.Zone_z1
   * 华南  qiniu.zone.Zone_z2
   * 北美  qiniu.zone.Zone_na0
   */
  zone: 'Zone_z0' | 'Zone_z1' | 'Zone_z2' | 'Zone_na0', // 空间
}
interface AkSk {
  ak: string, // 秘钥
  sk: string, // 秘钥
}

interface Key {
  key: string, // 文件路径+文件名
}
interface Scope {
  scope: string, // 作用域
}

interface UploadConfig extends AkSk, Zone, Key, Scope {}

// 上传资源
export async function upload (config: UploadConfig, localFile: string, key: string) {
  const mac = new qiniu.auth.digest.Mac(config.ak, config.sk)
  const qnConfig: any = new qiniu.conf.Config()
  qnConfig.zone = qiniu.zone[config.zone]
  const formUploader = new qiniu.form_up.FormUploader(qnConfig)
  const putExtra = new qiniu.form_up.PutExtra()

  const body = {
    "key": "$(key)",
    "hash": "$(etag)",
    "fsize": "$(fsize)",
    "w": "$(imageInfo.width)",
    "h": "$(imageInfo.height)",
    "type": "$(mimeType)",
    "format": "$(imageInfo.format)",
  }
  const options = {
    scope: `${config.scope}:${key}`,
    returnBody: JSON.stringify(body)
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  console.log(`[CDN Upload Start] 上传文件 开始`)
  return new Promise((resolve, reject) => {
    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr: any, respBody: any, respInfo: any) => {
      if (respErr) {
        resolve(false)
        throw respErr
      }
      if (respInfo.statusCode == 200) {
        console.log(`[CDN Uploaded] ${respBody.key}`)
        console.log(`[CDN Upload End] 上传文件 成功`)
        resolve(respBody)
      } else {
        console.log(`[CDN Upload Error] 上传文件 失败 statusCode:${respInfo.statusCode}`)
        resolve(false)
      }
    })
  })
}

interface RefreshConfig extends AkSk{}
// 刷新资源
export async function refresh(config: RefreshConfig, list: Array<string>) {
  let mac = new qiniu.auth.digest.Mac(config.ak, config.sk)
  let cdnManager = new qiniu.cdn.CdnManager(mac)
  console.log(`[CDN Refresh Start] 刷新网络资源 开始`)
  return new Promise((resolve, reject) => {
    // 刷新链接，单次请求链接不可以超过100个，如果超过，请分批发送请求
    cdnManager.refreshUrls(list, (err: any, respBody: any, respInfo: any) => {
      if (err) {
        console.log(`[CDN Refresh Error] 刷新网络资源 失败`)
        console.log('[Error]', err)
        console.log('[respInfo]', respInfo)
        resolve(false)
      }
      if (respInfo.statusCode == 200) {
        if (respBody.code === 200) {
          console.log(`[CDN Refresh End] 刷新网络资源 成功`)
          resolve(respBody)
        } else {
          console.log(`[CDN Refresh Error] 刷新网络资源 失败`)
          console.log('[Error]', err)
          console.log('[respInfo]', respInfo)
          resolve(false)
        }
      } else {
        console.log(`[CDN Refresh Error] 刷新网络资源 失败`)
        console.log('[Error]', err)
        console.log('[respInfo]', respInfo)
        resolve(false)
      }
    })
  })
}

interface FetchConfig extends AkSk, Zone, Key, Scope {
  url: string, // 网络地址
}
// 拉取网络文件
export async function fetch(config: FetchConfig, url: string, key: string) {
  const qnMac: any = new qiniu.auth.digest.Mac(config.ak, config.sk)
  const qnConfig: any = new qiniu.conf.Config()
  qnConfig.zone = qiniu.zone[config.zone]
  const bucketManager = new qiniu.rs.BucketManager(qnMac, qnConfig)
  // const key = config.key
  console.log(`[CDN Fetch Start] 转储网络文件 开始`)
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, config.scope, key, (err: any, respBody: any, respInfo: any) => {
      if (err) {
        resolve(false)
        console.log(`[CDN Fetch Error] 转储网络文件 失败`)
        console.log('[Error]', err)
        console.log('[respInfo]', respInfo)
      } else  {
        if (respInfo.statusCode == 200) {
          console.log(`[CDN Fetch] ${respBody.key}`)
          console.log(`[CDN Fetch End] 转储网络文件 成功`)
          resolve({
            ...respBody,
            source: url
          })
        } else {
          console.log(`[CDN Fetch Error] 转储网络文件 失败`)
          console.log('[Error]', err)
          console.log('[respInfo]', respInfo)
          resolve(false)
        }
      }
    })
  })
}




