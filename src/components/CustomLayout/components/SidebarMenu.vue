<script setup lang="ts">
  import { House, Setting } from '@element-plus/icons-vue';
  import { HOME_PATH } from '@/config/seeting.ts';

  const props = defineProps({
    collapse: {
      type: Boolean,
      default: false,
    },
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
  <el-menu
    :default-active="homePath"
    :collapse="props?.collapse"
    :unique-opened="true"
    @select="handleMenuSelect"
    :router="true"
  >
    <el-menu-item index="/home">
      <el-icon><House /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="/address">
      <el-icon></el-icon>
      <span>地点配置</span>
    </el-menu-item>
    <el-menu-item index="/goodsProcess">
      <el-icon><Setting /></el-icon>
      <span>流程配置</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="scss">

</style>