<template>
  <div style="margin: 8px; color: red">调试结果：{{ formulaValue }}</div>

  <el-button @click="dialogVisible = true">打开</el-button>
  <el-dialog v-model="dialogVisible">
    <Editor v-model:formulaValue="formulaValue" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formulaValue = ref<string>(`$.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',$.param.someVar)`)
const dialogVisible = ref<boolean>(false)

</script>
