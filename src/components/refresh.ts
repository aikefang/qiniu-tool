const qiniu = require('qiniu')
import {AkSk} from "../interface"

interface RefreshConfig extends AkSk{}

/**
 * 刷新资源
 * @param config {Object} 配置信息
 * @param config.ak {String} 七牛秘钥
 * @param config.sk {String} 七牛秘钥
 * @param config.zone {String} 七牛空间地区
 * @param config.scope {String} 七牛空间
 * @param list {Array<String>} CDN链接
 */
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
