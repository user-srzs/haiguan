import request from '@/utils/request';
import type {
  AddRegionArgs,
  AddRegionResult,
} from './model.ts';
import { GetRegionResult } from './model.ts';

const url: string = `/customsService/visualizationRegion`

/**
 * visualizationRegion
 * 地址管理
 */

/**
 * 查
 */
export const getRegion = (data: AddRegionArgs = {}) => {
  return request<GetRegionResult>({
    url: `${url}/selectVisualizationRegion`,
    method: 'post',
    data
  });
};

/**
 * 增
 */
export const createRegion = (data: AddRegionArgs) => {
  return request<AddRegionResult>({
    url: `${url}/addVisualizationRegion`,
    method: 'post',
    data
  });
};

/**
 * 改
 */
export const updateRegion = (data: AddRegionArgs) => {
  return request<AddRegionResult>({
    url: `${url}/updateVisualizationRegion`,
    method: 'post',
    data
  });
};

/**
 * 删
 */
export const removeRegion = (id: number) => {
  return request<AddRegionResult>({
    url: `${url}/deleteVisualizationRegion/${id}`,
    method: 'get',
  });
};

