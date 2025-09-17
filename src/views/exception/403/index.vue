<template>
  <div class="exception-page">
    <el-result title="404">
      <template #icon>
        <div style="width: 250px; height: 295px; margin: 20px 0 10px 0">
          <icon-svg />
        </div>
      </template>
      <template #sub-title>
        <h1>403</h1>
        <h2>抱歉，您没有权限访问此页面</h2>
        <p>请联系管理员获取相应权限，或返回首页继续浏览</p>
      </template>
      <template #extra>
        <router-link to="/" style="display: inline-flex; text-decoration: none">
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts" name="Exception403">
// import { useRouter } from 'vue-router';
// import { HOME_PATH } from '@/config/seeting';
import IconSvg from './components/icon-svg.vue';

// const router = useRouter();

// const goHome = () => {
//   router.push(HOME_PATH);
// };

// const goBack = () => {
//   router.go(-1);
// };
</script>

<style lang="scss" scoped>
.exception-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.exception-content {
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 800px;
  padding: 40px;
}

.exception-image {
  flex-shrink: 0;
  
  img {
    width: 300px;
    height: auto;
  }
}

.exception-info {
  h1 {
    font-size: 72px;
    font-weight: bold;
    color: #ff6b6b;
    margin: 0 0 16px 0;
    line-height: 1;
  }

  h2 {
    font-size: 24px;
    color: #333;
    margin: 0 0 16px 0;
    font-weight: 500;
  }

  p {
    font-size: 16px;
    color: #666;
    margin: 0 0 32px 0;
    line-height: 1.6;
  }
}

.exception-actions {
  display: flex;
  gap: 16px;
}

@media (max-width: 768px) {
  .exception-content {
    flex-direction: column;
    text-align: center;
    gap: 40px;
    padding: 20px;
  }

  .exception-image img {
    width: 200px;
  }

  .exception-info h1 {
    font-size: 48px;
  }

  .exception-info h2 {
    font-size: 20px;
  }
}
</style>