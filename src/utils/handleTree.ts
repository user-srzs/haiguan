import type { MenuItem } from '@/router/model.ts';
import type { TreeNode, FindTreeResult, RouteComponentResult } from './model.ts';
import type { RouteMeta, RouteRecordRaw } from 'vue-router';

/**
 * 递归处理树形结构数据
 * @param data 树形数据数组
 * @param callback 对每个节点执行的回调函数
 * @param childrenField 子节点字段名，默认为 "children"
 * @param parent 父节点（用于递归调用）
 */
export function eachTree<T = TreeNode>(
  data: T[] | undefined,
  callback?: (item: T, index: number, parent?: T) => (void | boolean),
  childrenField: string = "children",
  parent?: T
): void {
  if(!data?.length) return;
  data.forEach((item: T, index: number): void => {
    const shouldRecurse: boolean = callback?.(item, index, parent) !== false;
    const children: T[] | undefined = (item as any)[childrenField] as T[] | undefined;
    if (shouldRecurse && children?.length) {
      eachTree(children, callback, childrenField, item);
    }
  })
}

/**
 * 移除路径中的查询参数，返回纯净的路由路径
 * @param path  - 可能包含查询参数的路径
 * @returns 不包含查询参数的路径
 */
export function getRoutePath(path: string | undefined | null): string | undefined | null {
  if (!path || !path.includes("?")) return path;
  return path.substring(0, path.indexOf("?"));
}

/**
 * 判断给定的URL是否为外部链接
 * @param url - 要检查的URL
 * @returns 如果是外部链接返回true，否则返回false
 */
export function isExternalLink(url: string | undefined | null): boolean {
  if (!url) return false;
  const externalProtocols = ["http://", "https://", "//"];
  return externalProtocols.some(protocol => url.startsWith(protocol));
}

/**
 * 检查给定路径是否已在数据中存在
 * @param path - 要检查的路径
 * @param data - 已存在路径的数据
 * @returns 如果路径已存在返回true，否则返回false
 */
export function pathIsAdd(path: string, data: Array<{ path: string }>): boolean {
  const result: FindTreeResult<{ path: string }> | null = findTree<{ path: string }>(path, data, 'path');
  return result !== null;
}

/**
 * 将字符串转换为驼峰命名格式（首字母大写）
 * @param str - 要转换的字符串
 * @returns 驼峰命名的字符串
 */
export function pascalCase(str: string): string {
  if (!str) return "";
  return str
    .split(/[-|/]/)
    .filter(segment => segment.length > 0)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("")
}

/**
 * 获取路由组件，如果是外部链接则不返回组件
 * @param menu - 菜单项
 * @param name - 路由名称
 * @param componentGetter - 获取组件的函数
 * @returns 包含组件的对象或空对象
 */
export function getRouteComponent(
  menu: MenuItem,
  name: string,
  componentGetter: (component: string | undefined, menu: MenuItem, name: string) => any
): RouteComponentResult {
  if (!menu.component || isExternalLink(menu.component)) {
    return {}
  }
  return  { component: componentGetter(menu.component, menu, name) };
}

/**
 * 将菜单数据转换为路由配置
 * @param menus 菜单数据数组
 * @param getComponent 获取组件的函数
 * @param added 已添加的路由路径记录
 * @returns 路由配置数组
 */
export function menuToRoutes(
  menus?: MenuItem[] | null | undefined,
  getComponent?: (item: MenuItem, name: string) => { component?: any; },
  added: Array<{ path: string }> = []
): RouteRecordRaw[] | undefined {
  if(!menus?.length) return undefined;
  const routes: RouteRecordRaw[] = [];
  const addedRoutes: Array<{ path: string }> = !!added?.length ? [...added] : [];

  for(const item of menus) {
    const meta: RouteMeta = { ...item.meta };
    const path: string | undefined | null = getRoutePath(meta.routePath || item.path);
    // 跳过无效路径、外部链接或已添加的路径
    if(!path || isExternalLink(path) || pathIsAdd(path, addedRoutes)) {
      continue;
    }
    const name = item.name || pascalCase(path);
    const { component } = getRouteComponent(item, name, getComponent);

    addedRoutes.push({ path });

    const route: RouteRecordRaw = {
      name,
      path,
      component,
      redirect: item.redirect,
      meta,
      children: menuToRoutes(item.children, getComponent, addedRoutes)
    }
    routes.push(route)
  }
  return routes.length > 0 ? routes : undefined;
}

/**
 *
 * @param data 树形数据数组
 * @param formatter 节点格式化函数
 * @param childrenField 输入数据的子节点字段名（默认"children"）
 * @param resultChildrenField 输出数据的子节点字段名（默认"children"）
 * @param parent 父节点（内部递归使用）
 */
export function mapTree<T = TreeNode, R = TreeNode>(
  data: T[] | undefined,
  formatter:  (node: T, index: number, parent?: R) => R | null | undefined,
  childrenField: string = "children",
  resultChildrenField: string = "children",
  parent?: R
): R[] {
  if (!data?.length) return [];
  return data.map((node: T, index: number): R | null => {
    const formattedNode: R | null | undefined = formatter(node, index, parent);
    if (!formattedNode) return null;
    const children: T[] | undefined = (node as any)[childrenField] as T[] | undefined;
    if(children?.length) {
      (formattedNode as any)[resultChildrenField] = mapTree(
        children,
        formatter,
        childrenField,
        resultChildrenField,
        formattedNode
      )
    }
    return formattedNode;
  }).filter((node: R | null): node is R => node !== null);
}



/**
 * 查找节点(深度优先)
 * @param key 节点id
 * @param tree 树形数据
 * @param findField 查找字段名
 */
export function findTree<T extends TreeNode>(
  key: string | number,
  tree: T[],
  findField: string = "id",
): null | FindTreeResult<T> {
  if (!key || !tree?.length) return null; // 查找id or 树为空，直接返回null
  const searchPath: T[] = [];
  const stack: T[] = [...(Array.isArray(tree) ? tree : [tree])]; //  统一为数组
  // 初始化路径栈，根节点的路径就是它们自己
  const pathStack: T[][] = stack.map((node: T) => [node]);
  let result: FindTreeResult<T> | null = null;
  while (stack.length) {
    const node: T = stack.pop() as T; // 取出最后一个元素节点
    const currentPath: T[] = pathStack.pop() as T[];
    searchPath.push(node); // 记录所有访问路径(记录遍历查找过的所有节点)
    if (node[findField] === key) {
      result = { node, searchPath, currentPath }; // 赋值找到的节点和路径给result
      break;
    }
    if (!!node?.children?.length) {
      node.children.forEach((item: T): void => {
        stack.unshift(item); // 将children内的节点数组从头插入至stack
        pathStack.unshift([...currentPath, item]);
      });
    }
  }
  return result; // 返回找到的节点和路径，如果未找到节点，默认返回null
}

/**
 * 构建树形结构
 * @param data list
 * @param idField id字段名
 * @param parentIdField 父id字段名
 */
export function buildTree(
  data: TreeNode[],
  idField: string = "id",
  parentIdField: string = "parentId"
): TreeNode[] {
  const map: Record<string | number, TreeNode> = {};
  const roots: TreeNode[] = [];
  // 创建映射表
  data.forEach((item: TreeNode) => {
    map[item[idField]] = { ...item, children: null }; // 用id为key，节点为value，序列化列表
  });
  // 构建树形结构
  data.forEach((item: TreeNode) => {
    const node: TreeNode = map[item[idField]]; // 先获取节点
    if (!item[parentIdField] || !map[item[parentIdField]]) {
      // 没有父id or 找不到父节点，则该节点为根节点
      roots.push(node);
      return;
    }
    // 希望当父节点没有子节点时，children为null，而不是一个空数组[]
    if (
      !map[item[parentIdField]].children ||
      !map[item[parentIdField]].children?.length
    ) {
      // 如果父节点的children不存在 or 为null(不是一个数组)，
      map[item[parentIdField]].children = [node]; // 则创建一个children数组，并添加该节点，作为第一个元素 (第一次添加子节点)
      return;
    }
    map[item[parentIdField]].children?.push(node); // 否则，将该节点添加到父节点的children数组中(后续添加子节点)
  });
  // 清理空children数组
  // const cleanTree = (nodes: TreeNode[]): TreeNode[] => {
  //   return nodes.map(node => {
  //     const cleanedNode = { ...node };
  //
  //     if (cleanedNode.children?.length === 0) {
  //       delete cleanedNode.children;
  //     } else if (cleanedNode.children) {
  //       cleanedNode.children = cleanTree(cleanedNode.children);
  //     }
  //
  //     return cleanedNode;
  //   });
  // };
  return roots;
}

/**
 * 树形结构扁平化
 * @param data - 树形数据或数组
 * @param childrenField - 自定义子节点字段名，默认为 "children"
 */
export function flattenTree<T extends TreeNode>(
  data: T[] | T,
  childrenField: string = "children"
): T[] {
  const result:T[] = [];
  const stack: T[] = [...(Array.isArray(data) ? data : [data])]; // 统一为数组
  while (stack.length) {
    const node: T = stack.pop() as T; // 取出最后一个元素节点
    const { [childrenField]: children, ...rest} = node;
    result.push(rest as T); // 将当前节点添加到结果中，排除children，避免循环引用
    if (!!children?.length) {
      // children.forEach(item => stack.push(item)); // 将children内的节点数组从尾插入至stack，倒序 --> 跟原来的顺序相反
      children.forEach((item) => stack.unshift(item as T)); // 将children内的节点数组从头插入至stack，顺序 --> 跟原来的顺序一致
    }
  }
  return result;
}