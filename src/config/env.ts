/**
 * 环境变量配置管理
 */

/**
 * 获取环境变量
 */
export const getEnv = (): ImportMetaEnv => {
  return import.meta.env;
};

/**
 * 是否为开发环境
 */
export const isDev = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * 是否为生产环境
 */
export const isProd = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * 获取应用名称
 */
export const getAppName = (): string => {
  return import.meta.env.VITE_APP_NAME || 'Haiguan App';
};

/**
 * 获取API基础地址
 */
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || '';
};

/**
 * 获取默认服务地址
 */
export const getBaseServiceUrl = (): string => {
  return import.meta.env.VITE_API_URL_BASE || '/';
};

/**
 * 获取用户服务地址
 */
export const getUserServiceUrl = (): string => {
  return import.meta.env.VITE_API_URL_USER || '/userService';
};

/**
 * 获取海关服务地址
 */
export const getCustomsServiceUrl = (): string => {
  return import.meta.env.VITE_API_URL_CUSTOMS || '/customsService';
};

/**
 * 是否启用Mock
 */
export const isUseMock = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true';
};

/**
 * 是否启用PWA
 */
export const isUsePWA = (): boolean => {
  return import.meta.env.VITE_USE_PWA === 'true';
};

/**
 * 是否启用构建压缩
 */
export const isBuildCompress = (): boolean => {
  return import.meta.env.VITE_BUILD_COMPRESS === 'true';
};

/**
 * 获取构建压缩类型
 */
export const getBuildCompressType = (): 'gzip' | 'brotli' | 'both' => {
  return (import.meta.env.VITE_BUILD_COMPRESS_TYPE as 'gzip' | 'brotli' | 'both') || 'gzip';
};

/**
 * 是否删除console
 */
export const isDropConsole = (): boolean => {
  return import.meta.env.VITE_DROP_CONSOLE === 'true';
};

/**
 * 是否启用包分析
 */
export const isUseBundleAnalyzer = (): boolean => {
  return import.meta.env.VITE_USE_BUNDLE_ANALYZER === 'true';
};

/**
 * 环境配置对象
 */
export const envConfig = {
  // 基础信息
  appName: getAppName(),
  isDev: isDev(),
  isProd: isProd(),
  
  // API地址
  apiUrl: getApiUrl(),
  baseServiceUrl: getBaseServiceUrl(),
  userServiceUrl: getUserServiceUrl(),
  customsServiceUrl: getCustomsServiceUrl(),
  
  // 功能开关
  useMock: isUseMock(),
  usePWA: isUsePWA(),
  buildCompress: isBuildCompress(),
  buildCompressType: getBuildCompressType(),
  dropConsole: isDropConsole(),
  useBundleAnalyzer: isUseBundleAnalyzer()
};