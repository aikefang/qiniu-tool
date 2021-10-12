## 安装

```sh
npm install qiniu-tool
yarn add qiniu-tool
```

## 测试

```sh
npm run test
```

## 使用方法（仅限V2.0.0版本）

```typescript
const {fetch, refresh, upload} = require('qiniu-tool')
// 上传资源
const result01 = await upload({
  ak: '',
  sk: '',
  scope: '',
  zone: '', // 七牛空间（默认Zone_z1）
}, '/Users/kyle/zhuangkai/qiniu-tool/test.png', 'test/2020-10-12/demo.png')
// 刷新资源
const result02 = await refresh({
  ak,
  sk
}, [
  'https://static.domain.com/demo01.png',
  'https://static.domain.com/demo01.png'
])

```

## 使用方法（仅限V1.*版本，1.*所有版本将于2022/01/01起全部停止维护）

### 上传资源(上传文件夹)

```javascript
let qiniuTool = require('qiniu-tool')
qiniuTool.config({
  ak: '', // 七牛AccessKey
  sk: '', // 七牛SecretKey
  scope: 'myscope', // 七牛存储空间名称
  /**
   * 机房    Zone对象
   * 华东    qiniu.zone.Zone_z0
   * 华北    qiniu.zone.Zone_z1
   * 华南    qiniu.zone.Zone_z2
   * 北美    qiniu.zone.Zone_na0
   */
  zone: 'Zone_z1', // 七牛空间（默认Zone_z1）
  type: '.css|.js', // 允许上传的文件类型（详情请查看下文文档）
  pathCDN: 'test/', // 上传到CDN的路径
  pathLocal: '/Users/kyle/filesDir/', // 源文件夹路径(相对路径和绝对路径都行)
  random: false, // 是否产生随机数
  randomNumber: '66666', //随机数，默认自动生成，有randomNumber则不自动生成random
})
qiniuTool.upload()
```

### 上传资源(上传单个文件 v1.1.0新增)

```javascript
let qiniuTool = require('qiniu-tool')
qiniuTool.config({
  ak: '', // 七牛AccessKey
  sk: '', // 七牛SecretKey
  scope: 'myscope', // 七牛存储空间名称
  /**
   * 机房    Zone对象
   * 华东    qiniu.zone.Zone_z0
   * 华北    qiniu.zone.Zone_z1
   * 华南    qiniu.zone.Zone_z2
   * 北美    qiniu.zone.Zone_na0
   */
  zone: 'Zone_z1', // 七牛空间（默认Zone_z1）
  pathCDN: 'test/', // 上传到CDN的路径
  pathLocal: '/Users/kyle/filesDir/demo.js', // 源文件路径（相对路径和绝对路径都行）
  onlyPath: 'demo/dd.js'
})
qiniuTool.uploadOnly() // /Users/kyle/filesDir/demo.js => [CDN Path]/test/demo/dd.js
```

### 刷新资源

```javascript
let qiniuTool = require('qiniu-tool')
qiniuTool.config({
  ak: '', // 七牛AccessKey
  sk: '', // 七牛SecretKey
})
qiniuTool.refresh([
  'https://static.webascii.cn/test/0011220033/dir/dir2/f05.css',
  'https://static.webascii.cn/test/0011220033/dir/dir2/f06.css',
])
```

### 拉取网络资源(v1.2.0新增)

```javascript
let qiniuTool = require('qiniu-tool')
qiniuTool.config({
  ak: '', // 七牛AccessKey
  sk: '', // 七牛SecretKey
  scope: '', // 七牛存储空间名称
  /**
   * 机房    Zone对象
   * 华东    qiniu.zone.Zone_z0
   * 华北    qiniu.zone.Zone_z1
   * 华南    qiniu.zone.Zone_z2
   * 北美    qiniu.zone.Zone_na0
   */
  zone: 'Zone_z1', // 七牛空间（默认Zone_z1）
  pathCDN: 'test/demo/' //上传文件路径（开头请不要添加/）
})

async function demo() {
  let obj = await qiniuTool.fetch('http://devtools.qiniu.com/qiniu.png', 'kyle/qiniu.png')
  console.log(obj)
}

demo()
// log输出
// { fsize: 163469,
//   hash: 'FpHyF0kkil3sp-SaXXX8TBJY3jDh',
//   key: 'test/demo/kyle/qiniu.png',
//   mimeType: 'image/png',
//   originUrl: 'http://devtools.qiniu.com/qiniu.png' }
```

## 版本 v1.1.* 参数详解

#### `ak {String} `

```
必填
七牛SecretKey，请自行查询
```

#### `sk {String} `

```
必填
七牛云AccessKey，请自行查询
```

#### `scope {String} `

```
必填
七牛存储空间名称
请自行查询
```

#### `zone {String} `

```
非必填（默认：Zone_z1）
/**
* 机房	Zone对象
* 华东	qiniu.zone.Zone_z0
* 华北	qiniu.zone.Zone_z1
* 华南	qiniu.zone.Zone_z2
* 北美	qiniu.zone.Zone_na0
**/
```

#### `type {String} `

```
非必填
允许上传的文件类型
默认：.jpg|.js|.css|.png|.jpeg|.gif|.ico|.svg|.woff|.ttf|.eot
有type则覆盖默认值
```

#### `pathCDN {String} `

```
非必填(不可'/'开头)
上传到CDN的路径
若比填写则上传至CDN根目录，例如上传了文件‘demo.js’,上传后的路径是：http://cdn.xxx.com/demo.js
若填写http://cdn.xxx.com/[pathCDN]/demo.js
```

#### `onlyPath {String} `

```
单文件上传（uploadOnly）-必填
当前当前环境根路径（填写的此路径会将pathLocal的此部分路径删除）
例如：
pathLocal: '/Users/kyle/filesDir/demo.js', // 上传到CDN的路径
pathCDN: 'test/', // 上传到CDN的路径
onlyPath: 'demo/dd.js',
上传后得到：[CDN Path]/test/demo/dd.js
```

#### `pathLocal {String} `

```
必填
qiniuTool.upload()：需要上传到CDN的文件夹
qiniuTool.uploadOnly()：需要上传到CDN的文件
例如：/Users/kyle/filesDir/
```

#### `random {Boolean} `

```
非必填
是否自动生成时间戳
若没有randomNumber字段 且 random = true
true: http://cdn.xxx.com/[pathCDN]/[random]/demo.js
否则
true: http://cdn.xxx.com/[pathCDN]/[randomNumber]/demo.js
```

#### `randomNumber {String} `

```
非必填
是否自动生成时间戳
若没有randomNumber字段 且 random = true
true: http://cdn.xxx.com/[pathCDN]/[random]/demo.js
否则
true: http://cdn.xxx.com/[pathCDN]/[randomNumber]/demo.js
```

## 版本 v1.0.* 参数详解

#### `ak {String} `

```
必填
七牛SecretKey，请自行查询
```

#### `sk {String} `

```
必填
七牛云AccessKey，请自行查询
```

#### `scope {String} `

```
必填
七牛存储空间名称
请自行查询
```

#### `zone {String} `

```
非必填（默认：Zone_z1）
/**
* 机房	Zone对象
* 华东	qiniu.zone.Zone_z0
* 华北	qiniu.zone.Zone_z1
* 华南	qiniu.zone.Zone_z2
* 北美	qiniu.zone.Zone_na0
**/
```

#### `type {String} `

```
非必填
允许上传的文件类型
默认：.jpg|.js|.css|.png|.jpeg|.gif|.ico|.svg|.woff|.ttf|.eot
有type则覆盖默认值
```

#### `pathCDN {String} `

```
非必填(不可'/'开头)
上传到CDN的路径
若比填写则上传至CDN根目录，例如上传了文件‘demo.js’,上传后的路径是：http://cdn.xxx.com/demo.js
若填写http://cdn.xxx.com/[pathCDN]/demo.js
```

#### `pathLocal {String} `

```
必填
需要上传到CDN的文件夹
例如：/Users/kyle/filesDir/
```

#### `random {Boolean} `

```
非必填
是否自动生成时间戳
若没有randomNumber字段 且 random = true
true: http://cdn.xxx.com/[pathCDN]/[random]/demo.js
否则
true: http://cdn.xxx.com/[pathCDN]/[randomNumber]/demo.js
```

#### `randomNumber {String} `

```
非必填
是否自动生成时间戳
若没有randomNumber字段 且 random = true
true: http://cdn.xxx.com/[pathCDN]/[random]/demo.js
否则
true: http://cdn.xxx.com/[pathCDN]/[randomNumber]/demo.js
```
