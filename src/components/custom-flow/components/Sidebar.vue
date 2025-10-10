<template>
  <div class="flow-toolbar">
    <div class="toolbar-content">
      <div 
        class="node-item" 
        @click="onNodeClick('start')"
      >
        <div class="node-icon start-icon"></div>
        <span class="node-label">开始</span>
      </div>
      
      <div 
        class="node-item" 
        @click="onNodeClick('userTask')"
      >
        <div class="node-icon user-task-icon">
        </div>
        <span class="node-label">普通节点</span>
      </div>
      
      <div 
        class="node-item" 
        @click="onNodeClick('decision')"
      >
        <div class="node-icon decision-icon"></div>
        <span class="node-label">条件判断</span>
      </div>
      
      <div 
        class="node-item" 
        @click="onNodeClick('end')"
      >
        <div class="node-icon end-icon">
          <div class="outer-circle"></div>
        </div>
        <span class="node-label">结束</span>
      </div>
      
      <div 
        class="node-item" 
        @click="onNodeClick('selection')"
      >
        <div class="node-icon selection-icon">⊡</div>
        <span class="node-label">选区</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'nodeClick', type: string): void
}

const emit = defineEmits<Emits>()

const onNodeClick = (type: string) => {
  emit('nodeClick', type)
}
</script>

<style scoped lang="scss">
  .flow-toolbar {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 80px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;

  .toolbar-content {
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 400px;
    overflow-y: auto;
  }

  .node-item {
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


    .node-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--el-color-primary);
      border-radius: 4px;
      background: white;
      font-size: 12px;
      color: var(--el-color-primary);
      font-weight: bold;
    }

    .selection-icon {
      border-style: dashed;
      font-size: 18px;
    }

    .start-icon {
      border-radius: 50%;
      font-size: 20px;
    }

    .user-task-icon {
      border-radius: 4px;
    }

    .decision-icon {
      transform: rotate(45deg);
      font-size: 18px;
    }

    .end-icon {
      border-radius: 50%;
      position: relative;
    }

    .outer-circle {
      width: 16px;
      height: 16px;
      border: 2px solid var(--el-color-primary);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .inner-circle {
      width: 8px;
      height: 8px;
      background: var(--el-color-primary);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .node-label {
      font-size: 12px;
      color: #374151;
      font-weight: 500;
      text-align: center;
      line-height: 1.2;
    }
  }
}
</style>
