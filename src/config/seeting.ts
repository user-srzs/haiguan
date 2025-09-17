import userMenus from '@/router/modules/index.ts';
import { envConfig } from './env';

/** 接口地址 */
export const API_BASE_URL: string = envConfig.apiUrl;

/** 项目名称 */
export const PROJECT_NAME: string = envConfig.appName;

/** 项目api 默认服务代理 base地址 */
export const VITE_API_URL_BASE: string = envConfig.baseServiceUrl;

/** 项目api user(用户)服务代理 base地址 */
export const VITE_API_URL_USER: string = envConfig.userServiceUrl;

/** 项目api customs(海关)服务代理 base地址 */
export const VITE_API_URL_CUSTOMS: string = envConfig.customsServiceUrl;

/** 不需要登录的路由 */
export const WHITE_LIST: string[] = ['/login'];

/** 首页路径, 为空则取第一个菜单的地址 */
export const HOME_PATH: string = '/home';

/** 外层布局的路由地址 */
export const LAYOUT_PATH = '/';

/** 刷新路由的路由地址 */
export const REDIRECT_PATH = '/redirect';

// token 传递的 header 名称
export const TOKEN_HEADER_NAME = 'Authorization';

/** token本地缓存的名称 */
export const TOKEN_CACHE_NAME = 'token';

/** 角色本地缓存的名称 */
export const ROLES_CACHE_NAME = 'roles';

/** 用户本地缓存的名称 */
export const USER_CACHE_NAME = 'user';

/** 用户本地缓存的名称 */
export const MENUS_CACHE_NAME = 'menus';

/** 菜单 */
export const USER_MENUS = userMenus;

/** 主题配置本地缓存的名称 */
export const THEME_CACHE_NAME = 'theme';

/** i18n本地缓存的名称 */
export const I18N_CACHE_NAME = 'i18n-lang';
