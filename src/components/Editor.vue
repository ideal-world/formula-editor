<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import * as iconSvg from '../assets/icon'
import type { iwInterface } from '../processes'
import { DEFAULT_FUN_LIB } from '../processes/funcLib'
import type { EditorProps, FunInfo, Namespace, VarInfo } from '../processes/interface'
import { getParentWithClass, groupBy } from '../utils/basic'
import type { FormulaResult } from './CmWrap.vue'
import CmWrapComp from './CmWrap.vue'
import DebugComp from './Debug.vue'

const props = withDefaults(defineProps<EditorProps>(), {
  addDefaultFunLib: true,
  formulaValue: '',
  entrance: '$',
})

const emit = defineEmits(['update:formulaValue', 'update:checkPass'])

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
  showField?: boolean
  items: MaterialItemTree[]
}

interface LabelNameConf {
  [key: string]: string
}

if (props.addDefaultFunLib) {
  const customFunNs = props.materials.find(ns => ns.name === DEFAULT_FUN_LIB.name)
  if (customFunNs) {
    const customFuns = customFunNs.items as FunInfo[]
    const defaultFuns = DEFAULT_FUN_LIB.items as FunInfo[]
    defaultFuns.forEach((funInfo) => {
      if (customFuns.find(fun => fun.name === funInfo.name))
        return

      customFuns.push(funInfo)
    })
  }
  else {
    props.materials.unshift(DEFAULT_FUN_LIB)
  }
}

const CmWrapCompRef = ref()
const DebugCompRef = ref()
const materialNote = ref<string>('')
const searchMaterialVarKey = ref<string>('')
const searchMaterialFunKey = ref<string>('')
const formulaResult = reactive<FormulaResult>({
  materials: [],
  pass: false,
  value: '',
})
const openDebugPanel = ref<boolean>(false)

const materialVars = computed(() => {
  return findMaterials(true, '')
})

const materialFuns = computed(() => {
  return findMaterials(false, '')
})

function findMaterials(isVar: boolean, filterName: string): Material[] {
  if (isVar) {
    return props.materials
      .filter(ns => ns.isVar)
      .map((ns) => {
        const byCates = (ns.items as VarInfo[])
          .filter(item => filterName === '' || item.name?.includes(filterName))
          .map((item) => {
            return (
              item.cates?.map((cate) => {
                return {
                  id: item.name!,
                  name: item.name!,
                  label: item.label ?? '',
                  note: item.note ?? '',
                  cate,
                }
              }) ?? [
                {
                  id: '',
                  name: '',
                  label: '',
                  note: '',
                  cate: '',
                },
              ]
            )
          })
          .flat()
        const grouped = groupBy(byCates, item => item?.cate)
        const items = []
        for (const cate in grouped) {
          items.push({
            id: '',
            name: cate,
            label: '',
            note: '',
            children: grouped[cate],
          })
        }
        return {
          nsLabel: ns.label,
          nsName: ns.name,
          showField: ns.showField,
          items,
        }
      })
  }
  else {
    return props.materials
      .filter(ns => !ns.isVar)
      .map((ns) => {
        const byCates = (ns.items as FunInfo[])
          .filter(item => filterName === '' || item.name.includes(filterName) || item.label.includes(filterName))
          .map((item) => {
            return (
              item.cates?.map((cate) => {
                return {
                  id: item.name,
                  name: item.name,
                  label: item.label ?? '',
                  note: item.note ?? '',
                  cate,
                }
              }) ?? [
                {
                  id: '',
                  name: '',
                  label: '',
                  note: '',
                  cate: '',
                },
              ]
            )
          })
          .flat()
        const grouped = groupBy(byCates, item => item?.cate)
        const items = []
        for (const cate in grouped) {
          items.push({
            id: '',
            name: cate,
            label: '',
            note: '',
            children: grouped[cate],
          })
        }
        return {
          nsLabel: ns.label,
          nsName: ns.name,
          items,
        }
      })
  }
}

function searchMaterials(isVar: boolean, filterName: string) {
  if (isVar)
    materialVars.value.splice(0, materialVars.value.length)

  else
    materialFuns.value.splice(0, materialFuns.value.length)

  findMaterials(isVar, filterName).forEach((material) => {
    if (isVar)
      materialVars.value.push(material)

    else
      materialFuns.value.push(material)
  })
}

onMounted(() => {
  document.querySelectorAll('.iw-editor').forEach((editorEle) => {
    editorEle.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const itemEle = getParentWithClass(target, 'iw-editor-material__item')
      if (itemEle) {
        const name = itemEle.dataset.name
        const nsName = itemEle.dataset.nsName
        CmWrapCompRef.value.insertMaterial(nsName, name)
      }
    })
    editorEle.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement
      const itemEle = getParentWithClass(target, 'iw-editor-material__item--is-fun')
      if (itemEle) {
        const note = itemEle.dataset.note
        materialNote.value = note ?? ''
      }
      else {
        materialNote.value = ''
      }
    })
  })
})

function watchFormulaResult(_formulaResult: FormulaResult) {
  formulaResult.value = _formulaResult.value
  formulaResult.pass = _formulaResult.pass
  formulaResult.materials = _formulaResult.materials
  emit('update:formulaValue', _formulaResult.value)
  emit('update:checkPass', _formulaResult.pass)
}

function generateMaterialTree(materialItems: MaterialItemTree[], nsName: string, isFunTree: boolean, showField?: boolean): string {
  let html = ''
  for (const item of materialItems) {
    if (item.children) {
      html += `<li>
          <details>
            <summary>${item.name}</summary>
            <ul>${generateMaterialTree(item.children, nsName, isFunTree, showField)}</ul>
          </details>
        </li>`
    }
    else {
      html += `<li>
          <div class="iw-editor-material__item${isFunTree ? ' iw-editor-material__item--is-fun' : ''}" data-ns-name="${nsName}" data-name="${item.name}" data-note="${item.note}">
            <p class="iw-editor-material__item-title">${item.name}</p>
            ${showField ? `<p class="iw-editor-material__item-label">${item.label}</p>` : ``}
          </div>
        </li>`
    }
  }
  return html
}

function getFormulaWithLabel() {
  const reg = new RegExp(`(await )?\\${props.entrance}\\.(\\w+\\.\\w+)`, 'g')
  let _value = formulaResult.value
  const labelNameConf: LabelNameConf = {}
  _value.match(reg)?.forEach((item) => {
    const namespace = item.split('.')[1]
    const name = item.split('.')[2]
    const ns = props.materials.find(ns => ns.name === namespace)
    let label = name
    if (ns) {
      label = ns?.isVar
        ? (ns?.items as iwInterface.VarInfo[]).find(item => item.name === name)?.label ?? name
        : (ns?.items as iwInterface.FunInfo[]).find(item => item.name === name)?.label ?? name
    }
    labelNameConf[`${item}`] = label
  })
  Object.keys(labelNameConf).forEach((key) => {
    _value = _value.replaceAll(key, labelNameConf[key])
  })
  return _value
}

const filterUsedMaterials = computed(() => {
  const formulaMaterials = formulaResult.materials
  return props.materials
    .map((ns) => {
      let items
      if (ns.isVar) {
        items = (ns.items as VarInfo[]).filter((varInfo) => {
          const name = `${props.entrance}.${ns.name}.${varInfo.name}`
          return formulaMaterials.includes(name)
        })
      }
      else {
        items = (ns.items as FunInfo[]).filter((funInfo) => {
          const name = `${props.entrance}.${ns.name}.${funInfo.name}`
          return formulaMaterials.includes(name)
        })
      }
      return {
        name: ns.name,
        label: ns.label,
        isVar: ns.isVar,
        items,
      } as Namespace
    })
    .filter(ns => ns.items.length > 0)
})

async function getResultVal() {
  const val = await DebugCompRef.value.getDebugResultVal()
  return val
}

defineExpose({
  getFormulaWithLabel,
  getResultVal,
})
</script>

<template>
  <div :class="`iw-editor text-base text-base-content bg-base-100 border border-solid border-base-300 rounded-md grid ${openDebugPanel ? 'grid-cols-12' : ''}`">
    <div :class="`${openDebugPanel ? 'col-span-8' : ''}`">
      <div class="bg-base-200 p-1 border-solid border-b border-b-base-300 flex justify-between">
        <div>
          {{ props.targetVar.label }}
        </div>
        <div class="iw-editor-toolbar__opt">
          <button class="iw-btn iw-btn-ghost iw-btn-xs" @click="openDebugPanel = !openDebugPanel">
            <i :class="iconSvg.DEBUG" />  {{ $t('editor.debug') }}
          </button>
        </div>
      </div>
      <div class="iw-editor-formula">
        <CmWrapComp
          ref="CmWrapCompRef" class="w-full min-h-[200px]" :formula-value="props.formulaValue"
          :target-guard="targetVar" :materials="materials" :entrance="entrance" @update-formula-result="watchFormulaResult"
        />
      </div>
      <div class="iw-editor-material border-solid border-t border-t-base-300 grid grid-cols-12">
        <div :class="`border-solid border-r border-r-base-300 ${openDebugPanel ? 'col-span-6' : 'col-span-3'}`">
          <input
            v-model="searchMaterialVarKey" :placeholder="$t('editor.search_var')"
            class="iw-input iw-input-ghost iw-input-sm rounded-none focus:outline-none focus:border-none w-full"
            @input="searchMaterials(true, searchMaterialVarKey)"
          >
          <div class="border-solid border-t border-t-base-300 w-full h-[300px] overflow-auto">
            <ul class="iw-menu iw-menu-sm">
              <li v-for="materialVar in materialVars" :key="materialVar.nsName">
                <details open>
                  <summary>{{ materialVar.nsLabel }}</summary>
                  <ul v-html="generateMaterialTree(materialVar.items, materialVar.nsName, false, materialVar.showField)" />
                </details>
              </li>
            </ul>
          </div>
        </div>
        <div :class="`grid grid-cols-12 ${openDebugPanel ? 'col-span-6' : 'col-span-9'}`">
          <div :class="`border-solid border-r border-r-base-300 ${openDebugPanel ? 'col-span-12' : 'col-span-5'}`">
            <input
              v-model="searchMaterialFunKey" :placeholder="$t('editor.search_fun')"
              class="iw-input iw-input-ghost iw-input-sm rounded-none focus:outline-none focus:border-none w-full"
              @input="searchMaterials(false, searchMaterialFunKey)"
            >
            <div class="border-solid border-t border-t-base-300 w-full h-[300px] overflow-auto">
              <ul class="iw-menu iw-menu-sm">
                <li v-for="materialFun in materialFuns" :key="materialFun.nsName">
                  <details open>
                    <summary>{{ materialFun.nsLabel }}</summary>
                    <ul v-html="generateMaterialTree(materialFun.items, materialFun.nsName, true, materialFun.showField)" />
                  </details>
                </li>
              </ul>
            </div>
          </div>
          <div v-show="!openDebugPanel" class="p-1 col-span-7">
            <div v-show="materialNote !== ''" v-html="materialNote" />
            <div v-show="materialNote === ''" class="flex flex-col justify-center items-center p-1 h-full text-base-300">
              <i :class="iconSvg.INFO" />
              <span>{{ $t('editor.tips') }}</span>
              <span>{{ $t('editor.tip1') }}</span>
              <span>{{ $t('editor.tip2') }}</span>
              <span>{{ $t('editor.tip3') }}</span>
              <span v-html="$t('editor.tip4', { entrance: props.entrance })" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="openDebugPanel"
      :class="`iw-editor-debug ${openDebugPanel ? 'col-span-4' : ''}`"
    >
      <DebugComp
        ref="DebugCompRef" v-model:materials="filterUsedMaterials" v-model:formula-value="formulaResult.value"
        v-model:pass="formulaResult.pass" :entrance="props.entrance"
      />
    </div>
  </div>
</template>

<style lang="css">
.iw-editor-material__item{
  @apply flex flex-col items-start;
}

.iw-editor-material__item-label {
  @apply text-info;
}

.iw-editor-formula {
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
</style>
