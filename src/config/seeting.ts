import userMenus from '@/router/modules';

/** 接口地址 */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL;

/** 项目名称 */
export const PROJECT_NAME: string = import.meta.env.VITE_APP_NAME;

/** 不需要登录的路由 */
export const WHITE_LIST: string[] = ['/login', '/forget', '/callback'];

/** 首页路径, 为空则取第一个菜单的地址 */
export const HOME_PATH: string = '/machinery';

/** 外层布局的路由地址 */
export const LAYOUT_PATH = '/';

/** 刷新路由的路由地址 */
export const REDIRECT_PATH = '/redirect';

/** token本地缓存的名称 */
export const TOKEN_CACHE_NAME = 'token';

/** 角色本地缓存的名称 */
export const ROLES_CACHE_NAME = 'roles';

/** 用户本地缓存的名称 */
export const USER_CACHE_NAME = 'user';

/** 菜单 */
export const USER_MENUS = userMenus;

/** 主题配置本地缓存的名称 */
export const THEME_CACHE_NAME = 'theme';

/** i18n本地缓存的名称 */
export const I18N_CACHE_NAME = 'i18n-lang';