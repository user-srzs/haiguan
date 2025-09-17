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

/**
 * 只复制目标对象中已存在的字段
 * @param target 目标对象
 * @param source 源对象
 * @param exclude 排除的字段
 * @param options 选项
 * @param options.overwriteUndefined 是否允许覆盖undefined
 * @returns 目标对象
 */
export function formAssignObject(
  target: Record<string, any>,
  source: Record<string, any>,
  exclude: string[] = [],
  options: Record<string, any> = { }
): Record<string, any> {
  const { overwriteUndefined = true } = options;
  // 获取目标对象的所有键
  const targetKeys = Object.keys(target);
  for (let i = 0; i < targetKeys.length; ++i) {
    const key = targetKeys[i];
    // 跳过排除的属性
    if (exclude.includes(key)) continue;
    // 检查源对象是否有该属性
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    const sourceValue = source[key];
    // 如果源值是undefined且不允许覆盖，则跳过
    if (sourceValue === undefined && !overwriteUndefined) continue;
    // 赋值
    target[key] = sourceValue;
  }
  return target;
}


