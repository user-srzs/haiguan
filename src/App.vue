<script setup lang="ts" name="App">
  import {useLocale} from "./i18n/use-locale.ts";

  /** 国际化配置 */
  const { elLocale } = useLocale();
</script>

<template>
  <el-config-provider :locale="elLocale">

  </el-config-provider>
</template>

<style scoped>
</style>
