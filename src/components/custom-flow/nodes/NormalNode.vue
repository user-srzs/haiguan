<template>
  <div class="normal-node" :class="{ selected: isSelected }">
    <div class="node-content">
      <div class="node-icon">
      </div>
      <div class="node-label">{{ data?.label || '普通节点' }}</div>
    </div>
    <!-- 输入连接点 -->
    <Handle
      type="target"
      position="top"
      :id="`${id}-top`"
      style="background: #3b82f6; border: 2px solid white; width: 8px; height: 8px;"
    />
    <!-- 输出连接点 -->
    <Handle
      type="source"
      position="bottom"
      :id="`${id}-bottom`"
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
.normal-node {
  min-width: 120px;
  min-height: 60px;
  border: 3px solid #3b82f6;
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
    box-shadow: 0 0 0 2px #3b82f6;
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
