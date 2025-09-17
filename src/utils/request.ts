/**
 * HTTP请求封装
 */
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import type { Action } from 'element-plus';
import { getToken } from './token-util';
import {
  LAYOUT_PATH,
  TOKEN_HEADER_NAME,
  VITE_API_URL_BASE
} from '@/config/seeting';
import { logout, toURLSearch } from '@/utils';
import router from '@/router';

interface Config<D = any> extends InternalAxiosRequestConfig<D> {
  isResponse?: boolean;
}

// 请求超时时间
// const TIMEOUT = 30000;

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: VITE_API_URL_BASE
  // timeout: TIMEOUT,
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8'
  // }
});

// 请求拦截器
service.interceptors.request.use(
  (config: Config) => {
    // 添加token
    const token = getToken();
    if (token && config.headers) {
      config.headers[TOKEN_HEADER_NAME] = token;
    }
    // get请求处理数组和对象类型参数
    if (config.method === 'get' && config.params) {
      config.url = toURLSearch(config.params, config.url);
      config.params = {};
    }
    // 开发环境打印请求信息
    if (import.meta.env.DEV) {
      console.log(`请求拦截 [${config.method?.toUpperCase()}] ${config.url}`, {
        params: config.params,
        data: config.data,
        config
      });
    }
    // 设置是否启用响应处理的标志，默认为 true
    config.isResponse =
      config.isResponse !== undefined ? config.isResponse : true;
    return config;
  },
  (error) => {
    console.error('网络错误:', error);
    return Promise.reject(error);
  }
);

/** 统一的错误消息配置 */
const ERROR_MESSAGES = {
  400: 'Bad Request!',
  401: '登录状态已过期, 请退出重新登录!',
  403: '权限异常请联系管理员检查您的权限配置',
  404: '请求不存在',
  500: '服务器内部错误'
};

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response;
    // 开发环境打印响应信息
    if (import.meta.env.DEV) {
      console.log(
        `响应拦截 [${config.method?.toUpperCase()}] ${config.url}`,
        response
      );
    }
    if (!(config as Config).isResponse) {
      return response;
    }
    const { code, msg } = data || {};
    if (code !== 1) {
      ElMessage.error(msg || '请求失败！');
      return data;
      // return Promise.reject(data);
    }
    return data;
  },
  (error) => {
    console.error('Response Error:', error);
    // 网络错误处理
    if (!error.response) {
      ElMessage.error('网络连接异常，请检查网络设置');
      return Promise.reject(error);
    }

    const {
      status,
      data: { msg }
    } = error.response;
    if (status) {
      if (status === 401) {
        const { path, fullPath } = unref(router.currentRoute);
        if (path == LAYOUT_PATH) {
          logout(true, void 0, router.push);
        } else {
          handleLoginExpired(msg || ERROR_MESSAGES[status], fullPath);
        }
      } else {
        ElMessage.error(msg || ERROR_MESSAGES[status]);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 处理登录过期
 */
function handleLoginExpired(
  message = '登录状态已过期, 请退出重新登录!',
  fullPath?: string
) {
  ElMessageBox.alert(message, '系统提示', {
    showClose: false,
    confirmButtonText: '重新登录',
    callback: (action: Action) => {
      if (action === 'confirm') {
        // 退登处理
        logout(false, fullPath);
      }
    },
    beforeClose: () => ElMessageBox.close()
  }).then(() => {});
}

export default service;
