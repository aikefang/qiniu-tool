// const uuid = require('node-uuid')
// const path = require('path')
// const qiniu = require('qiniu')
// const fnv = require('fnv-plus')

// const v1 = uuid.v1()
// const hash = `${fnv.hash(v1, 64).str()}`
import { Zone, AkSk, Key, Scope } from './interface'
import { upload } from './components/upload'
import { refresh } from './components/refresh'
import { fetch } from './components/fetch'
export {
  upload,
  refresh,
  fetch
}





