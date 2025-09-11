import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";

/**
 * 配置项
 * @param command 命令 运行时参数 serve / build
 */
export default defineConfig(({ command, mode, ssrBuild}) => {
  // 执行打包命令，生产环境配置
  const isBuild = command === 'build'
  // 别名
  const alias = {
    '@/': resolve('src') + '/',
    'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
  }
  // 插件
  const plugins = [vue()]
  // 服务代理Ip
  let targetIp = 'http://192.168.8.158:'
  if(isBuild) {
    // 生产环境服务代理Ip
    targetIp = 'http://192.168.8.158:'
  }

  return {
    plugins,
    resolve: { alias },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "./src/style.css";
          `,
        },
      },
    },
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/renderers',
        'echarts/components',
        'vue-echarts',
        'echarts-wordcloud'
      ]
    },
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 2000
    },
    server: {
      port: 8083,
      proxy: {
        '/userService': {
          target: `${targetIp}${8030}`,
          changeOrigin: true,
          ws: false
        }
      }
    }
  }
})