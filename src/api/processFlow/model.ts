/** 创建流程节点参数 */
export interface CreateProcessFlowNodeArgs {
  id?: number
  arrivalOrDeparture: string,
  processGoodsTypeId: number,
  nodeName: string,
  nodeType: string,
  x: string,
  y: string,
  visualizationRegionId: number,
  visualizationRegionName: string
}

/** 创建流程lian参数 */
export interface CreateProcessFlowLineArgs {
  id?: number;
  arrivalOrDeparture: string;
  processGoodsTypeId: string;
  sourceNodeId: number;
  targetNodeId: number;
  lineName: string;
  condition: number;
}

export interface CreateResult {
  code: number;
  msg: string;
  success: string;
}

export interface FlowNodeResult {
  code: number;
  msg?: string;
  success: string;
  nodesList?: Nodes[];
  lineList?: Lines[];
}

/** 节点 */
export interface Nodes {
  id: number;
  /** 进出类型（arrival 进港、departure 出港）*/
  arrivalOrDeparture: string;
  /** 货物类型id */
  processGoodsTypeId: number;
  /** 节点显示名称 */
  nodeName: string;
  /** 节点类型（区分形状：1= 矩形 “任务节点”，2= 菱形 “判断节点”） */
  nodeType: string;
  x: string;
  y: string;
  /** 时间戳 */
  createTime: number;
  /** 项目编码 */
  projectCode: string;
  /** 节点绑定的区域地址ID */
  visualizationRegionId: number;
  /** 节点绑定的区域地址名称 */
  visualizationRegionName: string;
}

/** 线 */
export interface Lines {
  id?: number;
  /** 进出类型（arrival 进港、departure 出港）*/
  arrivalOrDeparture: string;
  /** 货物类型id */
  processGoodsTypeId: number;
  /** 【外键】源节点 ID（“从哪个节点出发”，关联process_flow_node_id） */
  sourceNodeId: number;
  /** 【外键】目标节点 ID（“到哪个节点”，关联process_flow_node_id） */
  targetNodeId: number;
  /** 连线显示名称（如 (“正常”“异常”)，可选） */
  lineName: string;
  /** 分支条件（如(“0正常”“1异常”)，用于判断节点的分支逻辑，可选） */
  condition: number;
  /** 时间戳 */
  createTime: number;
}