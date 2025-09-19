const address = {
  path: '/address',
  redirect: '/addressManage',
  meta: { title: '地址管理', icon: '', hide: false },
  children: [
    {
      path: '/addressManage',
      component: '/addressManage/index',
      name: 'addressManage',
      meta: { title: '地址管理', icon: '', hide: false }
    }
  ]
};
export default address;
