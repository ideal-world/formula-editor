<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue'
import {iwExecutor} from "../processes";
import {Namespace, VarInfo} from "../processes/interface";
import {VideoPlay} from "@element-plus/icons-vue";

interface Props {
  materials: Namespace[]
  formulaValue: string
  entrance: string
}

const props = withDefaults(defineProps<Props>(), {
  entrance: '$'
})

const inputParams = reactive<Map<string, any>>(new Map<string, any>())

const materialVars = computed(() => {
  inputParams.clear()
  return props.materials.filter((ns) => ns.isVar).map((ns) => {
    let items = (ns.items as VarInfo[]).map((varInfo) => {
      inputParams.set(props.entrance + '.' + ns.name + '.' + varInfo.name, varInfo.defaultValue)
      return {
        name: varInfo.name!,
        label: varInfo.label!,
        note: varInfo.note,
      }
    })
    return {
      nsLabel: ns.label,
      nsName: ns.name,
      items
    }
  })
})

const debugResult = ref<any>(null)

async function debug() {
  console.log('--------------' + props.materials)
  try {
    debugResult.value = await iwExecutor.execute(inputParams, props.formulaValue, props.materials, props.entrance)
  } catch (e) {
    debugResult.value = e.message
  }
}

</script>

<template>
  <div class="iw-debug">
    <el-form>
      <el-form-item class="iw-debug__toolbar">
        <el-button :icon="VideoPlay" link @click="debug">运行</el-button>
      </el-form-item>
      <template v-for="materialVar in materialVars">
        <el-divider content-position="left">{{ materialVar.nsLabel }}</el-divider>
        <template v-for="varInfo in materialVar.items">
          <el-form-item :label="varInfo.label"  class="iw-debug__param">
            <el-input v-model="inputParams[props.entrance+'.'+materialVar.nsName+'.'+varInfo.name]"/>
          </el-form-item>
        </template>
      </template>
      <p class="iw-debug__result">结果：{{ debugResult }}</p>

    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/main.scss';

@include b('debug') {
  font-size: 11pt;
  padding: 4px;
  border-left: 1px solid var(--el-border-color);
  height: 100%;

  @include e('toolbar') {
    background-color: var(--el-color-info-light-9);
    padding: 4px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
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
}

</style>

<style lang="scss">
@import '../assets/main.scss';

</style>
