<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'
import { VideoPlay, EditPen, Search } from '@element-plus/icons-vue'

interface Props {
  targetEle: string
}

const props = withDefaults(defineProps<Props>(), {
  targetEle: '测试字段'
})

interface Tree {
  id: string
  label: string
  note: string
  children?: Tree[]
}

const vars: Tree[] = [
  {
    id: '1',
    label: '字段1',
    note: 'xxxx'
  },
  {
    id: '2',
    label: '字段2',
    note: 'xxxx',
    children: [
      {
        id: '3',
        label: '字段2子字段1',
        note: 'xxxx'
      },
      {
        id: '4',
        label: '字段2子字段2',
        note: 'xxxx'
      }
    ]
  }
]

const formula = ref<string>()
</script>

<template>
  <div class="iw-editor">
    <el-row class="iw-editor-toolbar">
      <el-col :span="12">{{ targetEle }} =</el-col>
      <el-col :span="12" class="iw-editor-toolbar__opt"><el-button :icon="VideoPlay" link>调试</el-button><el-button :icon="EditPen" link>代码模式</el-button></el-col>
    </el-row>
    <el-row class="iw-editor-formula">
      <el-input v-model="formula" type="textarea" :autosize="{ minRows: 10 }" placeholder="在此输入公式" />
    </el-row>
    <el-row class="iw-editor-tooltip"> 字符错误 </el-row>
    <el-row class="iw-editor-material">
      <el-col class="iw-editor-material__var-wrapper" :span="6">
        <el-input placeholder="搜索变量" :prefix-icon="Search" />
        <el-tabs type="border-card" tab-position="bottom">
          <el-tab-pane label="字段">
            <el-tree :data="vars" node-key="id" accordion empty-text="暂无数据">
              <template #default="{ node, data }">
                <div class="iw-editor-material__var-item">
                  <p class="iw-editor-material__var-item-tile">{{ node.label }}</p>
                  <p class="iw-editor-material__var-item-note">xx说明</p>
                </div>
              </template>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="模型">Config</el-tab-pane>
          <el-tab-pane label="字典">Role</el-tab-pane>
          <el-tab-pane label="主题">Task</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col class="iw-editor-material__func-wrapper" :span="18">
        <el-row>
          <el-col class="iw-editor-material__func-list" :span="10">
            <el-input placeholder="搜索函数/API" :prefix-icon="Search" />
            <el-tabs type="border-card" tab-position="bottom">
              <el-tab-pane label="函数">
                <el-tree :data="vars" node-key="id" accordion empty-text="暂无数据">
                  <template #default="{ node, data }">
                    <div class="iw-editor-material__var-item">
                      <p class="iw-editor-material__var-item-tile">{{ node.label }}</p>
                      <p class="iw-editor-material__var-item-note">xx说明</p>
                    </div>
                  </template>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane label="API">Config</el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col class="iw-editor-material__func-note" :span="14">
            判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值。 用法：IF(逻辑表达式,为true时返回的值,为false时返回的值)。
            示例：IF(语文成绩>60,"及格","不及格")，当语文成绩>60时返回及格，否则返回不及格。
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
}

@include b('editor-tooltip') {
  background-color: var(--el-color-error-light-9);
  padding: 4px;
  border-top: 1px solid var(--el-border-color);
}

@include b('editor-material') {
  border-top: 1px solid var(--el-border-color);

  @include e('var-wrapper') {
    border-right: 1px solid var(--el-border-color);
  }

  @include e('var-item') {
    p {
      line-height: 1.3;
      margin: 1px 0;
    }
  }

  @include e('var-item-note') {
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
}
</style>
