<template>
  <el-form>
    <el-form-item label="Formula">
      <el-input v-model="form.formulaValue" type="textarea" />
    </el-form-item>
    <el-form-item label="Parameters">
      <el-input v-model="form.inputParams" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item label="Materials">
      <el-input v-model="form.materials" type="textarea" rows="30" />
    </el-form-item>
    <el-form-item label="Entrance">
      <el-input v-model="form.entrance" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Execute</el-button>
    </el-form-item>
    <el-form-item label="Result">
      <span>{{ form.result }}</span>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { execute } from '../src/processes/executor'
const form = reactive({
  materials: `[
 {
   name: 'field',
   label: '字段',
   isVar: true,
   items: [
     {
       name: 'age',
       label: '年龄'
     }
   ]
 },
 {
   name: 'fun',
   label: '内置',
   isVar: false,
   items: [
     {
       name: 'sum',
       label: '求和',
       body: \`return Array.from(arguments).reduce((a, b) => a + b)\`,
     },
     {
       name: 'concat',
       label: '合并文本',
       body: \`return Array.from(arguments).join('')\`,
       cates: ['常用', '文本'],
     }
   ]
 }]`,
  entrance: '$',
  formulaValue: `$.fun.concat($.fun.sum(1,$.field.age))`,
  inputParams: `let inputParams = new Map()
inputParams.set('$.field.age', 18)
return inputParams`,
  result: '',
})

const onSubmit = async () => {
  let inputParams
  let materials
  try {
    inputParams = eval('(function() {' + form.inputParams + '}())')
  } catch (e) {
    form.result = 'Eval parameters error:' + e
    return
  }
  try {
    materials = eval(form.materials)
  } catch (e) {
    form.result = 'Eval materials error:' + e
    return
  }
  try {
    form.result = await execute(inputParams, form.formulaValue, materials, form.entrance)
  } catch (e) {
    form.result = e
  }
}
</script>
