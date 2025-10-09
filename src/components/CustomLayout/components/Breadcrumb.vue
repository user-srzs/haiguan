<script setup lang="ts">
// 图标组件会在运行时动态加载
import { HOME_PATH } from '@/config/seeting.ts';
import { useRoute, useRouter } from 'vue-router';
import { generateBreadcrumbs, type BreadcrumbItem } from '@/utils/routeUtils';
import type { RouteRecordNormalized } from 'vue-router';

const props = defineProps({
  menus: {
    type: Object,
    default: () => ({})
  }
})

const route = useRoute();
const router = useRouter();

// 首页路径
const homePath = ref(HOME_PATH || props?.menus?.homePath || '/home');
// 面包屑数据
const breadcrumbItems = ref<BreadcrumbItem[]>([]);

/**
 * 更新面包屑数据
 */
const updateBreadcrumbs = () => {
  try {
    // 如果传入了路由数据
    if (props.menus?.routes && Array.isArray(props.menus.routes)) {
      breadcrumbItems.value = generateBreadcrumbs(
        route.path, 
        props.menus.routes as RouteRecordNormalized[], 
        homePath.value
      );
    } else {
      // 使用默认面包屑
      breadcrumbItems.value = [
        {
          path: homePath.value,
          title: '首页',
          icon: 'House'
        }
      ];
      
      // 如果不是首页，添加当前页面
      if (route.path !== homePath.value) {
        const currentTitle = route.meta?.title || route.name as string || '当前页面';
        breadcrumbItems.value.push({
          path: route.path,
          title: currentTitle,
          icon: route.meta?.icon as string
        });
      }
    }
  } catch (error) {
    console.error('更新面包屑失败:', error);
    // 使用默认面包屑
    breadcrumbItems.value = [
      {
        path: homePath.value,
        title: '首页',
        icon: 'House'
      }
    ];
  }
};

/**
 * 处理面包屑点击
 * @param item 面包屑项
 */
const handleBreadcrumbClick = (item: BreadcrumbItem) => {
  if (item.path !== route.path) {
    router.push(item.path);
  }
};

/** ------------- 页面挂载后执行 ----------------- */
onMounted(() => {
  updateBreadcrumbs();
});

// 监听路由变化
watch(() => route.path, () => {
  updateBreadcrumbs();
}, { immediate: true });

// 监听菜单数据变化
watch(() => props.menus, () => {
  updateBreadcrumbs();
}, { deep: true });
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item 
      v-for="(item, index) in breadcrumbItems" 
      :key="item.path"
      :to="index < breadcrumbItems.length - 1 ? { path: item.path } : undefined"
      @click="index < breadcrumbItems.length - 1 ? handleBreadcrumbClick(item) : null"
      :class="{ 'is-link': index < breadcrumbItems.length - 1 }"
    >
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
.el-breadcrumb {
  .el-breadcrumb-item {
    &.is-link {
      cursor: pointer;
      
      &:hover {
        color: var(--el-color-primary);
      }
    }
    
    .el-icon {
      margin-right: 4px;
    }
  }
}
</style>