import type { RouteRecordNormalized } from 'vue-router'

// 路由菜单项接口
export interface MenuItem {
  path: string
  name?: string
  title?: string
  icon?: string
  children?: MenuItem[]
  redirect?: string
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
  }
}

// 面包屑项接口
export interface BreadcrumbItem {
  path: string
  title: string
  icon?: string
}

/**
 * 检查路由是否应该被过滤（仅包含重定向的子路由）
 * @param route 路由对象
 * @returns 是否应该被过滤
 */
export function shouldFilterRoute(route: RouteRecordNormalized): boolean {
  // 如果没有子路由，不过滤
  if (!route.children || route.children.length === 0) {
    return false
  }
  
  // 如果子路由数量大于1，不过滤
  if (route.children.length > 1) {
    return false
  }
  
  // 如果只有一个子路由，检查是否是重定向路由
  const child = route.children[0]
  return child.path === route.redirect
}

/**
 * 过滤路由，排除仅包含重定向的子路由
 * @param routes 路由数组
 * @returns 过滤后的路由数组
 */
export function filterRoutes(routes: RouteRecordNormalized[]): RouteRecordNormalized[] {
  return routes.filter(route => {
    // 过滤掉隐藏的路由
    if (route.meta?.hidden) {
      return false
    }
    
    // 过滤掉仅包含重定向的子路由
    if (shouldFilterRoute(route)) {
      return false
    }
    
    // 递归过滤子路由
    if (route.children && route.children.length > 0) {
      route.children = filterRoutes(route.children)
    }
    
    return true
  })
}

/**
 * 将Vue Router路由转换为菜单项
 * @param routes 路由数组
 * @returns 菜单项数组
 */
export function routesToMenuItems(routes: RouteRecordNormalized[]): MenuItem[] {
  return routes.map(route => ({
    path: route.path,
    name: route.name as string,
    title: route.meta?.title || route.name as string,
    icon: route.meta?.icon,
    children: route.children && route.children.length > 0 
      ? routesToMenuItems(route.children) 
      : undefined,
    redirect: route.redirect as string,
    meta: route.meta
  }))
}

/**
 * 根据当前路径生成面包屑
 * @param currentPath 当前路径
 * @param routes 路由配置
 * @param homePath 首页路径
 * @returns 面包屑数组
 */
export function generateBreadcrumbs(
  currentPath: string, 
  routes: RouteRecordNormalized[], 
  homePath: string = '/home'
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []
  
  // 添加首页
  breadcrumbs.push({
    path: homePath,
    title: '首页',
    icon: 'House'
  })
  
  // 如果当前路径就是首页，直接返回
  if (currentPath === homePath) {
    return breadcrumbs
  }
  
  // 递归查找当前路径在路由树中的位置
  function findPathInRoutes(
    targetPath: string, 
    routes: RouteRecordNormalized[], 
    parentPath: string = ''
  ): BreadcrumbItem[] {
    for (const route of routes) {
      const fullPath = parentPath + route.path
      
      // 如果找到匹配的路由
      if (fullPath === targetPath || route.path === targetPath) {
        return [{
          path: fullPath,
          title: route.meta?.title || route.name as string || '未知页面',
          icon: route.meta?.icon
        }]
      }
      
      // 如果有子路由，递归查找
      if (route.children && route.children.length > 0) {
        const childResult = findPathInRoutes(targetPath, route.children, fullPath)
        if (childResult.length > 0) {
          // 添加当前路由到面包屑
          const currentBreadcrumb = {
            path: fullPath,
            title: route.meta?.title || route.name as string || '未知页面',
            icon: route.meta?.icon
          }
          return [currentBreadcrumb, ...childResult]
        }
      }
    }
    return []
  }
  
  // 查找路径
  const pathBreadcrumbs = findPathInRoutes(currentPath, routes)
  breadcrumbs.push(...pathBreadcrumbs)
  
  return breadcrumbs
}

/**
 * 获取当前激活的菜单项路径
 * @param currentPath 当前路径
 * @param routes 路由配置
 * @returns 激活的菜单路径
 */
export function getActiveMenuPath(
  currentPath: string, 
  routes: RouteRecordNormalized[]
): string {
  // 递归查找最匹配的菜单路径
  function findActivePath(
    targetPath: string, 
    routes: RouteRecordNormalized[], 
    parentPath: string = ''
  ): string {
    for (const route of routes) {
      const fullPath = parentPath + route.path
      
      // 如果完全匹配
      if (fullPath === targetPath || route.path === targetPath) {
        return fullPath
      }
      
      // 如果当前路径以这个路由开头，继续在子路由中查找
      if (targetPath.startsWith(fullPath + '/') || targetPath.startsWith(route.path + '/')) {
        if (route.children && route.children.length > 0) {
          const childResult = findActivePath(targetPath, route.children, fullPath)
          if (childResult) {
            return childResult
          }
        }
        // 如果没有子路由匹配，返回当前路由
        return fullPath
      }
    }
    return ''
  }
  
  return findActivePath(currentPath, routes)
}
