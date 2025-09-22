<script setup lang="ts">
  import { Panel, VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';

</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges">
    <Background></Background>
    <panel>
      <el-button type="primary" @click="createFlowNode">添加节点</el-button>
    </panel>
    <template #node-custom="{ node }"></template>
    <template #edge-custom="{ node }"></template>
  </VueFlow>
</template>

<style scoped lang="scss">

</style>