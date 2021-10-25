'use strict'
const expect = require('chai').expect
const add = require('qiniu-tool').add
const { fetch, refresh, upload } = require('qiniu-tool')
const path = require('path')

const ak = ''
const sk = ''
const scope = ''
const zone = 'Zone_z1'

// 拉取网络资源
describe('qiniu-tool function fetch', () => {
  it('should return 2', async () => {
    const result = await fetch({
      scope,
      ak,
      sk
    }, 'https://img2.domain.com/product/20210726/3/a6215667a08090b50623e9893ae0df90_400.png', 'test/tsUpload/aa2.png')
    console.log(result)
    // {
    //   fsize: 66672,
    //   hash: 'Fg0zgqGLZLBOFprwnO7vDSkcPDod',
    //   key: 'test/tsUpload/aa2.png',
    //   mimeType: 'image/jpeg',
    //   overwritten: false,
    //   version: '',
    //   source: 'https://img2.domain.com/product/20210726/3/a6215667a08090b50623e9893ae0df90_400.png'
    // }
    // expect(result).to.equal(true)
  })
})
// 刷新网络资源
describe('qiniu-tool function refresh', () => {
  it('应该刷新网络资源', async () => {
    const result = await refresh({
      ak,
      sk
    }, [
      'https://img2.domain.com/product/20210726/3/a6215667a08090b50623e9893ae0df90_400.png'
      // 'https://static.webascii.cn/webascii/files/image-obq432nef74v.png?imageMogr2/auto-orient/strip/format/jpg/interlace/1/quality/80|imageView2/1/w/270/h/150'
    ])
    console.log(result)
    // {
    //   code: 200,
    //   error: 'success',
    //   requestId: '614488cfae4f8447cdd927ce',
    //   taskIds: {
    //     'https://static.webascii.cn/webascii/files/image-obq432nef74v.png?imageMogr2/auto-orient/strip/format/jpg/interlace/1/quality/80|imageView2/1/w/270/h/150': '614488cfae4f8447cdd927cf'
    //   },
    //   invalidUrls: null,
    //   invalidDirs: null,
    //   urlQuotaDay: 500,
    //   urlSurplusDay: 494,
    //   dirQuotaDay: 10,
    //   dirSurplusDay: 10
    // }
    // {
    //   code: 400014,
    //   error: 'uid not match',
    //   requestId: '',
    //   taskIds: null,
    //   invalidUrls: [ 'img2.domain.com' ],
    //   invalidDirs: null,
    //   urlQuotaDay: 0,
    //   urlSurplusDay: 0,
    //   dirQuotaDay: 0,
    //   dirSurplusDay: 0
    // }
    // expect(result).to.equal(true)
  })
})
// 上传本地文件到远端
describe('qiniu-tool function upload', () => {
  it('应该上传本地资源到CDN', async () => {
    const result = await upload({
      ak,
      sk,
      scope,
      zone, // 七牛空间（默认Zone_z1）
    }, '/Users/kyle/zhuangkai/qiniu-tool/test.png', 'test/2020-10-12/demo.png')
    console.log(result)
    // {
    //   key: 'test/2020-10-12/demo.png',
    //     hash: 'Fk6OzIhgN6sVw-sYaA_Os-6IAQLJ',
    //   fsize: '16612',
    //   w: '124',
    //   h: '144',
    //   type: 'image/png',
    //   format: 'png'
    // }

    // expect(result).to.equal(true)
  })
})
