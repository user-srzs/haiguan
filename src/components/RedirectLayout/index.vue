<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';

  defineOptions({ name: 'RedirectLayout' });

  const { replace } = useRouter();
  const { params, query } = useRoute();

  const from = Array.isArray(params.path) ? params.path.join('/') : params.path;

  setTimeout(() => {
    replace({ path: '/' + from, query });
  }, 100);
</script>

<!-- 路由刷新页面 -->
<template>
  <div></div>
</template>