<script setup lang="ts">
  import CustomLayout from "@/components/CustomLayout/index.vue"
</script>

<template>
  <custom-layout>
    <router-view />
    <template #header-left>
      <el-button>按钮1</el-button>
    </template>
    <template #header-content>
      <el-button>按钮3444</el-button>
    </template>
    <template #header-right>
      <el-button>按钮2</el-button>
    </template>
  </custom-layout>
</template>

<style scoped lang="scss">

</style>
