/**
 * 路由工具函数
 */
import type { MenuItem } from '@/router/model.ts';
import { HOME_PATH } from '@/config/seeting.ts';

// 面包屑项接口
export interface BreadcrumbItem {
  path: string;
  title: string;
  icon?: string;
}

/**
 * 判断菜单项是否应该被过滤（仅包含重定向的子菜单）
 * @param menuItem 菜单项
 * @returns 是否应该过滤
 */
function shouldFilterMenuItem(menuItem: MenuItem): boolean {
  // 如果没有子菜单，不过滤
  if (!menuItem.children || menuItem.children.length === 0) {
    return false;
  }
  
  // 如果只有一个子菜单且是重定向菜单，则过滤掉
  if (menuItem.children.length === 1) {
    const child = menuItem.children[0];
    if (child.path === menuItem.redirect) {
      return true;
    }
  }
  
  return false;
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
      
      // 过滤掉仅包含重定向的子菜单
      return !shouldFilterMenuItem(item);
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
 * @returns 面包屑数组
 */
export function generateBreadcrumbs(
  currentPath: string, 
  menuItems: MenuItem[]
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // 添加首页
  breadcrumbs.push({
    path: HOME_PATH,
    title: '首页',
    icon: 'House'
  });
  
  // 如果当前路径就是首页，直接返回
  if (currentPath === HOME_PATH) {
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
  
  // 递归构建面包屑路径
  function buildBreadcrumbPath(path: string, items: MenuItem[]): string[] {
    const pathSegments: string[] = [];
    
    for (const item of items) {
      if (item.path === path) {
        pathSegments.push(item.path);
        return pathSegments;
      }
      
      if (item.children) {
        const childPath = buildBreadcrumbPath(path, item.children);
        if (childPath.length > 0) {
          pathSegments.push(item.path);
          pathSegments.push(...childPath);
          return pathSegments;
        }
      }
    }
    
    return pathSegments;
  }
  
  const pathSegments = buildBreadcrumbPath(currentPath, menuItems);
  
  // 为每个路径段生成面包屑项
  for (const segment of pathSegments) {
    const menuItem = findMenuItem(segment, menuItems);
    if (menuItem && menuItem.meta?.title) {
      breadcrumbs.push({
        path: menuItem.path,
        title: menuItem.meta.title,
        icon: menuItem.meta.icon
      });
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
  if (currentPath.startsWith(menuPath + '/')) {
    return true;
  }
  
  return false;
}