<script setup lang="ts" name="goodsProcessManage">
  import { Plus } from '@element-plus/icons-vue';
  import { createRegion, getRegion, removeRegion, updateRegion } from '@/api/region';
  import type { AddRegionResult, GetRegionResult, RegionResult, AddRegionArgs } from '@/api/region/model.ts';
  import type { FormInstance, FormRules } from 'element-plus';
  import { formAssignObject, isNullOrDef } from '@/utils';
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
    width: 160
  }])
  // 右侧表格数据
  const dataList = computed(() => {
    return activeNode.value ? [activeNode.value] : [];
  })
  // 刷新表格数据,根据当前选中的节点, 查找新数据，当前节点还存在即保持选中，不存在则默认选中第一个节点
  const refreshData = () => {
    const node: RegionResult | undefined = treeData.value?.find((item:RegionResult)  => activeNode.value?.id === item.id);
    if(!node) return activeNode.value = treeData.value?.[0];
    activeNode.value = node;
  }
  /** ------------------------- 列表 添加/编辑 表单 处理逻辑 start ------------------------------- */
    // 添加/编辑表单弹窗显示
  const dialogVisible = ref<boolean>(false)
  // 表单类型
  const dialogType = ref<'add' | 'edit'>('add')
  // 添加/编辑表单 ref
  const formRef = ref<FormInstance | null>(null)
  // 添加/编辑表单数据
  const form = ref<AddRegionArgs>({
    id: null,
    parentId: null,
    nodeName: '',
    modelRegion: '',
    projectCode: ''
  })
  // 添加/编辑表单验证规则
  const formRules = computed<FormRules<AddRegionArgs>>(() => {
    return {
      nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }]
    }
  })
  // 重置表单数据
  const clearForm = () => {
    form.value = {
      id: null,
      parentId: null,
      nodeName: '',
      modelRegion: '',
      projectCode: ''
    }
  }
  // 添加弹窗关闭回调事件
  const closed = () => {
    clearForm();
    formRef.value?.resetFields?.();
  }
  // 添加/编辑提交
  const onSubmit = () => {
    formRef.value?.validate?.(async (valid: boolean) => {
      if(!valid) return;
      if(dialogType.value === 'add') {
        // 创建
        const formData = {
          parentId: null,
          nodeName: ''
        }
        formAssignObject(formData, form.value);
        console.log('formData', formData);
        const res = await createRegion(formData);
        const { code, msg = '' } = res as AddRegionResult;
        if(code !== 1) return;
        ElMessage.success(msg || '添加成功!');
      }
      if(dialogType.value === 'edit') {
        // 修改
        const res = await updateRegion(form.value);
        const { code, msg = '' } = res as AddRegionResult;
        if(code !== 1) return;
        ElMessage.success(msg || '修改成功!');
      }
      dialogVisible.value = false;
      await getTreeData();
      refreshData();
    })
  }
  // 添加按钮，列表操作项
  const handleCreate = (row: RegionResult) => {
    const { id } = row;
    if(isNullOrDef(id)) {
      ElMessage.error('数据异常，请联系管理员！');
      return;
    }
    dialogType.value = 'add';
    dialogVisible.value = true;
    form.value.parentId = row.id;
  }
  // 编辑按钮
  const handleEdit = (row: RegionResult) => {
    const { id } = row
    if(isNullOrDef(id)) {
      ElMessage.error('数据异常，请联系管理员！');
      return;
    }
    dialogType.value = 'edit';
    dialogVisible.value = true;
    form.value = { ...row };
  }
  /** ------------------------- 列表 添加/编辑 表单 处理逻辑 end ------------------------------- */

    // 删除
  const handleRemove = async (row: RegionResult) => {
      const { id } = row
      if(isNullOrDef(id)) {
        ElMessage.error('数据异常，请联系管理员！');
        return;
      }
      const res = await removeRegion(id);
      const { code, msg = '' } = res as AddRegionResult;
      if(code !== 1) return;
      ElMessage.success(msg || '删除成功!');
      await getTreeData();
      refreshData();
    }

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
            <template v-if="column.slot === 'action'" v-slot:default="{ row }">
              <el-link type="primary" :underline="false" @click="handleCreate(row)">添加</el-link>
              <el-link type="primary" :underline="false" @click="handleEdit(row)">编辑</el-link>
              <el-popconfirm title="确定删除吗？" @confirm="handleRemove(row)">
                <template #reference>
                  <el-link type="danger" :underline="false">删除</el-link>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogType==='add' ? '添加':'编辑'"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    align-center
    @closed="closed"
  >
    <el-form
      ref="formRef"
      label-position="right"
      label-width="auto"
      :model="form"
      :rules="formRules"
    >
      <el-row>
        <el-col>
          <el-form-item label="节点名称" prop="nodeName">
            <el-input placeholder="请输入节点名称" v-model="form.nodeName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </template>
  </el-dialog>
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

  .el-link {
    &:not(:last-child) {
      margin-right: 14px;
    }
  }

  .el-form {
    margin: 10px 20px;
  }
</style>