<template>
  <div style="margin: 8px; color: red">调试结果：{{ formulaValue }}</div>

  <el-button @click="dialogVisible = true">打开</el-button>
  <el-dialog v-model="dialogVisible">
    <iw-editor v-model:formulaValue="formulaValue" :targetVar="targetVar" :materials="materials"/>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {iwInterface} from '../src';

const formulaValue = ref<string>(`$.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',$.param.someVar)`)
const dialogVisible = ref<boolean>(false)

const targetVar: iwInterface.VarInfo = {
  name: 'formName',
  label: '表单标题',
  kind: iwInterface.VarKind.STRING,
  note: '表单的显示名称',
  minLen: 2,
  maxLen: 20
}

const materials : iwInterface.Namespace[] = [
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
        cates: ['基础信息']
      },
      {
        name: 'kind',
        label: '申请类型',
        kind: iwInterface.VarKind.STRING,
        note: '申请类型',
        minLen: 2,
        maxLen: 20,
        cates: ['基础信息']
      },
      {
        name: 'age',
        label: '年龄',
        kind: iwInterface.VarKind.NUMBER,
        note: '年龄',
        minLen: 18,
        maxLen: 60,
        cates: ['基础信息']
      }
    ]
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
        cates: ['账户']
      },
      {
        name: 'phone',
        label: '手机号',
        kind: iwInterface.VarKind.STRING,
        cates: ['账户']
      },
      {
        name: 'roleName',
        label: '角色名',
        kind: iwInterface.VarKind.STRING,
        cates: ['角色']
      },
      {
        name: 'isAdmin',
        label: '是否是管理员',
        kind: iwInterface.VarKind.BOOLEAN,
        cates: ['角色']
      }
    ]
  },
  {
    name: 'fun',
    label: '函数',
    isVar: false,
    showLabel: false,
    color: '#d9ecff',
    items: [
      {
        name: 'sum',
        label: '求和',
        note: `获取一组数值的总和。
用法：SUM(数字1,数字2,...)。
示例：SUM(语文成绩,数学成绩, 英语成绩)返回三门课程的总分。`,
        input: [
          {
            kind: iwInterface.VarKind.NUMBER
          }
        ],
        isVarLen: true,
        isAsync: false,
        output: {
          kind: iwInterface.VarKind.NUMBER
        },
        cates: ['常用', '计算']
      },
      {
        name: 'now',
        label: '当前时间',
        note: `返回当前时间戳`,
        input: [],
        isVarLen: false,
        isAsync: false,
        output: {
          kind: iwInterface.VarKind.NUMBER
        },
        cates: ['常用', '日期处理']
      },
      {
        name: 'concat',
        label: '合并文本',
        note: `将多个文本合并成一个文本。
用法：CONCATENATE(文本1,文本2,...)。`,
        input: [
          {
            kind: iwInterface.VarKind.ANY
          }
        ],
        isVarLen: true,
        isAsync: false,
        output: {
          kind: iwInterface.VarKind.STRING
        },
        cates: ['常用', '文本处理']
      },
      {
        name: 'lower',
        label: '转成小写',
        note: `将一个文本中的所有大写字母转换为小写字母。
用法：lower(文本)。`,
        input: [
          {
            kind: iwInterface.VarKind.STRING
          }
        ],
        isVarLen: false,
        isAsync: false,
        output: {
          kind: iwInterface.VarKind.STRING
        },
        cates: ['文本处理']
      }
    ]
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
            kind: iwInterface.VarKind.STRING
          }
        ],
        isVarLen: false,
        isAsync: true,
        output: {
          kind: iwInterface.VarKind.ANY
        },
        cates: ['用户']
      }
    ]
  }
]
</script>
