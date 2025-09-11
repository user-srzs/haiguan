/**
 * 登录用户状态管理
 */
import { defineStore } from 'pinia';
import { mapTree, isExternalLink } from 'ele-admin-plus/es';
import type { MenuItem } from 'ele-admin-plus/es/ele-pro-layout/types';
import type { ProfileDto } from '@/api/user/model';
import type { AreaWholeParentsDto, DistrictDto } from '@/api/districts/model';
import type { Menu } from '@/api/system/model';
import type { AsseterDTO } from '@/api/fields/model';
import { getRoles } from '@/utils/token-util';
import { USER_MENUS } from '@/config/setting';
import { filterAsyncRoutes } from '@/utils/router-util';

export interface TypeDto {
  /** Id */
  value?: string;
  /** 名称 */
  label?: string;
}
export interface UserState {
  info: ProfileDto | null;
  menus: MenuItem[] | null;
  authorities: (string | undefined)[];
  roles: (string | undefined)[];
  currentDistrict: AreaWholeParentsDto;
  districtsTree: DistrictDto[];
  typeOptions: TypeDto[];
  asseterOptions: AsseterDTO[];
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    /** 当前登录用户的信息 */
    info: null,
    /** 当前登录用户的菜单 */
    menus: null,
    /** 当前登录用户的权限 */
    authorities: [],
    /** 当前登录用户的角色 */
    roles: [],
    /** 用户当前行政区树结构 */
    districtsTree: [],
    /** 作业类型选择 */
    typeOptions: [],
    /** 所有资产用户 */
    asseterOptions: []
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
    setInfo(value: ProfileDto) {
      this.info = value;
    },
    /**
     * 更新菜单数据
     */
    setMenus(menus: MenuItem[] | null) {
      this.menus = menus;
    },
    /**
     * 更新用户区域对象
     */
    setCurrentDistrict(currentDistrict: AreaWholeParentsDto) {
      this.currentDistrict = currentDistrict;
    },
    /**
     * 更新用户区域树
     */
    setDistrictsTree(districtsTree: DistrictDto[]) {
      this.districtsTree = districtsTree;
    },
    setTypeOptions(typeOptions: TypeDto[]) {
      this.typeOptions = typeOptions;
    },
    setAsseterOptions(asseterOptions: AsseterDTO[]) {
      this.asseterOptions = asseterOptions;
    }
  },
  persist: {
    key: 'districtsTree',
    storage: sessionStorage,
    pick: ['districtsTree', 'typeOptions', 'currentDistrict', 'asseterOptions']
  }
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
        meta: { title: item.title, icon: item.icon, hide: !!item.hide, ...meta }
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
