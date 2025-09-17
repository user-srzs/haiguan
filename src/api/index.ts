/**
 * 接口统一返回结果
 */
export interface ApiResult<T = any> {
  /** 状态码 */
  code: number;
  /** 状态信息 */
  msg?: string;
  /** 返回数据 */
  data?: T;
}