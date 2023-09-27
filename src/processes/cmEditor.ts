import { SyntaxNode } from "@lezer/common";
import { iwInterface } from "./index";
import { Diagnostic } from "@codemirror/lint";
import { Namespace } from "./interface";
import { EditorState } from "@codemirror/state";

export enum VerifyResult {
    IGNORE,
    HIT,
    PANIC
}

export function verifyExprParamOrVarGuards(node: SyntaxNode, state: EditorState, expectedOutputKind: iwInterface.VarKind, diagnostics: Diagnostic[], entrance: string, verifiedNode: [number, number][], findMaterials: (ns: string) => Namespace | undefined, processHit: (name: string) => void): VerifyResult {
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
    let memberName: string
    if (verifiedNode.find(offset => {
        let from = offset[0]
        let to = offset[1]
        return from <= node.from && to >= node.to
    })) {
        return VerifyResult.IGNORE
    }
    if (node.name === 'CallExpression' && node.firstChild?.name === 'MemberExpression' && node.firstChild?.firstChild?.name === 'MemberExpression' && node.firstChild?.nextSibling?.name === 'ArgList') {
        kind = 'expr'
        memberName = state.sliceDoc(node.firstChild?.from, node.firstChild?.to)
    } else if (node.name === 'MemberExpression' && node.firstChild?.name === 'MemberExpression') {
        kind = 'var'
        memberName = state.sliceDoc(node.from, node.to)
    } else if (node.name === 'VariableName') {
        // 不支持自定义变量
        diagnostics.push({
            from: node.from,
            to: node.to,
            severity: 'error',
            message: '变量/函数不存在',
            markClass: 'iw-cm-wrap--error'
        })
        verifiedNode.push([node.from, node.to])
        return VerifyResult.PANIC
    } else {
        return VerifyResult.IGNORE
    }

    if (!memberName.startsWith(entrance + '.')) {
        return VerifyResult.IGNORE
    }
    let memberNameSplit = memberName.split('.')
    let namespace = memberNameSplit[1]
    let name = memberNameSplit[2]
    let ns = findMaterials(namespace)
    if (!ns) {
        diagnostics.push({
            from: node.from,
            to: node.to,
            severity: 'error',
            message: (kind === 'var' ? '变量' : '函数') + '命名空间不存在',
            markClass: 'iw-cm-wrap--error'
        })
        verifiedNode.push([node.from, node.to])
        return VerifyResult.PANIC
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
            verifiedNode.push([node.from, node.to])
            return VerifyResult.PANIC
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
            verifiedNode.push([node.from, node.to])
            return VerifyResult.PANIC
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
            verifiedNode.push([node.from, node.to])
            return VerifyResult.PANIC
        }
        let tempParamNode = node.firstChild?.nextSibling?.firstChild!

        let paramStartOffset = tempParamNode.nextSibling!.from - 1
        if (funInfo.output.kind !== expectedOutputKind && expectedOutputKind !== iwInterface.VarKind.ANY && funInfo.output.kind !== iwInterface.VarKind.ANY) {
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
            if (paramName === 'CallExpression' || paramName === 'MemberExpression' || paramName === 'VariableName' || paramName === 'ConditionalExpression' || paramName === 'BinaryExpression' || paramName === 'LogicOp' || paramName === 'CompareOp' || paramName === 'AwaitExpression' || paramName === 'ParenthesizedExpression') {
                // $.fun.concat($.fun.now()>0?1:2)
                // ConditionalExpression(BinaryExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),CompareOp,Number),LogicOp,Number,LogicOp,Number)
                // $.fun.sum(1,2)>0?1:2
                // ConditionalExpression(BinaryExpression(CallExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),ArgList("(",Number,",",Number,")")),CompareOp,Number),LogicOp,Number,LogicOp,Number)
                // $.fun.concat($.fun.sum(1)>1?1:$.fun.now(1))
                // ConditionalExpression(BinaryExpression(CallExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),ArgList("(",Number,")")),CompareOp,Number),LogicOp,Number,LogicOp,CallExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),ArgList("(",Number,")")))
                // $.fun.concat((await $.fun.httpGet('https://httpbin.org/get')).url)
                let tempInputKind = funInfo.input[paramIdx].kind
                tempParamNode.cursor()
                    .iterate((node) => {
                        verifyExprParamOrVarGuards(node.node, state, tempInputKind, diagnostics, entrance, verifiedNode, findMaterials, processHit)
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
                if (funInfo.input[paramIdx].kind !== paramKind && funInfo.input[paramIdx].kind !== iwInterface.VarKind.ANY && paramKind !== iwInterface.VarKind.ANY) {
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
    processHit(entrance + '.' + namespace + '.' + name)
    verifiedNode.push([node.from, node.to])
    return VerifyResult.HIT
}