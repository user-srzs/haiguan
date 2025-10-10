<template>
  <div class="normal-node" :class="{ selected: isSelected }">
    <div class="node-content">
      <div class="node-icon">
      </div>
      <div class="node-label">{{ data?.label || '普通节点' }}</div>
    </div>
    <!-- 顶部顶点连接点 -->
    <Handle
      type="target"
      position="top"
      :id="`${id}-top`"
      :style="{
        border: '2px solid white',
        width: '8px',
        height: '8px',
        top: '0',
        left: '50%',
      }"
    />
    <!-- 右侧顶点连接点  -->
    <Handle
      type="source"
      position="right"
      :id="`${id}-right`"
      :style="{
        border: '2px solid white',
        width: '8px',
        height: '8px',
        right: '0',
        top: '50%',
      }"
    />
    <!-- 底部顶点连接点 -->
    <Handle
      type="source"
      position="bottom"
      :id="`${id}-bottom`"
      :style="{
        border: '2px solid white',
        width: '8px',
        height: '8px',
        bottom: '0',
        left: '50%',
      }"
    />
    <!-- 左侧顶点连接点 -->
    <Handle
      type="source"
      position="left"
      :id="`${id}-left`"
      :style="{
        border: '2px solid white',
        width: '8px',
        height: '8px',
        left: '0',
        top: '50%',
      }"
    />
  </div>
</template>

<script setup lang="ts">
// LogicFlow 不需要 Handle 组件

interface Props {
  id: string
  data: {
    label?: string
  }
  selected?: boolean
}

const props = defineProps<Props>()

const isSelected = computed(() => props.selected)
</script>

<style scoped lang="scss">
.normal-node {
  min-width: 120px;
  min-height: 60px;
  border: 3px solid var(--el-color-primary);
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  padding: 8px 12px;

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transform: scale(1.02);
  }

  &.selected {
    box-shadow: 0 0 0 2px var(--el-color-primary);
    border-style: dashed;
  }

  .node-content {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .node-icon {
    flex-shrink: 0;
  }


  .node-label {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    flex: 1;
    text-align: left;
  }
}
</style>
