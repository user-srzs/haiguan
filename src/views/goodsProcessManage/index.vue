<script setup lang="ts" name="addressManage">
import { Plus } from "@element-plus/icons-vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import type { Node, Edge } from "@vue-flow/core";
import {Background} from "@vue-flow/background";
const { addEdges } = useVueFlow();
interface TabItem {
  label: string;
  name: string;
}
// 右侧header， tab列表
const tabList = reactive<TabItem[]>([
  {
    label: '进港流程',
    name: 'enter'
  },
  {
    label: '出港流程',
    name: 'out'
  }
]);
// 当前激活的tab
const activeTab = ref<string>(tabList[0].name);
// 切换tab
const changeTab = (item: TabItem) => {
  activeTab.value = item.name;
};

// 节点
const nodes = ref<Node[]>([
  { id: 1, type: 'input', label: 'Node1', position: { x: 250, y: 5} },
  { id: 2, type: 'input2', label: 'Node2', position: { x: 100, y: 100} },
  { id: 3, type: 'input3', label: 'Node3', position: { x: 400, y: 100} },
])
//
const edges = ref<Edge[]>([
  {id: 1, source: 1, target: '2'},
  {id: 2, source: 2, target: '2'},
]);



</script>

<template>
  <div class="container">
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <span class="title">地址列表</span>
          <!--          <el-link icon="Plus" :underline="false">添加根节点</el-link>-->
          <span class="right" @click="addRootNode">
            <el-icon><Plus /></el-icon>
            <span>添加根节点</span>
          </span>
        </div>
      </template>
      <template #default>
        test
      </template>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="header-tabs">
          <div
            v-for="item in tabList"
            :key="item.name"
            :class="['tab-item', { 'active': activeTab === item.name }]"
            @click="changeTab(item)"
          >{{ item.label }}</div>
        </div>
      </template>
      <template #default>
        <!-- 进港流程 -->
        <template v-if="activeTab === 'enter'">
          <VueFlow v-model:nodes="nodes" v-model:edges="edges">
            <Background></Background>
            <template #node-custom="{ node }"></template>
            <template #edge-custom="{ node }"></template>
          </VueFlow>
        </template>
        <!-- 出港流程 -->
        <template v-if="activeTab === 'out'">
          <VueFlow></VueFlow>
        </template>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
@mixin flex($display: flex, $direction: row, $align: center, $justify: center) {
  display: flex;
  flex-direction: $direction;
  align-items: $align;
  justify-content: $justify;
}
.container {
  height: calc(100vh - 24px);
  display: grid;
  grid-template-columns: minmax(300px, 20%) minmax(0, auto);
  gap: 12px;
}

.el-card {
  border: unset;
  border-radius: 6px;
  :deep(.el-card__header) {
    padding: 0;
  }
}

.header {
  box-sizing: border-box;
  width: 100%;
  height: 62px;
  padding: 0 20px;
  @include flex($display: inline-flex, $justify: space-between);
  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    color: rgba(22, 19, 19, 0.8);
  }
  .right {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
  }
}

.el-link {
  &:not(:last-child) {
    margin-right: 14px;
  }
}

.el-form {
  margin: 10px 20px;
}

.header-tabs {
  height: 62px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  place-items: stretch stretch;
  .tab-item {
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    color: rgba(22, 19, 19, 0.8);
    @include flex($display: flex);
    cursor: pointer;
    &:not(:last-child) {
      border-right: 1px solid #ccc;
    }
  }
  .active {
    background: var(--el-color-primary);
    color: white;
  }
}
</style>
