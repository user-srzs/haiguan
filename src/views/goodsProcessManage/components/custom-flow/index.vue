<script setup lang="ts">
import LogicFlow from '@logicflow/core'
import '@logicflow/core/lib/style/index.css'
import { DndPanel, SelectionSelect, Menu } from '@logicflow/extension'
import '@logicflow/extension/lib/style/index.css'
import { ElMessage } from 'element-plus'
import decisionNodeIcon from "@/assets/flow/decisionNode.svg";
import endNodeIcon from "@/assets/flow/end.svg";
import normalNodeIcon from "@/assets/flow/normalNode.svg";
import startNodeIcon from "@/assets/flow/start.svg";
import electoral from "@/assets/flow/electoral.svg"
import {
  createProcessFlowNode,
  updateProcessFlowNode,
  removeProcessFlowNode,
  createProcessFlowLine,
  updateProcessFlowLine,
  removeProcessFlowLine, getProcessFlow
} from '@/api/processFlow';
import { formAssignObject } from '@/utils';
import { FlowNodeResult } from '@/api/processFlow/model.ts';
import AddressDialog from '@/views/goodsProcessManage/components/custom-flow/addressDialog.vue';
import CustomRect from '@/views/goodsProcessManage/components/custom-flow/registerNode/CustomRect';
import CustomPolygon from '@/views/goodsProcessManage/components/custom-flow/registerNode/CustomPolygon';
import CustomStart from '@/views/goodsProcessManage/components/custom-flow/registerNode/CustomStart';
import CustomEnd from '@/views/goodsProcessManage/components/custom-flow/registerNode/CustomEnd';
// 定义组件属性
interface Props {
  activeNode: ActiveNode;
}
interface ActiveNode {
  arrivalOrDeparture: string
  processGoodsTypeId: number
  activeProcessTerminalType: 'terminal' | 'goodsType'
}

const props = withDefaults(defineProps<Props>(), {
  activeNode: {}
})

// LogicFlow 实例
let lf: LogicFlow | null = null
const containerRef = ref<HTMLElement>()

// 节点和边的数据
const nodes = ref([])
const edges = ref([])

// 查询流程数据
const getFlow = async (where = {}) => {
  const params = {
    arrivalOrDeparture: props.activeNode?.arrivalOrDeparture,
    processGoodsTypeId: props.activeNode?.processGoodsTypeId,
    ...where,
  }
  const res = await getProcessFlow(params);
  console.log('res', res);
  const { code, nodesList, lineList, msg = ''  } = res as FlowNodeResult;
  if(code !== 1) {
    ElMessage.error(msg || '查询流程节点失败!')
    return
  }
  nodes.value = nodesList?.map(item => {
    return {
      ...item,
      id: item.id,
      type: item.nodeType,
      text: item.nodeName,
      x: Number(item.x),
      y: Number(item.y),
      visualizationRegionId: item.visualizationRegionId,
      visualizationRegionName: item.visualizationRegionName,
      properties: {...item}
    }
  }) ?? [];
  edges.value = lineList?.map(item => {
    return {
      ...item,
      type: 'bezier',
      text: item.lineName,
      properties: {...item}
    }
  }) ?? [];
  nextTick(() => {
    const transform = lf?.getTransform();
    initLogicFlow()
    lf?.zoom(transform?.SCALE_X);
    lf?.translate(transform?.TRANSLATE_X, transform?.TRANSLATE_Y);
    // lf.render({
    //   nodes: nodes.value,
    //   edges: edges.value
    // })
  })
}

// 增加节点
const createNode = async (nodeData: any) => {
  try {
    const formDate = {
      arrivalOrDeparture: "",
      processGoodsTypeId: "",
      nodeName: "",
      nodeType: "",
      x: "",
      y: "",
      visualizationRegionId: "",
      visualizationRegionName: ""
    }
    formAssignObject(formDate, nodeData);
    return await createProcessFlowNode(formDate)
  }catch (error) {
    throw error
  }
}
// 更新节点
const updateNode = async (nodeData: any) => {
  try {
    const formDate = {
      id: "",
      arrivalOrDeparture: "",
      processGoodsTypeId: "",
      nodeName: "",
      nodeType: "",
      x: "",
      y: "",
      visualizationRegionId: "",
      visualizationRegionName: ""
    }
    formAssignObject(formDate, nodeData);
    return await updateProcessFlowNode(formDate)
  }catch (error) {
    throw error
  }
}
// 删除节点
const delNode = async (id: any) => {
  try {
    return await removeProcessFlowNode(id)
  }catch (error) {
    throw error
  }
}
// 增加连线
const createEdge = async (edgeData: any) => {
  try {
    const formDate = {
      arrivalOrDeparture: "",
      processGoodsTypeId: "",
      sourceNodeId: "",
      targetNodeId: "",
      lineName: "",
      condition: ""
    }
    formAssignObject(formDate, edgeData);
    return await createProcessFlowLine(formDate)
  }catch (error) {
    throw error
  }
}
// 更新连线
const updateEdge = async (edgeData: any) => {
  try {
    const formDate = {
      id: "",
      arrivalOrDeparture: "",
      processGoodsTypeId: "",
      sourceNodeId: "",
      targetNodeId: "",
      lineName: "",
      condition: ""
    }
    formAssignObject(formDate, edgeData);
    return await updateProcessFlowLine(formDate)
  }catch (error) {
    throw error
  }
}
// 删除节点
const delEdge = async (id: any) => {
  try {
    return await removeProcessFlowLine(id)
  }catch (error) {
    throw error
  }
}

const isTerminal = computed(() => {
  return !props.activeNode?.activeProcessTerminalType || props.activeNode?.activeProcessTerminalType === 'terminal'
})

const dndPanelPatternItems =computed(() => [
  {
    label: '选区',
    icon: electoral,
    disabled: isTerminal.value,
    className: isTerminal.value ? '' : 'hover-item',
    callback: () => {
      if(isTerminal.value) {
        ElMessage.warning('当前选中的节点无法进行此操作!')
        return;
      }
      (lf?.extension.selectionSelect as any).openSelectionSelect()
      lf?.once('selection:selected', () => {
        (lf?.extension.selectionSelect as any).closeSelectionSelect()
      })
    },
  },
  {
    // type: 'circle',
    type: "CustomStart",
    text: '开始',
    label: '开始节点',
    disabled: isTerminal.value,
    icon: startNodeIcon,
    className: isTerminal.value ? '' : 'hover-item',
    callback: () => {
      if(isTerminal.value) {
        ElMessage.warning('当前选中的节点无法进行此操作!')
        return;
      }
    }
  },
  {
    // type: 'rect',
    type: "CustomRect",
    text: 'text',
    label: '普通节点',
    icon: normalNodeIcon,
    disabled: isTerminal.value,
    className: isTerminal.value ? '' : 'hover-item',
    callback: () => {
      if(isTerminal.value) {
        ElMessage.warning('当前选中的节点无法进行此操作!')
        return;
      }
    }
  },
  {
    // type: 'polygon',
    type: "CustomPolygon",
    text: 'text',
    label: '条件节点',
    disabled: isTerminal.value,
    icon: decisionNodeIcon,
    className: isTerminal.value ? '' : 'hover-item',
    callback: () => {
      if(isTerminal.value) {
        ElMessage.warning('当前选中的节点无法进行此操作!')
        return;
      }
    }
  },
  {
    // type: 'circle',
    type: "CustomEnd",
    text: '结束',
    label: '结束节点',
    disabled: isTerminal.value,
    icon: endNodeIcon,
    className: isTerminal.value ? '' : 'hover-item',
    callback: () => {
      if(isTerminal.value) {
        ElMessage.warning('当前选中的节点无法进行此操作!')
        return;
      }
    }
  }
])

// 初始化 LogicFlow
const initLogicFlow = () => {
  if (!containerRef.value) return

  // 使用扩展插件
  LogicFlow.use(DndPanel)
  LogicFlow.use(SelectionSelect)

  lf = new LogicFlow({
    container: containerRef.value,
    edgeType: 'bezier',
    background: {
      backgroundColor: '#f8fafc'
    },
    // allowResize: true, // 允许节点拖拽改变大小
    // stopMoveGraph: true, // 禁止移动画布
    grid: {
      size: 20,
      visible: true
    },
    keyboard: {
      enabled: true
    },
    style: {
      arrow: {
        offset: 10,
        verticalLength: 5,
        endArrowType: 'none'
      },
      baseNode: {
        stroke: "var(--el-color-primary)",
      },
      baseEdge: {
        stroke: "var(--el-color-primary)",
      },
      anchorLine: {
        stroke: "var(--el-color-primary)",
      },
      outline: {
        stroke: "var(--el-color-primary)",
        hover: {
          stroke: "var(--el-color-primary)",
        },
      }
    },
    themeMode: 'radius',
    plugins: [DndPanel, SelectionSelect, Menu]
  })
  lf.register(CustomRect);
  lf.register(CustomPolygon);
  lf.register(CustomStart);
  lf.register(CustomEnd);
  // 设置拖拽面板
  if (lf?.extension?.dndPanel) {
    (lf.extension.dndPanel as any).setPatternItems(dndPanelPatternItems.value)
  }
  // 设置右键菜单
  if (lf?.extension?.menu) {
    (lf.extension.menu as any).setMenuConfig({
      nodeMenu: [
        {
          className: 'lf-menu-delete',
          text: '删除',
          icon: true,
          callback: async (node: any) => {
            lf?.deleteNode(node.id)
          }
        },
        {
          className: 'lf-menu-edit',
          text: '编辑',
          icon: true,
          callback: (node: any) => {
            lf?.editText(node.id)
          }
        },
        {
          className: 'lf-menu-copy',
          text: '复制',
          icon: true,
          callback: async (node: any) => {
            lf?.cloneNode(node.id)
          }
        },
        {
          className: 'lf-menu-address',
          text: '绑定地址',
          icon: true,
          callback: (node: any) => {
            dialogVisible.value = true
            editNode.value = { ...node }
          }
        },
      ],
      edgeMenu: [
        {
          className: 'lf-menu-delete',
          text: '删除',
          icon: true,
          callback: async (edge: any) => {
            lf?.deleteEdge(edge.id)
          }
        },
        {
          className: 'lf-menu-edit',
          text: '编辑',
          icon: true,
          callback: (edge: any) => {
            lf?.editText(edge.id)
          }
        }
      ],
      graphMenu: [],
  })
  }
  // 绑定事件
  if (lf) {
    // 节点添加
    lf.on('node:dnd-add,node:add', async (data) => {
      try {
        const { data: node } = data
        const nodeData = {
          ...node,
          ...props.activeNode,
          nodeName: node?.text?.value,
          nodeType: node?.type
        }
        const res = await createNode(nodeData);
        const { code, msg = '' } = res || {};
        if(code !== 1) {
          ElMessage.error(msg || '操作失败');
          return;
        }
        await getFlow();
      }catch (error) {
        ElMessage.error('操作失败');
        console.error('error', error);
      }
    });
    // 节点更新
    lf.on('node:drop',async (data) => {
      console.log('data``````````````````````````````', data);
      try {
        const { data: node } = data
        const nodeData = {
          ...node,
          ...props.activeNode,
          visualizationRegionId: node?.properties?.visualizationRegionId,
          visualizationRegionName: node?.properties?.visualizationRegionName,
          nodeName: node?.text?.value,
          nodeType: node?.type
        }
        const res = await updateNode(nodeData);
        const { code, msg = '' } = res || {};
        if(code !== 1) {
          ElMessage.error(msg || '操作失败');
          return;
        }
        nextTick(async () => {
          await getFlow();
        })
      }catch (error) {
        ElMessage.error('操作失败');
        console.error('error', error);
      }
    })
    // 节点删除
    lf.on('node:delete', async (data) => {
      const { data: node } = data
      if(!node?.id) {
        ElMessage.error('数据异常，请联系管理员！');
        return;
      }
      try {
        const res = await delNode(node.id);
        console.log('res', res);
        const { code, msg = '' } = res || {};
        if(code !== 1) {
          ElMessage.error(msg || '操作失败');
          return;
        }
        await getFlow();
      }catch (error) {
        ElMessage.error('操作失败');
        console.error('error', error);
      }
    })
    // 连线添加
    lf.on('edge:add', async (data) => {
      try {
        const { data: edge } = data;
        const edgeData = {
          ...edge,
          ...props.activeNode,
          sourceNodeId: edge?.sourceNodeId,
          targetNodeId: edge?.targetNodeId,
        }
        const res = await createEdge(edgeData);
        console.log('res0000000000000000', res);
        await getFlow();
      } catch (error) {
        ElMessage.error('操作失败');
        console.error('error', error);
      }
    });
    // 连线更新
    lf.on('edge:adjust', async (data) => {
    })
    // 连线删除
    lf.on('edge:delete', async (data) => {
      const { data: edge } = data;
      if(!edge?.id) {
        ElMessage.error('数据异常，请联系管理员！');
        return;
      }
      try {
        const res = await delEdge(edge.id);
        console.log('res', res);
        const { code, msg = '' } = res || {};
        if(code !== 1) {
          ElMessage.error(msg || '操作失败');
          return;
        }
        await getFlow();
      }catch (error) {
        ElMessage.error('操作失败');
        console.error('error', error);
      }
    })
    // 连线不允许
    lf.on('connection:not-allowed', () => {
      ElMessage.warning('连接不允许')
    })
    // 文本编辑完成事件
    lf.on('text:update', async (data: any) => {
      const { id, text } = data?.data || {}
      const el =  lf?.getModelById(id);
      if(el.BaseType === 'node') {
        // 节点文本编辑完成
        const node = lf?.getNodeDataById(id);
        console.log('node', node);
        if (node) {
          try {
            const nodeData = {
              ...node,
              ...props.activeNode,
              visualizationRegionId: node?.properties?.visualizationRegionId,
              visualizationRegionName: node?.properties?.visualizationRegionName,
              nodeName: text,
              nodeType: node?.type
            }
            console.log('nodeData', nodeData);
            const res = await updateNode(nodeData);
            const { code, msg = '' } = res || {};
            if(code !== 1) {
              ElMessage.error(msg || '操作失败');
              return;
            }
            await getFlow();
          }catch (error) {
            ElMessage.error('操作失败');
            console.error('error', error);
          }
        }
        return;
      }
      if(el.BaseType === 'edge') {
        // 连线文本编辑完成
        const edge = lf?.getEdgeDataById(id);
        console.log('edge', edge);
        if (edge) {
          try {
            const edgeData = {
              ...edge,
              ...props.activeNode,
              lineName: text,
            }
            console.log('nodeData', edgeData);
            const res = await updateEdge(edgeData);
            const { code, msg = '' } = res || {};
            if(code !== 1) {
              ElMessage.error(msg || '操作失败');
              return;
            }
            await getFlow();
          }catch (error) {
            ElMessage.error('操作失败');
            console.error('error', error);
          }
        }
        return;
      }
    })
    // 渲染初始数据
    lf.render({
      nodes: nodes.value,
      edges: edges.value
    })
  }
}

const init = async () => {
  if (lf?.extension?.dndPanel) {
    (lf.extension.dndPanel as any).setPatternItems(dndPanelPatternItems.value)
  }
  if(isTerminal.value) {
    clearAll();
    return;
  }
  await getFlow();
  nextTick(() => {
    lf?.translateCenter();
  })
}

// 监听props变化，同步到内部状态
watch(() => props.activeNode, (newValue) => {
  if (newValue && lf) {
    init();
  }
}, { immediate: true, deep: true })

// 处理清空画布
// const handleClearAll = () => {
//   clearAll()
//   ElMessage.success('画布已清空')
// }

const clearAll = () => {
  nodes.value = []
  edges.value = []
  if (lf) {
    lf.clearData()
  }
}

// 绑定地址弹窗dialogVisible
const dialogVisible = ref(false);
const editNode = ref(null);

const onSubmit = async (formData: any) => {
  const res = await updateNode(formData);
  const { code, msg = '' } = res || {};
  if(code !== 1) {
    ElMessage.error(msg || '操作失败');
    return;
  }
  ElMessage.success('绑定成功!');
  dialogVisible.value = false;
  await getFlow();
}

// 组件挂载时初始化 LogicFlow
onMounted(() => {
  nextTick(() => {
    initLogicFlow()
  })
})

// 组件卸载时清理
onUnmounted(() => {
  if (lf) {
    lf.destroy()
  }
})

defineExpose({
  init,
})
</script>

<template>
  <div class="flow-container">
    <!-- 主画布区域 -->
    <div class="flow-main">
      <!-- LogicFlow 容器 -->
      <div ref="containerRef" class="logic-flow-container"></div>
      
      <!-- 操作按钮 -->
      <div class="flow-controls">
<!--        <el-button type="primary" size="small" @click="handleClearAll">清空画布</el-button>-->
        <div class="flow-tips">
          <el-text size="small" type="info">
            提示：拖拽左侧节点到画布创建，右键节点/连线可编辑，拖拽节点可调整位置
          </el-text>
        </div>
      </div>
    </div>
  </div>
  <address-dialog
    v-model:visible="dialogVisible"
    :editNode="editNode"
    @onSubmit="onSubmit"
  />
</template>

<style scoped lang="scss">
.flow-container {
  height: 100%;
  width: 100%;
  background: #f8fafc;
  position: relative;
}

.flow-main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.logic-flow-container {
  width: 100%;
  height: 100%;
  background: #f8fafc;
}

.flow-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.flow-tips {
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

// LogicFlow 全局样式覆盖
:deep(.lf-node) {
  cursor: pointer;
}

:deep(.lf-node.selected) {
  outline: 2px dashed var(--el-color-primary-light-3);
  outline-offset: 3px;
}

:deep(.lf-edge) {
  stroke: var(--el-color-primary) !important;
  stroke-width: 2 !important;
}

:deep(.lf-edge.selected) {
  stroke: var(--el-color-primary);
  stroke-width: 3;
}

// 右键菜单样式
:deep(.lf-menu) {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
}

:deep(.lf-menu-item) {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
  }
}

:deep(.lf-menu-delete) {
  color: #ef4444;
}

:deep(.lf-menu-edit) {
  color: var(--el-color-primary);
}

:deep(.lf-menu-copy) {
  color: #6b7280;
}
:deep(.lf-dndpanel) {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0;
  top: 20px;
  left: 20px;
  .lf-dnd-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }
  .hover-item {
    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      transform: translateY(-1px);
      background: rgba(59, 130, 246, 0.15);
    }
  }
}

:deep(.lf-line-text) {
  stroke: none;
}
</style>