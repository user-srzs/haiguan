<script setup lang="ts">
import LogicFlow from '@logicflow/core'
import '@logicflow/core/lib/style/index.css'
import { DndPanel, SelectionSelect, Menu } from '@logicflow/extension'
import '@logicflow/extension/lib/style/index.css'
import { ElMessage } from 'element-plus'
// 导入自定义组件
import EditDialog from './components/EditDialog.vue'

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
  LogicFlow.use(Menu)

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
      icon: 'Notification',
    },
    {
      type: 'rect',
      label: '用户任务',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==',
      className: 'important-node'
    },
    {
      type: 'diamond',
      label: '条件判断',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=',
    },
    {
      type: 'circle',
      text: '结束',
      label: '结束节点',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAA1BJREFUOBFtVE1IVUEYPXOf+tq40Y3vPcmFIdSjIorWoRG0ERWUgnb5FwVhYQSl72oUoZAboxKNFtWiwKRN0M+jpfSzqJAQclHo001tKkjl3emc8V69igP3znzfnO/M9zcDcKT67azmjYWTwl9Vn7Vumeqzj1DVb6cleQY4oAVnIOPb+mKAGxQmKI5CWNJ2aLPatxWa3aB9K7/fB+/Z0jUF6TmMlFLQqrkECWQzOZxYGjTlOl8eeKaIY5yHnFn486xBustDjWT6dG7pmjHOJd+33t0iitTPkK6tEvjxq4h2MozQ6WFSX/LkDUGfFwfhEZj1Auz/U4pyAi5Sznd7uKzznXeVHlI/Aywmk6j7fsUsEuCGADrWARXXwjxWQsUbIupDHJI7kF5dRktg0eN81IbiZXiTESic50iwS+t1oJgL83jAiBupLDCQqwziaWSoAFSeIR3P5Xv5az00wyIn35QRYTwdSYbz8pH8fxUUAtxnFvYmEmgI0wYXUXcCCspeEVpXlsRhBnCEATxWylL9+EKCAYhe1NGstUa6356kS9NVvt3DU2fd+Wtbm/+lSbylJqsqkSm9CRhvoJVlvKPvF1RKY/FcPn5j4UfIMLn8D4UYb54BNsilTDXKnF4CfTobA0FpoW/LSp306wkXM+XaOJhZaFkcNM82ASNAWMrhrUbRfmyeI1FvRBTpN06WKxa9BK0o2E4Pd3zfBBEwPsv9sQBnmLVbLEIZ/Xe9LYwJu/Er17W6HYVBc7vmuk0xUQ+pqxdom5Fnp55SiytXLPYoMXNM4u4SNSCFWnrVIzKG3EGyMXo6n/BQOe+bX3FClY4PwydVhthOZ9NnS+ntiLh0fxtlUJHAuGaFoVmttpVMeum0p3WEXbcll94l1wM/gZ0Ccczop77VvN2I7TlsZCsuXf1WHvWEhjO8DPtyOVg2/mvK9QqboEth+7pD6NUQC1HN/TwvydGBARi9MZSzLE4b8Ru3XhX2PBxf8E1er2A6516o0w4sIA+lwURhAON82Kwe2iDAC1Watq4XHaGQ7skLcFOtI5lDxuM2gZe6WFIotPAhbaeYlU4to5cuarF1QrcZ/lwrLaCJl66JBocYZnrNlvm2+MBCTmUymPrYZVbjdlr/BxlMjmNmNI3SAAAAAElFTkSuQmCC',
    }
  ])
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

// 编辑对话框状态
const editDialog = reactive({
  visible: false,
  nodeId: '',
  nodeLabel: ''
})

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

// 处理侧边栏节点点击
const handleSidebarNodeClick = (type: string) => {
  if (type === 'selection') {
    // 选择工具逻辑
    (lf?.extension.selectionSelect as any).openSelectionSelect()
    return
  }
  
  // 在画布中心创建节点
  const position = { x: 300, y: 200 }
  console.log('点击创建节点:', type, position)
  createNode(type, position)
}

// 处理编辑确认
const handleEditConfirm = (label: string) => {
  const node = nodes.value.find(n => n.id === editDialog.nodeId)
  if (node) {
    node.text = label
    // 同步到 LogicFlow
    if (lf) {
      lf.setProperties(node.id, { text: label })
    }
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