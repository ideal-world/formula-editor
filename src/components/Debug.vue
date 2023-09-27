<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { iwExecutor } from '../processes'
import { Namespace, VarInfo } from '../processes/interface'
import { VideoPlay } from '@element-plus/icons-vue'

interface Props {
  materials: Namespace[]
  formulaValue: string
  entrance: string
}

const props = withDefaults(defineProps<Props>(), {
  entrance: '$'
})

const inputParams = reactive({})
const debugResult = ref<any>(null)

const materialVars = computed(() => {
  debugResult.value = ''
  Object.assign(inputParams, {})
  return props.materials
    .filter((ns) => ns.isVar)
    .map((ns) => {
      let items = (ns.items as VarInfo[]).map((varInfo) => {
        inputParams[props.entrance + '.' + ns.name + '.' + varInfo.name] = varInfo.defaultValue
        return {
          name: varInfo.name!,
          label: varInfo.label!,
          note: varInfo.note
        }
      })
      return {
        nsLabel: ns.label,
        nsName: ns.name,
        items
      }
    })
})

async function debug() {
  let inputParamsMap = new Map<string, any>()
  for (let key in inputParams) {
    inputParamsMap.set(key, inputParams[key])
  }
  let spanDom = document.getElementsByClassName('iw-debug__result-span')[0] as HTMLElement
  spanDom.classList.remove('iw-debug__result-span--ok', 'iw-debug__result-span--error')
  try {
    spanDom.classList.add('iw-debug__result-span--ok')
    debugResult.value = await iwExecutor.execute(inputParamsMap, props.formulaValue, props.materials, props.entrance)
  } catch (e) {
    spanDom.classList.add('iw-debug__result-span--error')
    debugResult.value = e.message
  }
}
</script>

<template>
  <div class="iw-debug">
    <p class="iw-debug__toolbar">
      <el-button :icon="VideoPlay" link @click="debug">运行</el-button>
    </p>
    <template v-for="materialVar in materialVars">
      <el-divider content-position="left">{{ materialVar.nsLabel }}</el-divider>
      <template v-for="varInfo in materialVar.items">
        <el-form-item :label="varInfo.label" class="iw-debug__param">
          <el-input :placeholder="varInfo.note" v-model="inputParams[props.entrance + '.' + materialVar.nsName + '.' + varInfo.name]" />
        </el-form-item>
      </template>
    </template>
    <p class="iw-debug__result">
      结果：<span class="iw-debug__result-span">{{ debugResult }}</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/main.scss';

@include b('debug') {
  font-size: 11pt;
  padding: 4px;
  border-left: 1px solid var(--el-border-color);
  background-color: var(--el-color-info-light-9);
  height: 100%;

  @include e('toolbar') {
    padding: 4px;
    text-align: right;
  }

  @include e('param') {
    padding: 4px;
  }

  @include e('result') {
    border-top: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    padding: 4px;
  }

  @include e('result-span') {
    @include m('ok') {
      color: var(--el-color-success-dark-2);
    }

    @include m('error') {
      color: var(--el-color-error-dark-2);
    }
  }
}
</style>

<style lang="scss">
@import '../assets/main.scss';

@include b('debug') {
  p {
    margin: 0;
  }
}
</style>
