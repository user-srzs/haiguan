import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import store from './store';
import router from './router';
import i18n from './i18n';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
