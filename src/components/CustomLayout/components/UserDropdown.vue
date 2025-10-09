<script setup lang="ts">
  import { ArrowDownBold, SwitchButton, User } from '@element-plus/icons-vue';
  import { useUserStore } from '@/stores/modules/user.ts';
  import { logout } from '@/utils';
  const userStore = useUserStore();
  const userInfo = userStore.user;
  const { push } = useRouter();

  defineProps({
    collapse: {
      type: Boolean,
      default: false
    }
  })

  const handleUserAction = (command: string) => {
    if (command === 'logout') {
      handleLogout();
      return;
    }
  }

  const handleLogout = () => {
    logout(true, void 0, push);
  }
</script>

<template>
  <el-dropdown @command="handleUserAction" class="user-dropdown" trigger="click">
    <div class="user-info">
      <el-avatar
        :size="32"
        :src="userInfo?.avatar"
        class="user-avatar"
      >
        <el-icon><User /></el-icon>
      </el-avatar>
      <div class="user-details" v-if="!collapse">
        <div class="user-name">{{ userInfo?.username || '用户名' }}</div>
      </div>
      <el-icon><ArrowDownBold /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
<!--        <el-dropdown-item command="profile">-->
<!--          <el-icon><User /></el-icon>-->
<!--          个人资料-->
<!--        </el-dropdown-item>-->
<!--        <el-dropdown-item command="settings">-->
<!--          <el-icon><Setting /></el-icon>-->
<!--          系统设置-->
<!--        </el-dropdown-item>-->
        <el-dropdown-item command="logout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
  .user-dropdown {
    cursor: pointer;

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .user-avatar {
        flex-shrink: 0;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        line-height: 1.2;

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .user-role {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
</style>