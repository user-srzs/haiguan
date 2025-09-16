export interface TreeNode {
  [key: string]: any;
  id?: string | number;
  parentId?: string | number;
  children?: TreeNode[] | null;
}

export interface FindTreeResult<T extends TreeNode> {
  node: T;
  searchPath: Array<T>;
  currentPath: Array<T>;
}

export interface RouteComponentResult {
  component?: any;
}