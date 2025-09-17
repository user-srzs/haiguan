// 是否有权限
const hasPermission = (route: any, roles: string[] | undefined) => {
  if (route.meta && route.meta.roles) {
    return roles?.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
};

// 递归过滤没有权限的路由
export const filterAsyncRoutes = (
  routes: any[],
  roles: string[] | undefined
) => {
  const filterRoutes: any[] = [];
  for (const route of routes) {
    if (hasPermission(route, roles)) {
      const temp: any = { ...route };
      if (temp.children) {
        //递归过滤子路由
        temp.children = filterAsyncRoutes(temp.children, roles);
      }
      filterRoutes.push(temp);
    }
  }
  return filterRoutes;
};
