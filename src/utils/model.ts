import { MenuItem } from '@/router/model.ts';
import { RouteComponent } from 'vue-router';

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

export type GetComponent = (component?: string, menu?: MenuItem, name?: string) => (() => Promise<RouteComponent>) | RouteComponent | undefined;

