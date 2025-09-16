/**
 * Sass警告静默插件
 * 用于静默sass的legacy-js-api警告
 */
import type { Plugin } from 'vite';

export function sassSilencePlugin(): Plugin {
  return {
    name: 'sass-silence',
    configResolved() {
      // 静默sass的legacy-js-api警告
      const originalWarn = console.warn;
      console.warn = function(message: any, ...args: any[]) {
        if (typeof message === 'string' && message.includes('legacy-js-api')) {
          return;
        }
        originalWarn.call(console, message, ...args);
      };
    }
  };
}