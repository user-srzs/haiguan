/** 添加地址管理参数 */
export interface AddRegionArgs {
  /** 当前节点id */
  id?: number;
  /** 父节点id */
  parentId?: number;
  /** 节点名称 */
  nodeName?: string;
  /** 绑定模型区域 */
  modelRegion?: string;
  /** 项目编码 */
  projectCode?: string;
}

export interface AddRegionResult {
  code: number;
  msg: string;
  success: string;
}

export interface GetRegionResult {
  code: number;
  msg?: string;
  list?: RegionResult[] | null;
  success: string;
}


/** 添加地址管理参数 */
export interface RegionResult {
  /** 当前节点id */
  id: number;
  /** 父节点id */
  parentId: number;
  /** 节点名称 */
  nodeName: string;
  /** 绑定模型区域 */
  modelRegion: string;
  /** 项目编码 */
  projectCode: string;
  /** 子节点 */
  children?: Array<RegionResult> | null;
}