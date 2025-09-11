/**
 * pinia
 */
import { createPinia } from 'pinia';

import piniaPluginPersistence from 'pinia-plugin-persistedstate';

const pinia = createPinia();
//持久化
pinia.use(piniaPluginPersistence);

export default pinia;
