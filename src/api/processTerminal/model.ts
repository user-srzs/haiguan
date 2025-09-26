/** 添加航站楼参数 */
export interface AddProcessTerminal {
  /** 航站楼id */
  id?: number;
  /** 航站楼 */
  terminal?: string;
  /** 航站楼名称 */
  terminalName?: string;
}

/** 添加货物类型参数 */
export interface AddProcessGoodsType {
  /** 货物类型id */
  id?: number;
  /** 航站楼id */
  processTerminalId?: number;
  /** 货物类型 */
  goodsType?: string;
  /** 货物类型名称 */
  goodsTypeName?: string;
}

/** Add */
export interface AddResult {
  code: number
  success?: string;
  msg: string;
}

/** 获取 航站楼 result */
export interface ProcessTerminalResult {
  code: number
  success: string;
  list: ProcessTerminal[];
  msg?: string;
}

/** 航站楼 */
export interface ProcessTerminal {
  id: number;
  terminal: string;
  terminalName: string;
  projectCode: string;
  processGoodsTypeList: ProcessGoodsType[];
}

/** 获取类型 */
export interface ProcessGoodsType {
  id: number,
  processTerminalId: number;
  goodsType: string;
  goodsTypeName: string;
  projectCode: string
}

export interface TabItem {
  label: string;
  name: string;
}

export interface SelectItem {
  label: string;
  value: string | number;
}


export interface Tree<T> {
  id: number | string;
  label: string;
  value: number | string;
  type: TreeType;
  original: T;
  children?: Tree<T>[] | null;
}

export enum TreeType {
  terminal = 'terminal',
  goodsType = 'goodsType'
}