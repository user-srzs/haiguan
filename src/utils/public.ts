/**
 * 参数转url字符串
 * @param params 参数
 * @param url 需要拼接参数的地址
 */
export function toURLSearch(
  params?: Record<keyof any, any> | null,
  url?: string
): string {
  if (typeof params !== 'object' || params == null) {
    return '';
  }
  const result = transformParams(params)
    .map((d) => `${encodeURIComponent(d[0])}=${encodeURIComponent(d[1])}`)
    .join('&');
  if (!url) {
    return result;
  }
  return (url.includes('?') ? `${url}&` : `${url}?`) + result;
}

/**
 * get请求处理数组和对象类型参数
 * @param params 参数
 */
export function transformParams(params?: Record<string, any> | null) {
  const result: [string, string][] = [];
  if (params != null && typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value != null && value !== '') {
        if (typeof value === 'object' && !isBlobFile(value)) {
          getObjectParamsArray(value).forEach((item) => {
            result.push([`${key}${item[0]}`, item[1]]);
          });
        } else {
          result.push([key, value]);
        }
      }
    });
  }
  return result;
}

/**
 * 判断是否是文件
 * @param obj 对象
 */
export function isBlobFile(obj: any) {
  return obj != null && (obj instanceof Blob || obj instanceof File);
}

/**
 * 对象转参数数组
 * @param obj 对象
 */
export function getObjectParamsArray(obj: Record<string, any>) {
  const result: [string, string][] = [];
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value != null && value !== '') {
      const name = `[${key}]`;
      if (typeof value === 'object' && !isBlobFile(value)) {
        getObjectParamsArray(value).forEach((item) => {
          result.push([`${name}${item[0]}`, item[1]]);
        });
      } else {
        result.push([name, value]);
      }
    }
  });
  return result;
}