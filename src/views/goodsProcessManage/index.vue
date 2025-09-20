<script setup lang="ts" name="goodsProcessManage">
  import { Plus } from '@element-plus/icons-vue';
  import { createRegion, getRegion } from '@/api/region';
  import type { AddRegionResult, GetRegionResult, RegionResult } from '@/api/region/model.ts';
  /** 左侧树节点数据 */
  const treeData = ref<RegionResult[]>([])
  /** 树配置项 */
  const props = reactive({
    label: 'nodeName',
    children: 'children'
  })
  /** 当前选中的节点数据 */
  const activeNode = ref<RegionResult | null>(null)
  /** 处理节点点击事件 */
  const handleNodeClick = (node: RegionResult) => {
    console.log('node', node);
    activeNode.value = node;
  }
  /** 获取树节点数据  */
  const getTreeData = async () => {
    const res = await getRegion();
    const { list, code } = res as GetRegionResult;
    if(code !== 1) return;
    treeData.value = list ?? [];
  }
  // 添加根节点
  const addRootNode = async () => {
    const form = {
      parentId: 0,
      nodeName: '根节点'
    }
    const res = await createRegion(form);
    const { code, msg = '' } = res as AddRegionResult;
    if(code !== 1) return;
    ElMessage.success(msg || '添加成功!');
    await getTreeData();
  }
  // 添加 omit 方法来排除特定属性
  const omit = (obj: Record<string, any>, keys: string[]) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  }
  // 右侧表格列配置
  const columns = reactive([{
    prop: 'id',
    label: '节点Id',
    minWidth: 80
  },{
    prop: 'nodeName',
    label: '节点名称',
    minWidth: 120
  },{
    prop: 'modelRegion',
    label: '绑定模型区域',
    minWidth: 120
  },{
    prop: 'action',
    label: '操作',
    slot: 'action',
    minWidth: 120
  }])
  // 右侧表格数据
  const dataList = computed(() => {
    return activeNode.value ? [activeNode.value] : [];
  })

  /** 加载完后执行 */
  onMounted(async () => {
    await getTreeData();
    activeNode.value = !!treeData.value?.length ? treeData.value[0] : null;
  })
</script>

<template>
  <div class="container">
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <span class="title">地址列表</span>
<!--          <el-link icon="Plus" :underline="false">添加根节点</el-link>-->
          <span class="right" @click="addRootNode">
            <el-icon><Plus /></el-icon>
            <span>添加根节点</span>
          </span>
        </div>
      </template>
      <template #default>
        <div class="tree-wrapper">
          <el-tree
            :data="treeData"
            :props="props"
            icon-class="none"
            node-key="id"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :current-node-key="activeNode?.id"
            highlight-current
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </template>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <span class="title">{{ activeNode?.nodeName || '地址列表' }}</span>
        </div>
      </template>
      <template #default>
        <el-table
          :data="dataList"
          row-key="id"
          default-expand-all
          :tree-props="{ hasChildren: 'children', children: 'children' }"
        >
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            v-bind="omit(column, ['slot'])"
          >
            <!--  插槽 -->
            <template v-if="column.slot" action="{row}">
              <el-link>编辑</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
  .container {
    height: calc(100vh - 24px);
    display: grid;
    grid-template-columns: minmax(300px, 20%) minmax(0, auto);
    gap: 12px;
  }
  .el-card {
    border: unset;
    border-radius: 6px;
  }
  .header {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
      color: rgba(22, 19, 19, 0.8);
    }
    .right {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.85);
      cursor: pointer;
    }
  }

  .tree-wrapper {

  }
</style>