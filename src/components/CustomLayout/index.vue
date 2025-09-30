<script setup lang="ts">
  const isLogoHeader = ref(true);
</script>

<template>
  <div :class="['layout', { 'is-row-direction': !isLogoHeader }]">
      <!-- Header -->
      <div class="layout-header is-fixed">
        <!-- Header Left Slot -->
        <div v-if="$slots['header-left']" class="header-left">
          <slot name="header-left"></slot>
        </div>
        <!-- Header Breadcrumb -->
        <div class="header-breadcrumb">
          <slot name="header-breadcrumb"></slot>
        </div>
        <!-- Header Menus -->
        <div class="header-menus"></div>
        <!-- Header Right Slot -->
        <div v-if="$slots['header-right']" class="header-right">
          <slot name="header-right"></slot>
        </div>
      </div>
      <!-- Main -->
      <div class="layout-main is-row-direction">
        <!-- Sidebar -->
        <div class="layout-sidebar show-placeholder is-fixed">
          <el-dropdown>
            Default
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Action 1</el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
                <el-dropdown-item disabled>Action 4</el-dropdown-item>
                <el-dropdown-item divided>Action 5</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="layout-body">
          <div class="layout-tabs-wrapper"></div>
          <!-- Main Center slot -->
          <div class="layout-content-wrapper">
            <div class="layout-page">
              <slot name="default"></slot>
            </div>
            <div v-if="$slots['layout-footer']" class="layout-footer">
              <slot name="layout-footer"></slot>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped lang="scss">
  .layout {
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: max-content;
    min-height: 100vh; // 向下兼容性处理
    min-height: 100dvh;
    z-index: 1000;
    &.is-row-direction {
      flex-direction: row;
    }
  }
  .layout-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 60px;
    //background-color: var(--el-color-primary);
    background: #ffffff;
    //box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    box-shadow: 0 -.8px 0 #f0f0f0 inset;
    transition: all 0.3s;
    z-index: 1004;
    /* 固定顶栏 */
    &.is-fixed {
      position: sticky;
      top: 0;
    }

    .header-menus {
      flex: 1;
    }
  }
  .layout-main {
    flex: auto;
    display: flex;
    flex-direction: column;
    &.is-row-direction {
      flex-direction: row;
    }
  }
  .layout-sidebar {
    width: 240px;
    background: #ffffff;
    box-shadow: 1px 0 3px rgba(0, 21, 41, .08);
    transition: all 0.3s;
    z-index: 1003;
    &.show-placeholder {
      margin-top: 60px;
    }
    &.is-fixed {
      position: sticky;
      top: 0;
      left: 0;
      height: 100vh;
      height: 100dvh;
    }
    .layout-sidebar-box {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding-top: 60px;
      position: relative;
      .layout-menus {
        flex: 1;
        position: relative;
        height: 100%;
      }
    }

  }
  .layout-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    &.is-row-direction {
      flex-direction: row;
    }
    .layout-tabs-wrapper {
      height: 40px;
      box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
      &.is-fixed {
        position: sticky;
        top: 60px;
      }
    }
    .layout-content-wrapper {
      position: relative;
      flex: auto;
      display: flex;
      flex-direction: column;
      background: #F2F3F4;
      .layout-page {
        flex: auto;
      }
      .layout-footer {
        padding: 16px 0;
        text-align: center;
      }
    }
  }
</style>