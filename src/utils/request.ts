/**
 * HTTP请求封装
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getToken, removeToken } from './token-util';
import { VITE_API_URL_BASE } from '@/config/seeting';
import router from '@/router';

// 请求超时时间
const TIMEOUT = 30000;

// 需要重新登录的状态码
const NEED_LOGIN_CODES = [401, 403];

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: VITE_API_URL_BASE,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    // 开发环境打印请求信息
    if (import.meta.env.DEV) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response;

    // 开发环境打印响应信息
    if (import.meta.env.DEV) {
      console.log(`✅ [${config.method?.toUpperCase()}] ${config.url}`, data);
    }

    // 处理blob类型响应（文件下载）
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 统一处理业务错误
    if (data.code !== undefined && data.code !== 200) {
      const errorMsg = data.msg || '请求失败';
      
      // 需要重新登录的错误码
      if (NEED_LOGIN_CODES.includes(data.code)) {
        handleLoginExpired();
        return Promise.reject(new Error(errorMsg));
      }

      // 其他业务错误
      ElMessage.error(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    return data;
  },
  (error) => {
    console.error('❌ Response Error:', error);

    // 网络错误处理
    if (!error.response) {
      ElMessage.error('网络连接异常，请检查网络设置');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    let message = '请求失败';

    // 根据状态码处理错误
    switch (status) {
      case 400:
        message = data?.msg || '请求参数错误';
        break;
      case 401:
        message = '登录已过期，请重新登录';
        handleLoginExpired();
        break;
      case 403:
        message = '没有权限访问该资源';
        break;
      case 404:
        message = '请求的资源不存在';
        break;
      case 500:
        message = '服务器内部错误';
        break;
      case 502:
        message = '网关错误';
        break;
      case 503:
        message = '服务暂时不可用';
        break;
      default:
        message = data?.msg || `请求失败 (${status})`;
    }

    ElMessage.error(message);
    return Promise.reject(error);
  }
);

/**
 * 处理登录过期
 */
function handleLoginExpired() {
  ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    removeToken();
    router.push('/login');
  }).catch(() => {
    // 用户取消，不做处理
  });
}

/**
 * 通用请求方法
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config);
}

/**
 * GET请求
 */
export function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config });
}

/**
 * POST请求
 */
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.post(url, data, config);
}

/**
 * PUT请求
 */
export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put(url, data, config);
}

/**
 * DELETE请求
 */
export function del<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, { params, ...config });
}

/**
 * 文件上传
 */
export function upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    }
  });
}

/**
 * 文件下载
 */
export function download(url: string, params?: any, filename?: string): Promise<void> {
  return service.get(url, {
    params,
    responseType: 'blob'
  }).then((response: AxiosResponse) => {
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

export default service;