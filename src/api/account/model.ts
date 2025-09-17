export interface LoginArgs {
  // 用户名
  username?: string;
  // 密码
  password?: string;
  // 项目名称
  projectCode?: string;
  // 手机号
  mobile?: string;
  // 短信验证码
  msgCode?: string;
  // 微信openId
  openId?: string;
  // UnionId
  unioId?: string;
  // 企业微信用户的uid
  qyUid?: string;
  // 圆通工号
  ytNumber?: string;
}

export interface LoginResult {
  // 状态码
  code: number;
  // 结果
  result?: ResultDto;
  // 错误信息
  msg?: string;
  // 成功
  success: string;
}

export interface ResultDto {
  Authorization: string;
  code: number;
  role: RoleDto;
  user: UserDto;
  success: string;
}

export interface RoleDto {
  menus: Array<number> | null;
  projectCode: string | null;
  roleCode: string | null;
  roleId: number;
  roleName: string;
  roleRemark: string | null;
  type: string | null;
  userId: number | null;
}

export interface UserDto {
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  adminStatus: number;
  authorities: Array<string>;
  creatorUuid: string;
  credentialsNonExpired: boolean;
  depId: string;
  dispatch: boolean;
  enableCreate: number;
  enabled: boolean;
  fullName: string;
  headImage: string;
  imgUrl: string;
  mobile: string;
  password: string;
  projectCode: string;
  states: string;
  tokenType: string;
  userId: number;
  userType: number;
  userUuid: string;
  username: string;
}
