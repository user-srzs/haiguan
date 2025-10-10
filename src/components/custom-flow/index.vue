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
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ nodes: [], edges: [] })
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
}>()

// LogicFlow 实例
let lf: LogicFlow | null = null
const containerRef = ref<HTMLElement>()

// 节点和边的数据
const nodes = ref([])

const edges = ref([])

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
    },
    {
      type: 'rect',
      text: 'text',
      label: '普通节点',
      icon: normalNodeIcon,
      className: 'important-node'
    },
    {
      type: 'diamond',
      text: 'text',
      label: '条件判断',
      icon: decisionNodeIcon,
    },
    {
      type: 'circle',
      text: '结束',
      label: '结束节点',
      icon: endNodeIcon,
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
          callback: (node: any) => {
            lf?.deleteNode(node.id);
            ElMessage.success('节点已删除')
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
          callback: (node: any) => {
            lf?.cloneNode(node.id)
          }
        }
      ],
      edgeMenu: false,
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

    lf.on('node:drag-stop', (data) => {
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

    lf.on('connection:created', (data) => {
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

// 监听内部状态变化，同步到父组件
watch([nodes, edges], ([newNodes, newEdges]) => {
  const value = { nodes: newNodes, edges: newEdges }
  emit('update:modelValue', value)
  emit('nodes-change', newNodes)
  emit('edges-change', newEdges)
}, { deep: true })

// 节点ID计数器
let nodeIdCounter = 5

// 创建节点
const createNode = (type: string, position: { x: number, y: number }) => {
  const nodeId = nodeIdCounter.toString()
  nodeIdCounter++

  let nodeText = ''
  let nodeType = type
  
  switch (type) {
    case 'start':
      nodeText = '开始'
      nodeType = 'circle'
      break
    case 'end':
      nodeText = '结束'
      nodeType = 'circle'
      break
    case 'userTask':
      nodeText = '用户任务'
      nodeType = 'rect'
      break
    case 'systemTask':
      nodeText = '系统任务'
      nodeType = 'rect'
      break
    case 'decision':
      nodeText = '判断'
      nodeType = 'diamond'
      break
  }

  const newNode = {
    id: nodeId,
    type: nodeType,
    x: position.x,
    y: position.y,
    text: nodeText
  }

  console.log('准备添加节点:', newNode)
  // 使用展开运算符创建新数组，确保响应式更新
  nodes.value = [...nodes.value, newNode]
  console.log('节点已添加，当前节点数量:', nodes.value.length)
  
  // 同步到 LogicFlow
  if (lf) {
    lf.addNode(newNode)
  }
  
  return newNode
}

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
        <el-button type="danger" @click="handleClearAll">清空画布</el-button>
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