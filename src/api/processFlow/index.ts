import request from '@/utils/request';
import type {
  CreateProcessFlowLineArgs,
  CreateProcessFlowNodeArgs,
  CreateResult, FlowNodeResult
} from '@/api/processFlow/model.ts';

/**
 * 航站楼,货物类型
 * 流程节点配置
 */

/**
 * 查，流程
 */
export const getProcessFlow = (data= {}) => {
  return request<FlowNodeResult>({
    url: `/customsService/processTerminal/getProcessFlow`,
    method: 'post',
    data
  });
};

/**
 * 增，流程节点
 */
export const createProcessFlowNode = (data: CreateProcessFlowNodeArgs) => {
  return request<CreateResult>({
    url: `/customsService/processTerminal/addProcessFlowNode`,
    method: 'post',
    data
  });
};

/**
 * 改，流程节点
 */
export const updateProcessFlowNode = (data: CreateProcessFlowNodeArgs) => {
  return request<CreateResult>({
    url: `/customsService/processTerminal/updateProcessFlowNode`,
    method: 'post',
    data
  });
};

/**
 * 删，流程节点
 */
export const removeProcessFlowNode = (id: number) => {
  return request<CreateResult>({
    url: `/customsService/processTerminal/deleteProcessFlowNode/${id}`,
    method: 'get',
  });
};

/**
 * 增，流程连线
 */
export const createProcessFlowLine = (data: CreateProcessFlowLineArgs) => {
  return request<CreateResult>({
    url: `/customsService/processTerminal/addProcessFlowLine`,
    method: 'post',
    data
  });
};

/**
 * 改，流程连线
 */
export const updateProcessFlowLine = (data: CreateProcessFlowLineArgs) => {
  return request<CreateResult>({
    url: `/customsService/processTerminal/updateProcessFlowLine`,
    method: 'post',
    data
  });
};

/**
 * 删，流程连线
 */
export const removeProcessFlowLine = (id: number) => {
  return request<CreateResult>({
    url: `/customsService/processTerminal/deleteProcessFlowLine/${id}`,
    method: 'get',
  });
};

