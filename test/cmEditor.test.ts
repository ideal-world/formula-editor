import { assert, describe, it } from 'vitest'
import { DEFALUT_FUN_LIB } from "../src/processes/funcLib";
import { verifyExprParamOrVarGuards, VerifyResult } from "../src/processes/cmEditor";
import { syntaxTree } from "@codemirror/language";
import { Namespace, VarInfo, VarKind } from "../src/processes/interface";
import { Diagnostic } from "@codemirror/lint";
import { EditorState } from "@codemirror/state";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { iwInterface } from "../src";

describe('cmEditor verify', () => {

    let testMaterialVars: Namespace[] = [
        {
            name: 'field',
            label: '字段',
            isVar: true,
            showLabel: true,
            items: [
                {
                    name: 'age',
                    label: '年龄',
                    note: '年龄',
                    kind: VarKind.NUMBER
                } as VarInfo
            ]
        }]

    function verify(formula: string, materials: Namespace[], expectedOutputKind: iwInterface.VarKind) {
        let state = EditorState.create({
            doc: formula,
            extensions: [javascriptLanguage.extension]
        })
        let diagnostics: Diagnostic[] = []
        let verifiedNode: [number, number][] = []
        let usedMaterials: string[] = []
        syntaxTree(state)
            .topNode.cursor()
            .iterate((node) => {
                // console.log(node)
                // console.log('-----------------')
                verifyExprParamOrVarGuards(node.node, state, expectedOutputKind, diagnostics, '$', verifiedNode, namespace => materials.find(ns => ns.name === namespace), name => usedMaterials.push(name))
            })
        return [diagnostics, usedMaterials]
    }

    function expected(message: string, from: number, to: number): Diagnostic {
        return {
            from,
            to,
            severity: 'error',
            message,
            markClass: 'iw-cm-wrap--error'
        }
    }

    it('empty', () => {
        assert.deepEqual(verify('', [], VarKind.STRING)[0], [])
    })

    it('only number', () => {
        assert.deepEqual(verify('1', [], VarKind.NUMBER)[0], [])
    })

    it('only string', () => {
        assert.deepEqual(verify(`'gudaoxuri'`, [], VarKind.STRING)[0], [])
    })

    it('unknown variable/function', () => {
        assert.deepEqual(verify(`hi`, [], VarKind.STRING)[0][0], expected('变量/函数不存在', 0, 2))
        assert.deepEqual(verify(`hi()`, [], VarKind.STRING)[0][0], expected('变量/函数不存在', 0, 2))
        assert.deepEqual(verify(`$.field.hi`, [], VarKind.STRING)[0][0], expected('变量命名空间不存在', 0, 10))
        assert.deepEqual(verify(`$.fun.hi()`, [], VarKind.STRING)[0][0], expected('函数命名空间不存在', 0, 10))
        assert.deepEqual(verify(`$.field.hi`, testMaterialVars, VarKind.STRING)[0][0], expected('变量不存在', 0, 10))
        assert.deepEqual(verify(`$.fun.hi()`, [DEFALUT_FUN_LIB], VarKind.STRING)[0][0], expected('函数不存在', 0, 10))
    })

    it('return data type', () => {
        // TODO
        // assert.deepEqual(verify('1', [],VarKind.STRING)[0][0], expected('期望返回格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 1))
        assert.deepEqual(verify(`$.field.age`, testMaterialVars, VarKind.STRING)[0][0], expected('期望返回格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 11))
        assert.deepEqual(verify(`$.fun.sum(1,2)`, [DEFALUT_FUN_LIB], VarKind.STRING)[0][0], expected('期望返回格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 9))
        assert.deepEqual(verify(`$.fun.sum(1,2)`, [DEFALUT_FUN_LIB], VarKind.ANY)[0], [])
        assert.deepEqual(verify(`$.fun.concat(1,2)`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], [])
    })

    it('parameter', () => {
        assert.deepEqual(verify(`$.fun.sum(1,'2')`, [DEFALUT_FUN_LIB], VarKind.STRING)[0][0], expected('期望返回格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 9))
        assert.deepEqual(verify(`$.fun.sum(1,'2')`, [DEFALUT_FUN_LIB], VarKind.STRING)[0][1], expected('期望参数格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 12, 15))
        assert.deepEqual(verify(`$.fun.concat(1,'2')`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.lower('2','2')`, [DEFALUT_FUN_LIB], VarKind.STRING)[0][0], expected('期望参数长度为[1],实际为[2]', 16, 19))
        assert.deepEqual(verify(`$.fun.lower(2)`, [DEFALUT_FUN_LIB], VarKind.STRING)[0][0], expected('期望参数格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 12, 13))
        assert.deepEqual(verify(`$.fun.lower()`, [DEFALUT_FUN_LIB], VarKind.STRING)[0][0], expected('期望参数长度为[1],实际为[0]', 11, 13))
    })

    // TODO

})
