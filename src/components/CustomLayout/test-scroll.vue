<!-- 滚动测试页面 -->
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
    @logo-click="handleLogoClick"
  >
    <!-- 顶栏右侧插槽 -->
    <template #header-right>
      <el-button type="text" @click="toggleLayout">
        切换布局: {{ layout }}
      </el-button>
      <el-button type="text" @click="toggleTabs">
        {{ showTabs ? '隐藏' : '显示' }}页签
      </el-button>
      <el-button type="text" @click="toggleSidebar">
        {{ showSidebar ? '隐藏' : '显示' }}侧栏
      </el-button>
    </template>

    <!-- 侧栏插槽 -->
    <template #sidebar>
      <el-menu
        :default-active="activeMenu"
        :collapse="collapse"
        :unique-opened="true"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><House /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="users">用户管理</el-menu-item>
          <el-menu-item index="roles">角色管理</el-menu-item>
          <el-menu-item index="permissions">权限管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="content">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item index="articles">文章管理</el-menu-item>
          <el-menu-item index="categories">分类管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="test">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>测试功能</span>
          </template>
          <el-menu-item index="scroll-test">滚动测试</el-menu-item>
          <el-menu-item index="layout-test">布局测试</el-menu-item>
          <el-menu-item index="responsive-test">响应式测试</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </template>

    <!-- 页签插槽 -->
    <template #tabs>
      <el-tabs v-model="activeTab" type="card" closable @tab-remove="handleTabRemove">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.title"
          :name="tab.name"
        />
      </el-tabs>
    </template>

    <!-- 主内容 - 滚动测试 -->
    <div class="scroll-test-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>滚动测试页面</span>
            <div class="test-controls">
              <el-button @click="addContent">添加内容</el-button>
              <el-button @click="clearContent">清空内容</el-button>
              <el-button @click="addLongContent">添加长内容</el-button>
            </div>
          </div>
        </template>
        
        <div class="test-info">
          <el-alert
            title="滚动测试说明"
            type="info"
            :closable="false"
            show-icon
          >
            <p>1. 顶栏、侧栏、页签栏应该保持固定，不随内容滚动</p>
            <p>2. 只有主内容区域可以滚动</p>
            <p>3. 滚动条应该只出现在主内容区域</p>
            <p>4. 页面整体不应该出现横向滚动条</p>
          </el-alert>
        </div>

        <!-- 动态内容区域 -->
        <div class="dynamic-content">
          <div v-for="(item, index) in contentItems" :key="index" class="content-item">
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
            <div class="content-meta">
              <el-tag size="small">{{ item.type }}</el-tag>
              <span class="timestamp">{{ item.timestamp }}</span>
            </div>
          </div>
        </div>

        <!-- 固定底部信息 -->
        <div class="fixed-bottom-info">
          <el-card shadow="never">
            <p><strong>当前布局状态：</strong></p>
            <ul>
              <li>布局模式: {{ layout }}</li>
              <li>折叠状态: {{ collapse ? '已折叠' : '展开' }}</li>
              <li>显示侧栏: {{ showSidebar ? '是' : '否' }}</li>
              <li>显示页签: {{ showTabs ? '是' : '否' }}</li>
              <li>显示顶栏: {{ showHeader ? '是' : '否' }}</li>
            </ul>
          </el-card>
        </div>
      </el-card>
    </div>
  </CustomLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import CustomLayout from './index.vue'
import { 
  House, 
  Setting, 
  Document,
  DataAnalysis
} from '@element-plus/icons-vue'

// 类型定义
interface TabItem {
  name: string
  title: string
}

interface ContentItem {
  title: string
  content: string
  type: string
  timestamp: string
}

// 基础配置
const logo = ref('https://element-plus.org/images/element-plus-logo.svg')
const title = ref('滚动测试系统')

// 布局配置
const layout = ref<'side' | 'top' | 'mix'>('side')
const collapse = ref(false)
const showHeader = ref(true)
const showSidebar = ref(true)
const showTabs = ref(true)
const showCollapse = ref(true)

// 菜单和页签
const activeMenu = ref('dashboard')
const activeTab = ref('scroll-test')
const tabs = reactive<TabItem[]>([
  { name: 'scroll-test', title: '滚动测试' }
])

// 动态内容
const contentItems = ref<ContentItem[]>([])
let contentIndex = 0

// 事件处理
const handleCollapseChange = (value: boolean): void => {
  collapse.value = value
}

const handleLogoClick = (): void => {
  console.log('Logo 被点击')
}

const handleMenuSelect = (index: string): void => {
  activeMenu.value = index
}

const handleTabRemove = (targetName: string): void => {
  const index = tabs.findIndex(tab => tab.name === targetName)
  if (index > -1) {
    tabs.splice(index, 1)
  }
}

const toggleLayout = (): void => {
  const layouts: Array<'side' | 'top' | 'mix'> = ['side', 'top', 'mix']
  const currentIndex = layouts.indexOf(layout.value)
  layout.value = layouts[(currentIndex + 1) % layouts.length]
}

const toggleTabs = (): void => {
  showTabs.value = !showTabs.value
}

const toggleSidebar = (): void => {
  showSidebar.value = !showSidebar.value
}

const addContent = (): void => {
  contentIndex++
  contentItems.value.push({
    title: `内容项 ${contentIndex}`,
    content: `这是第 ${contentIndex} 个内容项。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    type: 'normal',
    timestamp: new Date().toLocaleTimeString()
  })
}

const addLongContent = (): void => {
  contentIndex++
  contentItems.value.push({
    title: `长内容项 ${contentIndex}`,
    content: `这是一个长内容项，包含大量文本用于测试滚动效果。${'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10)}`,
    type: 'long',
    timestamp: new Date().toLocaleTimeString()
  })
}

const clearContent = (): void => {
  contentItems.value = []
  contentIndex = 0
}

// 初始化一些内容
onMounted(() => {
  for (let i = 0; i < 5; i++) {
    addContent()
  }
})
</script>

<style lang="scss" scoped>
.scroll-test-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .test-controls {
      display: flex;
      gap: 8px;
    }
  }

  .test-info {
    margin-bottom: 20px;
  }

  .dynamic-content {
    .content-item {
      margin-bottom: 20px;
      padding: 16px;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      background: #fafafa;

      h3 {
        margin: 0 0 8px 0;
        color: #1890ff;
      }

      p {
        margin: 0 0 12px 0;
        line-height: 1.6;
        color: #666;
      }

      .content-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .timestamp {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .fixed-bottom-info {
    margin-top: 20px;
    position: sticky;
    bottom: 0;
    background: #fff;
    border-top: 1px solid #e8e8e8;
    padding: 16px 0;

    ul {
      margin: 8px 0 0 0;
      padding-left: 20px;

      li {
        margin: 4px 0;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
