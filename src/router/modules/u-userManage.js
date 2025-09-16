const userManage = {
  path: '/userManage',
  redirect: '/userManage/user',
  meta: { title: ' 用户管理', icon: 'el-icon--shouye', hide: false },
  children: [
    {
      path: '/userManage/user',
      component: '/userManage/user/index',
      meta: { title: '用户管理', icon: 'el-icon--shouye', hide: false }
    },
    {
      path: '/userManage/tenant',
      component: '/userManage/tenant/index',
      meta: { title: '租户管理', icon: 'el-icon--shouye', hide: false }
    },
    {
      path: '/userManage/platform',
      component: '/userManage/platform/index',
      meta: { title: '平台用户', icon: 'el-icon--shouye', hide: false }
    },
  ]
};
export default userManage;
