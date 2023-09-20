<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref, type Ref } from 'vue'
import { VideoPlay, EditPen, Search } from '@element-plus/icons-vue'
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
      color: '#d44',
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
      color: '#700',
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
      color: '#e2aa53',
      items: [
        {
          name: 'sum',
          label: '求和',
          note: `获取一组数值的总和。
用法：SUM(数字1,数字2,...)。
示例：SUM(语文成绩,数学成绩, 英语成绩)返回三门课程的总分。`,
          input: [
            {
              kind: VarKind.STRING
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
            kind: VarKind.NUMBER
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
  formula: `$.fun.connect($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',null,$.param.someVar)`,
  entrance: '$'
})

const formula: Ref<string> = ref(props.formula)

// -----------------------------------------

// const $ = {
// fun:{
//       sum: (a,b)=> a+b
//    },
// }

// function sum(a,b){
//   return a+b
// }

// function add(a,b){
//   return a+b
// }
//  $.fun.sum(1+$.field.age)>20? $.param.age: $.field.age

// -----------------------------

const codeEditor: Ref<InstanceType<typeof CodeMirror> | undefined> = ref()

// placeholderMatcher
const placeholderMatcher = new MatchDecorator({
  regexp: new RegExp('\\' + props.entrance + '\\.(\\w+\\.\\w+)', 'g'),
  decoration: (match) =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[1])
    })
})

//placeholderPlugin
const placeholders = ViewPlugin.fromClass(
  class {
    placeholders: DecorationSet
    constructor(view: EditorView) {
      this.placeholders = placeholderMatcher.createDeco(view)
    }
    update(update: ViewUpdate) {
      this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)
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

// placeholderWidget
class PlaceholderWidget extends WidgetType {
  constructor(readonly name: string) {
    super()
  }
  eq(other: PlaceholderWidget) {
    return this.name == other.name
  }
  toDOM() {
    let namespace = this.name.split('.')[0]
    let name = this.name.split('.')[1]
    let color = props.materials.find((ns) => ns.name === namespace)?.color || 'lightblue'
    let elt = document.createElement('span')
    elt.style.cssText =
      `
      border-radius: 4px;
      padding: 0 3px;
      background: ` +
      color +
      `;`
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
  if ((nsMatch == null || (nsMatch.from == nsMatch.to && !context.explicit)) && (nameMatch == null || (nameMatch.from == nameMatch.to && !context.explicit))) {
    return null
  }
  if (nsMatch != null) {
    return {
      from: nsMatch.from,
      options: props.materials.map((ns) => {
        return { label: props.entrance + '.' + ns.name, type: 'variable', detail: ns.label }
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
            return { label: fullName, type: 'variable', detail: item.label }
          } else {
            let offset = (item as FunInfo).name.length + 1
            return {
              label: fullName,
              type: 'variable',
              detail: item.label,
              apply: (view: EditorView, completion: Completion, from: number, to: number) => {
                view.dispatch({
                  changes: { from, to, insert: fullName + '()' },
                  selection: {
                    anchor: to + offset,
                    head: to + offset
                  }
                })
              }
            }
          }
        }) ?? []
    }
  } else {
    return null
  }
}

import { syntaxTree } from '@codemirror/language'
import { Diagnostic } from '@codemirror/lint'

function verifyExprParamOrVarGuards(node: SyntaxNode, view: EditorView, expectedOutputKind: VarKind, diagnostics: Diagnostic[]): boolean {
  // E.g.
  // code:
  // $.fun.connect($.fun.sum(1, $.field.age),3, true, ['1','2'], 'string', null, $.param.someVar)
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
  if (node.name === 'CallExpression' && node.firstChild?.name === 'MemberExpression' && node.firstChild?.firstChild?.name === 'MemberExpression' && node.firstChild?.nextSibling?.name === 'ArgList') {
    kind = 'expr'
  } else if (node.name === 'MemberExpression' && node.firstChild?.name === 'MemberExpression') {
    kind = 'var'
  } else {
    return true
  }

  let memberName = view.state.sliceDoc(node.node.firstChild?.from, node.node.firstChild?.to)
  if (!memberName.startsWith(props.entrance + '.')) {
    return true
  }
  let memberNameSplit = memberName.split('.')
  let namespace = memberNameSplit[0]
  let name = memberNameSplit[1]
  let ns = props.materials.find((ns) => ns.name === namespace)
  if (!ns) {
    return true
  }

  if (kind === 'var') {
    let varInfo = (ns.items as VarInfo[]).find((item) => item.name === name)
    if (!varInfo) {
      return true
    }
    if (varInfo.kind !== expectedOutputKind) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '期望返回格式为[' + expectedOutputKind + '],实际为[' + varInfo.kind + ']',
        actions: [
          {
            name: '删除',
            apply(view, from, to) {
              view.dispatch({ changes: { from, to } })
            }
          }
        ]
      })
      return false
    }
    return true
  }

  if (!node.firstChild?.nextSibling?.firstChild) {
    // not found params
    return true
  }
  let funInfo = (ns.items as FunInfo[]).find((item) => item.name === name)
  if (!funInfo) {
    return true
  }

  let tempParamNode = node.firstChild?.nextSibling?.firstChild!
  let paramIdx = 0
  while (tempParamNode.nextSibling != null) {
    tempParamNode = tempParamNode.nextSibling!
    let paramName = tempParamNode.name
    if (paramName === '(' || paramName === ')' || paramName === ',') {
      continue
    }
    if (funInfo.input.length <= paramIdx) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '期望参数长度为[' + funInfo.input.length + '],实际为[' + (paramIdx + 1) + ']',
        actions: [
          {
            name: '删除',
            apply(view, from, to) {
              view.dispatch({ changes: { from, to } })
            }
          }
        ]
      })
      return false
    }

    if (paramName === 'MemberExpression') {
      if (!verifyExprParamOrVarGuards(tempParamNode, view, funInfo.input[paramIdx].kind, diagnostics)) {
        return false
      }
    }
    let kindError = false
    switch (funInfo.input[paramIdx].kind) {
      case VarKind.STRING: {
        kindError = paramName !== 'String'
        break
      }
      case VarKind.NUMBER: {
        kindError = paramName !== 'Number'
        break
      }
      case VarKind.BOOLEAN: {
        kindError = paramName !== 'BooleanLiteral'
        break
      }
      case VarKind.NULL: {
        kindError = paramName !== 'null'
        break
      }
      case VarKind.STRINGS: {
        // TODO
        kindError = paramName !== 'ArrayExpression'
        break
      }
      case VarKind.NUMBERS: {
        // TODO
        kindError = paramName !== 'ArrayExpression'
        break
      }
      case VarKind.BOOLEANS: {
        // TODO
        kindError = paramName !== 'ArrayExpression'
        break
      }
      case VarKind.ANY:
    }
    if (kindError) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '期望参数格式为[' + funInfo.input[paramIdx].kind + '],实际为[' + paramName + ']',
        actions: [
          {
            name: '删除',
            apply(view, from, to) {
              view.dispatch({ changes: { from, to } })
            }
          }
        ]
      })
      return false
    }
    if (funInfo.input.length - 1 !== paramIdx || !funInfo.isVarLen) {
      paramIdx++
    }
  }
  return true
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

  syntaxTree(view.state)
    .cursor()
    .iterate((node) => {
      verifyExprParamOrVarGuards(node.node, view, VarKind.STRING, diagnostics)
    })
  return diagnostics
})

const cmExtensions: Extension[] = [
  placeholders,
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

interface materialTree {
  id: string
  label: string
  note: string
  children?: materialTree[]
}

const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    ;(acc[predicate(value, index, array)] ||= []).push(value)
    return acc
  }, {} as { [key: string]: T[] })

const materialVars = props.materials
  .filter((ns) => ns.isVar)
  .map((ns) => {
    let byCates = (ns.items as VarInfo[])
      .map((item) => {
        return (
          item.cates?.map((cate) => {
            return {
              id: item.name!,
              label: item.name!,
              note: item.label ?? '',
              cate: cate
            }
          }) ?? [
            {
              id: '',
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
        label: cate,
        note: '',
        children: grouped[cate]
      })
    }
    return {
      ns: ns.label,
      items: items
    }
  })

const materialFuns = props.materials
  .filter((ns) => !ns.isVar)
  .map((ns) => {
    let byCates = (ns.items as FunInfo[])
      .map((item) => {
        return (
          item.cates?.map((cate) => {
            return {
              id: item.name,
              label: item.name,
              note: item.label ?? '',
              cate: cate
            }
          }) ?? [
            {
              id: '',
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
        label: cate,
        note: '',
        children: grouped[cate]
      })
    }
    return {
      ns: ns.label,
      items: items
    }
  })

console.log(materialFuns)
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
        <el-tabs type="border-card" tab-position="bottom">
          <template v-for="materialVar in materialVars">
            <el-tab-pane :label="materialVar.ns">
              <el-tree :data="materialVar.items" node-key="id" accordion empty-text="暂无数据">
                <template #default="{ node }">
                  <div class="iw-editor-material__var-item">
                    <p class="iw-editor-material__var-item-tile">{{ node.label }}</p>
                    <p class="iw-editor-material__var-item-note">
                      {{
                        materialVar.items
                          .map((item) => item.children)
                          .flat()
                          .find((item) => item.label === node.label)?.note
                      }}
                    </p>
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
            <el-tabs type="border-card" tab-position="bottom">
              <template v-for="materialFun in materialFuns">
                <el-tab-pane :label="materialFun.ns">
                  <el-tree :data="materialFun.items" node-key="id" accordion empty-text="暂无数据">
                    <template #default="{ node }">
                      <div class="iw-editor-material__var-item">
                        <p class="iw-editor-material__var-item-tile">{{ node.label }}</p>
                        <p class="iw-editor-material__var-item-note">
                          {{
                            materialFun.items
                              .map((item) => item.children)
                              .flat()
                              .find((item) => item.label === node.label)?.note
                          }}
                        </p>
                      </div>
                    </template>
                  </el-tree>
                </el-tab-pane>
              </template>
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

  .cm-focused {
    outline: none;
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
