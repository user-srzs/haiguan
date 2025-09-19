const goodsProcess = {
  path: '/goodsProcess',
  redirect: '/goodsProcessManage',
  meta: { title: '货物流程管理', icon: '', hide: false },
  children: [
    {
      path: '/goodsProcessManage',
      component: '/goodsProcessManage/index',
      name: 'goodsProcessManage',
      meta: { title: '货物流程管理', icon: '', hide: false }
    }
  ]
};
export default goodsProcess;
