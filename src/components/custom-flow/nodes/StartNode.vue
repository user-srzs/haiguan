<template>
  <div class="start-node" :class="{ selected: isSelected }">
    <div class="node-content">
      <div class="node-label">{{ data?.label || '开始' }}</div>
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
import { Handle } from '@vue-flow/core'

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
.start-node {
  width: 80px;
  height: 80px;
  border: 3px solid var(--el-color-primary);
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transform: scale(1.05);
  }

  &.selected {
    box-shadow: 0 0 0 2px var(--el-color-primary);
    border-style: dashed;
  }

  .node-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .node-icon {
    font-size: 24px;
    color: var(--el-color-primary);
    font-weight: bold;
  }

  .node-label {
    font-size: 12px;
    color: #374151;
    text-align: center;
    font-weight: 500;
  }
}
</style>
