<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue';
import SidebarMenu from '@/layout/components/SidebarMenu.vue';
import Breadcrumb from '@/layout/components/Breadcrumb.vue';
import UserDropdown from '@/layout/components/UserDropdown.vue';
import { useUserStore } from '@/stores/modules/user.ts';
const userStore = useUserStore();
const logo = ref('https://element-plus.org/images/element-plus-logo.svg')
const title = ref('海关配置后台')
const layout = ref<'side' | 'top' | 'mix'>('side')
const collapse = ref(false)
const showHeader = ref(true)
const showSidebar = ref(true)
const showTabs = ref(false)
/** ------------- 折叠侧边菜单栏 ----------------- */
const showCollapse = ref(true);
const handleCollapseChange = (value: boolean): void => {
  collapse.value = value
};
// menus - { homePath: '', menus: [] }
const menus = userStore.getMenus();

/** ------------- 全屏切换 ----------------- */
const isFullscreen = ref(false);
const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (error) {
    ElMessage.error('全屏切换失败')
  }
};

/** ------------- 页面挂载后执行 ----------------- */
onMounted(() => {

});
</script>

<template>
  <CustomLayout
    :logo="logo"
    :title="title"
    :layout="layout"
    :collapse="collapse"
    :show-header="showHeader"
    :show-sidebar="showSidebar"
    :show-tabs="showTabs"
    :show-collapse="showCollapse"
    @update:collapse="handleCollapseChange"
  >
    <router-view />
    <template #header-left>
      <Breadcrumb :menus="menus"/>
    </template>
    <template #header-right>
      <!-- 全屏切换 -->
      <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
        <el-button
          :icon="FullScreen"
          circle
          size="small"
          @click="toggleFullscreen"
          class="fullscreen-toggle"
        />
      </el-tooltip>
      <!-- 用户信息 -->
      <UserDropdown :collapse="collapse" />
    </template>
    <template #sidebar>
      <SidebarMenu :menus="menus"/>
    </template>
  </CustomLayout>
</template>

<style scoped lang="scss">

</style>
