export interface Zone {
  /**
   * 机房  Zone对象
   * 华东  qiniu.zone.Zone_z0
   * 华北  qiniu.zone.Zone_z1
   * 华南  qiniu.zone.Zone_z2
   * 北美  qiniu.zone.Zone_na0
   */
  zone: 'Zone_z0' | 'Zone_z1' | 'Zone_z2' | 'Zone_na0', // 空间
}
export interface AkSk {
  ak: string, // 秘钥
  sk: string, // 秘钥
}

export interface Key {
  key: string, // 文件路径+文件名
}
export interface Scope {
  scope: string, // 作用域
}
