/**
 * Sass配置文件
 * 解决 legacy-js-api 警告问题
 */

// 静默sass的legacy-js-api警告
const originalWarn = console.warn;
console.warn = function(message) {
  if (message.includes('legacy-js-api')) {
    return;
  }
  originalWarn.apply(console, arguments);
};

export default {
  api: 'modern-compiler',
  silenceDeprecations: ['legacy-js-api']
};