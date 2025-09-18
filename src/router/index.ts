/**
 * 路由配置
 */
import NProgress from 'nprogress';
import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import {
  WHITE_LIST,
  REDIRECT_PATH,
  LAYOUT_PATH,
  HOME_PATH
} from '@/config/seeting.ts';
import { routes, getMenuRoutes } from './router';
import { setPageTitle, getToken, removeToken } from '@/utils/index.ts';
import { getRouteTitle } from '@/i18n/use-locale.ts';
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
router.beforeEach(async (to) => {
  // 显示进度条（排除刷新路径）
  if (!to.path.includes(REDIRECT_PATH)) {
    NProgress.start();
    setPageTitle(getRouteTitle(to));
  }

  const token = getToken();
  const userStore = useUserStore();
  // 如果没有token
  if (!token) {
    // 白名单页面直接放行
    if (WHITE_LIST.includes(to.path)) {
      return;
    }

    // 非白名单页面跳转到登录页
    const query =
      to.path === LAYOUT_PATH
        ? {}
        : {
            from: encodeURIComponent(to.fullPath)
          };
    return {
      path: '/login',
      query
    };
  }

  // 有token但访问登录页，重定向到首页
  if (to.path === '/login') {
    return { path: HOME_PATH || '/' };
  }

  // 检查是否已加载用户菜单
  if (!userStore.menus) {
    try {
      const { menus, homePath } = userStore.getMenus();
      if (!!menus?.length) {
        // 动态添加路由
        const menuRoutes = getMenuRoutes(menus, homePath);
        menuRoutes.forEach((route: RouteRecordRaw) => {
          router.addRoute(route);
        });
        // 确保路由已添加后再跳转
        return { ...to, replace: true };
      } else {
        // 没有菜单，跳转到404页面
        return '/404';
      }
    } catch (error) {
      // 获取菜单失败，清除token并跳转到登录页
      userStore.clearUser();
      removeToken();
      return '/login';
    }
  }
  console.log('router', router.getRoutes());
  return;
});

// 路由守卫-后置守卫
router.afterEach((to) => {
  if (!to.path.includes(REDIRECT_PATH) && NProgress.isStarted()) {
    setTimeout(() => {
      NProgress.done(true);
    }, 200);
  }
});

export default router;
