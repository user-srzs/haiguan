/**
 * 路由配置
 */
import NProgress from 'nprogress';
import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { WHITE_LIST, REDIRECT_PATH, LAYOUT_PATH, HOME_PATH } from '@/config/seeting.ts';
import { routes, getMenuRoutes } from "./router"
import {setPageTitle, getToken, removeToken} from "@/utils/index.ts"
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
router.beforeEach((to) => {
  // 显示进度条（排除刷新路径）
  if (!to.path.includes(REDIRECT_PATH)) {
    NProgress.start();
    setPageTitle(getRouteTitle(to));
  }

  const token = getToken();
  const userStore = useUserStore();
  debugger;
  // 如果没有token
  if (!token) {
    // 白名单页面直接放行
    if (WHITE_LIST.includes(to.path)) {
      return;
    }
    
    // 非白名单页面跳转到登录页
    const query = to.path === LAYOUT_PATH ? {} : {
      from: encodeURIComponent(to.fullPath)
    };
    return {
      path: '/login',
      query
    };
  }

  // 有token但访问登录页，重定向到首页
  if (to.path === '/login') {
    return { path: HOME_PATH || '/'};
  }

  // 检查是否已加载用户菜单
  if (!userStore.menus) {
    try {
      const { menus, homePath } = userStore.getMenus();
      if (menus && menus.length > 0) {
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
      console.error('获取用户菜单失败:', error);
      // 获取菜单失败，清除token并跳转到登录页
      userStore().clearUser();
      removeToken();
      return '/login';
    }
  }
  // // 检查路由权限
  // if (to.meta?.requiresAuth !== false && !hasRoutePermission(to, userStore.menus)) {
  //   return '/403';
  // }
  return;
});

/**
 * 检查路由权限
 */
// function hasRoutePermission(route: any, menus: any[]): boolean {
//   // 如果路由不需要权限检查，直接返回true
//   if (route.meta?.requiresAuth === false) {
//     return true;
//   }
//
//   // 递归检查菜单中是否存在该路由
//   function checkMenus(menuList: any[]): boolean {
//     return menuList.some(menu => {
//       if (menu.path === route.path) {
//         return true;
//       }
//       if (menu.children && menu.children.length > 0) {
//         return checkMenus(menu.children);
//       }
//       return false;
//     });
//   }
//
//   return checkMenus(menus);
// }

// 路由守卫-后置守卫
router.afterEach((to) => {
  if (!to.path.includes(REDIRECT_PATH) && NProgress.isStarted()) {
    setTimeout(() => {
      NProgress.done(true);
    }, 200);
  }
})

export default router;
