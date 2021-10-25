import { AkSk, Key, Scope, Zone } from "../interface";
interface FetchConfig extends AkSk, Zone, Scope {
    url: string;
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
export declare function fetch(config: FetchConfig, url: string, key: Key): Promise<unknown>;
export {};
