"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
var qiniu = require('qiniu');
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
function fetch(config, url, key) {
    return __awaiter(this, void 0, void 0, function () {
        var qnMac, qnConfig, bucketManager;
        return __generator(this, function (_a) {
            qnMac = new qiniu.auth.digest.Mac(config.ak, config.sk);
            qnConfig = new qiniu.conf.Config();
            qnConfig.zone = qiniu.zone[config.zone];
            bucketManager = new qiniu.rs.BucketManager(qnMac, qnConfig);
            // const key = config.key
            console.log("[CDN Fetch Start] \u8F6C\u50A8\u7F51\u7EDC\u6587\u4EF6 \u5F00\u59CB");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    bucketManager.fetch(url, config.scope, key, function (err, respBody, respInfo) {
                        if (err) {
                            resolve(false);
                            console.log("[CDN Fetch Error] \u8F6C\u50A8\u7F51\u7EDC\u6587\u4EF6 \u5931\u8D25");
                            console.log('[Error]', err);
                            console.log('[respInfo]', respInfo);
                        }
                        else {
                            if (respInfo.statusCode == 200) {
                                console.log("[CDN Fetch] " + respBody.key);
                                console.log("[CDN Fetch End] \u8F6C\u50A8\u7F51\u7EDC\u6587\u4EF6 \u6210\u529F");
                                resolve(__assign(__assign({}, respBody), { source: url }));
                            }
                            else {
                                console.log("[CDN Fetch Error] \u8F6C\u50A8\u7F51\u7EDC\u6587\u4EF6 \u5931\u8D25");
                                console.log('[Error]', err);
                                console.log('[respInfo]', respInfo);
                                resolve(false);
                            }
                        }
                    });
                })];
        });
    });
}
exports.fetch = fetch;
