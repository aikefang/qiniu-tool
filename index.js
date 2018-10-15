let getFileList = require('./get-files-list/index')
let uploadFn = require('./upload/index')
let refreshFn = require('./refresh/index')

class QiniuTool {
  async config(option) {
    qiniuTool.option = option
  }

  async upload() {
    await getFileList.config(qiniuTool.option)
    await uploadFn.config(qiniuTool.option)
    let fileList = await getFileList.eachFiles()
    await uploadFn.continuityUpload(fileList)
  }

  async refresh(list) {
    await refreshFn.config({
      ak: qiniuTool.option.ak,
      sk: qiniuTool.option.sk
    })
    console.log(`[CDN refresh Start] 准备刷新`)
    let res = await refreshFn.run(list)
    let i = 0
    for (let item in res.taskIds) {
      i++
      console.log(`[CDN] refreshed [${res.taskIds[item]}] ${item}`)
    }
    console.log(`[CDN refresh End] 刷新成功 共${i}个文件刷新成功`)
  }
}

let qiniuTool = new QiniuTool()
module.exports = qiniuTool