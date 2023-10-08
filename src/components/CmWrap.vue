<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Extension } from '@codemirror/state'
import { Decoration, DecorationSet, drawSelection, EditorView, highlightSpecialChars, keymap, MatchDecorator, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view'
import { bracketMatching, defaultHighlightStyle, indentOnInput, syntaxHighlighting, syntaxTree } from '@codemirror/language'
import { autocompletion, closeBrackets, Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { highlightSelectionMatches } from '@codemirror/search'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import CodeMirror from 'vue-codemirror6'
import { Diagnostic, linter } from '@codemirror/lint'
import * as eslint from 'eslint-linter-browserify'
import { esLint, javascript } from '@codemirror/lang-javascript'
import { iwInterface } from '../processes'
import { diagnosticFormula } from '../processes/cmEditor'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

export interface FormulaResult {
  value: string
  pass: boolean
  materials: string[]
}

interface Props {
  targetGuard: iwInterface.VarGuard
  materials: iwInterface.Namespace[]
  formulaValue: string
  entrance?: string
}

const emit = defineEmits(['updateFormulaResult'])

const props = withDefaults(defineProps<Props>(), {
  formulaValue: '',
  entrance: '$',
})

const formulaResult = reactive<FormulaResult>({
  value: props.formulaValue,
  pass: true,
  materials: [],
})

const codeEditor = ref<InstanceType<typeof CodeMirror> | undefined>()

// --------------------------------------
// Decoration processing of material keywords
// --------------------------------------

class IwEditorKeywordsWidget extends WidgetType {
  constructor(readonly name: string) {
    super()
  }

  eq(other: IwEditorKeywordsWidget) {
    return this.name == other.name
  }

  toDOM() {
    let namespace = this.name.split('.')[0]
    let name = this.name.split('.')[1]
    let ns = props.materials.find((ns) => ns.name === namespace)
    let label = name
    if (ns?.showLabel) {
      label = ns?.isVar
        ? (ns.items as iwInterface.VarInfo[]).find((item) => item.name === name)?.label ?? name
        : (ns.items as iwInterface.FunInfo[]).find((item) => item.name === name)?.label ?? name
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

const IwEditorKeywordsMatcher = new MatchDecorator({
  regexp: new RegExp('(await )?\\' + props.entrance + '\\.(\\w+\\.\\w+)', 'g'),
  decoration: (match) =>
    Decoration.replace({
      widget: new IwEditorKeywordsWidget(match[2]),
    }),
})

const iwEditorKeywordsPlugin = ViewPlugin.fromClass(
  class {
    placeholders: DecorationSet

    constructor(view: EditorView) {
      this.placeholders = IwEditorKeywordsMatcher.createDeco(view)
    }

    update(update: ViewUpdate) {
      this.placeholders = IwEditorKeywordsMatcher.updateDeco(update, this.placeholders)
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none
      }),
  },
)

// --------------------------------------
// Automatic material processing
// --------------------------------------

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
      }),
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
            let isAsync = (ns?.items as iwInterface.FunInfo[]).find((i) => i.name === item.name)?.isAsync
            let offset = (isAsync ? '(await '.length : 0) + fullName.length + 1
            return {
              label: fullName,
              type: 'function',
              detail: item.label,
              apply: (view: EditorView, completion: Completion, from: number, to: number) => {
                view.dispatch({
                  changes: {
                    from,
                    to,
                    insert: (isAsync ? '(await ' : '') + fullName + '()' + (isAsync ? ')' : ''),
                  },
                  selection: {
                    anchor: from + offset,
                    head: from + offset,
                  },
                })
              },
            }
          }
        }) ?? [],
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
                apply: fullName + ' ',
              } as Completion
            })
        } else {
          return (ns.items as iwInterface.FunInfo[])
            .filter((item) => item.name.startsWith(text))
            .map((item) => {
              let fullName = props.entrance + '.' + ns.name + '.' + item.name
              let isAsync = (ns?.items as iwInterface.FunInfo[]).find((i) => i.name === item.name)?.isAsync
              let offset = (isAsync ? '(await '.length : 0) + fullName.length + 1
              return {
                label: item.name,
                type: 'function',
                detail: item.label + '(' + ns.label + ')',
                apply: (view: EditorView, completion: Completion, from: number, to: number) => {
                  view.dispatch({
                    changes: {
                      from,
                      to,
                      insert: (isAsync ? '(await ' : '') + fullName + '()' + (isAsync ? ') ' : ''),
                    },
                    selection: {
                      anchor: from + offset,
                      head: from + offset,
                    },
                  })
                },
              } as Completion
            })
        }
      })
      .flat()
    return {
      from: wordMatch.from,
      options: options,
    }
  } else {
    return null
  }
}

// --------------------------------------
// Formula format diagnostic processing
// --------------------------------------

const iwEditorLinter = linter((view) => {
  let diagnostics: Diagnostic[] = esLint(new eslint.Linter(), {
    // eslint configuration
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    env: {
      browser: true,
      node: true,
    },
  })(view)

  let verifiedNode: [number, number][] = []
  formulaResult.materials = []
  syntaxTree(view.state)
    .topNode.cursor()
    .iterate((node) => {
      diagnosticFormula(
        node.node,
        view.state,
        props.targetGuard.kind,
        diagnostics,
        props.entrance,
        verifiedNode,
        (namespace) => props.materials.find((ns) => ns.name === namespace),
        (name) => {
          if (!formulaResult.materials.includes(name)) {
            formulaResult.materials.push(name)
          }
        },
      )
    })

  document.querySelectorAll('.iw-cm-wrap__key-word').forEach((element) => {
    element.classList.remove('iw-cm-wrap--error')
  })
  diagnostics.forEach((diagnostic) => {
    if (diagnostic.source === 'eslint') {
      if (diagnostic.message.includes('Parsing error: Unterminated string constant')) {
        diagnostic.message = t('diagnostic.unterminated_string_constant')
      } else {
        diagnostic.message = t('diagnostic.syntax_error')
      }
      delete diagnostic.source
    } else {
      let posCoords = view.coordsAtPos(diagnostic.from)
      if (posCoords) {
        // Process offset caused by border radius
        const element = document.elementFromPoint(posCoords.left + 10, posCoords.top + 10)
        if (element?.className.includes('iw-cm-wrap__key-word')) {
          // Add error styling to material decorator
          element?.classList.add('iw-cm-wrap--error')
        }
      }
    }
  })
  formulaResult.pass = diagnostics.length === 0
  // Notify formula result updates
  emit('updateFormulaResult', formulaResult)
  return diagnostics
})

// --------------------------------------
// Receive material inserted into formula
// --------------------------------------

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
    text = (isAsync ? '(await ' : '') + props.entrance + '.' + namespace + '.' + name + '()' + (isAsync ? ')' : '')
  }
  view.dispatch({
    changes: {
      from: range.from,
      to: range.to,
      insert: text,
    },
    selection: { anchor: isVar ? range.to + text.length : range.to + text.length - 1 },
  })
}

defineExpose({
  insertMaterial,
})

// -----------------------------

const cmExtensions: Extension[] = [
  iwEditorKeywordsPlugin,
  highlightSpecialChars(),
  history(),
  drawSelection(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion({
    override: [completions],
  }),
  highlightSelectionMatches(),
  javascript(),
  iwEditorLinter,
  keymap.of([...defaultKeymap, ...historyKeymap]),
]
</script>

<template>
  <code-mirror class="iw-cm-wrap" ref="codeEditor" v-model="formulaResult.value" wrap :placeholder="$t('editor.placeholder')" :extensions="cmExtensions" />
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
