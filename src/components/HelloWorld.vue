<script setup lang="ts">
import { useMouse } from '@vueuse/core';
import { ref } from 'vue';
import { DataForm } from './CustomDataForm';
import SelectTree from './SelectTree.vue';
import TestTable from './TestTable.vue';
const { x, y } = useMouse();

defineProps<{ msg: string }>()

const count = ref(0)
const color = ref('#888')

const formData = ref({
  number: '23242',
  name: 'luzhike'
})

const formProps: IFromItem[] = [
  {
    label: '编号',
    prop: 'number',
    span: 12
  },
  {
    label: '名称',
    prop:'name',
    span: 12
  }
]


</script>

<template>
  <h1>{{ msg }}</h1>
  {{ x, y  }}

  <SelectTree/>

  <TestTable/>
  <DataForm :form-data="formData" :form-props="formProps"/>

  <div class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
  
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  
</template>

<style scoped>
.read-the-docs {
  color: v-bind(color);
}
</style>
