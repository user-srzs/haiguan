import request from '@/utils/request';
import type {
  LoginArgs,
  LoginResult,
  PermissionsResult
} from '@/api/account/model.ts';

/**
 * Account
 * 账户
 */

enum UrlPath {
  // 登录
  login = `/userService/login/webAccount`,
  // 获取权限列表
  permissions = `/userService/menuMan/getPermissions`
}

/**
 * 登录
 */
export const login = (data: LoginArgs) => {
  return request.post<LoginResult>(UrlPath.login, data);
};

/**
 * 获取权限列表(按钮权限，菜单权限，数据权限)
 */
export const getPermissions = () => {
  return request.get<PermissionsResult>(UrlPath.permissions);
};