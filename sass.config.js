/**
 * Sass全局配置
 * 用于解决legacy-js-api警告
 */
export default {
  api: 'modern-compiler',
  silenceDeprecations: ['legacy-js-api'],
  quietDeps: true,
  verbose: false
};