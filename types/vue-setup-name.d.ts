declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 添加对 name 属性的支持
interface ScriptSetupOptions {
  name?: string;
}

// vue-setup-name.d.ts
declare module "vue" {
  interface HTMLAttributes {
    // 告知 TypeScript 和 WebStorm，<script setup> 标签上允许有 name 属性
    name?: string;
    // 如果 inheritAttrs 也报错，可以同样声明
    // inheritAttrs?: boolean;
  }
}

// 或者尝试另一种模块声明方式
declare namespace JSX {
  interface IntrinsicAttributes {
    name?: string;
  }
}
