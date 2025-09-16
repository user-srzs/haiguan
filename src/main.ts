import App from './App.vue';
import pinia from './stores';
import router from './router';
import i18n from './i18n';
import VueViewer from 'v-viewer';
// import * as ElIcon from '@element-plus/icons-vue';
import { envConfig } from './config/env';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import 'xgplayer/dist/index.min.css';
import 'viewerjs/dist/viewer.css';
import './styles/index.scss';
import 'element-plus/theme-chalk/display.css';
import 'element-plus/es/components/collapse/style/index';
import 'element-plus/es/components/collapse-item/style/index';
import 'element-plus/es/components/carousel/style/index';
import 'element-plus/es/components/carousel-item/style/index';
import 'element-plus/dist/index.css';
import 'echarts';

const app = createApp(App);

// 定义全局变量-默认 base服务地址
app.config.globalProperties.$baseServiceUrl = envConfig.baseServiceUrl;
// 定义全局变量-user base服务地址
app.config.globalProperties.$userServiceUrl = envConfig.userServiceUrl;
// 定义全局变量-customs base服务地址
app.config.globalProperties.$customsServiceUrl = envConfig.customsServiceUrl;

// // 全局引入 element plus icon
// Object.keys(ElIcon).forEach((name) => {
//   app.component(name, ElIcon[name]);
// });

app.use(VueViewer);
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount('#app');
