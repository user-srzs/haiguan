<script setup lang="ts">
// 图标组件会在运行时动态加载
import { HOME_PATH } from '@/config/seeting.ts';
import { useRoute, useRouter } from 'vue-router';
import { filterRoutes, routesToMenuItems, getActiveMenuPath, type MenuItem } from '@/utils/routeUtils';
import type { RouteRecordNormalized } from 'vue-router';

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

const route = useRoute();
const router = useRouter();

// 首页路径
const homePath = ref(HOME_PATH || props?.menus?.homePath || '/home');
// 当前激活的菜单路径
const activeMenuPath = ref(homePath.value);
// 菜单栏数据
const menuItems = ref<MenuItem[]>([]);

/**
 * 渲染菜单项
 * @param items 菜单项数组
 * @returns 菜单项组件
 */
const renderMenuItem = (items: MenuItem[]) => {
  return items.map(item => {
    // 如果有子菜单且子菜单不为空
    if (item.children && item.children.length > 0) {
      return h('el-sub-menu', {
        key: item.path,
        index: item.path
      }, {
        title: () => [
          item.icon ? h('el-icon', {}, [h(resolveComponent(item.icon))]) : null,
          h('span', item.title)
        ],
        default: () => renderMenuItem(item.children!)
      });
    } else {
      // 一级菜单项
      return h('el-menu-item', {
        key: item.path,
        index: item.path
      }, {
        default: () => [
          item.icon ? h('el-icon', {}, [h(resolveComponent(item.icon))]) : null,
          h('span', item.title)
        ]
      });
    }
  });
};

/**
 * 处理菜单选择
 * @param index 选中的菜单路径
 */
const handleMenuSelect = (index: string) => {
  if (index !== route.path) {
    router.push(index);
  }
};

/**
 * 初始化菜单数据
 */
const initMenuData = () => {
  try {
    // 如果传入了路由数据
    if (props.menus?.routes && Array.isArray(props.menus.routes)) {
      // 过滤路由
      const filteredRoutes = filterRoutes(props.menus.routes as RouteRecordNormalized[]);
      // 转换为菜单项
      menuItems.value = routesToMenuItems(filteredRoutes);
    } else {
      // 使用默认菜单
      menuItems.value = [
        {
          path: '/home',
          title: '首页',
          icon: 'House'
        },
        {
          path: '/address',
          title: '地点配置',
          icon: 'Location'
        },
        {
          path: '/goodsProcess',
          title: '流程配置',
          icon: 'Setting'
        }
      ];
    }
  } catch (error) {
    console.error('初始化菜单数据失败:', error);
    // 使用默认菜单
    menuItems.value = [
      {
        path: '/home',
        title: '首页',
        icon: 'House'
      }
    ];
  }
};

/**
 * 更新激活的菜单项
 */
const updateActiveMenu = () => {
  if (props.menus?.routes && Array.isArray(props.menus.routes)) {
    const filteredRoutes = filterRoutes(props.menus.routes as RouteRecordNormalized[]);
    activeMenuPath.value = getActiveMenuPath(route.path, filteredRoutes) || homePath.value;
  } else {
    // 简单匹配当前路径
    activeMenuPath.value = route.path || homePath.value;
  }
};

/** ------------- 页面挂载后执行 ----------------- */
onMounted(() => {
  initMenuData();
  updateActiveMenu();
});

// 监听路由变化
watch(() => route.path, () => {
  updateActiveMenu();
}, { immediate: true });

// 监听菜单数据变化
watch(() => props.menus, () => {
  initMenuData();
  updateActiveMenu();
}, { deep: true });
</script>

<template>
  <el-menu
    :default-active="activeMenuPath"
    :collapse="props?.collapse"
    :unique-opened="true"
    @select="handleMenuSelect"
    :router="true"
  >
    <!-- 动态渲染菜单项 -->
    <template v-for="item in menuItems" :key="item.path">
      <!-- 有子菜单的情况 -->
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
        <template #title>
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item 
          v-for="child in item.children" 
          :key="child.path" 
          :index="child.path"
        >
          <el-icon v-if="child.icon">
            <component :is="child.icon" />
          </el-icon>
          <span>{{ child.title }}</span>
        </el-menu-item>
      </el-sub-menu>
      <!-- 一级菜单项 -->
      <el-menu-item v-else :index="item.path">
        <el-icon v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">

</style>