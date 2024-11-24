<template>
  <el-table :data="tableData" style="width: 1000px" height="250">
    <el-table-column v-for="item in tableProps" :key="item.label" :prop="item.prop" :label="item.label">
        <el-table-column v-for="it in item.children" :key="it.label" :prop="it.prop" :label="it.label" :width="it.width">
            <template #default="scope">
                <span>{{ scope.row[it.prop] }}</span>
            </template>
        </el-table-column>
    </el-table-column>>
    
  </el-table>
</template>

<script lang="ts" setup>

const tableProps = [
    {
        label: '通用能力几线', prop: 'capLine', children: [
          { label: '防线', prop: 'lineOfDefense',width: '150' },
          { label: '五要素', prop: 'fiveElements',width: '150' },
          { label: '子要素', prop: 'subElements',width: '150'},
          { label: '管理类', prop: 'manageClass',width: '150' },
  ]},
    {
        label: '管理指引与细则', prop: 'guideline', children: [
          { label: '管理指引与细则编号', prop: 'guidelineNo',width: '180'},
          { label: '管理指引与细则名称', prop: 'guidelineName',width: '180' },
        ]
    },
    {
        label: '风险库', prop: 'riskLib', children: [
          { label: '风险库编号', prop: 'riskLibNo',width: '150' },
          { label: '风险库名称', prop: 'riskLibName',width: '150' },
  ]},
    {
        label: '度量', prop: 'measure', children: [
          { label: '度量编号', prop: 'measureNo',width: '150' },
          { label: '度量名称', prop: 'measureName',width: '150' },
  ]},
]
const tableData = [
  {
    lineOfDefense: '2016-05-03',
    fiveElements: 'Tom',
    subElements: 'California',
    manageClass: 'Los Angeles',
    guidelineNo: 'No. 189',
    guidelineName: 'CA 90036',
    riskLibNo: 'No. 189',
    riskLibName: 'CA 90036',
    measureNo: 'No. 189',
    measureName: 'CA 90036',
  },
  
]
</script>
