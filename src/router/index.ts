import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: () => import('../layout/index.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router