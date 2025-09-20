import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Compression from 'vite-plugin-compression';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

/**
 * 配置项
 * @param command 命令 运行时参数 serve / build
 */
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  // 执行打包命令，生产环境配置
  const isBuild = command === 'build';
  // 是否启用压缩
  const enableCompress = env.VITE_BUILD_COMPRESS === 'true';
  // 是否删除console
  const dropConsole = env.VITE_DROP_CONSOLE === 'true';
  // 别名
  const alias = {
    '@/': resolve('src') + '/',
    'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
  };
  // 插件
  const plugins = [
    vue(),
    vueSetupExtend(),
    AutoImport({
      // 自动引入组件
      dts: true,
      vueTemplate: true,
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()] // 按需引入
    })
  ];
  // 服务代理Ip
  // let targetIp = 'http://192.168.8.201:'; // 卢成让
  // let targetIp = 'http://192.168.8.47:'; // 王浩权
  let targetIp = 'https://m1.apifoxmock.com/m1/2165906-505936-default'; // 线上
  // 生产环境配置
  if (isBuild) {
    // 生产环境服务代理Ip
    targetIp = 'http://192.168.8.201:';
    // gzip压缩
    if (enableCompress) {
      plugins.push(
        Compression({
          disable: !isBuild,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz'
        })
      );
    }
  }

  return {
    plugins,
    resolve: { alias },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
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
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 分包策略
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            'echarts': ['echarts', 'vue-echarts'],
            'utils': ['axios', 'dayjs', 'nprogress']
          }
        }
      },
      // 删除console
      terserOptions: dropConsole
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        : undefined
    },
    server: {
      port: 8083,
      proxy: {
        [env.VITE_API_URL_USER]: {
          target: `${targetIp}${8030}`,
          changeOrigin: true,
          ws: false
        },
        [env.VITE_API_URL_CUSTOMS]: {
          target: `${targetIp}`,
          // target: `${targetIp}${8028}`,
          changeOrigin: true,
          ws: false
        }
      }
    }
  };
});
