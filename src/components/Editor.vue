<script setup lang="ts">
import {ElInput} from 'element-plus'
import {reactive, ref, watch, type Ref} from 'vue'
import {VideoPlay, EditPen, Search} from '@element-plus/icons-vue'
import {exampleProps} from '../processes/example'
import CmWrap from './CmWrap.vue'
import {EditorProps, FunInfo, VarInfo} from '../processes/interface'
import {groupBy} from '../utils/basic'

const emit = defineEmits(['update:formulaValue', 'update:checkPass'])

const props = withDefaults(defineProps<EditorProps>(), exampleProps)

interface MaterialItemTree {
  id: string
  name: string
  label: string
  note: string
  children?: MaterialItemTree[]
  cate?: string
}

interface Material {
  nsLabel: string
  nsName: string
  items: MaterialItemTree[]
}

const formulaValue: Ref<string> = ref(props.formulaValue)
const checkPass: Ref<boolean> = ref(true)
const CmWrapRef = ref()
const materialNote = ref<String>('')
const materialVars = reactive<Material[]>(findMaterials(true, ''))
const searchMaterialVarKey = ref<string>('')
const searchMaterialFunKey = ref<string>('')
const materialFuns = reactive<Material[]>(findMaterials(false, ''))

watch(checkPass, async (newValue) => {
  emit('update:checkPass', newValue)
})

watch(formulaValue, async (newValue) => {
  emit('update:formulaValue', newValue)
})

function findMaterials(isVar: boolean, filterName: string): Material[] {
  if (isVar) {
    return props.materials
        .filter((ns) => ns.isVar)
        .map((ns) => {
          let byCates = (ns.items as VarInfo[])
              .filter((item) => filterName === '' || item.name?.includes(filterName) || item.label?.includes(filterName))
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
  } else {
    return props.materials
        .filter((ns) => !ns.isVar)
        .map((ns) => {
          let byCates = (ns.items as FunInfo[])
              .filter((item) => filterName === '' || item.name.includes(filterName) || item.label.includes(filterName))
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
  }
}

function searchMaterials(isVar: boolean, filterName: string) {
  console.log('filter' + filterName)
  if (isVar) {
    materialVars.splice(0, materialVars.length)
  } else {
    materialFuns.splice(0, materialFuns.length)
  }
  findMaterials(isVar, filterName).forEach((material) => {
    if (isVar) {
      materialVars.push(material)
    } else {
      materialFuns.push(material)
    }
  })
}

function insertMaterial(isLeaf: boolean, ns: string, name: string) {
  isLeaf && CmWrapRef.value.insertMaterial(ns, name)
}
</script>

<template>
  <div class="iw-editor">
    <el-row class="iw-editor-toolbar">
      <el-col :span="12">{{ props.targetVar.label }} =</el-col>
      <el-col :span="12" class="iw-editor-toolbar__opt">
        <el-button :icon="VideoPlay" link>调试</el-button>
        <el-button :icon="EditPen" link>代码模式</el-button>
      </el-col>
    </el-row>
    <el-row class="iw-editor-formula">
      <CmWrap ref="CmWrapRef" class="iw-editor-formula--size" v-model:formulaValue="formulaValue"
              v-model:checkPass="checkPass"
              :targetGuard="targetVar" :materials="materials" :entrance="entrance"/>
    </el-row>
    <el-row class="iw-editor-material">
      <el-col class="iw-editor-material__var-wrapper" :span="6">
        <el-input placeholder="搜索变量" v-model="searchMaterialVarKey" :prefix-icon="Search"
                  @input="searchMaterials(true, searchMaterialVarKey)"/>
        <el-tabs tab-position="bottom">
          <template v-for="materialVar in materialVars">
            <el-tab-pane :label="materialVar.nsLabel">
              <el-tree :data="materialVar.items" node-key="id" accordion empty-text="暂无数据">
                <template #default="{ node, data }">
                  <div class="iw-editor-material__item"
                       @click="insertMaterial(node.isLeaf, materialVar.nsName, data.name)">
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
            <el-input placeholder="搜索函数/API" v-model="searchMaterialFunKey" :prefix-icon="Search"
                      @input="searchMaterials(false, searchMaterialFunKey)"/>
            <el-tabs tab-position="bottom">
              <template v-for="materialFun in materialFuns">
                <el-tab-pane :label="materialFun.nsLabel">
                  <el-tree :data="materialFun.items" node-key="id" accordion empty-text="暂无数据">
                    <template #default="{ node, data }">
                      <div class="iw-editor-material__item"
                           @click="insertMaterial(node.isLeaf, materialFun.nsName, data.name)"
                           @mouseenter="materialNote = data.note" @mouseleave="materialNote = ''">
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
