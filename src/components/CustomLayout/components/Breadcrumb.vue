<script setup lang="ts">
import { House } from '@element-plus/icons-vue';
import { HOME_PATH } from '@/config/seeting.ts';
const props = defineProps({
  menus: {
    type: Object,
    default: () => ({})
  }
})
// 首页路径
const homePath = ref(HOME_PATH || props?.menus?.homePath);
// 菜单栏数据
const currentMenus = ref(props?.menus);

/** ------------- 页面挂载后执行 ----------------- */
onMounted(() => {
  console.log('currentMenus', currentMenus);
});
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: homePath }">
      <el-icon><House /></el-icon>
    </el-breadcrumb-item>
    <el-breadcrumb-item>promotion list</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">

</style>