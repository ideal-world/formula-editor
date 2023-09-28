import {assert, describe, it} from 'vitest'
import {DEFALUT_FUN_LIB} from "../src/processes/funcLib";
import {verifyExprParamOrVarGuards} from "../src/processes/cmEditor";
import {syntaxTree} from "@codemirror/language";
import {Namespace, VarInfo, VarKind} from "../src/processes/interface";
import {Diagnostic} from "@codemirror/lint";
import {EditorState} from "@codemirror/state";
import {javascriptLanguage} from "@codemirror/lang-javascript";
import {iwInterface} from "../src";

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

    let miniMaterials = testMaterialVars
    miniMaterials.push(DEFALUT_FUN_LIB)

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
                verifyExprParamOrVarGuards(node.node, state, expectedOutputKind, diagnostics, '$', verifiedNode, namespace => materials.find(ns => ns.name === namespace), name => {
                    if (!usedMaterials.includes(name)) {
                        usedMaterials.push(name)
                    }
                })
            })
        return [diagnostics, usedMaterials]
    }

    function expect(message: string, from: number, to: number): Diagnostic {
        return {
            from,
            to,
            severity: 'error',
            message,
            markClass: 'iw-cm-wrap--error'
        }
    }

    function expects(...diagnostics: [string, number, number][]): Diagnostic[] {
        return diagnostics.map(d => expect(d[0], d[1], d[2]))
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
        assert.deepEqual(verify(`hi`, [], VarKind.STRING)[0], expects(['变量/函数不存在', 0, 2]))
        assert.deepEqual(verify(`hi()`, [], VarKind.STRING)[0], expects(['变量/函数不存在', 0, 2]))
        assert.deepEqual(verify(`$.field.hi`, [], VarKind.STRING)[0], expects(['变量命名空间不存在', 0, 10]))
        assert.deepEqual(verify(`$.fun.hi()`, [], VarKind.STRING)[0], expects(['函数命名空间不存在', 0, 10]))
        assert.deepEqual(verify(`$.field.hi`, testMaterialVars, VarKind.STRING)[0], expects(['变量不存在', 0, 10]))
        assert.deepEqual(verify(`$.fun.hi()`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], expects(['函数不存在', 0, 10]))
    })

    it('return data type', () => {
        assert.deepEqual(verify('1', [], VarKind.STRING)[0], expects(['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 1]))
        assert.deepEqual(verify('true', [], VarKind.STRING)[0], expects(['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.BOOLEAN + ']', 0, 4]))
        assert.deepEqual(verify(`'hi'`, [], VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 0, 4]))
        assert.deepEqual(verify(`'hi'+'hi'`, [], VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 0, 4], ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 5, 9]))
        assert.deepEqual(verify(`$.field.age`, testMaterialVars, VarKind.STRING)[0], expects(['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 11]))
        assert.deepEqual(verify(`$.fun.sum(1,2)`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], expects(['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 9]))
        assert.deepEqual(verify(`$.fun.sum(1,$.fun.lower('1'))`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], expects(['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 9], ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 12, 23]))
        assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.fun.lower('1')))`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], expects(['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 9], ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 22, 33]))
        assert.deepEqual(verify(`$.fun.sum($.field.age,$.fun.sum($.fun.lower('1')))+$.field.age`, miniMaterials, VarKind.STRING)[0], expects(
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 9],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 32, 43],
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 51, 62],
        ))
        assert.deepEqual(verify(`$.field.age+$.fun.sum($.field.age,$.fun.sum($.fun.lower('1')))`, miniMaterials, VarKind.STRING)[0], expects(
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 0, 11],
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 12, 21],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 44, 55])
        )
        assert.deepEqual(verify(`1`, miniMaterials, VarKind.NUMBER)[0], [])
        assert.deepEqual(verify(`true`, miniMaterials, VarKind.BOOLEAN)[0], [])
        assert.deepEqual(verify(`'hi'`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`'hi'`, miniMaterials, VarKind.ANY)[0], [])
        assert.deepEqual(verify(`'hi'+'hi'`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.sum(1,2)`, miniMaterials, VarKind.ANY)[0], [])
        assert.deepEqual(verify(`$.fun.sum(1,2)`, miniMaterials, VarKind.NUMBER)[0], [])
        assert.deepEqual(verify(`$.fun.concat(1,2)`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.concat($.field.age,$.fun.sum(1,2))`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.sum($.field.age,$.fun.sum(1,$.fun.sum(1,2)))`, miniMaterials, VarKind.NUMBER)[0], [])
        assert.deepEqual(verify(`$.fun.sum(1,2)+100`, miniMaterials, VarKind.ANY)[0], [])
        assert.deepEqual(verify(`$.fun.sum(1,2)+100`, miniMaterials, VarKind.NUMBER)[0], [])
        assert.deepEqual(verify(`$.fun.concat(1,2)+'hi'`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.concat($.field.age,$.fun.sum(1,2))+'hi'`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.sum($.field.age,$.fun.sum(1,$.fun.sum(1,2)))-100`, miniMaterials, VarKind.NUMBER)[0], [])
    })

    it('parameter', () => {
        assert.deepEqual(verify(`$.fun.sum(1,'2')`, miniMaterials, VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 12, 15]))
        assert.deepEqual(verify(`$.fun.lower('2','2')`, miniMaterials, VarKind.STRING)[0], expects(['期望参数长度为[1],实际为[2]', 16, 19]))
        assert.deepEqual(verify(`$.fun.lower(2)`, miniMaterials, VarKind.STRING)[0], expects(['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 12, 13]))
        assert.deepEqual(verify(`$.fun.lower()`, miniMaterials, VarKind.STRING)[0], expects(['期望参数长度为[1],实际为[0]', 11, 13]))
        assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2'))`, miniMaterials, VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 34, 37]))
        assert.deepEqual(verify(`1+$.fun.sum(1,$.fun.sum($.field.age,'2'))`, miniMaterials, VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 36, 39]))
        assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2'))+1`, miniMaterials, VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 34, 37]))
        assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower(2)))+1`, miniMaterials, VarKind.NUMBER)[0], expects(
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 34, 37],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 38, 49],
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 50, 51],
        ))
        assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower($.fun.lower())))+1`, miniMaterials, VarKind.NUMBER)[0], expects(
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 34, 37],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 38, 49],
            ['期望参数长度为[1],实际为[0]', 61, 63],
        ))
        assert.deepEqual(verify(`$.fun.concat(1,'2')`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.concat($.fun.sum(12))`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.concat($.fun.sum(12))+'hi'`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], [])
        assert.deepEqual(verify(`'hi'+$.fun.concat($.fun.sum(12))`, [DEFALUT_FUN_LIB], VarKind.STRING)[0], [])
    })

    it('expression', () => {
        assert.deepEqual(verify(`$.fun.sum(1,2)>0?'':''`, miniMaterials, VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 17, 19], ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 20, 22]))
        assert.deepEqual(verify(`$.fun.sum($.fun.sum(1,2)>0?'':'',2)>0?'':''`, miniMaterials, VarKind.STRING)[0], expects(
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 27, 29],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 30, 32]
        ))
        assert.deepEqual(verify(`false?1:$.field.age>'3'?(1?'222':333):'22'`, miniMaterials, VarKind.STRING)[0], expects(
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 6, 7],
            ['期望格式为[' + VarKind.BOOLEAN + '],实际为[' + VarKind.NUMBER + ']', 25, 26],
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 33, 36]
        ))
        assert.deepEqual(verify(`false?'1':$.field.age>3?($.fun.sum(1,'2')>0?'222':'333'):'22'`, miniMaterials, VarKind.STRING)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 37, 40]))
        assert.deepEqual(verify(`false?'1':$.field.age>3?($.fun.sum(1,2)?'222':'333'):'22'`, miniMaterials, VarKind.STRING)[0], expects(['期望格式为[' + VarKind.BOOLEAN + '],实际为[' + VarKind.NUMBER + ']', 25, 34]))

        assert.deepEqual(verify(`'1'&&'2'`, miniMaterials, VarKind.NUMBER)[0], expects(['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 0, 3], ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 5, 8]))

        assert.deepEqual(verify(`'1'&&'2'`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`(1+0)>2?'222':'343'`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.sum(1,2)>0?'':''`, miniMaterials, VarKind.STRING)[0], [])
        assert.deepEqual(verify(`$.fun.sum($.fun.sum(1,2)>0?3:4,2)>0?'':''`, miniMaterials, VarKind.STRING)[0], [])
        // ConditionalExpression(BooleanLiteral,LogicOp,String,LogicOp,ConditionalExpression(BinaryExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),CompareOp,Number),LogicOp,ParenthesizedExpression("(",ConditionalExpression(Number,LogicOp,String,LogicOp,String),")"),LogicOp,String))
        assert.deepEqual(verify(`false?'1':$.field.age>3?($.fun.sum(1,2)>0?'222':'333'):'22'`, miniMaterials, VarKind.STRING)[0], [])
    })

    it('complex', () => {
        assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower($.fun.lower(2,2))))+1)>0?'':'',2)>0?'':''`, miniMaterials, VarKind.STRING)[0], expects(
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 45, 48],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 49, 60],
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 73, 74],
            ['期望格式为[' + VarKind.STRING + '],实际为[' + VarKind.NUMBER + ']', 75, 76],
            ['期望参数长度为[1],实际为[2]', 75, 76],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 86, 88],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 89, 91]
        ))
        assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower($.fun.lower('hi'))==='hi'?0:1))+1)>0?'':'',2)>0?'':(await $.fun.httpGet('xxx')).code`, miniMaterials, VarKind.STRING)[0], expects(
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 45, 48],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 98, 100],
            ['期望格式为[' + VarKind.NUMBER + '],实际为[' + VarKind.STRING + ']', 101, 103]
        ))
        assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,2,$.fun.lower($.fun.lower('hi'))==='hi'?0:1))+1)>0?11:222,2)>0?'':(await $.fun.httpGet('xxx')).code`, miniMaterials, VarKind.STRING)[0], [])
    })

    it('used materials', () => {
        assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,2,$.fun.lower($.fun.lower('hi'))==='hi'?0:1))+1)>0?11:222,2)>0?'':(await $.fun.httpGet('xxx')).code`, miniMaterials, VarKind.STRING)[1], [
            '$.field.age',
            '$.fun.lower',
            '$.fun.sum',
            '$.fun.httpGet',])
    })

})
