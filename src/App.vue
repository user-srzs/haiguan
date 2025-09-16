<script setup lang="ts" name="App">
import { useLocale } from "@/i18n/use-locale";

/** 国际化配置 */
const { elLocale } = useLocale();

// 设置根元素字体大小
const setRootFontSize = () => {
  // 假设设计稿为 1920px，此时 1rem = 14px
  const scale = document.documentElement.clientWidth / 1920;
  const fontSize = scale * 14;
  document.documentElement.style.fontSize = fontSize + 'px';
}

// 挂载完成执行
onMounted(() => {
  setRootFontSize();
  window.addEventListener('resize', setRootFontSize);
});

// 卸载之后执行
onUnmounted(() => {
  window.removeEventListener('resize', setRootFontSize);
});
</script>

<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>
