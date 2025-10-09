<script setup lang="ts" name="Home">

</script>

<template>
  <div class="home-container">
    <h1>海关管理系统 - 首页</h1>
    <div class="test-content">
      <h2>测试横向滚动内容</h2>
      <div class="wide-content">
        <div class="card" v-for="i in 20" :key="i">
          <h3>卡片 {{ i }}</h3>
          <p>这是第 {{ i }} 个测试卡片，用于验证横向滚动时内容是否会被侧边栏遮挡。</p>
        </div>
      </div>
      
      <div class="extra-wide-content">
        超宽内容测试 - 验证头部和侧边栏是否固定
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  
  h1 {
    color: var(--el-color-primary);
    margin-bottom: 20px;
  }
  
  .test-content {
    h2 {
      margin-bottom: 16px;
      color: var(--el-text-color-primary);
    }
    
    .wide-content {
      display: flex;
      gap: 16px;
      padding: 16px 0;
      min-width: 2000px; // 强制创建横向滚动
      
      .card {
        flex-shrink: 0;
        width: 300px;
        padding: 20px;
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        
        h3 {
          margin: 0 0 12px 0;
          color: var(--el-color-primary);
        }
        
        p {
          margin: 0;
          color: var(--el-text-color-regular);
          line-height: 1.5;
        }
      }
    }
    
    // 添加一个超宽的内容测试
    .extra-wide-content {
      width: 3000px;
      height: 200px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
      margin: 20px 0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
  }
}
</style>