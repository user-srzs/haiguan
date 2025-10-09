# 自定义VueFlow组件

这是一个基于vue-flow插件的自定义流程图组件，支持拖拽创建节点、右键菜单操作等功能。

## 功能特性

- ✅ 左侧操作栏拖拽创建节点
- ✅ 支持4种自定义节点类型：
  - 开始节点（圆形）
  - 结束节点（圆形）
  - 普通节点（带圆角的矩形）
  - 判断节点（菱形）
- ✅ 右键菜单功能：
  - 编辑文本
  - 复制节点
  - 删除节点
- ✅ 节点拖拽和连接
- ✅ 响应式设计

## 使用方法

```vue
<template>
  <div style="height: 100vh;">
    <CustomFlow />
  </div>
</template>

<script setup>
import CustomFlow from '@/components/custom-flow/index.vue'
</script>
```

## 新特性

### 浮动工具栏
- 工具栏现在固定在VueFlow画布的左上角
- 采用毛玻璃效果和阴影设计
- 支持滚动，当节点较多时不会超出屏幕
- 半透明背景，不会遮挡画布内容

### 拖拽功能
- 从工具栏拖拽节点到画布任意位置
- 支持点击工具栏节点在画布中心创建
- 拖拽时显示正确的鼠标指针

## 组件结构

```
custom-flow/
├── index.vue              # 主组件
├── components/            # 子组件
│   ├── Sidebar.vue        # 左侧操作栏
│   ├── ContextMenu.vue    # 右键菜单
│   └── EditDialog.vue     # 编辑对话框
├── nodes/                 # 自定义节点
│   ├── StartNode.vue      # 开始节点
│   ├── EndNode.vue        # 结束节点
│   ├── NormalNode.vue     # 普通节点
│   └── DecisionNode.vue   # 判断节点
└── README.md
```

## 节点类型

### 开始节点
- 类型：`start`
- 形状：圆形
- 默认文本：开始

### 结束节点
- 类型：`end`
- 形状：圆形（双环）
- 默认文本：结束

### 普通节点
- 类型：`userTask` 或 `systemTask`
- 形状：带圆角的矩形
- 默认文本：用户任务/系统任务

### 判断节点
- 类型：`decision`
- 形状：菱形
- 默认文本：判断

## 操作说明

1. **创建节点**：从左侧操作栏拖拽节点到画布，或点击节点在画布中心创建
2. **编辑节点**：右键点击节点选择"编辑文本"
3. **复制节点**：右键点击节点选择"复制"
4. **删除节点**：右键点击节点选择"删除"
5. **连接节点**：拖拽节点边缘的连接点创建连接线

## 样式自定义

组件使用SCSS编写样式，支持主题色自定义：

```scss
// 主要颜色变量
$primary-color: #3b82f6;
$background-color: #f8fafc;
$border-color: #e2e8f0;
```
