<script setup lang="ts" name="Login">
  import { Form, TableItem } from '@/views/login/model.ts';
  import { Lock, UserFilled } from '@element-plus/icons-vue';
  import pcIcon from '@/assets/login/pc.svg';
  import qrCodeIcon from '@/assets/login/qrCode.svg';
  import { encryptByEcb, setToken } from '@/utils';
  import type { FormInstance, FormRules } from 'element-plus';
  import type { LoginResult } from '@/api/account/model.ts';
  import { login } from '@/api/account';
  import {useUserStore} from "@/stores/modules/user.ts";
  import {HOME_PATH} from "@/config/seeting.ts";
  import router from "@/router";
  const userStore = useUserStore();
  /** 账号密码表单ref */
  const formRef = ref<FormInstance | null>(null);
  /** 账号密码表单数据 */
  const form = reactive<Form>({
    username: '',
    password: ''
    // code: ''
  });
  /** 账号密码 */
  const rules = computed<FormRules<Form>>(() => {
    return {
      username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    };
  });
  /** 手机号登录表单ref */
  const mobileFormRef = ref<FormInstance | null>(null);
  /** 手机号登录表单数据 */
  const mobileForm = reactive<Form>({
    mobile: '',
    code: ''
  });
  /** 手机号登录表单校验规则 */
  const mobileRules = computed<FormRules<Form>>(() => {
    return {
      mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
    };
  });
  /** tab列表数据(账号密码/手机号) */
  const tabList = reactive<TableItem[]>([
    {
      key: 'account',
      name: '账户密码登录'
    },
    {
      key: 'mobile',
      name: '手机号登录'
    }
  ]);
  /** 当前tab(账号密码/手机号登录) */
  const activeTab = ref<string>(tabList[0].key);
  /** 手机号登录表单校验规则 */
  const changeTab = (item: TableItem) => {
    const { key } = item;
    activeTab.value = key;
  };
  /** 当前图标pc or qr */
  const loginHeaderIcon = ref<string>('qr');
  /** 切换pc(输入账号密码or手机号登录) or qr(扫描二维码登录) */
  const changeQrCode = () => {
    // 切换 loginHeaderIcon 的值
    if (loginHeaderIcon.value === 'pc') {
      loginHeaderIcon.value = 'qr';
    } else {
      loginHeaderIcon.value = 'pc';
    }
  };
  /** 记住密码复选框 */
  const checked = ref<boolean>(false);
  /** 登录加载状态 */
  const loading = ref<boolean>(false);
  /** 登录提交 */
  const submit = () => {
    if(activeTab.value === 'account') {
      formRef.value?.validate(async (valid: boolean | null) => {
        if (!valid) return;
        try {
          loading.value = true;
          const formData = {
            username: encryptByEcb(form.username),
            password: encryptByEcb(form.password)
          };
          const res = await login(formData);
          await handleSetData(res)
          ElMessage.success('登录成功');
          goHome();
        } finally {
          loading.value = false;
        }
      });
    }
  };
  /** 登录成功存储数据 */
  const handleSetData = async (res: LoginResult) => {
    const { result } = res;
    const { Authorization, role, user } = result || {};
    setToken(Authorization, true);
    userStore.setUser(user);
    userStore.setRoles(role);
  };
  /** 登录成功跳转 */
  const goHome = () => {
    router.push(HOME_PATH || '/');
  }

  onMounted(() => {
  });
</script>

<template>
  <div class="login-wrapper">
    <div class="login-form-wrapper">
      <div class="login-header-wrapper">
        <div class="login-header-qrCode" @click="changeQrCode">
          <Transition name="fade" mode="out-in">
            <el-image
              v-if="loginHeaderIcon === 'pc'"
              id="pc"
              :src="pcIcon"
              fit="fill"
            />
            <el-image
              v-else-if="loginHeaderIcon === 'qr'"
              id="qr"
              :src="qrCodeIcon"
              fit="fill"
            />
          </Transition>
        </div>
      </div>
      <template v-if="loginHeaderIcon === 'qr'">
        <div class="login-account-wrapper">
          <div class="header-title">
            <div class="text">{{ '智慧物流园区运管一体化系统' }}</div>
          </div>
          <div class="header-tabs">
            <div
              v-for="item in tabList"
              :key="item.key"
              @click="changeTab(item)"
              :class="['header-tabs-item', { active: activeTab === item.key }]"
            >
              {{ item.name }}
            </div>
          </div>
          <el-form
            v-if="activeTab === 'account'"
            ref="formRef"
            size="large"
            :model="form"
            :rules="rules"
            class="login-form"
            @keyup.enter.prevent="submit"
          >
            <el-row>
              <el-col>
                <el-form-item prop="username">
                  <el-input
                    v-model="form.username"
                    placeholder="账号"
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
                    placeholder="密码"
                    show-password
                    :prefix-icon="Lock"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            v-if="activeTab === 'mobile'"
            ref="mobileFormRef"
            size="large"
            :model="mobileForm"
            :rules="mobileRules"
            class="login-form"
            @keyup.enter.prevent="submit"
          >
            <el-row>
              <el-col>
                <el-form-item prop="mobile">
                  <el-input
                    v-model="form.mobile"
                    placeholder="手机号"
                    :prefix-icon="UserFilled"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input
                    v-model="form.code"
                    placeholder="验证码"
                    show-password
                    :prefix-icon="Lock"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="text-align: end;">
                <el-button>{{ '点击获取验证码' }}</el-button>
              </el-col>
            </el-row>
          </el-form>
          <div class="login-button-wrapper">
            <el-button
              type="primary"
              class="login-button"
              @click="submit"
              :loading="loading"
            >登录</el-button>
          </div>
          <div v-if="activeTab === 'account'" class="forget-password-wrapper">
            <div class="forget-password">
              <el-checkbox v-model="checked">{{ '记住密码' }}</el-checkbox>
            </div>
          </div>
        </div>
      </template>


      <div v-if="loginHeaderIcon === 'pc'"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .login-wrapper {
    width: 100vw;
    height: 100vh;
    background: url('@/assets/login/login_bg.svg') no-repeat center center;
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

  .login-header-wrapper {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .login-header-qrCode {
    width: 82px;
    height: 100%;
    cursor: pointer;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  .login-account-wrapper {
    box-sizing: border-box;
    height: calc(100% - 82px);
    padding: 0 48px 48px;
  }

  .header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    line-height: 60px;
    margin-bottom: 48px;
  }

  .header-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px 32px;
    &-item {
      padding-bottom: 10px;
      font-size: 18px;
      line-height: 24px;
      cursor: pointer;
    }
    &-item.active {
      color: var(--el-color-primary);
      border-bottom: 2px solid var(--el-color-primary);
    }
  }

  .login-button-wrapper {
    margin-top: 20px;
    height: 40px;
    .login-button {
      width: 100%;
      height: 100%;
      font-size: 22px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 6px;
    }
  }

  .forget-password-wrapper {
    margin-top: 10px;
    .forget-password {
      .el-checkbox {
        font-size: 14px;
        color: var(--el-text-color-text);
      }
    }
  }

  :deep(.el-input__inner) {
    color: var(--el-text-color-input);
  }
</style>
