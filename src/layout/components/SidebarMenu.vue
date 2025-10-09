<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="collapse"
    :unique-opened="true"
    :router="true"
    class="sidebar-menu"
    @select="handleMenuSelect"
  >
    <template v-for="item in filteredMenus" :key="item.path">
      <!-- 有子菜单的情况 -->
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="getIconComponent(item.meta.icon)" />
          </el-icon>
          <span>{{ item.meta?.title || item.name }}</span>
        </template>
        
        <template v-for="child in item.children" :key="child.path">
          <!-- 子菜单还有子菜单 -->
          <el-sub-menu v-if="child.children && child.children.length > 0" :index="child.path">
            <template #title>
              <el-icon v-if="child.meta?.icon">
                <component :is="getIconComponent(child.meta.icon)" />
              </el-icon>
              <span>{{ child.meta?.title || child.name }}</span>
            </template>
            
            <el-menu-item
              v-for="grandChild in child.children"
              :key="grandChild.path"
              :index="grandChild.path"
            >
              <el-icon v-if="grandChild.meta?.icon">
                <component :is="getIconComponent(grandChild.meta.icon)" />
              </el-icon>
              <span>{{ grandChild.meta?.title || grandChild.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 子菜单没有子菜单 -->
          <el-menu-item v-else :index="child.path">
            <el-icon v-if="child.meta?.icon">
              <component :is="getIconComponent(child.meta.icon)" />
            </el-icon>
            <span>{{ child.meta?.title || child.name }}</span>
          </el-menu-item>
        </template>
      </el-sub-menu>
      
      <!-- 没有子菜单的情况 -->
      <el-menu-item v-else :index="item.path">
        <el-icon v-if="item.meta?.icon">
          <component :is="getIconComponent(item.meta.icon)" />
        </el-icon>
        <span>{{ item.meta?.title || item.name }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { filterMenuItems, getActiveMenuPath, isPathMatch } from '@/utils/routeUtils';
import type { MenuItem } from '@/router/model.ts';

// 定义props
interface MenuData {
  homePath: string;
  menus: MenuItem[];
}

interface Props {
  menus: MenuData;
  collapse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapse: false
});

const route = useRoute();
const router = useRouter();

// 过滤后的菜单
const filteredMenus = computed(() => {
  return filterMenuItems(props.menus.menus);
});

// 当前激活的菜单
const activeMenu = ref('');

// 更新激活菜单
const updateActiveMenu = () => {
  const currentPath = route.path;
  const activePaths = getActiveMenuPath(currentPath, props.menus.menus);
  
  if (activePaths.length > 0) {
    // 找到最匹配的菜单项
    let bestMatch = '';
    for (const menuPath of activePaths) {
      if (isPathMatch(currentPath, menuPath)) {
        bestMatch = menuPath;
        break;
      }
    }
    activeMenu.value = bestMatch || activePaths[activePaths.length - 1];
  } else {
    // 如果没有找到匹配的菜单，尝试直接匹配
    for (const menu of filteredMenus.value) {
      if (isPathMatch(currentPath, menu.path)) {
        activeMenu.value = menu.path;
        break;
      }
    }
  }
};

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  if (index && index !== route.path) {
    router.push(index);
  }
};

// 获取图标组件
const getIconComponent = (iconName: string) => {
  // 这里可以根据iconName动态导入图标组件
  // 暂时返回一个默认的图标组件名
  return iconName || 'Document';
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateActiveMenu();
  },
  { immediate: true }
);

// 监听菜单变化
watch(
  () => props.menus,
  () => {
    updateActiveMenu();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.sidebar-menu {
  border-right: none;
  
  .el-menu-item,
  .el-sub-menu__title {
    height: 50px;
    line-height: 50px;
    
    .el-icon {
      margin-right: 8px;
    }
  }
  
  .el-sub-menu {
    .el-menu-item {
      height: 45px;
      line-height: 45px;
      padding-left: 50px !important;
    }
  }
  
  // 二级子菜单
  .el-sub-menu .el-sub-menu {
    .el-menu-item {
      padding-left: 70px !important;
    }
  }
}
</style>