<script setup lang="ts">
import { ElInput } from 'element-plus'
import { reactive, ref, type Ref } from 'vue'
import { VideoPlay, EditPen, Search, View } from '@element-plus/icons-vue'
import { FunInfo, Namespace, VarInfo, VarKind } from '../processes'
import CmWrap from './CmWrap.vue'

interface Props {
  targetVar: VarInfo
  materials: Namespace[]
  formula: string
  entrance: string | null
}

const emit = defineEmits(['update:targetVar', 'update:materials', 'update:formula'])

const props = withDefaults(defineProps<Props>(), {
  targetVar: () => ({
    name: 'formName',
    label: '表单名称',
    kind: VarKind.STRING,
    note: '表单的显示名称',
    minLen: 2,
    maxLen: 20
  }),
  materials: () => [
    {
      name: 'field',
      label: '字段',
      isVar: true,
      color: '#f8e3c5',
      items: [
        {
          name: 'applicant',
          label: '申请人',
          kind: VarKind.STRING,
          note: '表单申请人姓名',
          minLen: 2,
          maxLen: 20,
          cates: ['基础信息']
        },
        {
          name: 'kind',
          label: '申请类型',
          kind: VarKind.STRING,
          note: '申请类型',
          minLen: 2,
          maxLen: 20,
          cates: ['基础信息']
        },
        {
          name: 'age',
          label: '年龄',
          kind: VarKind.NUMBER,
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
      color: '#e1f3d8',
      items: [
        {
          name: 'accountName',
          label: '账号',
          kind: VarKind.STRING,
          note: '账号名',
          minLen: 2,
          maxLen: 20,
          cates: ['账户']
        },
        {
          name: 'phone',
          label: '手机号',
          kind: VarKind.STRING,
          cates: ['账户']
        },
        {
          name: 'roleName',
          label: '角色名',
          kind: VarKind.STRING,
          cates: ['角色']
        },
        {
          name: 'isAdmin',
          label: '是否是管理员',
          kind: VarKind.BOOLEAN,
          cates: ['角色']
        }
      ]
    },
    {
      name: 'fun',
      label: '函数',
      isVar: false,
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
              kind: VarKind.NUMBER
            }
          ],
          isVarLen: true,
          output: {
            kind: VarKind.NUMBER
          },
          cates: ['常用', '计算']
        },
        {
          name: 'now',
          label: '当前时间',
          note: `返回当前时间戳`,
          input: [],
          isVarLen: false,
          output: {
            kind: VarKind.NUMBER
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
              kind: VarKind.ANY
            }
          ],
          isVarLen: true,
          output: {
            kind: VarKind.STRING
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
              kind: VarKind.STRING
            }
          ],
          isVarLen: false,
          output: {
            kind: VarKind.STRING
          },
          cates: ['文本处理']
        }
      ]
    }
  ],
  formula: `$.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',null,$.param.someVar)`,
  entrance: '$'
})

const formula: Ref<string> = ref(props.formula)
  const CmWrap = ref(null);

const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    ;(acc[predicate(value, index, array)] ||= []).push(value)
    return acc
  }, {} as { [key: string]: T[] })

const materialVars = reactive(
  props.materials
    .filter((ns) => ns.isVar)
    .map((ns) => {
      let byCates = (ns.items as VarInfo[])
        .map((item) => {
          return (
            item.cates?.map((cate) => {
              return {
                id: item.name!,
                name: item.name!,
                label: item.label ?? '',
                note: item.note ?? '',
                cate: cate
              }
            }) ?? [
              {
                id: '',
                name: '',
                label: '',
                note: '',
                cate: ''
              }
            ]
          )
        })
        .flat()
      let grouped = groupBy(byCates, (item) => item?.cate)
      let items = []
      for (let cate in grouped) {
        items.push({
          id: '',
          name: cate,
          label: '',
          note: '',
          children: grouped[cate]
        })
      }
      return {
        nsLabel: ns.label,
        nsName: ns.name,
        items: items
      }
    })
)

const materialFuns = reactive(
  props.materials
    .filter((ns) => !ns.isVar)
    .map((ns) => {
      let byCates = (ns.items as FunInfo[])
        .map((item) => {
          return (
            item.cates?.map((cate) => {
              return {
                id: item.name,
                name: item.name,
                label: item.label ?? '',
                note: item.note ?? '',
                cate: cate
              }
            }) ?? [
              {
                id: '',
                name: '',
                label: '',
                note: '',
                cate: ''
              }
            ]
          )
        })
        .flat()
      let grouped = groupBy(byCates, (item) => item?.cate)
      let items = []
      for (let cate in grouped) {
        items.push({
          id: '',
          name: cate,
          label: '',
          note: '',
          children: grouped[cate]
        })
      }
      return {
        nsLabel: ns.label,
        nsName: ns.name,
        items: items
      }
    })
)

const materialNote = ref<String>('')
</script>

<template>
  <div style="margin: 8px; color: red">调试结果：{{ formula }}</div>
  <div class="iw-editor">
    <el-row class="iw-editor-toolbar">
      <el-col :span="12">{{ props.targetVar.label }} = </el-col>
      <el-col :span="12" class="iw-editor-toolbar__opt"><el-button :icon="VideoPlay" link>调试</el-button><el-button :icon="EditPen" link>代码模式</el-button></el-col>
    </el-row>
    <el-row class="iw-editor-formula">
      <CmWrap ref="CmWrap" class="iw-editor-formula--size" v-model:formula="formula" :targetGuard="targetVar" :materials="materials" :entrance="entrance" />
    </el-row>
    <el-row class="iw-editor-material">
      <el-col class="iw-editor-material__var-wrapper" :span="6">
        <el-input placeholder="搜索变量" :prefix-icon="Search" />
        <el-tabs tab-position="bottom">
          <template v-for="materialVar in materialVars">
            <el-tab-pane :label="materialVar.nsLabel">
              <el-tree :data="materialVar.items" node-key="id" accordion empty-text="暂无数据">
                <template #default="{ node, data }">
                  <div class="iw-editor-material__item" @click="node.isLeaf && CmWrap.value.insertMaterial(materialVar.nsName, data.name)">
                    <p class="iw-editor-material__item-tile">{{ data.name }}</p>
                    <p class="iw-editor-material__item-note">{{ data.label }}</p>
                  </div>
                </template>
              </el-tree>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-col>
      <el-col class="iw-editor-material__func-wrapper" :span="18">
        <el-row>
          <el-col class="iw-editor-material__func-list" :span="10">
            <el-input placeholder="搜索函数/API" :prefix-icon="Search" />
            <el-tabs tab-position="bottom">
              <template v-for="materialFun in materialFuns">
                <el-tab-pane :label="materialFun.nsLabel">
                  <el-tree :data="materialFun.items" node-key="id" accordion empty-text="暂无数据">
                    <template #default="{ node, data }">
                      <div
                        class="iw-editor-material__item"
                        @click="node.isLeaf && CmWrap.value.insertMaterial(materialFun.nsName, data.name)"
                        @mouseenter="materialNote = data.note"
                        @mouseleave="materialNote = ''"
                      >
                        <p class="iw-editor-material__item-tile">{{ data.name }}</p>
                        <p class="iw-editor-material__item-note">{{ data.label }}</p>
                      </div>
                    </template>
                  </el-tree>
                </el-tab-pane>
              </template>
            </el-tabs>
          </el-col>
          <el-col class="iw-editor-material__func-note" :span="14">
            {{ materialNote }}
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/main.scss';

@include b('editor') {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  font-size: 11pt;
}

@include b('editor-toolbar') {
  background-color: var(--el-color-info-light-9);
  padding: 4px;
  border-bottom: 1px solid var(--el-border-color);

  @include e('opt') {
    text-align: right;
  }
}

@include b('editor-formula') {
  @include m('size') {
    width: 100%;
    min-height: 200px;
  }
}

@include b('editor-material') {
  border-top: 1px solid var(--el-border-color);

  @include e('var-wrapper') {
    border-right: 1px solid var(--el-border-color);
  }

  @include e('item') {
    p {
      line-height: 1.3;
      margin: 1px 0;
    }
  }

  @include e('item-note') {
    color: var(--el-color-info-light-3);
  }

  @include e('func-list') {
    border-right: 1px solid var(--el-border-color);
  }

  @include e('func-note') {
    padding: 4px;
  }
}
</style>

<style lang="scss">
@import '../assets/main.scss';

@include b('editor-formula') {
  textarea {
    border: none;
    box-shadow: none;
  }

  textarea:hover {
    border: none;
    box-shadow: none;
  }

  textarea:focus {
    border: none;
    box-shadow: none;
  }
}

@include b('editor-material') {
  .el-input__wrapper {
    border: none;
    border-radius: 0;
    box-shadow: none;
    border-bottom: 1px solid var(--el-border-color);
  }

  .el-input__wrapper:hover {
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  .is_focus {
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  .el-tabs {
    border: none;
    border-radius: 0;
    box-shadow: none;

    .el-tab-pane {
      height: 250px;
    }
  }

  .el-tree-node__content {
    height: auto;
    padding: 2px 0;
  }

  .el-tabs__header {
    padding: 0 6px;
    border-top: 1px solid var(--el-border-color);
    border-bottom-width: 0;
  }

  .el-tabs__nav-wrap::after {
    background-color: none;
  }
}
</style>
