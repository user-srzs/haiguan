/**
 * 环境变量类型定义
 */
interface ImportMetaEnv {
  /** 应用名称 */
  readonly VITE_APP_NAME: string;
  /** API基础地址 */
  readonly VITE_API_URL: string;
  /** 默认服务代理地址 */
  readonly VITE_API_URL_BASE: string;
  /** 用户服务代理地址 */
  readonly VITE_API_URL_USER: string;
  /** 海关服务代理地址 */
  readonly VITE_API_URL_CUSTOMS: string;
  /** 是否开启Mock */
  readonly VITE_USE_MOCK?: string;
  /** 是否开启PWA */
  readonly VITE_USE_PWA?: string;
  /** 是否开启压缩 */
  readonly VITE_BUILD_COMPRESS?: string;
  /** 压缩算法 */
  readonly VITE_BUILD_COMPRESS_TYPE?: 'gzip' | 'brotli' | 'both';
  /** 是否删除console */
  readonly VITE_DROP_CONSOLE?: string;
  /** 是否开启包分析 */
  readonly VITE_USE_BUNDLE_ANALYZER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}