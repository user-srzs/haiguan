/**
 * 登录用户状态管理
 */
import { defineStore } from 'pinia';
import { mapTree, isExternalLink, removeToken } from '@/utils/index.ts';
import type { MenuItem } from '@/router/model.ts';
import { filterAsyncRoutes } from '@/utils/router-util.ts';
import {
  MENUS_CACHE_NAME,
  ROLES_CACHE_NAME,
  USER_CACHE_NAME,
  USER_MENUS
} from '@/config/seeting.ts';
import { RoleDto, UserDto } from '@/api/account/model.ts';

export interface TypeDto {
  /** Id */
  value?: string;
  /** 名称 */
  label?: string;
}
export interface UserState {
  // 当前登录用户信息
  user: UserDto | null;
  // 当前登录用户角色信息
  roles: RoleDto | null;
  authorities: (string | undefined)[];
  // 菜单列表
  menus: MenuItem[] | null;
  // 菜单权限
  menusPermissions: [];
  // 能源权限 <水,点,燃气>
  energyPermissions: string;
  // 按钮权限
  buttonPermissions: string[];
  // 数据权限
  dataPermissions: string[];
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    // 当前登录用户信息
    user: null,
    // 当前登录用户角色信息
    roles: null,
    authorities: [],
    // 菜单列表
    menus: null,
    // 菜单权限
    menusPermissions: [],
    // 能源权限 <水,点,燃气>
    energyPermissions: '',
    // 按钮权限
    buttonPermissions: [],
    // 数据权限
    dataPermissions: []
  }),
  actions: {
    /**
     * 请求登录用户的个人信息/权限/角色/菜单
     */
    getMenus() {
      const roles: string[] | undefined = getRoles()?.split(',');
      const filterRoutes = filterAsyncRoutes(USER_MENUS, roles);
      const { menus, homePath } = formatMenus(filterRoutes);
      this.setMenus(menus);
      return { menus, homePath };
    },
    /**
     * 更新用户信息
     */
    setUser(value: UserDto) {
      this.info = value;
    },
    /**
     * 更新菜单数据
     */
    setMenus(menus: MenuItem[] | null) {
      this.menus = menus;
    },
    /** 重置 user store */
    clearUser() {
      this.$reset();
    }
  },
  persist: [
    {
      key: USER_CACHE_NAME,
      storage: localStorage,
      pick: ['user']
    },
    {
      key: ROLES_CACHE_NAME,
      storage: localStorage,
      pick: ['roles']
    },
    {
      key: MENUS_CACHE_NAME,
      storage: localStorage,
      pick: ['menus']
    },
    {
      key: 'authorities',
      storage: localStorage,
      pick: ['authorities']
    },
    {
      key: 'menusPermissions',
      storage: localStorage,
      pick: ['menusPermissions']
    },
    {
      key: 'energyPermissions',
      storage: localStorage,
      pick: ['energyPermissions']
    },
    {
      key: 'buttonPermissions',
      storage: localStorage,
      pick: ['buttonPermissions']
    },
    {
      key: 'dataPermissions',
      storage: localStorage,
      pick: ['dataPermissions']
    }
  ]
});

/**
 * 菜单数据处理为EleProLayout所需要的格式
 * @param data 菜单数据
 * @param childField 子级的字段名称
 */
function formatMenus(data: Menu[], childField = 'children') {
  let homePath: string | undefined;
  let homeTitle: string | undefined;
  const menus = mapTree<Menu, MenuItem>(
    data,
    (item) => {
      const meta: MenuItem['meta'] =
        typeof item.meta === 'string'
          ? JSON.parse(item.meta || '{}')
          : item.meta;
      const menu: MenuItem = {
        path: item.path,
        component: item.component,
        meta: {
          title: item.title,
          icon: item.icon,
          hide: !!item.hide,
          ...meta
        }
      };
      const children = item[childField]
        ? item[childField].filter((d: any) => !(d.meta?.hide ?? d.hide))
        : void 0;
      if (!children?.length) {
        if (!homePath && menu.path && !isExternalLink(menu.path)) {
          homePath = menu.path;
          homeTitle = menu.meta?.title;
        }
      } else {
        const childPath = children[0].path;
        if (childPath) {
          if (!menu.redirect) {
            menu.redirect = childPath;
          }
          if (!menu.path) {
            menu.path = childPath.substring(0, childPath.lastIndexOf('/'));
          }
        }
      }
      if (!menu.path) {
        console.error('菜单path不能为空且要唯一:', item);
        return;
      }
      return menu;
    },
    childField
  );
  return { menus, homePath, homeTitle };
}
