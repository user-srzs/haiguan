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
  /** 时间戳 */
  timestamp?: number;
  /** 请求ID */
  requestId?: string;
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  /** 当前页码 */
  current?: number;
  /** 每页大小 */
  size?: number;
  /** 排序字段 */
  orderBy?: string;
  /** 排序方向 */
  orderDirection?: 'asc' | 'desc';
}

/**
 * 分页查询结果
 */
export interface PageResult<T = any> {
  /** 数据列表 */
  records: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页大小 */
  size: number;
  /** 总页数 */
  pages: number;
}

// 重新导出请求方法
export { request, get, post, put, del, upload, download } from '@/utils/request';
