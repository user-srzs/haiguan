<template>
  <div 
    v-if="visible" 
    class="context-menu" 
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @click.stop
  >
    <div class="menu-item" @click="handleEdit">
      <span>编辑文本</span>
    </div>
    <div class="menu-item" @click="handleCopy">
      <span>复制</span>
    </div>
    <div class="menu-item danger" @click="handleDelete">
      <span>删除</span>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Position {
  x: number
  y: number
}

interface Props {
  visible: boolean
  position: Position
}

interface Emits {
  (e: 'edit'): void
  (e: 'copy'): void
  (e: 'delete'): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleEdit = () => {
  emit('edit')
  emit('close')
}

const handleCopy = () => {
  emit('copy')
  emit('close')
}

const handleDelete = () => {
  emit('delete')
  emit('close')
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.context-menu')) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 1000;
  min-width: 140px;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 14px;
    color: #374151;

    &:hover {
      background: #f3f4f6;
    }

    &.danger {
      color: #dc2626;

      &:hover {
        background: #fef2f2;
      }
    }

    .menu-icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }
  }
}
</style>
