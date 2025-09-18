import type { RouteRecordRaw } from 'vue-router';
import { HOME_PATH, LAYOUT_PATH, REDIRECT_PATH } from '@/config/seeting.ts';
import Layout from '@/layout/index.vue';
import RedirectLayout from '@/components/RedirectLayout/index.vue';
import type { MenuItem } from '@/router/model.ts';
import { eachTree, menuToRoutes } from '@/utils/index.ts';
const modules = import.meta.glob('/src/views/**/*.vue');

/**
 * 静态路由
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  // 404
  {
    path: '/:path(.*)*',
    component: () => import('@/views/exception/404/index.vue')
  }
];

/**
 * 根据菜单生成动态路由
 * @param menus 菜单数据
 * @param homePath 主页地址
 */
export function getMenuRoutes(
  menus?: MenuItem[],
  homePath?: string
): RouteRecordRaw[] {
  // 子级路由
  const childRoutes: RouteRecordRaw[] = [
    // 用于刷新的路由
    {
      path: REDIRECT_PATH + '/:path(.*)',
      component: RedirectLayout,
      meta: { hideFooter: true }
    }
  ];
  // 顶级路由
  const layoutRoutes: RouteRecordRaw[] = [
    {
      path: LAYOUT_PATH,
      component: Layout,
      redirect: HOME_PATH ?? homePath,
      children: childRoutes
    }
  ];
  eachTree(
    menuToRoutes(menus, getComponent, routes),
    (route) => {
      const temp = Object.assign({}, route, { children: void 0 });
      if (route.meta?.layout === false) {
        layoutRoutes.push(temp); // 不需要外层布局的路由
      } else {
        childRoutes.push(temp); // 需要外层布局的路由
      }
    }
  )
  return layoutRoutes;
}

/**
 * 解析路由组件
 * @param component 组件名称
 */
function getComponent(component?: string) {
  if (component) {
    const module = modules[`/src/views${component}.vue`];
    if (!module) {
      return modules[`/src/views${component}/index.vue`];
    }
    return module;
  }
}