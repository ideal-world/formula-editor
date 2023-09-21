<script setup lang="ts">
import { ElInput } from 'element-plus'
import { reactive, ref, type Ref } from 'vue'
import { VideoPlay, EditPen, Search, View } from '@element-plus/icons-vue'
import { EditorState, Extension } from '@codemirror/state'
import { highlightSpecialChars, drawSelection, MatchDecorator, Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType, keymap } from '@codemirror/view'
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching } from '@codemirror/language'
import { autocompletion, closeBrackets, Completion, CompletionResult } from '@codemirror/autocomplete'
import { highlightSelectionMatches } from '@codemirror/search'
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands'
import CodeMirror from 'vue-codemirror6'
import { linter } from '@codemirror/lint'
import * as eslint from 'eslint-linter-browserify'
import { esLint, javascript } from '@codemirror/lang-javascript'
import { SyntaxNode } from '@lezer/common'

interface Props {
  targetVar: VarInfo
  materials: Namespace[]
  formula: string
  entrance: string | null
}

const emit = defineEmits(['update:targetVar', 'update:materials', 'update:formula'])

enum VarKind {
  STRING = '字符串',
  NUMBER = '数值',
  BOOLEAN = '布尔',
  NULL = '空',
  STRINGS = '字符串数组',
  NUMBERS = '数值数组',
  BOOLEANS = '布尔数组',
  ANY = '任意类型'
}

interface Namespace {
  name: string
  label: string
  color?: string
  isVar: boolean
  items: VarInfo[] | FunInfo[]
}

interface VarGuard {
  kind: VarKind
  minLen?: number
  maxLen?: number
  checkReg?: string
  options?: [{ value: any; label: string }]
}

interface VarInfo extends VarGuard {
  name?: string
  label?: string
  note?: string
  cates?: string[]
  defaultValue?: any
}

interface FunInfo {
  name: string
  label: string
  note?: string
  input: VarInfo[]
  // Variable length, the variable length type is the type of the last input
  isVarLen: boolean
  output: VarGuard
  cates: string[]
}

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

// $.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',null,$.param.someVar)

const formula: Ref<string> = ref(props.formula)

// -----------------------------

const codeEditor: Ref<InstanceType<typeof CodeMirror> | undefined> = ref()

const keyWordMatcher = new MatchDecorator({
  regexp: new RegExp('\\' + props.entrance + '\\.(\\w+\\.\\w+)', 'g'),
  decoration: (match) =>
    Decoration.replace({
      widget: new KeywordWidget(match[1])
    })
})

const keyWordPlugin = ViewPlugin.fromClass(
  class {
    placeholders: DecorationSet
    constructor(view: EditorView) {
      this.placeholders = keyWordMatcher.createDeco(view)
    }
    update(update: ViewUpdate) {
      this.placeholders = keyWordMatcher.updateDeco(update, this.placeholders)
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none
      })
  }
)

class KeywordWidget extends WidgetType {
  constructor(readonly name: string) {
    super()
  }
  eq(other: KeywordWidget) {
    return this.name == other.name
  }
  toDOM() {
    let namespace = this.name.split('.')[0]
    let name = this.name.split('.')[1]
    let color = props.materials.find((ns) => ns.name === namespace)?.color || '#e9e9eb'
    let elt = document.createElement('span')
    elt.style.cssText =
      `
      border-radius: 4px;
      margin: 0 3px;
      padding: 1px 3px;
      background: ` +
      color +
      `;`
    elt.className = 'iw-editor-formula__key-word'
    elt.textContent = name
    return elt
  }
  ignoreEvent() {
    return false
  }
}

import { CompletionContext } from '@codemirror/autocomplete'

function completions(context: CompletionContext): CompletionResult | null {
  let nsMatch = context.matchBefore(new RegExp('\\' + props.entrance + '\\.*'))
  let nameMatch = context.matchBefore(new RegExp('\\' + props.entrance + '\\.\\w*\\.'))
  let wordMatch = context.matchBefore(/\w*/)
  if (
    (nsMatch == null || (nsMatch.from == nsMatch.to && !context.explicit)) &&
    (nameMatch == null || (nameMatch.from == nameMatch.to && !context.explicit)) &&
    (wordMatch == null || (wordMatch.from == wordMatch.to && !context.explicit))
  ) {
    return null
  }
  if (nsMatch != null) {
    return {
      from: nsMatch.from,
      options: props.materials.map((ns) => {
        return { label: props.entrance + '.' + ns.name, type: 'namespace', detail: ns.label }
      })
    }
  } else if (nameMatch != null) {
    let namespace = nameMatch.text.split('.')[1]
    let ns = props.materials.find((ns) => ns.name == namespace)
    if (!ns) {
      return null
    }
    return {
      from: nameMatch.from,
      options:
        ns.items.map((item) => {
          let fullName = props.entrance + '.' + namespace + '.' + item.name
          if (ns?.isVar) {
            return { label: fullName + ' ', type: 'variable', detail: item.label }
          } else {
            let offset = fullName.length + 1
            return {
              label: fullName,
              type: 'function',
              detail: item.label,
              apply: (view: EditorView, completion: Completion, from: number, to: number) => {
                view.dispatch({
                  changes: { from, to, insert: fullName + '()' },
                  selection: {
                    anchor: from + offset,
                    head: from + offset
                  }
                })
              }
            }
          }
        }) ?? []
    }
  } else if (wordMatch != null) {
    let text = wordMatch.text
    let options: Completion[] = props.materials
      .map((ns) => {
        if (ns.isVar) {
          return (ns.items as VarInfo[])
            .filter((item) => item.name?.startsWith(text))
            .map((item) => {
              let fullName = props.entrance + '.' + ns.name + '.' + item.name
              return { label: item.name, type: 'variable', detail: item.label + '(' + ns.label + ')', apply: fullName + ' ' } as Completion
            })
        } else {
          return (ns.items as FunInfo[])
            .filter((item) => item.name.startsWith(text))
            .map((item) => {
              let fullName = props.entrance + '.' + ns.name + '.' + item.name
              let offset = fullName.length + 1
              return {
                label: item.name,
                type: 'function',
                detail: item.label + '(' + ns.label + ')',
                apply: (view: EditorView, completion: Completion, from: number, to: number) => {
                  view.dispatch({
                    changes: { from, to, insert: fullName + '()' },
                    selection: {
                      anchor: from + offset,
                      head: from + offset
                    }
                  })
                }
              } as Completion
            })
        }
      })
      .flat()
    return {
      from: wordMatch.from,
      options: options
    }
  } else {
    return null
  }
}

import { syntaxTree } from '@codemirror/language'
import { Diagnostic } from '@codemirror/lint'

enum VerifyResult {
  IGNORE,
  HIT
}

function verifyExprParamOrVarGuards(node: SyntaxNode, view: EditorView, expectedOutputKind: VarKind, diagnostics: Diagnostic[]): VerifyResult {
  // E.g.
  // code:
  // $.fun.concat($.fun.sum(1, $.field.age),3, true, ['1','2'], 'string', null, $.param.someVar)
  //
  // syntaxTree:
  //  CallExpression(
  //    MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName),
  //    ArgList(
  //      '(',
  //      CallExpression(
  //        MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName),
  //        ArgList('(', Number, ',', MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName), ')')
  //      ),
  //      ',',
  //      Number,
  //      ',',
  //      BooleanLiteral,
  //      ',',
  //      ArrayExpression('[', String, ',', String, ']'),
  //      ',',
  //      String,
  //      ',',
  //      null,
  //      ',',
  //      MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName),
  //      ')'
  //    )
  //  )
  let kind = null
  let memberName
  if (node.name === 'CallExpression' && node.firstChild?.name === 'MemberExpression' && node.firstChild?.firstChild?.name === 'MemberExpression' && node.firstChild?.nextSibling?.name === 'ArgList') {
    kind = 'expr'
    memberName = view.state.sliceDoc(node.firstChild?.from, node.firstChild?.to)
  } else if (node.name === 'MemberExpression' && node.firstChild?.name === 'MemberExpression') {
    kind = 'var'
    memberName = view.state.sliceDoc(node.from, node.to)
  } else if (node.name === 'VariableName') {
    // 不支持自定义变量
    diagnostics.push({
      from: node.from,
      to: node.to,
      severity: 'error',
      message: '变量不存在',
      markClass: 'iw-editor-formula--error'
    })
    return VerifyResult.HIT
  } else {
    return VerifyResult.IGNORE
  }

  if (!memberName.startsWith(props.entrance + '.')) {
    return VerifyResult.IGNORE
  }
  let memberNameSplit = memberName.split('.')
  let namespace = memberNameSplit[1]
  let name = memberNameSplit[2]
  let ns = props.materials.find((ns) => ns.name === namespace)
  if (!ns) {
    diagnostics.push({
      from: node.from,
      to: node.to,
      severity: 'error',
      message: (kind === 'var' ? '变量' : '函数') + '不存在',
      markClass: 'iw-editor-formula--error'
    })
    return VerifyResult.HIT
  }

  if (kind === 'var') {
    let varInfo = (ns.items as VarInfo[]).find((item) => item.name === name)
    if (!varInfo) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '变量不存在',
        markClass: 'iw-editor-formula--error'
      })
      return VerifyResult.HIT
    }
    if (varInfo.kind !== expectedOutputKind && expectedOutputKind !== VarKind.ANY) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '期望返回格式为[' + expectedOutputKind + '],实际为[' + varInfo.kind + ']',
        markClass: 'iw-editor-formula--error'
      })
    }
  } else {
    if (!node.firstChild?.nextSibling?.firstChild) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '函数格式错误',
        markClass: 'iw-editor-formula--error'
      })
      return VerifyResult.HIT
    }
    let funInfo = (ns.items as FunInfo[]).find((item) => item.name === name)
    if (!funInfo) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '函数不存在',
        markClass: 'iw-editor-formula--error'
      })
      return VerifyResult.HIT
    }

    let tempParamNode = node.firstChild?.nextSibling?.firstChild!

    let paramStartOffset = tempParamNode.nextSibling!.from - 1
    if (funInfo.output.kind !== expectedOutputKind && expectedOutputKind !== VarKind.ANY) {
      diagnostics.push({
        // 只标记方法体
        from: node.from,
        to: paramStartOffset,
        severity: 'error',
        message: '期望返回格式为[' + expectedOutputKind + '],实际为[' + funInfo.output.kind + ']',
        markClass: 'iw-editor-formula--error'
      })
    }

    let paramIdx = 0
    while (tempParamNode.nextSibling != null) {
      tempParamNode = tempParamNode.nextSibling!
      let paramName = tempParamNode.name
      if (paramName === '(' || paramName === ')' || paramName === ',') {
        continue
      }
      if (funInfo.input.length <= paramIdx) {
        diagnostics.push({
          // 只标记过长的参数
          from: tempParamNode.from,
          to: node.to - 1,
          severity: 'error',
          message: '期望参数长度为[' + funInfo.input.length + '],实际为[' + (paramIdx + 1) + ']',
          markClass: 'iw-editor-formula--error'
        })
        break
      }

      if (paramName === 'CallExpression' || paramName === 'MemberExpression' || paramName === 'VariableName') {
        verifyExprParamOrVarGuards(tempParamNode, view, funInfo.input[paramIdx].kind, diagnostics)
      } else {
        let paramKind = null
        switch (paramName) {
          case 'String': {
            paramKind = VarKind.STRING
            break
          }
          case 'Number': {
            paramKind = VarKind.NUMBER
            break
          }
          case 'BooleanLiteral': {
            paramKind = VarKind.BOOLEAN
            break
          }
          case 'null': {
            paramKind = VarKind.NULL
            break
          }
          case 'ArrayExpression': {
            // TODO
            paramKind = VarKind.STRINGS
            break
          }
          default: {
            paramKind = VarKind.ANY
          }
        }
        if (funInfo.input[paramIdx].kind !== paramKind && funInfo.input[paramIdx].kind !== VarKind.ANY) {
          diagnostics.push({
            // 只标记错误的参数
            from: tempParamNode.from,
            to: tempParamNode.to,
            severity: 'error',
            message: '期望参数格式为[' + funInfo.input[paramIdx].kind + '],实际为[' + paramKind + ']',
            markClass: 'iw-editor-formula--error'
          })
        }
      }
      if (funInfo.input.length - 1 !== paramIdx || !funInfo.isVarLen) {
        paramIdx++
      }
    }
    if (paramIdx == 0 && funInfo.input.length !== 0 && !funInfo.isVarLen) {
      diagnostics.push({
        // 只标记()
        from: paramStartOffset,
        to: node.to,
        severity: 'error',
        message: '期望参数长度为[' + funInfo.input.length + '],实际为[0]',
        markClass: 'iw-editor-formula--error'
      })
    }
  }
  return VerifyResult.HIT
}

const ExprParamLinter = linter((view) => {
  let diagnostics: Diagnostic[] = esLint(new eslint.Linter(), {
    // eslint configuration
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    env: {
      browser: true,
      node: true
    }
  })(view)

  let traceOffset = 0
  syntaxTree(view.state)
    .topNode.cursor()
    .iterate((node) => {
      if (traceOffset <= node.from && verifyExprParamOrVarGuards(node.node, view, props.targetVar.kind, diagnostics) !== VerifyResult.IGNORE) {
        traceOffset = node.to
      }
    })
  document.querySelectorAll('.iw-editor-formula__key-word').forEach((element) => {
    element.classList.remove('iw-editor-formula--error')
  })
  diagnostics.forEach((diagnostic) => {
    if (diagnostic.source === 'eslint') {
      if (diagnostic.message.includes('Parsing error: Unexpected token')) {
        diagnostic.message = '公式语法错误'
        delete diagnostic.source
      }
    } else {
      let view: EditorView = codeEditor.value?.view
      let posCoords = view.coordsAtPos(diagnostic.from)
      if (posCoords) {
        // 处理border-radius导致的偏移
        const element = document.elementFromPoint(posCoords.left + 10, posCoords.top + 10)
        if (element?.className.includes('iw-editor-formula__key-word')) {
          element?.classList.add('iw-editor-formula--error')
        }
      }
    }
  })
  return diagnostics
})

const cmExtensions: Extension[] = [
  keyWordPlugin,
  highlightSpecialChars(),
  history(),
  drawSelection(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion({
    override: [completions]
  }),
  highlightSelectionMatches(),
  javascript(),
  ExprParamLinter,
  keymap.of([...defaultKeymap, ...historyKeymap])
]

// -----------------------------

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

function insertMaterial(namespace: string, name: string) {
  let view: EditorView = codeEditor.value?.view
  const state = view.state
  const range = state.selection.ranges[0]
  let isVar = props.materials.find((ns) => ns.name == namespace)?.isVar ?? false
  let text
  if (isVar) {
    text = props.entrance + '.' + namespace + '.' + name + ' '
  } else {
    text = props.entrance + '.' + namespace + '.' + name + '()'
  }
  view.dispatch({
    changes: {
      from: range.from,
      to: range.to,
      insert: text
    },
    selection: { anchor: isVar ? range.to + text.length : range.to + text.length - 1 }
  })
}

const materialNote = ref<String>('')
</script>

<template>
  <div class="iw-editor">
    <el-row class="iw-editor-toolbar">
      <el-col :span="12">{{ props.targetVar.label }} =</el-col>
      <el-col :span="12" class="iw-editor-toolbar__opt"><el-button :icon="VideoPlay" link>调试</el-button><el-button :icon="EditPen" link>代码模式</el-button></el-col>
    </el-row>
    <el-row class="iw-editor-formula">
      <code-mirror class="iw-editor-formula--size" ref="codeEditor" v-model="formula" wrap placeholder="在此输入公式" :extensions="cmExtensions" />
    </el-row>
    <el-row class="iw-editor-material">
      <el-col class="iw-editor-material__var-wrapper" :span="6">
        <el-input placeholder="搜索变量" :prefix-icon="Search" />
        <el-tabs tab-position="bottom">
          <template v-for="materialVar in materialVars">
            <el-tab-pane :label="materialVar.nsLabel">
              <el-tree :data="materialVar.items" node-key="id" accordion empty-text="暂无数据">
                <template #default="{ node, data }">
                  <div class="iw-editor-material__item" @click="node.isLeaf && insertMaterial(materialVar.nsName, data.name)">
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
                        @click="node.isLeaf && insertMaterial(materialFun.nsName, data.name)"
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

  .cm-focused {
    outline: none;
  }

  .cm-line {
    font-size: 14pt;
  }

  .cm-lintRange-error {
    background-image: none;
  }

  .cm-tooltip.cm-tooltip-autocomplete {
    border-radius: 4px;
    font-size: 12pt;
  }

  .cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected] {
    border-radius: 4px;
  }

  .cm-tooltip.cm-tooltip-autocomplete > ul > li {
    padding: 2px 0;
  }

  @include m(error) {
    border-radius: 4px;
    border-bottom: 3px solid red;
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

  .el-tabs__nav-wrap::after{
    background-color: none;
  }
}
</style>
