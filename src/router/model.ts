/**
 * 路由item项
 */
export interface MenuItem {
  /** 路由名称 */
  name?: string;
  /** 菜单地址 */
  path: string;
  /** 路由组件 */
  component?: string;
  /** 路由重定向 */
  redirect?: string;
  /** 路由元数据 */
  meta?: MenuMeta;
  /** 子路由 */
  children?: Array<MenuItem>;
  /** 路由扩展 */
  [key: string]: any;
}

/**
 * 路由item元数据
 */
export interface MenuMeta extends Record<string, any> {
  /** 菜单标题 */
  title?: string;
  /** 菜单图标 */
  icon?: any;
  /** 菜单是否隐藏 */
  hide?: boolean;
  /** 页签是否缓存 */
  keepAlive?: boolean;
  /** 是否在面包屑中显示 */
  breadcrumb?: boolean;
  /** 是否需要外层布局 */
  layout?: boolean;
  /** 路由地址 */
  routePath?: string;
  /** 菜单扩展 */
  [key: string]: any;
}

/**
 * 菜单数据
 */
export interface MenuDto {
  /** 菜单id */
  id: number;
  /** 菜单中文名称 */
  label: string;
  /** 菜单英语名称 */
  menuEng: string;
  /** 菜单图标 */
  menuIcon?: string;
  /** 菜单排序 */
  menuOrder?: number;
  /** 菜单地址 */
  menuUrl: string;
  /** 父级菜单id */
  parentId: number;
  /** 子级 */
  children?: Array<MenuDto> | null;
}

/**
 * 菜单数据
 */
export interface Menu {
  /** 菜单id */
  id: number;
  /** 菜单中文名称 */
  title: string;
  /** 菜单英语名称 */
  menuEng: string;
  /** 菜单图标 */
  icon?: string;
  /** 菜单排序 */
  order?: number;
  /** 菜单地址 */
  path: string;
  /** 父级菜单id */
  parentId: number;
  /** 子级 */
  children?: Array<MenuDto> | null;
}