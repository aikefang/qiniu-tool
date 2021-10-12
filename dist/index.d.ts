interface Zone {
    /**
     * 机房  Zone对象
     * 华东  qiniu.zone.Zone_z0
     * 华北  qiniu.zone.Zone_z1
     * 华南  qiniu.zone.Zone_z2
     * 北美  qiniu.zone.Zone_na0
     */
    zone: 'Zone_z0' | 'Zone_z1' | 'Zone_z2' | 'Zone_na0';
}
interface AkSk {
    ak: string;
    sk: string;
}
interface Key {
    key: string;
}
interface Scope {
    scope: string;
}
interface UploadConfig extends AkSk, Zone, Key, Scope {
}
export declare function upload(config: UploadConfig, localFile: string, key: string): Promise<unknown>;
interface RefreshConfig extends AkSk {
}
export declare function refresh(config: RefreshConfig, list: Array<string>): Promise<unknown>;
interface FetchConfig extends AkSk, Zone, Key, Scope {
    url: string;
}
export declare function fetch(config: FetchConfig, url: string, key: string): Promise<unknown>;
export {};
