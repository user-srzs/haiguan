<script setup lang="ts">

// 类型定义
import { Expand, Fold } from '@element-plus/icons-vue';

type LayoutMode = 'side' | 'top' | 'mix'

interface LayoutProps {
  logo?: string
  title?: string
  layout?: LayoutMode
  showHeader?: boolean
  showSidebar?: boolean
  showTabs?: boolean
  showCollapse?: boolean
  collapse?: boolean
  fixedHeader?: boolean
  fixedSidebar?: boolean
  responsive?: boolean
}

interface LayoutEmits {
  (e: 'update:collapse', value: boolean): void
  (e: 'logo-click'): void
}

interface LayoutClass {
  'layout-side': boolean
  'layout-top': boolean
  'layout-mix': boolean
  'layout-collapse': boolean
  'layout-mobile': boolean
  'layout-no-sidebar': boolean
  'layout-no-tabs': boolean
  'layout-no-header': boolean
}

// 响应式断点配置
interface BreakpointConfig {
  mobile: number
  desktop: number
}

// 布局状态接口
interface LayoutState {
  isMobile: boolean
  isDesktopNot: boolean;
  isDesktop: boolean
  screenWidth: number
}

// Props 定义
const props = withDefaults(defineProps<LayoutProps>(), {
  logo: '',
  title: '管理系统',
  layout: 'side',
  showHeader: true,
  showSidebar: true,
  showTabs: true,
  showCollapse: true,
  collapse: false,
  fixedHeader: true,
  fixedSidebar: true,
  responsive: true
})

// Emits 定义
const emit = defineEmits<LayoutEmits>()

// 响应式断点配置
const breakpoints: BreakpointConfig = {
  mobile: 768,
  desktop: 1200
}

// 响应式数据
const screenWidth = ref(window.innerWidth)
const isMobile = computed(() => screenWidth.value <= breakpoints.mobile);
const isDesktop = computed(() => screenWidth.value >= breakpoints.desktop);
const isDesktopNot = computed(
  () =>
    screenWidth.value > breakpoints.mobile &&
    screenWidth.value < breakpoints.desktop
);

// 布局状态
const layoutState: ComputedRef<LayoutState> = computed(() => ({
  isMobile: isMobile.value,
  isDesktopNot: isDesktopNot.value,
  isDesktop: isDesktop.value,
  screenWidth: screenWidth.value
}))

// 计算属性 - 布局类名
const layoutClass: ComputedRef<LayoutClass> = computed(() => {
  return {
    'layout-side': props.layout === 'side',
    'layout-top': props.layout === 'top',
    'layout-mix': props.layout === 'mix',
    'layout-collapse': props.collapse,
    'layout-mobile': isMobile.value,
    'layout-no-sidebar': !props.showSidebar || props.layout === 'top',
    'layout-no-tabs': !props.showTabs,
    'layout-no-header': !props.showHeader
  }
})

// 计算属性 - 是否显示侧栏
const showSidebar: ComputedRef<boolean> = computed(() => {
  if (props.layout === 'top') return false
  return props.showSidebar;
})

// 方法定义
const toggleCollapse = (): void => {
  emit('update:collapse', !props.collapse)
}

const onLogoClick = (): void => {
  emit('logo-click')
}

// 响应式检测
const checkScreenSize = (): void => {
  if (props.responsive) {
    screenWidth.value = window.innerWidth
  }
}

// 防抖处理窗口大小变化
let resizeTimer: ReturnType<typeof setTimeout> | null = null
const handleResize = (): void => {
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  resizeTimer = setTimeout(() => {
    checkScreenSize()
  }, 100)
}

// 获取当前布局模式
const getCurrentLayout = (): LayoutMode => {
  if (isMobile.value) return 'top'
  return props.layout || 'side'
}

// 检查是否应该自动折叠
const shouldAutoCollapse = (): boolean => {
  return isMobile.value && !props.collapse
}

// 生命周期钩子
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = null
  }
})

// 监听屏幕尺寸变化，自动调整布局  1200px <= isDesktop
watch(isDesktop, (newValue: boolean, oldValue: boolean) => {
  if (newValue !== oldValue && newValue) {
    // 桌面端：显示侧栏并展开
    emit('update:collapse', false);
  }
});
// 监听屏幕尺寸变化，自动调整布局  768px < isDesktopNot < 1200px
watch(isDesktopNot, (newValue: boolean, oldValue: boolean) => {
  if (newValue !== oldValue && newValue) {
    // 中等屏幕：显示侧栏但折叠
    emit('update:collapse', true);
  }
});
// 监听屏幕尺寸变化，自动调整布局  isMobile <= 768px
watch(isMobile, (newValue: boolean, oldValue: boolean) => {
  if (newValue !== oldValue && newValue) {
    // 移动端：隐藏侧栏（通过折叠实现）
    emit('update:collapse', true);
  }
});

// 暴露给父组件的方法和属性
defineExpose({
  layoutState,
  getCurrentLayout,
  shouldAutoCollapse,
  toggleCollapse,
  onLogoClick
})
</script>

<template>
  <div class="custom-layout" :class="layoutClass">
    <!-- 顶栏 - 固定定位 -->
    <div v-if="showHeader" class="layout-header">
      <div class="header-left">
        <div class="logo" @click="onLogoClick">
          <img v-if="logo" :src="logo" alt="logo" />
          <span v-if="title">{{ title }}</span>
        </div>
        <div v-if="showCollapse" class="collapse-btn" @click="toggleCollapse">
          <el-icon>
            <Fold v-if="!collapse" />
            <Expand v-else />
          </el-icon>
        </div>
        <slot name="header-left"></slot>
      </div>
      <div class="header-content">
        <slot name="header-content"></slot>
      </div>
      <div class="header-right">
        <div class="header-right-tools">
        </div>
        <slot name="header-right"></slot>
      </div>
    </div>

    <!-- 侧栏 - 固定定位 -->
    <div v-if="showSidebar" class="layout-sidebar" :class="{ 'sidebar-collapse': collapse }">
      <slot name="sidebar-header"></slot>
      <slot name="sidebar"></slot>
      <slot name="sidebar-bottom"></slot>
    </div>

    <!-- 页签栏 - 固定定位 -->
    <div v-if="showTabs" class="layout-tabs">
      <slot name="tabs"></slot>
    </div>

    <!-- 主内容区域 - 可滚动 -->
    <div class="layout-content">
      <div class="layout-page">
        <slot></slot>
        <div class="layout-footer">
          <slot name="layout-footer"></slot>
        </div>
      </div>
    </div>
    <!-- 小屏幕遮罩层 -->
    <div v-if="isMobile && !collapse" class="layout-shade" @click="toggleCollapse"></div>
  </div>
</template>

<style lang="scss" scoped>
@use './assets/styles/var.scss' as *;

.custom-layout {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f0f2f5;
  overflow: hidden;

  // 顶栏 - 固定定位，始终在顶部
  .layout-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: $header-height;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    //justify-content: space-between;
    padding: 0 16px;
    z-index: $z-index-header;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    transition: all 0.3s;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        color: #1890ff;
        transition: all 0.3s;

        img {
          height: 32px;
          width: auto;
        }
      }

      .collapse-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s;
        font-size: 24px;

        &:hover {
          background: #f5f5f5;
        }
      }
    }

    .header-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: 16px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  // 侧栏 - 固定定位，不随内容滚动
  .layout-sidebar {
    position: fixed;
    top: $header-height;
    left: 0;
    bottom: 0;
    width: $sidebar-width;
    background: #fff;
    border-right: 1px solid #e8e8e8;
    z-index: $z-index-sidebar;
    transition: all 0.3s;
    overflow-y: auto;
    overflow-x: hidden;

    &.sidebar-collapse {
      width: $sidebar-collapse-width;
    }

    // 侧栏滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 3px;

      &:hover {
        background: #bfbfbf;
      }
    }
  }

  // 页签栏 - 固定定位，不随内容滚动
  .layout-tabs {
    position: fixed;
    top: $header-height;
    left: $sidebar-width;
    right: 0;
    height: $tabs-height;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    z-index: $z-index-tabs;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }

  // 主内容区域 - 可滚动，独立于其他固定元素
  .layout-content {
    position: fixed;
    top: $header-height + $tabs-height;
    left: $sidebar-width;
    right: 0;
    bottom: 0;
    background: #f0f2f5;
    z-index: 1;
    transition: all 0.3s;
    overflow: hidden;

    .layout-page {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: auto;
      box-sizing: border-box;

      // 主内容滚动条样式
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #d9d9d9;
        border-radius: 4px;

        &:hover {
          background: #bfbfbf;
        }
      }
    }
  }

  // 小屏幕遮罩层
  .layout-shade {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: $z-index-shade;
  }

  // 布局变体
  &.layout-top {
    .layout-sidebar {
      display: none;
    }

    .layout-tabs {
      left: 0;
    }

    .layout-content {
      left: 0;
    }
  }

  &.layout-mix {
    .layout-sidebar {
      width: $sidebar-collapse-width;
    }

    .layout-tabs {
      left: $sidebar-collapse-width;
    }

    .layout-content {
      left: $sidebar-collapse-width;
    }
  }

  // 折叠状态
  &.layout-collapse {
    .layout-sidebar {
      width: $sidebar-collapse-width;
    }

    .layout-tabs {
      left: $sidebar-collapse-width;
    }

    .layout-content {
      left: $sidebar-collapse-width;
    }
  }

  // 移动端适配
  &.layout-mobile {
    .layout-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s;

      &:not(.sidebar-collapse) {
        transform: translateX(0);
      }
    }

    .layout-tabs {
      left: 0;
    }

    .layout-content {
      left: 0;
    }
  }

  // 无侧栏模式
  &.layout-no-sidebar {
    .layout-tabs {
      left: 0;
    }

    .layout-content {
      left: 0;
    }
  }

  // 无页签模式
  &.layout-no-tabs {
    .layout-tabs {
      display: none;
    }

    .layout-content {
      top: $header-height;
    }
  }

  // 无顶栏模式
  &.layout-no-header {
    .layout-sidebar {
      top: 0;
    }

    .layout-tabs {
      top: 0;
    }

    .layout-content {
      top: $tabs-height;
    }
  }
}

// 全局滚动条重置
:global(body) {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

:global(html) {
  height: 100%;
  overflow: hidden;
}
</style>