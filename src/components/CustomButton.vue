<template>
  <component :is="h(ElButton, { ...$attrs, ...props, ref: changeRef }, $slots)"></component>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";

const props = defineProps({});

const vm = getCurrentInstance();

/**
 * @param {Record<string, any> | null} instance
 */
const changeRef = (instance) => {
  vm.exposed = vm.exposeProxy = instance || {};
}

</script>

<style scoped lang="scss">

</style>