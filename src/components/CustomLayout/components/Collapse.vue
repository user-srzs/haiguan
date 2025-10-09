<script setup lang="ts">
  const props = defineProps({
    collapse: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits<{
    (e: 'update:collapse', value: boolean): void
  }>();
  const toggleCollapse = (): void => {
    emit('update:collapse', !props.collapse)
  };
</script>

<template>
  <div class="collapse-btn" @click="toggleCollapse">
    <svg
      :class="{ 'is-active': !props.collapse }"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
    >
      <path
        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
        fill="#ccc"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
    font-size: 24px;
    &:hover {
      background: #f5f5f5;
    }
  }
  .is-active {
    transform: rotate(180deg);
  }
</style>