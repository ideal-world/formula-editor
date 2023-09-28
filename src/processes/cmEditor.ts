import { SyntaxNode } from '@lezer/common'
import { iwInterface } from './index'
import { Diagnostic } from '@codemirror/lint'
import { Namespace } from './interface'
import { EditorState } from '@codemirror/state'


function addDiagnostic(diagnostics: Diagnostic[], message: string, from: number, to: number) {
  diagnostics.push({
    from: from,
    to: to,
    severity: 'error',
    message: message,
    markClass: 'iw-cm-wrap--error',
  })
}

export function verifyExprParamOrVarGuards(node: SyntaxNode, state: EditorState, expectedOutputKind: iwInterface.VarKind, diagnostics: Diagnostic[], entrance: string, verifiedNode: [number, number][], findMaterials: (ns: string) => Namespace | undefined, processHit: (name: string) => void) {
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

  // console.debug('#node:' + node + '#from:' + node.from + '#to:' + node.to + '#kind' + expectedOutputKind)

  // 排除已处理的token
  if (verifiedNode.find(offset => {
    let from = offset[0]
    let to = offset[1]
    return from <= node.from && to >= node.to
  })) {
    return
  }

  // 基本类型处理
  let paramKind = null
  switch (node.name) {
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
      addDiagnostic(diagnostics, '期望格式为[' + expectedOutputKind + '],实际为[' + paramKind + ']', node.from, node.to)
    }
    verifiedNode.push([node.from, node.to])
    return
  }

  // 括号表达式处理
  if (node.name === 'ParenthesizedExpression') {
    // (1+0+3)
    // ParenthesizedExpression("(",BinaryExpression(BinaryExpression(Number,ArithOp,Number),ArithOp,Number),")")
    let expr = node.firstChild?.nextSibling
    if (!expr) {
      addDiagnostic(diagnostics, '括号格式错误', node.from, node.to)
      verifiedNode.push([node.from, node.to])
      return
    }
    verifyExprParamOrVarGuards(expr, state, expectedOutputKind, diagnostics, entrance, verifiedNode, findMaterials, processHit)
    return
  }

  // 二元表达式处理
  if (node.name === 'BinaryExpression') {
    // $.field.age>3
    // BinaryExpression(MemberExpression(MemberExpression(VariableName, ".", PropertyName), ".", PropertyName), CompareOp, Number)
    let left = node.firstChild
    let op = left?.nextSibling
    let right = op?.nextSibling
    if (!left || !op || !right) {
      addDiagnostic(diagnostics, '二元表达式格式错误', node.from, node.to)
      verifiedNode.push([node.from, node.to])
      return
    }
    // 比较运算符下，左右两边可以是任意类型
    let expectedInputKind = op.name === 'CompareOp' ? iwInterface.VarKind.ANY : expectedOutputKind
    verifyExprParamOrVarGuards(left, state, expectedInputKind, diagnostics, entrance, verifiedNode, findMaterials, processHit)
    verifyExprParamOrVarGuards(right, state, expectedInputKind, diagnostics, entrance, verifiedNode, findMaterials, processHit)
    return
  }

  // 条件表达式处理
  if (node.name === 'ConditionalExpression') {
    // false?'1':$.field.age>3?(1?'222':'333'):'22'
    //     ConditionalExpression(
    //         BooleanLiteral, LogicOp, String, LogicOp, ConditionalExpression(
    //             BinaryExpression(MemberExpression(MemberExpression(VariableName, ".", PropertyName), ".", PropertyName), CompareOp, Number),
    //             LogicOp,
    //             ParenthesizedExpression("(", ConditionalExpression(
    //                 Number, LogicOp, String, LogicOp, String
    //                 ), ")"),
    //             LogicOp,
    //             String
    //         )
    //     )
    let cond = node.firstChild
    let trueResult = cond?.nextSibling?.nextSibling
    let falseResult = trueResult?.nextSibling?.nextSibling
    if (!cond || !trueResult || !falseResult) {
      addDiagnostic(diagnostics, '条件表达式格式错误', node.from, node.to)
      verifiedNode.push([node.from, node.to])
      return
    }
    verifyExprParamOrVarGuards(cond, state, iwInterface.VarKind.BOOLEAN, diagnostics, entrance, verifiedNode, findMaterials, processHit)
    verifyExprParamOrVarGuards(trueResult, state, expectedOutputKind, diagnostics, entrance, verifiedNode, findMaterials, processHit)
    verifyExprParamOrVarGuards(falseResult, state, expectedOutputKind, diagnostics, entrance, verifiedNode, findMaterials, processHit)
    return
  }

  let kind = null
  let memberName: string
  if (node.name === 'CallExpression' && node.firstChild?.name === 'MemberExpression' && node.firstChild?.firstChild?.name === 'MemberExpression' && node.firstChild?.nextSibling?.name === 'ArgList') {
    kind = 'expr'
    memberName = state.sliceDoc(node.firstChild?.from, node.firstChild?.to)
  } else if (node.name === 'MemberExpression' && node.firstChild?.name === 'MemberExpression') {
    kind = 'var'
    memberName = state.sliceDoc(node.from, node.to)
  } else if (node.name === 'VariableName') {
    // 不支持自定义变量
    addDiagnostic(diagnostics, '变量/函数不存在', node.from, node.to)
    verifiedNode.push([node.from, node.to])
    return
  } else {
    return
  }

  // 变量/函数处理
  if (!memberName.startsWith(entrance + '.')) {
    return
  }
  let memberNameSplit = memberName.split('.')
  let namespace = memberNameSplit[1]
  let name = memberNameSplit[2]
  let ns = findMaterials(namespace)
  if (!ns) {
    addDiagnostic(diagnostics, (kind === 'var' ? '变量' : '函数') + '命名空间不存在', node.from, node.to)
    verifiedNode.push([node.from, node.to])
    return
  }

  if (kind === 'var') {
    let varInfo = (ns.items as iwInterface.VarInfo[]).find((item) => item.name === name)
    if (!varInfo) {
      addDiagnostic(diagnostics, '变量不存在', node.from, node.to)
      verifiedNode.push([node.from, node.to])
      return
    }
    if (varInfo.kind !== expectedOutputKind && expectedOutputKind !== iwInterface.VarKind.ANY) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: '期望格式为[' + expectedOutputKind + '],实际为[' + varInfo.kind + ']',
        markClass: 'iw-cm-wrap--error',
      })
    }
  } else {
    if (!node.firstChild?.nextSibling?.firstChild) {
      addDiagnostic(diagnostics, '函数格式错误', node.from, node.to)
      verifiedNode.push([node.from, node.to])
      return
    }
    let funInfo = (ns.items as iwInterface.FunInfo[]).find((item) => item.name === name)
    if (!funInfo) {
      addDiagnostic(diagnostics, '函数不存在', node.from, node.to)
      verifiedNode.push([node.from, node.to])
      return
    }
    let tempParamNode = node.firstChild?.nextSibling?.firstChild!

    let paramStartOffset = tempParamNode.nextSibling!.from - 1
    if (funInfo.output.kind !== expectedOutputKind && expectedOutputKind !== iwInterface.VarKind.ANY && funInfo.output.kind !== iwInterface.VarKind.ANY) {
      // 只标记方法体，如果是异步函数，需要减去 `await `的长度
      addDiagnostic(diagnostics, '期望格式为[' + expectedOutputKind + '],实际为[' + funInfo.output.kind + ']', node.from + (funInfo.isAsync ? -6 : 0), paramStartOffset)
    }

    let paramIdx = 0
    let realParamLen = 0
    while (tempParamNode.nextSibling != null) {
      tempParamNode = tempParamNode.nextSibling!
      let paramName = tempParamNode.name
      if (paramName === '(' || paramName === ')' || paramName === ',') {
        continue
      }
      if (funInfo.input.length <= paramIdx) {
        // 只标记过长的参数
        addDiagnostic(diagnostics, '期望参数长度为[' + funInfo.input.length + '],实际为[' + (paramIdx + 1) + ']', tempParamNode.from, node.to - 1)
        break
      }
      let tempInputKind = funInfo.input[paramIdx].kind
      tempParamNode.cursor()
        .iterate((node) => {
          verifyExprParamOrVarGuards(node.node, state, tempInputKind, diagnostics, entrance, verifiedNode, findMaterials, processHit)
        })
      if (funInfo.input.length - 1 !== paramIdx || !funInfo.isVarLen) {
        paramIdx++
      }
      realParamLen++
    }
    if (paramIdx === 0 && funInfo.input.length !== 0 && !funInfo.isVarLen) {
      // 只标记()
      addDiagnostic(diagnostics, '期望参数长度为[' + funInfo.input.length + '],实际为[0]', paramStartOffset, node.to)
    }
    if (realParamLen === 0 && funInfo.isVarLen) {
      // 只标记函数
      addDiagnostic(diagnostics, '缺少参数', node.from, paramStartOffset)
    }
  }
  processHit(entrance + '.' + namespace + '.' + name)
  verifiedNode.push([node.from, node.to])
  return
}