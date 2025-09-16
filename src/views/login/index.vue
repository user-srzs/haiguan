<script setup lang="ts" name="Login">
  import type { TableItem } from '@/views/login/model.ts';
  import { Lock, UserFilled } from '@element-plus/icons-vue';
  const rules = ref({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  });

  const form = reactive({
    username: '',
    password: '',
    code: ''
  });

  const tabList = reactive<TableItem[]>([
    {
      key: 'account',
      name:  '账号登录'
    },
    {
      key: 'mobile',
      name: '手机号登录'
    }
  ])

  const activeTab = ref(tabList[0]);

  const changeTab = (item: TableItem) => {
    const { key } = item;
    activeTab.value = key
  }

  const submit = () => {

  }
</script>

<template>
  <div class="login-wrapper">
    <div class="login-form-wrapper">
      <el-form
        ref="formRef"
        size="large"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter.prevent="submit"
      >
        <el-row :gutter="20">
          <el-col>
            <div
              v-for="item in tabList"
              :key="item.key"
              @click="changeTab(item)"
            >
              {{ item.name }}
            </div>
          </el-col>
          <el-col>
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入用户名"
                :prefix-icon="UserFilled"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                show-password
                :prefix-icon="Lock"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background: url("@/assets/login_bg.svg") no-repeat center center;
  background-size: cover;
  position: relative;
}

.login-form-wrapper {
  width: 476px;
  height: 604px;
  border-radius: 10px;
  // 编辑器显示的颜色可能不准确, 请自行检查, 或者查看styles/variables.scss文件
  background-color: var(--el-bg-color);
  position: absolute;
  right: 11.143rem; // 156px;
  top: calc(50% - 302px);
}
.login-form {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-row {
  width: 100%;
}
</style>