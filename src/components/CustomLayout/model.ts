/**
 * 布局组件相关类型定义
 */

// 菜单项类型
export interface MenuItem {
  id: string
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
  }
}

// 标签页类型
export interface TabItem {
  id: string
  title: string
  path: string
  closable?: boolean
  active?: boolean
}

// 面包屑类型
export interface BreadcrumbItem {
  title: string
  path?: string
  icon?: string
}

// 用户信息类型
export interface UserInfo {
  id: string
  name: string
  avatar?: string
  role?: string
  department?: string
}

// 布局配置类型
export interface LayoutConfig {
  sidebarCollapsed: boolean
  showBreadcrumb: boolean
  showTabs: boolean
  theme: 'light' | 'dark'
  sidebarWidth: number
  collapsedSidebarWidth: number
}

// 布局组件 Props 类型
export interface CustomLayoutProps {
  menus?: MenuItem[]
  userInfo?: UserInfo
  config?: Partial<LayoutConfig>
}

// 布局组件 Emits 类型
export interface CustomLayoutEmits {
  (e: 'update:config', config: LayoutConfig): void
  (e: 'menu-click', menu: MenuItem): void
  (e: 'tab-close', tab: TabItem): void
  (e: 'tab-click', tab: TabItem): void
  (e: 'user-action', action: string): void
}
