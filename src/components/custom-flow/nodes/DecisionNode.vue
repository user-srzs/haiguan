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
        border: '2px solid white',
        width: '8px',
        height: '8px',
        top: '0',
        left: '0',
      }"
    />
    <!-- 右侧顶点连接点 -->
    <Handle
      type="source"
      position="right"
      :id="`${id}-right`"
      :style="{
        border: '2px solid white',
        width: '8px',
        height: '8px',
        right: '0',
        top: '0',
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
        left: '100%',
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
        top: '100%',
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
.decision-node {
  width: 80px;
  height: 80px;
  border: 3px solid var(--el-color-primary);
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
    box-shadow: 0 0 0 2px var(--el-color-primary);
    border: 3px dashed var(--el-color-primary);
    outline: 2px dashed var(--el-color-primary);
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
