<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { iwExecutor } from '../processes'
import type { Namespace, VarInfo } from '../processes/interface'
import * as iconSvg from '../assets/icon'

const props = withDefaults(defineProps<Props>(), {
  entrance: '$',
})

const { t } = useI18n()

interface Props {
  materials: Namespace[]
  formulaValue: string
  pass: boolean
  entrance?: string
}

const inputParams = reactive<any>({})
const debugResult = ref<any>(null)

const materialVars = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  debugResult.value = ''
  Object.assign(inputParams, {})
  return props.materials
    .filter(ns => ns.isVar)
    .map((ns) => {
      const items = (ns.items as VarInfo[]).map((varInfo) => {
        inputParams[`${props.entrance}.${ns.name}.${varInfo.name}`] = varInfo.defaultValue
        return {
          name: varInfo.name!,
          label: varInfo.label!,
          note: varInfo.note,
        }
      })
      return {
        nsLabel: ns.label,
        nsName: ns.name,
        items,
      }
    })
})

async function debug() {
  const spanDom = document.getElementsByClassName('iw-debug__result-span')[0] as HTMLElement
  spanDom.classList.remove('iw-debug__result-span--ok', 'iw-debug__result-span--error')
  if (!props.pass) {
    spanDom.classList.add('iw-debug__result-span--error')
    debugResult.value = t('debug.formula_error')
    return
  }
  const inputParamsMap = new Map<string, any>()
  for (const key in inputParams) {
    // TODO Empty value handling of facts
    if (inputParams[key] !== '')
      inputParamsMap.set(key, inputParams[key])
  }
  try {
    spanDom.classList.add('iw-debug__result-span--ok')
    debugResult.value = await iwExecutor.execute(inputParamsMap, props.formulaValue, props.materials, props.entrance)
  }
  catch (e: any) {
    spanDom.classList.add('iw-debug__result-span--error')
    debugResult.value = e.message
  }
}
async function getDebugResultVal() {
  await debug()
  return debugResult.value
}
defineExpose({
  getDebugResultVal,
})
</script>

<template>
  <div class="p-1 border border-solid border-l-base-300 bg-base-200 h-full">
    <p class="p-1 text-right">
      <button class="iw-btn iw-btn-ghost iw-btn-xs" @click="debug">
        <i :class="iconSvg.RUN" /> {{ $t('debug.run') }}
      </button>
    </p>
    <template v-for="materialVar in materialVars" :key="materialVar.nsName">
      <div class="iw-divider">
        {{ materialVar.nsLabel }}
      </div>
      <template v-for="varInfo in materialVar.items" :key="varInfo.name">
        <div class="p-1 flex justify-between items-center">
          <div>{{ varInfo.label }}</div>
          <div>
            <input
              v-model="inputParams[`${props.entrance}.${materialVar.nsName}.${varInfo.name}`]" :placeholder="varInfo.note"
              class="iw-input iw-input-bordered iw-input-sm"
            >
          </div>
        </div>
      </template>
    </template>

    <div class="iw-divider">
      {{ $t('debug.result') }}
    </div>
    <p class="p-1">
      <span class="iw-debug__result-span">{{ debugResult }}</span>
    </p>
  </div>
</template>

<style lang="css">
.iw-debug__result-span--ok {
  @apply text-success;
}
.iw-debug__result-span--error {
  @apply text-error;
}
</style>
