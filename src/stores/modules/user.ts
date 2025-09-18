/**
 * 登录用户状态管理
 */
import { defineStore } from 'pinia';
import { mapTree, isExternalLink } from '@/utils/index.ts';
import type { MenuItem } from '@/router/model.ts';
import { filterAsyncRoutes } from '@/utils/router-util.ts';
import {
  MENUS_CACHE_NAME,
  ROLES_CACHE_NAME,
  USER_CACHE_NAME,
  USER_MENUS
} from '@/config/seeting.ts';
import { MenuDto, RoleDto, UserDto } from '@/api/account/model.ts';

// 添加 Menu 类型定义
interface Menu {
  path: string;
  component?: string;
  title: string;
  icon?: string;
  hide?: boolean;
  meta?: any;
  children?: Menu[];
  redirect?: string;
}

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
  authorities: Array<string | undefined> | null;
  // 菜单列表
  menus: MenuItem[] | null;
  // 菜单权限
  menusPermissions: MenuDto[] | null;
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
      const filterRoutes = filterAsyncRoutes(USER_MENUS, []);
      const { menus, homePath } = formatMenus(filterRoutes);
      this.setMenus(menus);
      return { menus, homePath };
    },
    /**
     * 更新用户信息
     */
    setUser(value: UserDto) {
      this.user = value;
    },
    /**
     * 获取当前登录用户的角色信息
     */
    setRoles(value: RoleDto | null) {
      this.roles = value;
    },
    /** 更新用户权限 */
    setAuthorities(value: Array<string | undefined> | null) {
      this.authorities = value;
    },
    /**
     * 更新菜单数据
     */
    setMenus(menus: MenuItem[] | null) {
      this.menus = menus;
    },
    /**
     * 获取当前登录用户的菜单权限
     */
    setMenuPermissions(menus: MenuDto[] | null) {
      this.menusPermissions = menus;
    },
    /**
     * 获取当前登录用户的能源权限
     */
    setEnergyPermissions(value: string) {
      this.energyPermissions = value;
    },
    /**
     * 获取当前登录用户的按钮权限
     */
    setButtonPermissions(value: string[]) {
      this.buttonPermissions = value;
    },
    /**
     * 获取当前登录用户的数据权限
     */
    setDataPermissions(value: string[]) {
      this.dataPermissions = value;
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
      paths: ['user'],
      serializer: {
        serialize: (state: any) => JSON.stringify(state.user),
        deserialize: (value: string) => ({ user: JSON.parse(value) })
      }
    },
    {
      key: ROLES_CACHE_NAME,
      storage: localStorage,
      paths: ['roles'],
      serializer: {
        serialize: (state: any) => JSON.stringify(state.roles),
        deserialize: (value: string) => ({ roles: JSON.parse(value) })
      }
    },
    // {
    //   key: MENUS_CACHE_NAME,
    //   storage: localStorage,
    //   paths: ['menus'],
    //   serializer: {
    //     serialize: (state: any) => JSON.stringify(state.menus),
    //     deserialize: (value: string) => ({ menus: JSON.parse(value) })
    //   }
    // },
    {
      key: 'user-authorities',
      storage: localStorage,
      paths: ['authorities'],
      serializer: {
        serialize: (state: any) => JSON.stringify(state.authorities),
        deserialize: (value: string) => ({ authorities: JSON.parse(value) })
      }
    },
    {
      key: 'user-menus-permissions',
      storage: localStorage,
      paths: ['menusPermissions'],
      serializer: {
        serialize: (state: any) => JSON.stringify(state.menusPermissions),
        deserialize: (value: string) => ({
          menusPermissions: JSON.parse(value)
        })
      }
    },
    {
      key: 'user-energy-permissions',
      storage: localStorage,
      paths: ['energyPermissions'],
      serializer: {
        serialize: (state: any) => JSON.stringify(state.energyPermissions),
        deserialize: (value: string) => ({
          energyPermissions: JSON.parse(value)
        })
      }
    },
    {
      key: 'user-button-permissions',
      storage: localStorage,
      paths: ['buttonPermissions'],
      serializer: {
        serialize: (state: any) => JSON.stringify(state.buttonPermissions),
        deserialize: (value: string) => ({
          buttonPermissions: JSON.parse(value)
        })
      }
    },
    {
      key: 'user-data-permissions',
      storage: localStorage,
      paths: ['dataPermissions'],
      serializer: {
        serialize: (state: any) => JSON.stringify(state.dataPermissions),
        deserialize: (value: string) => ({ dataPermissions: JSON.parse(value) })
      }
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
