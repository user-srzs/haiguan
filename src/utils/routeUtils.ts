/**
 * 路由工具函数
 */
import type { MenuItem } from '@/router/model.ts';
// HOME_PATH 已移除，使用传入的 homePath 参数

// 面包屑项接口
export interface BreadcrumbItem {
  path: string;
  title: string;
  icon?: string;
}


/**
 * 过滤菜单项，移除仅包含重定向的子菜单
 * @param menuItems 菜单项数组
 * @returns 过滤后的菜单项数组
 */
export function filterMenuItems(menuItems: MenuItem[]): MenuItem[] {
  return menuItems
    .filter(item => {
      // 过滤掉隐藏的菜单
      if (item.meta?.hide) {
        return false;
      }
      
      // 不过滤有重定向的菜单项，因为这是正常的菜单结构
      return true;
    })
    .map(item => ({
      ...item,
      children: item.children ? filterMenuItems(item.children) : undefined
    }));
}

/**
 * 生成面包屑
 * @param currentPath 当前路径
 * @param menuItems 菜单项数组
 * @param homePath 首页路径，默认为 '/'
 * @returns 面包屑数组
 */
export function generateBreadcrumbs(
  currentPath: string, 
  menuItems: MenuItem[],
  homePath: string = '/'
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // 添加首页
  breadcrumbs.push({
    path: homePath,
    title: '首页',
    icon: 'House'
  });
  
  // 如果当前路径就是首页，直接返回
  if (currentPath === homePath) {
    return breadcrumbs;
  }
  
  // 递归查找当前路径对应的菜单项
  function findMenuItem(path: string, items: MenuItem[]): MenuItem | null {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = findMenuItem(path, item.children);
        if (found) return found;
      }
    }
    return null;
  }
  
  // 递归构建面包屑路径，处理重定向
  function buildBreadcrumbPath(path: string, items: MenuItem[]): string[] {
    const pathSegments: string[] = [];
    
    for (const item of items) {
      // 直接匹配路径
      if (item.path === path) {
        pathSegments.push(item.path);
        return pathSegments;
      }
      
      // 检查重定向
      if (item.redirect === path) {
        // 如果当前路径是重定向目标，只添加重定向目标路径，不添加父路径
        pathSegments.push(path);
        return pathSegments;
      }
      
      // 递归查找子菜单
      if (item.children) {
        const childPath = buildBreadcrumbPath(path, item.children);
        if (childPath.length > 0) {
          // 只有当父菜单不是重定向菜单时才添加父路径
          if (!item.redirect || item.redirect !== path) {
            pathSegments.push(item.path);
          }
          pathSegments.push(...childPath);
          return pathSegments;
        }
      }
    }
    
    return pathSegments;
  }
  
  const pathSegments = buildBreadcrumbPath(currentPath, menuItems);
  
  // 为每个路径段生成面包屑项，去重
  const addedPaths = new Set<string>();
  for (const segment of pathSegments) {
    if (!addedPaths.has(segment)) {
      const menuItem = findMenuItem(segment, menuItems);
      if (menuItem && menuItem.meta?.title) {
        breadcrumbs.push({
          path: menuItem.path,
          title: menuItem.meta.title,
          icon: menuItem.meta.icon
        });
        addedPaths.add(segment);
      }
    }
  }
  
  return breadcrumbs;
}

/**
 * 获取激活的菜单路径
 * @param currentPath 当前路径
 * @param menuItems 菜单项数组
 * @returns 激活的菜单路径
 */
export function getActiveMenuPath(
  currentPath: string, 
  menuItems: MenuItem[]
): string[] {
  const activePath: string[] = [];
  
  function findActivePath(path: string, items: MenuItem[]): boolean {
    for (const item of items) {
      if (item.path === path) {
        activePath.push(item.path);
        return true;
      }
      
      if (item.children) {
        activePath.push(item.path);
        if (findActivePath(path, item.children)) {
          return true;
        }
        activePath.pop();
      }
    }
    return false;
  }
  
  findActivePath(currentPath, menuItems);
  return activePath;
}

/**
 * 检查路径是否匹配（支持动态路由）
 * @param currentPath 当前路径
 * @param menuPath 菜单路径
 * @returns 是否匹配
 */
export function isPathMatch(currentPath: string, menuPath: string): boolean {
  // 完全匹配
  if (currentPath === menuPath) {
    return true;
  }
  
  // 检查是否是子路径
  return currentPath.startsWith(menuPath + '/');
  

}