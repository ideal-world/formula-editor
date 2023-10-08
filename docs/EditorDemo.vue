<template>
  <div style="margin: 8px; color: red">Result：checkPass:{{ checkPass }} formulaValue:{{ formulaValue }}</div>

  <el-button @click="dialogVisible = true">打开</el-button>
  <el-dialog v-model="dialogVisible">
    <iw-editor v-model:formulaValue="formulaValue" v-model:checkPass="checkPass" :targetVar="targetVar" :materials="materials" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { iwInterface } from '../src'

const formulaValue = ref<string>(`$.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',$.param.someVar)`)
const checkPass = ref<boolean>(true)
const dialogVisible = ref<boolean>(false)

const targetVar: iwInterface.VarInfo = {
  name: 'formName',
  label: 'form title',
  kind: iwInterface.VarKind.STRING,
  note: 'Display name of the form',
  minLen: 2,
  maxLen: 20,
}

const materials: iwInterface.Namespace[] = [
  {
    name: 'field',
    label: 'FIELD',
    isVar: true,
    showLabel: true,
    color: '#f8e3c5',
    items: [
      {
        name: 'applicant',
        label: 'Applicant',
        kind: iwInterface.VarKind.STRING,
        note: 'Form Applicant Name',
        minLen: 2,
        maxLen: 20,
        cates: ['Basic'],
      },
      {
        name: 'kind',
        label: 'Application type',
        kind: iwInterface.VarKind.STRING,
        note: 'Application type',
        minLen: 2,
        maxLen: 20,
        cates: ['Basic'],
      },
      {
        name: 'age',
        label: 'age',
        kind: iwInterface.VarKind.NUMBER,
        note: 'age',
        minLen: 18,
        maxLen: 60,
        defaultValue: 36,
        cates: ['Basic'],
      },
    ],
  },
  {
    name: 'model',
    label: 'MODEL',
    isVar: true,
    showLabel: true,
    color: '#e1f3d8',
    items: [
      {
        name: 'accountName',
        label: 'Account Name',
        kind: iwInterface.VarKind.STRING,
        note: 'Account Name',
        minLen: 2,
        maxLen: 20,
        cates: ['ACCOUNT'],
      },
      {
        name: 'phone',
        label: 'Phone Number',
        kind: iwInterface.VarKind.STRING,
        cates: ['ACCOUNT'],
      },
      {
        name: 'roleName',
        label: 'Role Name',
        kind: iwInterface.VarKind.STRING,
        cates: ['ROLE'],
      },
      {
        name: 'isAdmin',
        label: 'Is it an administrator',
        kind: iwInterface.VarKind.BOOLEAN,
        cates: ['ROLE'],
      },
    ],
  },
  {
    name: 'fun',
    label: 'Function',
    isVar: false,
    showLabel: false,
    color: '#d9ecff',
    items: [
      {
        name: 'now',
        label: 'Current time (custom)',
        note: `return current timestamp`,
        input: [],
        isVarLen: false,
        isAsync: false,
        output: {
          kind: iwInterface.VarKind.NUMBER,
        },
        body: `return Date.now()`,
        cates: ['COMMON', 'TIME'],
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
        label: 'Get user information',
        note: `Get user information based on user ID`,
        input: [
          {
            label: 'User ID',
            kind: iwInterface.VarKind.STRING,
          },
        ],
        isVarLen: false,
        isAsync: true,
        output: {
          kind: iwInterface.VarKind.ANY,
        },
        body: `return {
        userId: arguments[0],
        userName: 'nestor',
        age: 18
    }`,
        cates: ['USER'],
      },
    ],
  },
]
</script>
