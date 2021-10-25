import { AkSk } from "../interface";
interface RefreshConfig extends AkSk {
}
/**
 * 刷新资源
 * @param config {Object} 配置信息
 * @param config.ak {String} 七牛秘钥
 * @param config.sk {String} 七牛秘钥
 * @param config.zone {String} 七牛空间地区
 * @param config.scope {String} 七牛空间
 * @param list {Array<String>} CDN链接
 */
export declare function refresh(config: RefreshConfig, list: Array<string>): Promise<unknown>;
export {};
