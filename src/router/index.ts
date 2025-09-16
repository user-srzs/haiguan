/**
 * 路由配置
 */
import NProgress from 'nprogress';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { WHITE_LIST, REDIRECT_PATH, LAYOUT_PATH } from '@/config/seeting.ts';
import { routes, getMenuRoutes } from "./router"
import { setPageTitle, getToken } from "@/utils/index.ts"
import { getRouteTitle } from "@/i18n/use-locale.ts"
import { useUserStore } from '@/stores/modules/user.ts';

// 浏览器加载进度条
NProgress.configure({
  speed: 200,
  minimum: 0.02,
  trickleSpeed: 200,
  showSpinner: false
});

// 创建路由实例
const router = createRouter({
  routes,
  // history: createWebHistory(),
  history: createWebHashHistory(),
  scrollBehavior: () => {
    return { top: 0 };
  }
});

// 路由守卫-前置守卫
router.beforeEach((to,from,next  ) => {
  // 显示进度条（排除刷新路径）
  if (!to.path.includes(REDIRECT_PATH)) {
    NProgress.start();
    setPageTitle(getRouteTitle(to));
  }
  // 登录时直接放行, 未登录时需要判断路径是否需要登录(白名单内页面不需要登录)
  if(!getToken()) {
    // 判断跳转的路径是否是白名单, 在白名单内放行, 不在白名单内跳转到登录界面
    if(!WHITE_LIST.includes(to.path)) {
      const query = to.path === LAYOUT_PATH ? {} : {
        from: encodeURIComponent(to.fullPath)
      }
      // 跳转到登录界面
      next({
        path: '/login',
        query
      })
    }
    next();
  }
  // 注册动态路由
  const userStore = useUserStore();
  if(!userStore.menus) {
    const { menus, homePath } = userStore.getMenus();
    if(menus) {
      getMenuRoutes(menus, homePath).forEach((r: RouteRecordRaw) => {
        router.addRoute(r);
      })
      next({ ...to, replace: true });
    }else {
      next();
    }
  }
  next();
})

// 路由守卫-后置守卫
router.afterEach((to) => {
  if (!to.path.includes(REDIRECT_PATH) && NProgress.isStarted()) {
    setTimeout(() => {
      NProgress.done(true);
    }, 200);
  }
})

export default router;
