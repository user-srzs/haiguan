<template>
  <div class="decision-node" :class="{ selected: isSelected }">
    <div class="node-content">
      <div class="node-icon">
      </div>
      <div class="node-label">{{ data?.label || '判断' }}</div>
    </div>
    <!-- 顶部顶点连接点 -->
    <Handle
      type="target"
      position="top"
      :id="`${id}-top`"
      :style="{
        background: '#3b82f6',
        border: '2px solid white',
        width: '8px',
        height: '8px',
        top: '0px',
        left: '50%',
        transform: 'translateX(-50%)'
      }"
    />
    <!-- 右侧顶点连接点 -->
    <Handle
      type="source"
      position="right"
      :id="`${id}-right`"
      :style="{
        background: '#3b82f6',
        border: '2px solid white',
        width: '8px',
        height: '8px',
        right: '0px',
        top: '50%',
        transform: 'translateY(-50%)'
      }"
    />
    <!-- 底部顶点连接点 -->
    <Handle
      type="source"
      position="bottom"
      :id="`${id}-bottom`"
      :style="{
        background: '#3b82f6',
        border: '2px solid white',
        width: '8px',
        height: '8px',
        bottom: '0px',
        left: '50%',
        transform: 'translateX(-50%)'
      }"
    />
    <!-- 左侧顶点连接点 -->
    <Handle
      type="source"
      position="left"
      :id="`${id}-left`"
      :style="{
        background: '#3b82f6',
        border: '2px solid white',
        width: '8px',
        height: '8px',
        left: '0px',
        top: '50%',
        transform: 'translateY(-50%)'
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
.decision-node {
  width: 100px;
  height: 100px;
  border: 3px solid #3b82f6;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transform: rotate(45deg) scale(1.05);
  }

  &.selected {
    box-shadow: 0 0 0 2px #3b82f6;
    border: 3px dashed #3b82f6;
    outline: 2px dashed #3b82f6;
    outline-offset: 25px;
    // 菱形旋转45度后，需要的最小正方形边长是100√2 ≈ 141.4px
    // 我们设置为145px以确保完全包围菱形
    width: 145px;
    height: 145px;
  }

  .node-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transform: rotate(-45deg);
  }

  .node-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .node-label {
    font-size: 12px;
    color: #374151;
    text-align: center;
    font-weight: 500;
    max-width: 60px;
    word-wrap: break-word;
  }
}
</style>
