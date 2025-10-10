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
import { 
  createProcessFlowNode,
  updateProcessFlowNode,
  removeProcessFlowNode,
  createProcessFlowLine,
  updateProcessFlowLine,
  removeProcessFlowLine
} from '@/api/processFlow';
// 导入自定义组件

// 禁用属性继承，手动控制属性传递
defineOptions({
  inheritAttrs: false
})

// 定义组件属性
interface Props {
  modelValue?: {
    nodes: any[]
    edges: any[]
  }
  // 后端API相关参数
  arrivalOrDeparture?: string
  processGoodsTypeId?: number
  // 是否启用自动同步到后端
  enableAutoSync?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ nodes: [], edges: [] }),
  arrivalOrDeparture: '',
  processGoodsTypeId: 0,
  enableAutoSync: true
})

// 定义事件
const emit = defineEmits<{
  'update:modelValue': [value: { nodes: any[], edges: any[] }]
  'nodes-change': [nodes: any[]]
  'edges-change': [edges: any[]]
  // LogicFlow 原生事件
  'node-click': [event: any]
  'edge-click': [event: any]
  'node-drag': [event: any]
  'node-drag-stop': [event: any]
  'edge-update': [event: any]
  'edge-update-end': [event: any]
  'connect': [event: any]
  'connect-start': [event: any]
  'connect-end': [event: any]
  'selection-change': [event: any]
  'viewport-change': [event: any]
  'zoom-change': [event: any]
  'init': [event: any]
  'error': [event: any]
  // 自定义事件
  'node-delete': [event: { nodeId: string }]
  'edge-delete': [event: { edgeId: string }]
  'node-edit': [event: { node: any }]
  'edge-edit': [event: { edge: any }]
}>()

// LogicFlow 实例
let lf: LogicFlow | null = null
const containerRef = ref<HTMLElement>()

// 节点和边的数据
const nodes = ref([])
const edges = ref([])

// 后端API同步函数
const syncNodeToBackend = async (nodeData: any, operation: 'create' | 'update' | 'delete') => {
  if (!props.enableAutoSync) return
  
  try {
    const formData = {
      id: nodeData.id,
      arrivalOrDeparture: props.arrivalOrDeparture,
      processGoodsTypeId: props.processGoodsTypeId,
      nodeName: nodeData.nodeName || nodeData.text || '',
      nodeType: nodeData.nodeType || getNodeTypeByShape(nodeData.type),
      x: nodeData.x?.toString() || '0',
      y: nodeData.y?.toString() || '0',
      visualizationRegionId: nodeData.visualizationRegionId || '',
      visualizationRegionName: nodeData.visualizationRegionName || ''
    }

    let res
    switch (operation) {
      case 'create':
        res = await createProcessFlowNode(formData)
        break
      case 'update':
        res = await updateProcessFlowNode(formData)
        break
      case 'delete':
        res = await removeProcessFlowNode(nodeData.id)
        break
    }
    
    const { code, msg = '' } = res as any
    if (code !== 1) {
      ElMessage.error(msg || `${operation}节点失败`)
      return false
    }
    
    ElMessage.success(`${operation === 'create' ? '创建' : operation === 'update' ? '更新' : '删除'}节点成功`)
    return true
  } catch (error) {
    console.error(`${operation}节点失败:`, error)
    ElMessage.error(`${operation}节点失败`)
    return false
  }
}

const syncEdgeToBackend = async (edgeData: any, operation: 'create' | 'update' | 'delete') => {
  if (!props.enableAutoSync) return
  
  try {
    const formData = {
      id: edgeData.id,
      arrivalOrDeparture: props.arrivalOrDeparture,
      processGoodsTypeId: props.processGoodsTypeId?.toString() || '0',
      sourceNodeId: edgeData.sourceNodeId,
      targetNodeId: edgeData.targetNodeId,
      lineName: edgeData.lineName || edgeData.text || '连线',
      condition: edgeData.condition || 0
    }

    let res
    switch (operation) {
      case 'create':
        res = await createProcessFlowLine(formData)
        break
      case 'update':
        res = await updateProcessFlowLine(formData)
        break
      case 'delete':
        res = await removeProcessFlowLine(edgeData.id)
        break
    }
    
    const { code, msg = '' } = res as any
    if (code !== 1) {
      ElMessage.error(msg || `${operation}连线失败`)
      return false
    }
    
    ElMessage.success(`${operation === 'create' ? '创建' : operation === 'update' ? '更新' : '删除'}连线成功`)
    return true
  } catch (error) {
    console.error(`${operation}连线失败:`, error)
    ElMessage.error(`${operation}连线失败`)
    return false
  }
}

// 根据节点形状获取节点类型
const getNodeTypeByShape = (type: string) => {
  switch (type) {
    case 'circle':
      return '1' // 开始节点
    case 'rect':
      return '2' // 普通节点
    case 'diamond':
      return '3' // 判断节点
    default:
      return '2'
  }
}

// 初始化 LogicFlow
const initLogicFlow = () => {
  if (!containerRef.value) return

  // 使用扩展插件
  LogicFlow.use(DndPanel)
  LogicFlow.use(SelectionSelect)
  // LogicFlow.use(Menu)

  lf = new LogicFlow({
    container: containerRef.value,
    edgeType: 'bezier',
    background: {
      backgroundColor: '#f8fafc'
    },
    allowResize: true,
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
  // 设置拖拽面板
  if (lf?.extension?.dndPanel) {
    (lf.extension.dndPanel as any).setPatternItems([
    {
      label: '选区',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAOVJREFUOBGtVMENwzAIjKP++2026ETdpv10iy7WFbqFyyW6GBywLCv5gI+Dw2Bluj1znuSjhb99Gkn6QILDY2imo60p8nsnc9bEo3+QJ+AKHfMdZHnl78wyTnyHZD53Zzx73MRSgYvnqgCUHj6gwdck7Zsp1VOrz0Uz8NbKunzAW+Gu4fYW28bUYutYlzSa7B84Fh7d1kjLwhcSdYAYrdkMQVpsBr5XgDGuXwQfQr0y9zwLda+DUYXLaGKdd2ZTtvbolaO87pdo24hP7ov16N0zArH1ur3iwJpXxm+v7oAJNR4JEP8DoAuSFEkYH7cAAAAASUVORK5CYII=',
      callback: () => {
        (lf?.extension.selectionSelect as any).openSelectionSelect()
        lf?.once('selection:selected', () => {
          (lf?.extension.selectionSelect as any).closeSelectionSelect()
        })
      },
    },
    {
      type: 'circle',
      text: '开始',
      label: '开始节点',
      icon: startNodeIcon,
      callback: async (node: any) => {
        const nodeData = {
          ...node,
          nodeName: node.text || '开始节点',
          nodeType: '1'
        }
        await syncNodeToBackend(nodeData, 'create')
      }
    },
    {
      type: 'rect',
      text: 'text',
      label: '普通节点',
      icon: normalNodeIcon,
      className: 'important-node',
      callback: async (node: any) => {
        const nodeData = {
          ...node,
          nodeName: node.text || '普通节点',
          nodeType: '2'
        }
        await syncNodeToBackend(nodeData, 'create')
      }
    },
    {
      type: 'diamond',
      text: 'text',
      label: '条件判断',
      icon: decisionNodeIcon,
      callback: async (node: any) => {
        const nodeData = {
          ...node,
          nodeName: node.text || '条件判断',
          nodeType: '3'
        }
        await syncNodeToBackend(nodeData, 'create')
      }
    },
    {
      type: 'circle',
      text: '结束',
      label: '结束节点',
      icon: endNodeIcon,
      callback: async (node: any) => {
        const nodeData = {
          ...node,
          nodeName: node.text || '结束节点',
          nodeType: '4'
        }
        await syncNodeToBackend(nodeData, 'create')
      }
    }
  ])
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
            const success = await syncNodeToBackend(node, 'delete')
            if (success) {
              lf?.deleteNode(node.id)
            }
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
            const clonedNode = lf?.cloneNode(node.id)
            if (clonedNode) {
              // 为复制的节点生成新的ID和位置
              const newNodeData = {
                ...clonedNode,
                id: `node_${Date.now()}`,
                x: (node.x || 0) + 50,
                y: (node.y || 0) + 50,
                nodeName: `${node.nodeName || node.text || '节点'}_副本`
              }
              await syncNodeToBackend(newNodeData, 'create')
            }
          }
        }
      ],
      edgeMenu: [
        {
          className: 'lf-menu-delete',
          text: '删除',
          icon: true,
          callback: async (edge: any) => {
            const success = await syncEdgeToBackend(edge, 'delete')
            if (success) {
              lf?.deleteEdge(edge.id)
            }
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
    lf.on('node:click', (data) => {
      emit('node-click', data)
    })

    lf.on('edge:click', (data) => {
      emit('edge-click', data)
    })

    lf.on('node:drag', (data) => {
      emit('node-drag', data)
    })

    lf.on('node:drag-stop', async (data) => {
      // 同步节点位置到后端
      await syncNodeToBackend(data.node, 'update')
      emit('node-drag-stop', data)
    })

    lf.on('edge:update', (data) => {
      emit('edge-update', data)
    })

    lf.on('edge:update-end', (data) => {
      emit('edge-update-end', data)
    })

    lf.on('connection:not-allowed', () => {
      ElMessage.warning('连接不允许')
    })

    lf.on('connection:created', async (data) => {
      // 同步连线创建到后端
      await syncEdgeToBackend(data.edge, 'create')
      emit('connect', data)
    })

    lf.on('selection:selected', (data) => {
      emit('selection-change', data)
    })

    lf.on('viewport:change', (data) => {
      emit('viewport-change', data)
    })

    lf.on('zoom:change', (data) => {
      emit('zoom-change', data)
    })

    // 文本编辑完成事件
    lf.on('text:update', async (data: any) => {
      const { id, text, type } = data
      if (type === 'node') {
        const node = lf?.getNodeModelById(id)
        if (node) {
          const nodeData = {
            ...node,
            nodeName: text,
            text: text
          }
          await syncNodeToBackend(nodeData, 'update')
        }
      } else if (type === 'edge') {
        const edge = lf?.getEdgeModelById(id)
        if (edge) {
          const edgeData = {
            ...edge,
            lineName: text,
            text: text
          }
          await syncEdgeToBackend(edgeData, 'update')
        }
      }
    })

    // 渲染初始数据
    lf.render({
      nodes: nodes.value,
      edges: edges.value
    })

    emit('init', lf)
  }
}

// 监听props变化，同步到内部状态
watch(() => props.modelValue, (newValue) => {
  if (newValue && lf) {
    nodes.value = newValue.nodes || []
    edges.value = newValue.edges || []
    lf.render({
      nodes: nodes.value,
      edges: edges.value
    })
  }
}, { immediate: true, deep: true })

// 监听节点拖拽结束事件，更新位置数据
watch(() => lf, (lfInstance) => {
  if (lfInstance) {
    lfInstance.on('node:drag-stop', (data) => {
      const { node } = data
      // 更新节点位置
      const nodeIndex = nodes.value.findIndex(n => n.id === node.id)
      if (nodeIndex !== -1) {
        nodes.value[nodeIndex] = {
          ...nodes.value[nodeIndex],
          x: node.x,
          y: node.y
        }
        // 触发父组件更新
        emit('node-drag-stop', { node: nodes.value[nodeIndex] })
      }
    })

    // 监听连接创建事件
    lfInstance.on('connection:created', (data) => {
      const { sourceNodeId, targetNodeId } = data
      const newEdge = {
        id: `edge_${Date.now()}`,
        sourceNodeId: sourceNodeId,
        targetNodeId: targetNodeId,
        lineName: '',
        condition: 0
      }
      edges.value = [...edges.value, newEdge]
      emit('connect', newEdge)
      ElMessage.success('连线创建成功，请右键编辑连线属性')
    })

    // 监听节点删除事件
    lfInstance.on('node:delete', (data) => {
      const { nodeId } = data
      removeNode(nodeId)
      emit('node-delete', { nodeId })
    })

    // 监听连线删除事件
    lfInstance.on('edge:delete', (data) => {
      const { edgeId } = data
      removeEdge(edgeId)
      emit('edge-delete', { edgeId })
    })
  }
}, { immediate: true })

// 监听内部状态变化，同步到父组件
watch([nodes, edges], ([newNodes, newEdges]) => {
  const value = { nodes: newNodes, edges: newEdges }
  emit('update:modelValue', value)
  emit('nodes-change', newNodes)
  emit('edges-change', newEdges)
}, { deep: true })



// 处理清空画布
const handleClearAll = () => {
  clearAll()
  ElMessage.success('画布已清空')
}

// 暴露给父组件的方法
const addNode = (node: any) => {
  nodes.value = [...nodes.value, node]
  if (lf) {
    lf.addNode(node)
  }
  return node
}

const removeNode = (nodeId: string) => {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  // 同时删除相关的边
  edges.value = edges.value.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId)
  if (lf) {
    lf.deleteNode(nodeId)
  }
}

const addEdge = (edge: any) => {
  edges.value = [...edges.value, edge]
  if (lf) {
    lf.addEdge(edge)
  }
  return edge
}

const removeEdge = (edgeId: string) => {
  edges.value = edges.value.filter(e => e.id !== edgeId)
  if (lf) {
    lf.deleteEdge(edgeId)
  }
}

const clearAll = () => {
  nodes.value = []
  edges.value = []
  if (lf) {
    lf.clearData()
  }
}

const getNodes = () => nodes.value
const getEdges = () => edges.value

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

// 暴露方法给父组件
defineExpose({
  addNode,
  removeNode,
  addEdge,
  removeEdge,
  clearAll,
  getNodes,
  getEdges,
  nodes: readonly(nodes),
  edges: readonly(edges)
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
        <el-button type="primary" size="small" @click="handleClearAll">清空画布</el-button>
        <div class="flow-tips">
          <el-text size="small" type="info">
            提示：拖拽左侧节点到画布创建，右键节点/连线可编辑，拖拽节点可调整位置
          </el-text>
        </div>
      </div>
    </div>
  </div>
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
    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      transform: translateY(-1px);
      background: rgba(59, 130, 246, 0.15);
    }
  }
}
</style>