import { SyntaxNode } from '@lezer/common'
import { iwInterface } from './index'
import { Diagnostic } from '@codemirror/lint'
import { Namespace } from './interface'
import { EditorState } from '@codemirror/state'
import i18n from '../i18n'
const { t } = i18n.global

/**
 * Add diagnostic information
 *
 * @param diagnostics diagnostic information collection
 * @param message error description
 * @param from The starting position of the error in the formula
 * @param to wrong ending group in formula
 */
function addDiagnostic(diagnostics: Diagnostic[], message: string, from: number, to: number) {
  diagnostics.push({
    from: from,
    to: to,
    severity: 'error',
    message: message,
    markClass: 'iw-cm-wrap--error',
  })
}

/**
 * Diagnose errors in formulas
 *
 * @param currNode current node error
 * @param state formula state
 * @param expectedOutputKind expected output type
 * @param diagnostics diagnostic collection
 * @param entrance material entrance variable name
 * @param diagnosedNode The start and end position of the diagnosed node
 * @param findMaterials Query material information
 * @param processHit material hit processing
 * 
 * E.g.
 * code:
 * $.fun.concat($.fun.sum(1, $.field.age),3, true, ['1','2'], 'string', null, $.param.someVar)
 *
 * syntaxTree:
 *  CallExpression(
 *    MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName),
 *    ArgList(
 *      '(',
 *      CallExpression(
 *        MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName),
 *        ArgList('(', Number, ',', MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName), ')')
 *      ),
 *      ',',
 *      Number,
 *      ',',
 *      BooleanLiteral,
 *      ',',
 *      ArrayExpression('[', String, ',', String, ']'),
 *      ',',
 *      String,
 *      ',',
 *      null,
 *      ',',
 *      MemberExpression(MemberExpression(VariableName, '.', PropertyName), '.', PropertyName),
 *      ')'
 *    )
 *  ) 
 */
export function diagnosticFormula(currNode: SyntaxNode, state: EditorState, expectedOutputKind: iwInterface.VarKind, diagnostics: Diagnostic[], entrance: string, diagnosedNode: [number, number][], findMaterials: (ns: string) => Namespace | undefined, processHit: (name: string) => void): void {
  // console.debug('#node:' + currNode + '#from:' + currNode.from + '#to:' + currNode.to + '#kind' + expectedOutputKind)

  /**
   * Exclude processed tokens
   */
  if (diagnosedNode.find(offset => {
    let from = offset[0]
    let to = offset[1]
    return from <= currNode.from && to >= currNode.to
  })) {
    return
  }

  /**
   * ----------------------------------
   * Basic type processing
   * ----------------------------------
   */
  let paramKind = null
  switch (currNode.name) {
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
  }
  if (paramKind != null) {
    if (expectedOutputKind !== paramKind && expectedOutputKind !== iwInterface.VarKind.ANY) {
      addDiagnostic(diagnostics, t('diagnostic.format_error', { 'expect': t('data_kind.' + expectedOutputKind), 'real': t('data_kind.' + paramKind) }), currNode.from, currNode.to)
    }
    diagnosedNode.push([currNode.from, currNode.to])
    return
  }

  /**
  * ----------------------------------
  * Parentheses expression processing
  * ----------------------------------
  */
  if (currNode.name === 'ParenthesizedExpression') {
    // (1+0+3)
    // ParenthesizedExpression("(",BinaryExpression(BinaryExpression(Number,ArithOp,Number),ArithOp,Number),")")
    let expr = currNode.firstChild?.nextSibling
    if (!expr) {
      addDiagnostic(diagnostics, t('diagnostic.bracket_error'), currNode.from, currNode.to)
      diagnosedNode.push([currNode.from, currNode.to])
      return
    }
    diagnosticFormula(expr, state, expectedOutputKind, diagnostics, entrance, diagnosedNode, findMaterials, processHit)
    return
  }

  /**
  * ----------------------------------
  * Binary expression processing
  * ----------------------------------
  */
  if (currNode.name === 'BinaryExpression') {
    // $.field.age>3
    // BinaryExpression(MemberExpression(MemberExpression(VariableName, ".", PropertyName), ".", PropertyName), CompareOp, Number)
    let left = currNode.firstChild
    let op = left?.nextSibling
    let right = op?.nextSibling
    if (!left || !op || !right) {
      addDiagnostic(diagnostics, t('diagnostic.binary_expression_error'), currNode.from, currNode.to)
      diagnosedNode.push([currNode.from, currNode.to])
      return
    }
    // Under comparison operators, the left and right sides can be of any type
    let expectedInputKind = op.name === 'CompareOp' ? iwInterface.VarKind.ANY : expectedOutputKind
    diagnosticFormula(left, state, expectedInputKind, diagnostics, entrance, diagnosedNode, findMaterials, processHit)
    diagnosticFormula(right, state, expectedInputKind, diagnostics, entrance, diagnosedNode, findMaterials, processHit)
    return
  }

  /**
  * ----------------------------------
  * Conditional expression processing
  * ----------------------------------
  */
  if (currNode.name === 'ConditionalExpression') {
    // false?'1':$.field.age>3?(1?'222':'333'):'22'
    // ConditionalExpression(
    //   BooleanLiteral, LogicOp, String, LogicOp, ConditionalExpression(
    //     BinaryExpression(MemberExpression(MemberExpression(VariableName, ".", PropertyName), ".", PropertyName), CompareOp, Number),
    //     LogicOp,
    //     ParenthesizedExpression("(", ConditionalExpression(
    //       Number, LogicOp, String, LogicOp, String
    //       ), ")"),
    //     LogicOp,
    //     String
    //   )
    // )
    let cond = currNode.firstChild
    let trueResult = cond?.nextSibling?.nextSibling
    let falseResult = trueResult?.nextSibling?.nextSibling
    if (!cond || !trueResult || !falseResult) {
      addDiagnostic(diagnostics, t('diagnostic.conditional_expression_error'), currNode.from, currNode.to)
      diagnosedNode.push([currNode.from, currNode.to])
      return
    }
    diagnosticFormula(cond, state, iwInterface.VarKind.BOOLEAN, diagnostics, entrance, diagnosedNode, findMaterials, processHit)
    diagnosticFormula(trueResult, state, expectedOutputKind, diagnostics, entrance, diagnosedNode, findMaterials, processHit)
    diagnosticFormula(falseResult, state, expectedOutputKind, diagnostics, entrance, diagnosedNode, findMaterials, processHit)
    return
  }

  /**
  * ----------------------------------
  * Contains material token processing
  * ----------------------------------
  */
  let kind = null
  let memberName: string
  if (currNode.name === 'CallExpression' && currNode.firstChild?.name === 'MemberExpression' && currNode.firstChild?.firstChild?.name === 'MemberExpression' && currNode.firstChild?.nextSibling?.name === 'ArgList') {
    kind = 'expr'
    memberName = state.sliceDoc(currNode.firstChild?.from, currNode.firstChild?.to)
  } else if (currNode.name === 'MemberExpression' && currNode.firstChild?.name === 'MemberExpression') {
    kind = 'var'
    memberName = state.sliceDoc(currNode.from, currNode.to)
  } else if (currNode.name === 'VariableName') {
    // Custom variables are not supported
    addDiagnostic(diagnostics, t('diagnostic.var_fun_not_exist_error'), currNode.from, currNode.to)
    diagnosedNode.push([currNode.from, currNode.to])
    return
  } else {
    return
  }

  if (!memberName.startsWith(entrance + '.')) {
    return
  }
  let memberNameSplit = memberName.split('.')
  let namespace = memberNameSplit[1]
  let name = memberNameSplit[2]
  let ns = findMaterials(namespace)
  if (!ns) {
    addDiagnostic(diagnostics, t('diagnostic.namespace_not_exist_error'), currNode.from, currNode.to)
    diagnosedNode.push([currNode.from, currNode.to])
    return
  }

  if (kind === 'var') {
    let varInfo = (ns.items as iwInterface.VarInfo[]).find((item) => item.name === name)
    if (!ns.isVar || !varInfo) {
      addDiagnostic(diagnostics, t('diagnostic.var_not_exist_error'), currNode.from, currNode.to)
      diagnosedNode.push([currNode.from, currNode.to])
      return
    }
    if (varInfo.kind !== expectedOutputKind && expectedOutputKind !== iwInterface.VarKind.ANY) {
      diagnostics.push({
        from: currNode.from,
        to: currNode.to,
        severity: 'error',
        message: t('diagnostic.format_error', { 'expect': t('data_kind.' + expectedOutputKind), 'real': t('data_kind.' + varInfo.kind) }),
        markClass: 'iw-cm-wrap--error',
      })
    }
  } else {
    if (!currNode.firstChild?.nextSibling?.firstChild) {
      addDiagnostic(diagnostics, t('diagnostic.fun_format_error'), currNode.from, currNode.to)
      diagnosedNode.push([currNode.from, currNode.to])
      return
    }
    let funInfo = (ns.items as iwInterface.FunInfo[]).find((item) => item.name === name)
    if (!funInfo) {
      addDiagnostic(diagnostics, t('diagnostic.fun_not_exist_error'), currNode.from, currNode.to)
      diagnosedNode.push([currNode.from, currNode.to])
      return
    }

    let tempParamNode = currNode.firstChild?.nextSibling?.firstChild!
    let paramStartOffset = tempParamNode.nextSibling!.from - 1
    if (funInfo.output.kind !== expectedOutputKind && expectedOutputKind !== iwInterface.VarKind.ANY && funInfo.output.kind !== iwInterface.VarKind.ANY) {
      // Only mark the method body. If it is an asynchronous function, you need to subtract the length of `await`
      addDiagnostic(diagnostics, t('diagnostic.format_error', { 'expect': t('data_kind.' + expectedOutputKind), 'real': t('data_kind.' + funInfo.output.kind) }), currNode.from + (funInfo.isAsync ? -6 : 0), paramStartOffset)
    }

    // Function parameter checking
    let paramIdx = 0
    let realParamLen = 0
    while (tempParamNode.nextSibling != null) {
      tempParamNode = tempParamNode.nextSibling!
      let paramName = tempParamNode.name
      if (paramName === '(' || paramName === ')' || paramName === ',') {
        continue
      }
      if (funInfo.input.length <= paramIdx) {
        // Only mark parameters that are too long
        addDiagnostic(diagnostics, t('diagnostic.param_length_error', { 'expect': funInfo.input.length, 'real': (paramIdx + 1) }), tempParamNode.from, currNode.to - 1)
        break
      }
      let tempInputKind = funInfo.input[paramIdx].kind
      tempParamNode.cursor()
        .iterate((node) => {
          diagnosticFormula(node.node, state, tempInputKind, diagnostics, entrance, diagnosedNode, findMaterials, processHit)
        })
      if (funInfo.input.length - 1 !== paramIdx || !funInfo.isVarLen) {
        // This judgment is used to ensure that when the last parameter is a variable-length parameter, it will not be included in the actual parameter length.
        paramIdx++
      }
      realParamLen++
    }
    if (paramIdx === 0 && funInfo.input.length !== 0 && !funInfo.isVarLen) {
      // Only mark () 
      addDiagnostic(diagnostics, t('diagnostic.param_length_error', { 'expect': funInfo.input.length, 'real': 0 }), paramStartOffset, currNode.to)
    }
    if (realParamLen === 0 && funInfo.isVarLen) {
      // Only mark functions
      addDiagnostic(diagnostics, t('diagnostic.param_not_exist_error'), currNode.from, paramStartOffset)
    }
  }
  // Process hit
  processHit(entrance + '.' + namespace + '.' + name)
  diagnosedNode.push([currNode.from, currNode.to])
  return
}