import { AkSk, Key, Scope, Zone } from "../interface";
interface UploadConfig extends AkSk, Zone, Scope {
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
export declare function upload(config: UploadConfig, localFile: string, key: Key): Promise<unknown>;
export {};
