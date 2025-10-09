<script setup lang="ts">
import { VueFlow, Panel } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ElMessage } from 'element-plus'

// 导入自定义组件
import Sidebar from './components/Sidebar.vue'
import ContextMenu from './components/ContextMenu.vue'
import EditDialog from './components/EditDialog.vue'
import StartNode from './nodes/StartNode.vue'
import EndNode from './nodes/EndNode.vue'
import NormalNode from './nodes/NormalNode.vue'
import DecisionNode from './nodes/DecisionNode.vue'

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
  // Vue Flow 原生事件
  'nodes-updated': [event: any]
  'edges-updated': [event: any]
  'node-click': [event: any]
  'edge-click': [event: any]
  'node-drag': [event: any]
  'node-drag-stop': [event: any]
  'edge-update': [event: any]
  'edge-update-end': [event: any]
  'connect': [event: any]
  'connect-start': [event: any]
  'connect-end': [event: any]
  'pane-ready': [event: any]
  'move': [event: any]
  'move-start': [event: any]
  'move-end': [event: any]
  'selection-change': [event: any]
  'viewport-change': [event: any]
  'zoom-change': [event: any]
  'init': [event: any]
  'error': [event: any]
}>()

// 节点和边的数据
const nodes = ref([
  {
    id: '1',
    type: 'start',
    position: { x: 100, y: 100 },
    data: { label: '开始' }
  },
  {
    id: '2',
    type: 'userTask',
    position: { x: 100, y: 250 },
    data: { label: '用户任务' }
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 100, y: 400 },
    data: { label: '判断条件' }
  },
  {
    id: '4',
    type: 'end',
    position: { x: 300, y: 400 },
    data: { label: '结束' }
  }
])

const edges = ref([
  {
    id: 'edge-1',
    source: '1',
    target: '2',
    sourceHandle: '1-bottom',
    targetHandle: '2-top',
    type: 'default',
    animated: false,
  },
  {
    id: 'edge-2',
    source: '2',
    target: '3',
    sourceHandle: '2-bottom',
    targetHandle: '3-top',
    type: 'default',
    animated: false,
  },
  {
    id: 'edge-3',
    source: '3',
    target: '4',
    sourceHandle: '3-right',
    targetHandle: '4-left',
    type: 'default',
    animated: false,
  }
])

// 注册自定义节点类型
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  userTask: NormalNode,
  systemTask: NormalNode,
  decision: DecisionNode
}

// 监听props变化，同步到内部状态
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    nodes.value = newValue.nodes || []
    edges.value = newValue.edges || []
  }
}, { immediate: true, deep: true })

// 监听外部传入的nodes和edges变化
watch(() => [props.modelValue?.nodes, props.modelValue?.edges], ([newNodes, newEdges]) => {
  if (newNodes) {
    nodes.value = newNodes
  }
  if (newEdges) {
    edges.value = newEdges
  }
}, { deep: true })

// 监听内部状态变化，同步到父组件
watch([nodes, edges], ([newNodes, newEdges]) => {
  const value = { nodes: newNodes, edges: newEdges }
  emit('update:modelValue', value)
  emit('nodes-change', newNodes)
  emit('edges-change', newEdges)
}, { deep: true })

// 右键菜单状态
const contextMenu = reactive({
  visible: false,
  position: { x: 0, y: 0 },
  nodeId: ''
})

// 编辑对话框状态
const editDialog = reactive({
  visible: false,
  nodeId: '',
  nodeLabel: ''
})


// 节点ID计数器
let nodeIdCounter = 2

// 创建节点
const createNode = (type: string, position: { x: number, y: number }) => {
  const nodeId = nodeIdCounter.toString()
  nodeIdCounter++

  let nodeData = { label: '' }
  
  switch (type) {
    case 'start':
      nodeData = { label: '开始' }
      break
    case 'end':
      nodeData = { label: '结束' }
      break
    case 'userTask':
      nodeData = { label: '用户任务' }
      break
    case 'systemTask':
      nodeData = { label: '系统任务' }
      break
    case 'decision':
      nodeData = { label: '判断' }
      break
  }

  const newNode = {
    id: nodeId,
    type,
    position,
    data: nodeData
  }

  console.log('准备添加节点:', newNode)
  // 使用展开运算符创建新数组，确保响应式更新
  nodes.value = [...nodes.value, newNode]
  console.log('节点已添加，当前节点数量:', nodes.value.length)
  return newNode
}

// 处理拖拽开始
const handleDragStart = (type: string, event: DragEvent) => {
  console.log('主组件收到拖拽开始事件:', type)
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'copy'
    console.log('主组件设置拖拽数据:', type)
  }
}

// 处理侧边栏节点点击
const handleSidebarNodeClick = (type: string) => {
  if (type === 'selection') {
    // 选择工具逻辑
    return
  }
  
  // 在画布中心创建节点
  const position = { x: 300, y: 200 }
  console.log('点击创建节点:', type, position)
  createNode(type, position)
}


// 处理画布拖拽放置
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  
  const type = event.dataTransfer?.getData('application/vueflow')
  if (!type) {
    console.log('未找到拖拽数据')
    return
  }

  console.log('拖拽类型:', type)

  // 获取VueFlow容器的位置
  const vueFlowContainer = document.querySelector('.vue-flow')
  if (!vueFlowContainer) {
    console.log('未找到VueFlow容器')
    return
  }
  
  const rect = vueFlowContainer.getBoundingClientRect()
  
  // 计算相对于VueFlow容器的位置
  const position = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }

  console.log('拖拽放置:', { type, position, clientX: event.clientX, clientY: event.clientY, rect })
  
  const newNode = createNode(type, position)
  console.log('创建的新节点:', newNode)
  console.log('当前所有节点:', nodes.value)
  
  // 强制更新VueFlow
  nextTick(() => {
    console.log('VueFlow更新后的节点:', nodes.value)
  })
}

// 处理拖拽悬停
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

// 处理拖拽进入
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

// 处理节点右键
const handleNodeContextMenu = (event: MouseEvent, nodeId: string) => {
  event.preventDefault()
  event.stopPropagation()
  
  contextMenu.visible = true
  contextMenu.position = { x: event.clientX, y: event.clientY }
  contextMenu.nodeId = nodeId
}

// 处理右键菜单操作
const handleContextMenuEdit = () => {
  const node = nodes.value.find(n => n.id === contextMenu.nodeId)
  if (node) {
    editDialog.visible = true
    editDialog.nodeId = node.id
    editDialog.nodeLabel = node.data.label
  }
}

const handleContextMenuCopy = () => {
  const node = nodes.value.find(n => n.id === contextMenu.nodeId)
  if (node) {
    const newNode = createNode(node.type, { 
      x: node.position.x + 50, 
      y: node.position.y + 50 
    })
    newNode.data.label = node.data.label + ' 副本'
    ElMessage.success('节点已复制')
  }
}

const handleContextMenuDelete = () => {
  const index = nodes.value.findIndex(n => n.id === contextMenu.nodeId)
  if (index > -1) {
    nodes.value.splice(index, 1)
    // 同时删除相关的边
    edges.value = edges.value.filter(edge => 
      edge.source !== contextMenu.nodeId && edge.target !== contextMenu.nodeId
    )
    ElMessage.success('节点已删除')
  }
}

const handleContextMenuClose = () => {
  contextMenu.visible = false
}

// 处理编辑确认
const handleEditConfirm = (label: string) => {
  const node = nodes.value.find(n => n.id === editDialog.nodeId)
  if (node) {
    node.data.label = label
    ElMessage.success('节点文本已更新')
  }
}

// 处理清空画布
const handleClearAll = () => {
  clearAll()
  ElMessage.success('画布已清空')
}

// 暴露给父组件的方法
const addNode = (node: any) => {
  nodes.value = [...nodes.value, node]
  return node
}

const removeNode = (nodeId: string) => {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  // 同时删除相关的边
  edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId)
}

const addEdge = (edge: any) => {
  edges.value = [...edges.value, edge]
  return edge
}

const removeEdge = (edgeId: string) => {
  edges.value = edges.value.filter(e => e.id !== edgeId)
}

const clearAll = () => {
  nodes.value = []
  edges.value = []
}

const getNodes = () => nodes.value
const getEdges = () => edges.value

// Vue Flow 原生事件处理器
const handleNodesUpdated = (event: any) => {
  emit('nodes-updated', event)
}

const handleEdgesUpdated = (event: any) => {
  emit('edges-updated', event)
}

const handleNodeClick = (event: any) => {
  emit('node-click', event)
}

const handleEdgeClick = (event: any) => {
  emit('edge-click', event)
}

const handleNodeDrag = (event: any) => {
  emit('node-drag', event)
}

const handleNodeDragStop = (event: any) => {
  emit('node-drag-stop', event)
}

const handleEdgeUpdate = (event: any) => {
  emit('edge-update', event)
}

const handleEdgeUpdateEnd = (event: any) => {
  emit('edge-update-end', event)
}

const handleConnect = (event: any) => {
  console.log('连接事件:', event)
  
  // 创建新的边
  const newEdge = {
    id: `edge-${Date.now()}`,
    source: event.source,
    target: event.target,
    sourceHandle: event.sourceHandle,
    targetHandle: event.targetHandle,
    type: 'default',
    animated: false
  }
  
  // 添加到边数组
  edges.value = [...edges.value, newEdge]
  
  console.log('新边已创建:', newEdge)
  console.log('当前所有边:', edges.value)
  
  emit('connect', event)
}

const handleConnectStart = (event: any) => {
  emit('connect-start', event)
}

const handleConnectEnd = (event: any) => {
  emit('connect-end', event)
}

const handlePaneReady = (event: any) => {
  emit('pane-ready', event)
}

const handleMove = (event: any) => {
  emit('move', event)
}

const handleMoveStart = (event: any) => {
  emit('move-start', event)
}

const handleMoveEnd = (event: any) => {
  emit('move-end', event)
}

const handleSelectionChange = (event: any) => {
  emit('selection-change', event)
}

const handleViewportChange = (event: any) => {
  emit('viewport-change', event)
}

const handleZoomChange = (event: any) => {
  emit('zoom-change', event)
}

const handleInit = (event: any) => {
  emit('init', event)
}

const handleError = (event: any) => {
  emit('error', event)
}

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
      <VueFlow 
        v-model:nodes="nodes" 
        v-model:edges="edges"
        :node-types="nodeTypes"
        @nodes-updated="handleNodesUpdated"
        @edges-updated="handleEdgesUpdated"
        @node-click="handleNodeClick"
        @edge-click="handleEdgeClick"
        @node-drag="handleNodeDrag"
        @node-drag-stop="handleNodeDragStop"
        @edge-update="handleEdgeUpdate"
        @edge-update-end="handleEdgeUpdateEnd"
        @connect="handleConnect"
        @connect-start="handleConnectStart"
        @connect-end="handleConnectEnd"
        @pane-ready="handlePaneReady"
        @move="handleMove"
        @move-start="handleMoveStart"
        @move-end="handleMoveEnd"
        @selection-change="handleSelectionChange"
        @viewport-change="handleViewportChange"
        @zoom-change="handleZoomChange"
        @init="handleInit"
        @error="handleError"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        :nodes-draggable="true"
        :nodes-connectable="true"
        :edges-updatable="true"
        :fit-view-on-init="false"
        v-bind="$attrs"
        class="vue-flow"
      >
        <!-- 节点工具栏 -->
        <Sidebar 
          @node-click="handleSidebarNodeClick"
          @drag-start="handleDragStart"
        />
        <Background />
        
        <!-- 操作按钮 -->
        <Panel position="top-right">
          <el-button type="danger" @click="handleClearAll">清空画布</el-button>
        </Panel>
                
        <!-- 自定义节点模板 -->
        <template #node-start="{ node }">
          <StartNode 
            :id="node?.id"
            :data="node?.data" 
            :selected="node?.selected"
            @contextmenu="(event) => handleNodeContextMenu(event, node?.id)"
          />
        </template>
        
        <template #node-end="{ node }">
          <EndNode 
            :id="node?.id"
            :data="node?.data" 
            :selected="node?.selected"
            @contextmenu="(event) => handleNodeContextMenu(event, node?.id)"
          />
        </template>
        
        <template #node-userTask="{ node }">
          <NormalNode 
            :id="node?.id"
            :data="node?.data" 
            :selected="node?.selected"
            @contextmenu="(event) => handleNodeContextMenu(event, node?.id)"
          />
        </template>
        
        <template #node-systemTask="{ node }">
          <NormalNode 
            :id="node?.id"
            :data="node?.data" 
            :selected="node?.selected"
            @contextmenu="(event) => handleNodeContextMenu(event, node?.id)"
          />
        </template>
        
        <template #node-decision="{ node }">
          <DecisionNode 
            :id="node?.id"
            :data="node?.data" 
            :selected="node?.selected"
            @contextmenu="(event) => handleNodeContextMenu(event, node?.id)"
          />
        </template>
        
      </VueFlow>
    </div>
    
    <!-- 右键菜单 -->
    <ContextMenu
      :visible="contextMenu.visible"
      :position="contextMenu.position"
      @edit="handleContextMenuEdit"
      @copy="handleContextMenuCopy"
      @delete="handleContextMenuDelete"
      @close="handleContextMenuClose"
    />
    
    <!-- 编辑对话框 -->
    <EditDialog
      v-model="editDialog.visible"
      :node-label="editDialog.nodeLabel"
      @confirm="handleEditConfirm"
    />
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

.vue-flow {
  width: 100%;
  height: 100%;
  background: #f8fafc;
}

// 全局样式覆盖
:deep(.vue-flow__node) {
  cursor: pointer;
}

:deep(.vue-flow__node.selected) {
  outline: 2px dashed var(--el-color-primary-light-3);
  outline-offset: 3px;
}

:deep(.vue-flow__node.selected:has(.decision-node)) {
  outline: 2px dashed var(--el-color-primary-light-3);
  outline-offset: 20px;
}


:deep(.vue-flow__handle) {
  background: var(--el-color-primary);
  border: 2px solid white;
  width: 8px;
  height: 8px;
}

:deep(.vue-flow__edge-path) {
  stroke: var(--el-color-primary) !important;
  stroke-width: 2 !important;
}

:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: var(--el-color-primary);
  stroke-width: 3;
}

</style>