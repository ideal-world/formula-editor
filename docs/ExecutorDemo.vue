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

async function onSubmit() {
  let inputParams
  let materials
  try {
    // eslint-disable-next-line no-eval
    inputParams = eval(`(function() {${form.inputParams}}())`)
  }
  catch (e) {
    form.result = `Eval parameters error:${e}`
    return
  }
  try {
    // eslint-disable-next-line no-eval
    materials = eval(form.materials)
  }
  catch (e) {
    form.result = `Eval materials error:${e}`
    return
  }
  try {
    form.result = await execute(inputParams, form.formulaValue, materials, form.entrance)
  }
  catch (e) {
    form.result = e
  }
}
</script>

<template>
  <div class="grid-cols-6">
    <div class="col-span-1">
      Formula
    </div>
    <div class="col-span-5">
      <textarea v-model="form.formulaValue" class="iw-textarea iw-textarea-bordered w-full" style="border-width: 1px; border-style: solid;" />
    </div>
    <div class="col-span-1">
      Parameters
    </div>
    <div class="col-span-5">
      <textarea v-model="form.inputParams" class="iw-textarea iw-textarea-bordered w-full" rows="4" style="border-width: 1px; border-style: solid;" />
    </div>
    <div class="col-span-1">
      Materials
    </div>
    <div class="col-span-5">
      <textarea v-model="form.materials" class="iw-textarea iw-textarea-bordered w-full" rows="30" style="border-width: 1px; border-style: solid;" />
    </div>
    <div class="col-span-1">
      Entrance
    </div>
    <div class="col-span-5">
      <input v-model="form.entrance" class="iw-input iw-input-bordered w-full" style="border-width: 1px; border-style: solid;">
    </div>
    <div class="col-span-6">
      <button class="iw-btn iw-btn-secondary iw-btn-xs" @click="onSubmit">
        Execute
      </button>
    </div>
    <div class="col-span-1">
      Result
    </div>
    <div class="col-span-5">
      {{ form.result }}
    </div>
  </div>
</template>
