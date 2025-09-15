import request from '@/utils/request';

/**
 * Account
 * 账户
 */
export const url: string = '/api/account';

enum UrlPath {
  // 登录
  login = `/api/Account/Login`,
  // 刷新Token
  refreshToken = `/api/Account/RefreshToken`,
  // 吊销Token
  revokeToken = `/api/Account/RevokeToken`,
  // 更改密码
  changePwd = `/api/Account/ChangePwd`,
}

/**
 * 登录
 */
export const login = (data: LoginArgs) => {
  return request.post<LoginResult>(UrlPath.login, data);
};

/**
 * 刷新Token
 */
export const refreshToken = (data: RefreshTokenArgs) => {
  return request.post<RefreshTokenResult>(UrlPath.refreshToken, data);
};

/**
 * 吊销Token
 */
export const revokeToken = (data: RevokeTokenArgs): Promise<void> => {
  return request.post(UrlPath.revokeToken, data);
};

/**
 * 更改密码
 */
export const changePwd = (data: ChangePwdArgs): Promise<void> => {
  return request.put(UrlPath.changePwd, data);
};
