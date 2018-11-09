let fs = require('fs') //文件模块
let path = require('path') //文件模块
let type = '.jpg|.js|.css|.png|.jpeg|.gif|.ico|.svg|.woff|.ttf|.eot'

class ChildAssembly {
  // 遍历文件和文件夹列表
  async mapList({dir, cb, list}) {
    list.map(async (data, index, all) => {
      let filePath = path.resolve(dir, data)
      let stat = fs.lstatSync(filePath)
      // 是文件夹 过滤文件夹
      if (stat.isDirectory()) {
        await this.getList({dir: filePath, cb})
      } else {
        //过滤非 .js 文件
        let rgx = `(${type})$`
        let re = new RegExp(rgx)
        if (re.test(filePath)) {
          cb(filePath)
        }
      }
    })
  }

  // 生成文件内容文件内容
  async createFileContent() {
    return new Promise((resolve, reject) => {
      let timeStamp = new Date().getTime()
      fs.writeFile(path.join(__dirname, './timeStamp.json'), JSON.stringify({timeStamp: timeStamp}), (err, data) => {
        if (err) {
          // 读文件是不存在报错
          // 意外错误
          // 文件权限问题
          // 文件夹找不到(不会自动创建文件夹)
          reject(err)
        } else {
          // console.log('timeStamp.json Create Success');
          resolve(data)
        }
      });
    })
  }

  async createTimeStamp() {
    let content = await this.createFileContent()
    return content
  }


  // 获取时间戳
  async getTimeStamp() {
    await childAssembly.createTimeStamp()
    let content = await this.getFileContent()
    return JSON.parse(content).timeStamp
  }

  // 获取文件内容
  async getFileContent() {
    return new Promise((resolve, reject) => {
      // 读取json文件ª
      fs.readFile(path.join(__dirname, './timeStamp.json'), 'utf-8', function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  // 获取文件和文件夹列表
  async getList({dir, cb}) {
    let list = await fs.readdirSync(dir)
    await this.mapList({dir, cb, list})
  }
}

let childAssembly = new ChildAssembly()

// 遍历文件列表
class GetFilesList {
  constructor() {
    this.option = {}
    // 自定义文件路径
    this.pathCDN = ''
    // 是否需要随机数拼接到「自定义文件路径」后面 （默认不拼接）
    this.random = false
  }

  async config(option) {
    getFilesList.option = {
      ...option
    }
    if (option.type) {
      type = option.type
    }
    if (option.pathCDN) {
      getFilesList.pathCDN = option.pathCDN
    }
    if (option.random) {
      getFilesList.random = option.random
    }
  }

  // 遍历文件目录
  async eachFiles() {
    let timeStamp = ''
    if (getFilesList.option.randomNumber) {
      timeStamp = getFilesList.option.randomNumber
    } else {
      timeStamp = await childAssembly.getTimeStamp()
    }
    let dir = path.resolve(getFilesList.option.pathLocal)
    // 判断是相对路径还是绝对路径
    let arr = []
    await childAssembly.getList({
      dir, cb(filePath) {
        // 本地绝对路径
        let fileOriginPath = filePath
        // 相对路径
        let relativePath = ''
        if (getFilesList.random) {
          relativePath = path.join(getFilesList.pathCDN, timeStamp, fileOriginPath.replace(dir, ''))
        } else {
          relativePath = path.join(getFilesList.pathCDN, fileOriginPath.replace(dir, ''))
        }
        arr.push({fileOriginPath, relativePath})
      }
    })
    // console.log(arr)
    return arr
  }
}

let getFilesList = new GetFilesList()
module.exports.eachFiles = getFilesList.eachFiles
module.exports.config = getFilesList.config