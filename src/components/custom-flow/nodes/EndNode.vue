<template>
  <div class="end-node" :class="{ selected: isSelected }">
    <div class="node-content">
      <div class="node-label">{{ data?.label || '结束' }}</div>
    </div>
    <!-- 输入连接点 -->
    <Handle
      type="target"
      position="top"
      :id="`${id}-top`"
      style="background: #3b82f6; border: 2px solid white; width: 8px; height: 8px;"
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
.end-node {
  width: 80px;
  height: 80px;
  border: 3px solid #3b82f6;
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
    box-shadow: 0 0 0 2px #3b82f6;
    border-style: dashed;
  }

  .node-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .node-icon {
    position: relative;
    width: 24px;
    height: 24px;
  }

  .outer-circle {
    width: 24px;
    height: 24px;
    border: 3px solid #3b82f6;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .inner-circle {
    width: 12px;
    height: 12px;
    background: #3b82f6;
    border-radius: 50%;
    position: absolute;
    top: 6px;
    left: 6px;
  }

  .node-label {
    font-size: 12px;
    color: #374151;
    text-align: center;
    font-weight: 500;
  }
}
</style>
