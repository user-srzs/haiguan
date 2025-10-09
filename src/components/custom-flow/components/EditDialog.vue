<template>
  <el-dialog
    v-model="visible"
    title="编辑节点文本"
    width="400px"
    :before-close="handleClose"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="节点文本">
        <el-input
          v-model="form.label"
          placeholder="请输入节点文本"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

interface FormData {
  label: string
}

interface Props {
  modelValue: boolean
  nodeLabel?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', label: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = ref(false)
const form = reactive<FormData>({
  label: ''
})

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    form.label = props.nodeLabel || ''
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm', form.label)
  handleClose()
}
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
