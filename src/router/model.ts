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