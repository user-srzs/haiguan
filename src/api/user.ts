/**
 * 用户相关API
 */
import { get, post } from './index';
import type { ApiResult } from './index';

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
  createTime: string;
  updateTime: string;
}

/**
 * 登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  remember?: boolean;
}

/**
 * 登录结果
 */
export interface LoginResult {
  token: string;
  refreshToken: string;
  expires: number;
  userInfo: UserInfo;
}

/**
 * 用户登录
 */
export function login(params: LoginParams): Promise<ApiResult<LoginResult>> {
  return post('/auth/login', params);
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<ApiResult<UserInfo>> {
  return get('/user/info');
}

/**
 * 退出登录
 */
export function logout(): Promise<ApiResult> {
  return post('/auth/logout');
}

/**
 * 刷新token
 */
export function refreshToken(refreshToken: string): Promise<ApiResult<{ token: string; expires: number }>> {
  return post('/auth/refresh', { refreshToken });
}