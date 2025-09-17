import request from '@/utils/request';
import type { LoginArgs, LoginResult } from '@/api/account/model.ts';

/**
 * Account
 * 账户
 */
export const url: string = '/api/account';

enum UrlPath {
  // 登录
  login = `/userService/login/webAccount`,
  // 更改密码
  changePwd = `/userService/login`
}

/**
 * 登录
 */
export const login = (data: LoginArgs) => {
  return request.post<LoginResult>(UrlPath.login, data);
};
