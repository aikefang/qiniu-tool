const qiniu = require('qiniu')
const path = require('path')
const fs = require('fs')
const mineType = require('mime-types')
import {Duplex} from 'stream';
import {AkSk, Key, Scope, Zone} from "../interface"

interface UploadConfig extends AkSk, Zone, Scope {
}

interface ResourcesResult {
  type: string,
  data: any
}
function resources(source: any): any {
  if (typeof source === 'string') {
    if (isBase64(source)) {
      const buff = new Buffer(source.split('base64,')[1], 'base64')
      const stream = new Duplex()
      stream.push(buff);
      stream.push(null)
      return {
        type: 'putStream',
        data: stream
      }
    } else {
      return {
        type: 'putFile',
        data: source
      }
    }
  } else {
    const readStream = fs.createReadStream(source.path)
    return {
      type: 'putStream',
      data: readStream
    }
  }
}
//
function isBase64(str: string): boolean {
  if (str.indexOf('data:') != -1 && str.indexOf('base64') != -1) {
    return true;
  } else {
    return false;
  }
}

/**
 * 上传资源
 * @param config {Object} 配置信息
 * @param config.ak {String} 七牛秘钥
 * @param config.sk {String} 七牛秘钥
 * @param config.zone {String} 七牛空间地区
 * @param config.scope {String} 七牛空间
 * @param localFile 文件，buffer，base64
 * @param key cdn路径
 */
export async function upload(config: UploadConfig, localFile: string, key: Key) {
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

  const source = resources(localFile)
  console.log(`[CDN Upload Type] 上传类型 ${source.type}`)

  return new Promise((resolve, reject) => {
    // 文件上传
    formUploader[source.type](uploadToken, key, source.data, putExtra, (respErr: any, respBody: any, respInfo: any) => {
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
