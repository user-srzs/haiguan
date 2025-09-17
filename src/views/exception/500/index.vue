<template>
  <div class="exception-page">
    <el-result title="500">
      <template #icon>
        <div style="width: 250px; height: 295px; margin: 20px 0 10px 0">
          <icon-svg />
        </div>
      </template>
      <template #sub-title>
        <h2 type="placeholder">抱歉, 服务器出错了.</h2>
      </template>
      <template #extra>
        <router-link to="/" style="display: inline-flex; text-decoration: none">
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </template>
    </el-result>
  </div>
</template>

<script lang="ts" setup name="Exception500">
  import IconSvg from './components/icon-svg.vue';
</script>

<style lang="scss" scoped>
  .exception-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--el-bg-color);
  }
</style>