import request from '@/utils/request';
import type {
  AddProcessGoodsType,
  AddProcessTerminal,
  AddResult,
  ProcessTerminalResult
} from '@/api/processTerminal/model.ts';

/**
 * 航站楼
 * 货物类型
 */

/**
 * 查，航站楼
 */
export const getProcessTerminal = (data = {}) => {
  return request<ProcessTerminalResult>({
    url: `/customsService/processTerminal/getProcessTerminal`,
    method: 'post',
    data
  });
};

/**
 * 增，航站楼
 */
export const createProcessTerminal = (data: AddProcessTerminal) => {
  return request<AddResult>({
    url: `/customsService/processTerminal/addProcessTerminal`,
    method: 'post',
    data
  });
};

/**
 * 改，航站楼
 */
export const updateProcessTerminal = (data: AddProcessTerminal) => {
  return request<AddResult>({
    url: `/customsService/processTerminal/updateProcessTerminal`,
    method: 'post',
    data
  });
};

/**
 * 删，航站楼
 */
export const removeProcessTerminal = (id: string) => {
  return request<AddResult>({
    url: `/customsService/processTerminal/deleteProcessTerminal/${id}`,
    method: 'get',
  });
};

/**
 * 增，货物类型
 */
export const createProcessGoodsType = (data: AddProcessGoodsType) => {
  return request<AddResult>({
    url: `/customsService/processGoodsType/addGoodsType`,
    method: 'post',
    data
  });
};

/**
 * 改，货物类型
 */
export const updateProcessGoodsType = (data: AddProcessGoodsType) => {
  return request<AddResult>({
    url: `/customsService/processGoodsType/updateGoodsType`,
    method: 'post',
    data
  });
};

/**
 * 增，货物类型
 */
export const removeProcessGoodsType = (id: string) => {
  return request<AddResult>({
    url: `/customsService/processGoodsType/deleteGoodsType/${id}`,
    method: 'get',
  });
};