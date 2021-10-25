
const qiniu = require('qiniu')
import {AkSk, Key, Scope, Zone} from "../interface";

interface FetchConfig extends AkSk, Zone, Scope {
  url: string, // 网络地址
}

/**
 * 拉取网络文件
 * @param config {Object} 配置信息
 * @param config.ak {String} 七牛秘钥
 * @param config.sk {String} 七牛秘钥
 * @param config.zone {String} 七牛空间地区
 * @param config.scope {String} 七牛空间
 * @param url {String} 网络URL
 * @param key cdn路径
 */
export async function fetch(config: FetchConfig, url: string, key: Key) {
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
