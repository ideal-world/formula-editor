<script setup lang="ts">
import {reactive, ref} from 'vue'
import {Extension} from '@codemirror/state'
import {
  highlightSpecialChars,
  drawSelection,
  MatchDecorator,
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  keymap
} from '@codemirror/view'
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  syntaxTree
} from '@codemirror/language'
import {autocompletion, closeBrackets, Completion, CompletionResult, CompletionContext} from '@codemirror/autocomplete'
import {highlightSelectionMatches} from '@codemirror/search'
import {history, defaultKeymap, historyKeymap} from '@codemirror/commands'
import CodeMirror from 'vue-codemirror6'
import {linter, Diagnostic} from '@codemirror/lint'
import * as eslint from 'eslint-linter-browserify'
import {esLint, javascript} from '@codemirror/lang-javascript'
import {SyntaxNode, Tree} from '@lezer/common'
import {iwInterface} from '../processes'

export interface FormulaResult {
  value: string
  pass: boolean
  materials: string[]
}

interface Props {
  targetGuard: iwInterface.VarGuard
  materials: iwInterface.Namespace[]
  formulaValue: string
  entrance: string | null
}

const emit = defineEmits(['updateFormulaResult'])

const props = withDefaults(defineProps<Props>(), {
  formulaValue: '',
  entrance: '$'
})

const formulaResult = reactive<FormulaResult>({
  value: props.formulaValue,
  pass: true,
  materials: []
})

const codeEditor = ref<InstanceType<typeof CodeMirror> | undefined>()

// -----------------------------

const keyWordMatcher = new MatchDecorator({
  regexp: new RegExp('(await )?\\' + props.entrance + '\\.(\\w+\\.\\w+)', 'g'),
  decoration: (match) =>
      Decoration.replace({
        widget: new KeywordWidget(match[2])
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
    let ns = props.materials.find((ns) => ns.name === namespace)
    let label = name
    if (ns?.showLabel) {
      label = ns?.isVar ? (ns.items as iwInterface.VarInfo[]).find((item) => item.name === name)?.label ?? name : (ns.items as iwInterface.FunInfo[]).find((item) => item.name === name)?.label ?? name
    }
    let color = ns?.color || '#e9e9eb'
    let elt = document.createElement('span')
    elt.style.cssText =
        `
      border-radius: 4px;
      margin: 0 3px;
      padding: 1px 3px;
      background: ` +
        color +
        `;`
    elt.className = 'iw-cm-wrap__key-word'
    elt.textContent = label
    return elt
  }

  ignoreEvent() {
    return false
  }
}

// -----------------------------

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
        return {label: props.entrance + '.' + ns.name, type: 'namespace', detail: ns.label}
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
              return {label: fullName + ' ', type: 'variable', detail: item.label}
            } else {
              let isAsync = (ns?.items as iwInterface.FunInfo[]).find((i) => i.name === item.name)?.isAsync
              let offset = (isAsync ? 'await '.length : 0) + fullName.length + 1
              return {
                label: fullName,
                type: 'function',
                detail: item.label,
                apply: (view: EditorView, completion: Completion, from: number, to: number) => {
                  view.dispatch({
                    changes: {from, to, insert: (isAsync ? 'await ' : '') + fullName + '()'},
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
            return (ns.items as iwInterface.VarInfo[])
                .filter((item) => item.name?.startsWith(text))
                .map((item) => {
                  let fullName = props.entrance + '.' + ns.name + '.' + item.name
                  return {
                    label: item.name,
                    type: 'variable',
                    detail: item.label + '(' + ns.label + ')',
                    apply: fullName + ' '
                  } as Completion
                })
          } else {
            return (ns.items as iwInterface.FunInfo[])
                .filter((item) => item.name.startsWith(text))
                .map((item) => {
                  let fullName = props.entrance + '.' + ns.name + '.' + item.name
                  let isAsync = (ns?.items as iwInterface.FunInfo[]).find((i) => i.name === item.name)?.isAsync
                  let offset = (isAsync ? 'await '.length : 0) + fullName.length + 1
                  return {
                    label: item.name,
                    type: 'function',
                    detail: item.label + '(' + ns.label + ')',
                    apply: (view: EditorView, completion: Completion, from: number, to: number) => {
                      view.dispatch({
                        changes: {from, to, insert: (isAsync ? 'await ' : '') + fullName + '()'},
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

// -----------------------------

enum VerifyResult {
  IGNORE,
  HIT
}

function verifyExprParamOrVarGuards(node: SyntaxNode, view: EditorView, expectedOutputKind: iwInterface.VarKind, diagnostics: Diagnostic[]): VerifyResult {
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
      markClass: 'iw-cm-wrap--error'
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
      markClass: 'iw-cm-wrap--error'
    })
    return VerifyResult.HIT
  }

  if (kind === 'var') {
    let varInfo = (ns.items as iwInterface.VarInfo[]).find((item) => item.name === name)
    if (!varInfo) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '变量不存在',
        markClass: 'iw-cm-wrap--error'
      })
      return VerifyResult.HIT
    }
    if (varInfo.kind !== expectedOutputKind && expectedOutputKind !== iwInterface.VarKind.ANY) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '期望返回格式为[' + expectedOutputKind + '],实际为[' + varInfo.kind + ']',
        markClass: 'iw-cm-wrap--error'
      })
    }
  } else {
    if (!node.firstChild?.nextSibling?.firstChild) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '函数格式错误',
        markClass: 'iw-cm-wrap--error'
      })
      return VerifyResult.HIT
    }
    let funInfo = (ns.items as iwInterface.FunInfo[]).find((item) => item.name === name)
    if (!funInfo) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '函数不存在',
        markClass: 'iw-cm-wrap--error'
      })
      return VerifyResult.HIT
    }
    let tempParamNode = node.firstChild?.nextSibling?.firstChild!

    let paramStartOffset = tempParamNode.nextSibling!.from - 1
    if (funInfo.output.kind !== expectedOutputKind && expectedOutputKind !== iwInterface.VarKind.ANY) {
      diagnostics.push({
        // 只标记方法体，如果是异步函数，需要减去 `await `的长度
        from: node.from + (funInfo.isAsync ? -6 : 0),
        to: paramStartOffset,
        severity: 'error',
        message: '期望返回格式为[' + expectedOutputKind + '],实际为[' + funInfo.output.kind + ']',
        markClass: 'iw-cm-wrap--error'
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
          markClass: 'iw-cm-wrap--error'
        })
        break
      }
      if (paramName === 'CallExpression' || paramName === 'MemberExpression' || paramName === 'VariableName') {
        verifyExprParamOrVarGuards(tempParamNode, view, funInfo.input[paramIdx].kind, diagnostics)
      } else if (paramName === 'ConditionalExpression' || paramName === 'BinaryExpression' || paramName === 'LogicOp' || paramName === 'CompareOp') {
        // $.fun.concat($.fun.now()>0?1:2)
        // ConditionalExpression(BinaryExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),CompareOp,Number),LogicOp,Number,LogicOp,Number)
        // $.fun.sum(1,2)>0?1:2
        // ConditionalExpression(BinaryExpression(CallExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),ArgList("(",Number,",",Number,")")),CompareOp,Number),LogicOp,Number,LogicOp,Number)
        // $.fun.concat($.fun.sum(1)>1?1:$.fun.now(1))
        // ConditionalExpression(BinaryExpression(CallExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),ArgList("(",Number,")")),CompareOp,Number),LogicOp,Number,LogicOp,CallExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),ArgList("(",Number,")")))
        let traceOffset = tempParamNode.from
        let tempInputKind = funInfo.input[paramIdx].kind
        tempParamNode.cursor()
            .iterate((node) => {
              if (traceOffset <= node.from && verifyExprParamOrVarGuards(node.node, view, tempInputKind, diagnostics) !== VerifyResult.IGNORE) {
                traceOffset = node.to
              }
            })
      } else {
        let paramKind = null
        switch (paramName) {
          case 'String': {
            paramKind = iwInterface.VarKind.STRING
            break
          }
          case 'Number': {
            paramKind = iwInterface.VarKind.NUMBER
            break
          }
          case 'BooleanLiteral': {
            paramKind = iwInterface.VarKind.BOOLEAN
            break
          }
          case 'null': {
            paramKind = iwInterface.VarKind.NULL
            break
          }
          case 'ArrayExpression': {
            // TODO
            paramKind = iwInterface.VarKind.STRINGS
            break
          }
          default: {
            paramKind = iwInterface.VarKind.ANY
          }
        }
        if (funInfo.input[paramIdx].kind !== paramKind && funInfo.input[paramIdx].kind !== iwInterface.VarKind.ANY) {
          diagnostics.push({
            // 只标记错误的参数
            from: tempParamNode.from,
            to: tempParamNode.to,
            severity: 'error',
            message: '期望参数格式为[' + funInfo.input[paramIdx].kind + '],实际为[' + paramKind + ']',
            markClass: 'iw-cm-wrap--error'
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
        markClass: 'iw-cm-wrap--error'
      })
    }
  }
  formulaResult.materials.push(props.entrance + '.' + namespace + '.' + name)
  return VerifyResult.HIT
}

const exprParamLinter = linter((view) => {
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
  formulaResult.materials = []
  syntaxTree(view.state)
      .topNode.cursor()
      .iterate((node) => {
        if (traceOffset <= node.from && verifyExprParamOrVarGuards(node.node, view, props.targetGuard.kind, diagnostics) !== VerifyResult.IGNORE) {
          traceOffset = node.to
        }
      })

  document.querySelectorAll('.iw-cm-wrap__key-word').forEach((element) => {
    element.classList.remove('iw-cm-wrap--error')
  })
  diagnostics.forEach((diagnostic) => {
    if (diagnostic.source === 'eslint') {
      if (diagnostic.message.includes('Parsing error: Unterminated string constant')) {
        diagnostic.message = '未终止的字符串常量'
      } else {
        diagnostic.message = '公式语法错误'
      }
      delete diagnostic.source
    } else {
      let view: EditorView = codeEditor.value?.view
      let posCoords = view.coordsAtPos(diagnostic.from)
      if (posCoords) {
        // 处理border-radius导致的偏移
        const element = document.elementFromPoint(posCoords.left + 10, posCoords.top + 10)
        if (element?.className.includes('iw-cm-wrap__key-word')) {
          element?.classList.add('iw-cm-wrap--error')
        }
      }
    }
  })
  formulaResult.pass = diagnostics.length === 0;
  emit('updateFormulaResult', formulaResult)
  return diagnostics
})

// -----------------------------

const insertMaterial = (namespace: string, name: string) => {
  let view: EditorView = codeEditor.value?.view
  const state = view.state
  const range = state.selection.ranges[0]
  let ns = props.materials.find((ns) => ns.name == namespace)
  let isVar = ns?.isVar ?? false
  let text
  if (isVar) {
    text = props.entrance + '.' + namespace + '.' + name + ' '
  } else {
    let isAsync = (ns?.items as iwInterface.FunInfo[]).find((i) => i.name === name)?.isAsync
    text = (isAsync ? 'await ' : '') + props.entrance + '.' + namespace + '.' + name + '()'
  }
  view.dispatch({
    changes: {
      from: range.from,
      to: range.to,
      insert: text
    },
    selection: {anchor: isVar ? range.to + text.length : range.to + text.length - 1}
  })
}

// -----------------------------

const cmExtensions: Extension[] = [
  keyWordPlugin,
  highlightSpecialChars(),
  history(),
  drawSelection(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
  bracketMatching(),
  closeBrackets(),
  autocompletion({
    override: [completions]
  }),
  highlightSelectionMatches(),
  javascript(),
  exprParamLinter,
  keymap.of([...defaultKeymap, ...historyKeymap])
]

// -----------------------------

defineExpose({
  insertMaterial
})
</script>

<template>
  <code-mirror class="iw-cm-wrap" ref="codeEditor" v-model="formulaResult.value" wrap placeholder="在此输入公式"
               :extensions="cmExtensions"/>
</template>

<style lang="scss" scoped></style>

<style lang="scss">
@import '../assets/main.scss';

@include b('cm-wrap') {
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
    padding: 4px;
  }

  .cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected] {
    border-radius: 4px;
    color: var(--el-text-color-primary);
    background-color: var(--el-color-primary-light-8);
  }

  .cm-tooltip.cm-tooltip-autocomplete > ul > li {
    padding: 8px 0;
  }

  @include m(error) {
    border-radius: 4px;
    border-bottom: 3px solid red;
  }
}
</style>
