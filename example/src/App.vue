<script setup lang="ts">
import { ref } from 'vue'
import { iwInterface } from 'formula-editor'

const checkPass = ref<boolean>(true)
const formulaValue = ref<string>(`$.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',$.param.someVar)`)
const dialogVisible = ref<boolean>(false)

const targetVar: iwInterface.VarInfo = {
  name: 'formName',
  label: '表单标题',
  kind: iwInterface.VarKind.STRING,
  note: '表单的显示名称',
  minLen: 2,
  maxLen: 20,
}

const materials: iwInterface.Namespace[] = [
  {
    name: 'field',
    label: '字段',
    isVar: true,
    showLabel: true,
    color: '#f8e3c5',
    items: [
      {
        name: 'applicant',
        label: '申请人',
        kind: iwInterface.VarKind.STRING,
        note: '表单申请人姓名',
        minLen: 2,
        maxLen: 20,
        cates: ['基础信息'],
      },
    ],
  },
  {
    name: 'model',
    label: '模型',
    isVar: true,
    showLabel: true,
    color: '#e1f3d8',
    items: [
      {
        name: 'accountName',
        label: '账号',
        kind: iwInterface.VarKind.STRING,
        note: '账号名',
        minLen: 2,
        maxLen: 20,
        cates: ['账户'],
      },
      {
        name: 'phone',
        label: '手机号',
        kind: iwInterface.VarKind.STRING,
        cates: ['账户'],
      },
    ],
  },
  {
    name: 'api',
    label: 'API',
    isVar: false,
    showLabel: true,
    color: '#d9ec00',
    items: [
      {
        name: 'getUserInfo',
        label: '获取用户基础信息',
        note: `根据用户Id获取用户信息`,
        input: [
          {
            label: '用户Id',
            kind: iwInterface.VarKind.STRING,
          },
        ],
        isVarLen: false,
        isAsync: true,
        body: `return await (await fetch('http://x.x.x.x/user/'+arguments[0])).json()`,
        output: {
          kind: iwInterface.VarKind.ANY,
        },
        cates: ['用户'],
      },
    ],
  },
]
</script>

<template>
  <el-button @click="dialogVisible = true">打开</el-button>
  <el-dialog v-model="dialogVisible">
    <!-- v-model:formulaValue:formula value -->
    <!-- v-model:checkPass:Check the formula correct -->
    <!-- :targetVar:Target object of the formula -->
    <!-- :materials:Material collection -->
    <iw-editor v-model:formulaValue="formulaValue" v-model:checkPass="checkPass" :targetVar="targetVar" :materials="materials" />
  </el-dialog>
</template>
