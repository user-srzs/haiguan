<script setup lang="ts" name="addressManage">
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from 'element-plus';
import type {
  AddProcessGoodsType,
  AddProcessTerminal, AddResult, ProcessGoodsType, ProcessTerminal,
  ProcessTerminalResult,
  SelectItem,
  TabItem, Tree
} from '@/api/processTerminal/model.ts';
import { TreeType } from '@/api/processTerminal/model.ts';
import {
  createProcessGoodsType,
  createProcessTerminal,
  getProcessTerminal, removeProcessGoodsType,
  updateProcessGoodsType,
  updateProcessTerminal
} from '@/api/processTerminal';
import { formAssignObject, isNullOrDef } from '@/utils';
import CustomFlow from './components/custom-flow/index.vue';
// 获取节点列表(航站楼、货物类型)
const getTerminal = async () => {
  const res = await getProcessTerminal();
  const  { code, list } = res as ProcessTerminalResult;
  if(code !== 1) return;
  processTerminalList.value = terminalTree<ProcessTerminal>(list);
}

// 字段映射 tree
const terminalTree = <T extends Record<string, any>>(list: T[]): Tree<T>[] => {
  if(!list?.length) return [];
  return list.map((item) => {
    return {
      id: item.id,
      key: `${TreeType.terminal}-${item.id}`,
      label: item.terminalName,
      value: item.terminal,
      type: TreeType.terminal,
      original: item,
      children: item.processGoodsTypeList?.map((obj: ProcessGoodsType) => ({
        id: obj.id,
        key: `${TreeType.goodsType}-${obj.id}`,
        label: obj.goodsTypeName,
        value: obj.goodsType,
        type: TreeType.goodsType,
        original: obj,
        children: null
      }))
    }
  });
};

// 节点列表（包括航站楼、货物类型）
const processTerminalList = ref<ProcessTerminal[]>([]);

// 激活的节点
const activeProcessTerminal = ref<Tree<ProcessTerminal> | null>(null);

// 点击节点
const handleNodeClick = async (node: Tree<ProcessTerminal>) => {
  console.log('node', node);
  if(node.type === 'terminal') {
    if(!node?.children?.length) {
      activeProcessTerminal.value = null;
    }else {
      activeProcessTerminal.value = { ...node.children[0] };
    }
  }else {
    activeProcessTerminal.value = { ...node };
  }
}

// 左侧header, 添加节点
const addRootNode = () => {
  dialogVisible.value = true;
}

// 添加节点表单弹窗，显示/隐藏状态控制
const dialogVisible = ref<boolean>(false);

// 弹窗 类型， 添加/编辑
const dialogType = ref<'add' | 'edit'>('add');

// 添加/编辑表单 ref
const formRef = ref<FormInstance | null>(null);

// 类型
const formType = ref<'terminal' | 'goodsType'>('terminal');

// 变更
const changeFormType = () => {
  clearForm();
  formRef.value?.resetFields?.();
}

// 添加类型选项
const formTypeOptions = reactive<SelectItem>([
  {
    label: '航站楼',
    value: 'terminal'
  },
  {
    label: '货物类型',
    value: 'goodsType'
  }
])

// 添加/编辑表单校验规则
const formRules = computed<FormRules<AddProcessTerminal>>(() => {
  if(formType.value === 'terminal') {
    return {
      terminal: [{ required: true, message: '请输入航站楼', trigger: 'blur' }],
      terminalName: [{ required: true, message: '请输入航站楼名称', trigger: 'blur' }],
    }
  }
  if(formType.value === 'goodsType') {
    return {
      processTerminalId: [{ required: true, message: '请选择所属航站楼', trigger: 'blur' }],
      goodsType: [{ required: true, message: '请输入货物类型', trigger: 'blur' }],
      goodsTypeName: [{ required: true, message: '请输入货物类型名称', trigger: 'blur' }],
    }
  }
  return {};
})

// 添加/编辑表单数据
const form = ref<AddProcessTerminal | AddProcessGoodsType>({});

// 添加/编辑表单所属航站楼选项
const processTerminalIdOptions = computed<SelectItem>(() => {
  return processTerminalList.value.map(item => ({
    label: item.label,
    value: item.id,
  }));
})
//
const customNodeClass = computed(() => {
  if(processTerminalIdOptions.value?.some?.(item => item.children)) {
    return ''
  }else {
    return 'not-selectable';
  }
})
// 重置添加/编辑表单数据
const clearForm = () => {
  form.value = {
    id: null,
    terminal: '',
    terminalName: '',
    processTerminalId: '',
    goodsType: '',
    goodsTypeName: ''
  }
}
// 添加节点表单弹窗，关闭回调
const closed = () => {
  formType.value = 'terminal';
  dialogType.value = 'add';
  isTreeAdd.value = false;
  clearForm();
  formRef.value?.resetFields?.();
}
// 添加/编辑节点表单提交
const onSubmit = () => {
  formRef.value?.validate?.(async (valid: boolean) => {
    if(!valid) return;
    // 策略模式，定义策略映射
    const submitStrategies: Record<string, () => Promise<unknown>> = {
      'terminal-add': createTerminal,
      'terminal-edit': updateTerminal,
      'goodsType-add': createGoodsType,
      'goodsType-edit': updateGoodsType
    }
    // 策略键
    const strategyKey = `${formType.value}-${dialogType.value}`;
    // 策略执行
    const strategy = submitStrategies[strategyKey];
    if(strategy) {
      if(dialogType.value === 'edit' && isNullOrDef(form.value.id)) {
        ElMessage.error('数据异常，请联系管理员！');
        return;
      }
      const res = await strategy();
      const { code, msg = '' } = res as AddResult;
      if(code !== 1) return;
      ElMessage.success(msg || '操作成功!');
      dialogVisible.value = false;
      await getTerminal();
    }else {
      throw new Error(`未定义的策略: strategyKey: ${strategyKey}, submitStrategies: ${submitStrategies}`);
    }
  })
}
// 添加航站楼
const createTerminal = async () => {
  const formData = {
    terminal: '',
    terminalName: ''
  }
  formAssignObject(formData, form.value)
  return await createProcessTerminal(formData);
}
// 编辑航站楼
const updateTerminal = async () => {
  const formData = {
    id: 0,
    terminal: '',
    terminalName: ''
  }
  formAssignObject(formData, form.value);
  formData.id = Number(formData.id);
  return await updateProcessTerminal(formData);
}
// 添加货物类型
const createGoodsType = async () => {
  const formData = {
    processTerminalId: 0,
    goodsType: '',
    goodsTypeName: ''
  }
  formAssignObject(formData, form.value);
  formData.processTerminalId = Number(formData.processTerminalId);
  return await createProcessGoodsType(formData);
}
// 编辑货物类型
const updateGoodsType = async () => {
  const formData = {
    id: 0,
    processTerminalId: 0,
    goodsType: '',
    goodsTypeName: ''
  }
  formAssignObject(formData, form.value);
  formData.id = Number(formData.id);
  formData.processTerminalId = Number(formData.processTerminalId);
  return await updateProcessGoodsType(formData);
}

// 是否是tree上的按钮，不能变更添加类型
const isTreeAdd = ref<boolean>(false);
// 添加节点, tree树上的按钮，不能变更添加类型
const addNode = (data) => {
  formType.value = 'goodsType'
  isTreeAdd.value = true;
  dialogVisible.value = true;
  form.value.processTerminalId = data.id;
}
// 编辑节点(航站楼 or 货物类型)
const editNode = (data) => {
  console.log('data', data);
  formType.value = data.type
  dialogVisible.value = true;
  dialogType.value = 'edit';
  console.log('processTerminalIdOptions', processTerminalIdOptions);
  form.value = { ...data.original };
}
// 删除节点(航站楼 or 货物类型)
const removeNode = async (data) => {
  console.log('data', data);
  const { id } = data.original;
  if(isNullOrDef(id)) {
    ElMessage.error('数据异常，请联系管理员！');
    return;
  }
  const res = await removeProcessGoodsType(id);
  const { code, msg = '' } = res as AddResult;
  if(code !== 1) return;
  ElMessage.success(msg || '删除成功!');
  await getTerminal();
}

// 右侧header， tab列表
const tabList = reactive<TabItem[]>([
  {
    label: '进港流程',
    name: 'arrival'
  },
  {
    label: '出港流程',
    name: 'departure'
  }
]);
// 当前激活的tab
const activeTab = ref<string>(tabList[0].name);
// 切换tab
const changeTab = async (item: TabItem) => {
  activeTab.value = item.name;
};

const computedParamsNodes = computed(() => {
  return {
    arrivalOrDeparture: activeTab.value,
    processGoodsTypeId: activeProcessTerminal.value?.id,
    activeProcessTerminalType: activeProcessTerminal.value?.type
  }
})

const flowRef = ref<InstanceType<typeof CustomFlow>>();

/** 初始化挂载完之后执行 */
onMounted(async () => {
  await getTerminal();
  if(!processTerminalList.value?.length) {
    activeProcessTerminal.value = null;
  }else {
    await handleNodeClick(processTerminalList.value[0])
    // if(processTerminalList.value[0].type === 'terminal') {
    //   activeProcessTerminal.value =
    // }
  }
  // activeProcessTerminal.value = !!processTerminalList.value?.length ? processTerminalList.value[0] : null;
})
</script>

<template>
  <div class="container">
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <span class="title">节点列表</span>
          <!--          <el-link icon="Plus" :underline="false">添加根节点</el-link>-->
          <span class="right" @click="addRootNode">
            <el-icon><Plus /></el-icon>
            <span>添加节点</span>
          </span>
        </div>
      </template>
      <template #default>
        <div class="tree-wrapper">
          <el-tree
            :data="processTerminalList"
            icon-class="none"
            node-key="key"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :current-node-key="activeProcessTerminal?.value"
            highlight-current
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
                <div>
                  <el-link v-if="data.type === 'terminal'" type="primary" :underline="false" @click="addNode(data)">添加</el-link>
                  <el-link type="primary" :underline="false" @click="editNode(data)">编辑</el-link>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="removeNode(data)"
                  >
                    <template #reference>
                      <el-link type="danger" :underline="false">删除</el-link>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </template>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="header-tabs">
          <div
            v-for="item in tabList"
            :key="item.name"
            :class="['tab-item', { 'active': activeTab === item.name }]"
            @click="changeTab(item)"
          >{{ item.label }}</div>
        </div>
      </template>
      <template #default>
      <!-- 流程图 -->
        <CustomFlow
          ref="flowRef"
          :activeNode="computedParamsNodes"
        ></CustomFlow>
      </template>
    </el-card>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加':'编辑'"
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
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-col v-if="!isTreeAdd">
          <el-form-item label="类型" prop="type">
            <el-select
              :disabled="dialogType==='edit' || isTreeAdd"
              style="width: 100%"
              v-model="formType"
              placeholder="请选择"
              @change="changeFormType"
            >
              <el-option
                v-for="item in formTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="formType === 'terminal'">
          <el-col>
            <el-form-item  label="航站楼" prop="terminal">
              <el-input placeholder="请输入" v-model="form.terminal"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="航站楼名称" prop="terminalName">
              <el-input placeholder="请输入" v-model="form.terminalName"></el-input>
            </el-form-item>
          </el-col>
        </template>
        <template v-if="formType === 'goodsType'">
          <el-col v-if="!isTreeAdd">
            <el-form-item  label="所属航站楼" prop="processTerminalId">
              <el-tree-select
                :disabled="isTreeAdd"
                style="width: 100%"
                v-model="form.processTerminalId"
                :data="processTerminalIdOptions"
                :props="{ class: customNodeClass }"
                filterable
                check-strictly
                show-checkbox
                :indent="12"
                placeholder="请选择"
              ></el-tree-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item  label="货物类型" prop="goodsType">
              <el-input placeholder="请输入" v-model="form.goodsType"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="货物类型名称" prop="goodsTypeName">
              <el-input placeholder="请输入" v-model="form.goodsTypeName"></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>


<style lang="scss">
  .not-selectable {
    padding-left: 8px;
    .el-tree-node__expand-icon {
      display: none;
    }
  }
</style>
<style scoped lang="scss">
@mixin flex($display: flex, $direction: row, $align: center, $justify: center) {
  display: flex;
  flex-direction: $direction;
  align-items: $align;
  justify-content: $justify;
}
.container {
  //height: calc(100vh - 24px);
  height: 100%;
  display: grid;
  grid-template-columns: minmax(300px, 20%) minmax(0, auto);
  gap: 12px;
}

.el-card {
  border: unset;
  border-radius: 6px;
  :deep(.el-card__header) {
    padding: 0;
  }
  :deep(.el-card__body) {
    height: calc(100% - 63px);
  }
}

.header {
  box-sizing: border-box;
  width: 100%;
  height: 62px;
  padding: 0 20px;
  @include flex($display: inline-flex, $justify: space-between);
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

.header-tabs {
  height: 62px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  place-items: stretch stretch;
  .tab-item {
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    color: rgba(22, 19, 19, 0.8);
    @include flex($display: flex);
    cursor: pointer;
    &:not(:last-child) {
      border-right: 1px solid #ccc;
    }
  }
  .active {
    background: var(--el-color-primary);
    color: white;
  }
}

.custom-tree-node {
  width: 100%;
  @include flex($justify: space-between);
}
</style>
