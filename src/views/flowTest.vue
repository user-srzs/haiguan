<template>
  <div class="flow-test-page">
    <h1>VueFlow 测试页面</h1>
    <div class="test-container">
      <CustomFlow />
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomFlow from '@/components/custom-flow/index.vue'
</script>

<style scoped lang="scss">
.flow-test-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  h1 {
    margin: 0;
    padding: 20px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .test-container {
    flex: 1;
    height: calc(100vh - 80px);
  }
}
</style>
