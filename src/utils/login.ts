import { removeToken } from '@/utils/token-util.ts';
import { useUserStore } from '@/stores/modules/user.ts';
import { getBaseServiceUrl } from '@/config/env.ts'
import type { Router } from 'vue-router';

/**
 * 退出登录
 * @param route 是否使用路由跳转
 * @param from 登录后跳转的地址
 * @param push 路由跳转方法
 */
export function logout(route?: boolean, from?: string, push?: Router['push']) {
  /** 清除用户信息缓存 */
  useUserStore().clearUser();
  removeToken();
  if (route && push) {
    push({
      path: '/login',
      query: from ? { from: encodeURIComponent(from) } : void 0
    });
    return;
  }
  // 这样跳转避免再次登录重复注册动态路由, hash 路由模式使用 location.reload();
  const BASE_URL = getBaseServiceUrl();
  const url = BASE_URL + 'login';
  location.replace(from ? `${url}?from=${encodeURIComponent(from)}` : url);
}