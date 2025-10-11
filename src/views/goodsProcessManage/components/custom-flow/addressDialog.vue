<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus';
  import { getRegion } from '@/api/region';
  import type { GetRegionResult, RegionResult } from '@/api/region/model.ts';
  import { findTree } from '@/utils';
  interface FormData {
    address: string;
  }
  const props = defineProps<{
    visible: boolean;
    editNode: any;
  }>();
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
  }>();
  const dialogVisible = computed<boolean>({
    get: () => {
      return props.visible;
    },
    set: (value: boolean) => {
      emit('update:visible', value);
    }
  });
  const formRef = ref<FormInstance | null>(null);
  const form = ref({
    address: ''
  });
  const clearForm = () => {
    form.value = {
      address: ''
    };
  }
  const formRules = computed<FormRules<FormData>>(() => {
    return {
      address: [
        { required: true, message: '请输入地址', trigger: 'blur' }
      ]
    };
  })
  const closed = () => {
    clearForm();
    formRef.value?.resetFields?.();
  }
  // 树节点选项数据
  const treeData = ref<RegionResult[]>([]);
  /** 树配置项 */
  const treeProps = reactive({
    label: 'nodeName',
    children: 'children'
  })
  /** 获取树节点数据  */
  const getTreeData = async () => {
    const res = await getRegion();
    const { list, code } = res as GetRegionResult;
    if(code !== 1) return;
    treeData.value = list ?? [];
  }

  watch(() => props.editNode, async (newValue: any) => {
    await getTreeData();
    form.value.address = newValue?.properties?.visualizationRegionId
  }, { immediate: true, deep: true })


  const onSubmit = () => {
    formRef.value?.validate?.(async (valid: boolean) => {
      if(!valid) return;
      let node: any | null = null;
      if(form.value.address) {
        node = findTree(form.value.address, treeData.value);
      }
      const formData = {
        ...props.editNode.properties,
        visualizationRegionId: node?.node?.id || '',
        visualizationRegionName: node?.node?.nodeName || '',
      };
      emit('onSubmit', formData)
    });
  }

  // onMounted(() => {
  //   getTreeData();
  // })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="绑定地址"
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
        <el-col>
          <el-form-item label="地址" prop="address">
            <el-tree-select
              v-model="form.address"
              :props="treeProps"
              :data="treeData"
              icon-class="none"
              node-key="id"
              :render-after-expand="false"
              :current-node-key="form.address"
              show-checkbox
              check-strictly
              check-on-click-node
            />
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
  .el-form {
    margin: 10px 20px;
  }
</style>