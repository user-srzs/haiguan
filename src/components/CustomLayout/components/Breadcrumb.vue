<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbItems"
      :key="item.path"
      :to="index < breadcrumbItems.length - 1 ? item.path : undefined"
      :class="{ 'is-link': index < breadcrumbItems.length - 1 }"
    >
      <el-icon v-if="item.icon && index === 0">
        <component :is="getIconComponent(item.icon)" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { generateBreadcrumbs } from '@/utils/routeUtils';
import type { MenuItem } from '@/router/model.ts';

// 定义props
interface Props {
  menus: MenuItem[];
}

const props = defineProps<Props>();

const route = useRoute();

// 面包屑数据
const breadcrumbItems = computed(() => {
  return generateBreadcrumbs(route.path, props.menus);
});

// 获取图标组件
const getIconComponent = (iconName: string) => {
  // 这里可以根据iconName动态导入图标组件
  // 暂时返回一个默认的图标组件名
  return iconName || 'House';
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    // 面包屑会自动更新，这里不需要额外处理
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.breadcrumb {
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