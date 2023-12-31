import { assert, describe, it } from 'vitest'
import { syntaxTree } from '@codemirror/language'
import type { Diagnostic } from '@codemirror/lint'
import { EditorState } from '@codemirror/state'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { VarKind } from '../src/processes/interface'
import type { Namespace, VarInfo } from '../src/processes/interface'
import { diagnosticFormula } from '../src/processes/cmEditor'
import { DEFAULT_FUN_LIB } from '../src/processes/funcLib'
import type { iwInterface } from '../src'

describe('cmEditor verify', () => {
  const testMaterialVars: Namespace[] = [
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
          kind: VarKind.NUMBER,
        } as VarInfo,
      ],
    },
  ]

  const miniMaterials = testMaterialVars
  miniMaterials.push(DEFAULT_FUN_LIB)

  function verify(formula: string, materials: Namespace[], expectedOutputKind: iwInterface.VarKind) {
    const state = EditorState.create({
      doc: formula,
      extensions: [javascriptLanguage.extension],
    })
    const diagnostics: Diagnostic[] = []
    const verifiedNode: [number, number][] = []
    const usedMaterials: string[] = []
    syntaxTree(state)
      .topNode.cursor()
      .iterate((node) => {
        diagnosticFormula(node.node, state, expectedOutputKind, diagnostics, '$', verifiedNode, namespace => materials.find(ns => ns.name === namespace), (name) => {
          if (!usedMaterials.includes(name))
            usedMaterials.push(name)
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
      markClass: 'iw-cm-wrap--error',
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
    assert.deepEqual(verify(`hi`, [], VarKind.STRING)[0], expects(['Variable/function does not exist', 0, 2]))
    assert.deepEqual(verify(`hi()`, [], VarKind.STRING)[0], expects(['Variable/function does not exist', 0, 2]))
    assert.deepEqual(verify(`$.field.hi`, [], VarKind.STRING)[0], expects(['Namespace does not exist', 0, 10]))
    assert.deepEqual(verify(`$.fun.hi()`, [], VarKind.STRING)[0], expects(['Namespace does not exist', 0, 10]))
    assert.deepEqual(verify(`$.field.hi`, testMaterialVars, VarKind.STRING)[0], expects(['Variable does not exist', 0, 10]))
    assert.deepEqual(verify(`$.fun.hi()`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], expects(['Function does not exist', 0, 10]))
  })

  it('return data type', () => {
    assert.deepEqual(verify('1', [], VarKind.STRING)[0], expects(['The expected format is [string], the actual format is [numeric]', 0, 1]))
    assert.deepEqual(verify('true', [], VarKind.STRING)[0], expects(['The expected format is [string], the actual format is [boolean]', 0, 4]))
    assert.deepEqual(verify(`'hi'`, [], VarKind.NUMBER)[0], expects(['The expected format is [numeric], the actual format is [string]', 0, 4]))
    assert.deepEqual(verify(`'hi'+'hi'`, [], VarKind.NUMBER)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 0, 4],
      ['The expected format is [numeric], the actual format is [string]', 5, 9],
    ))
    assert.deepEqual(verify(`$.field.age`, testMaterialVars, VarKind.STRING)[0], expects(['The expected format is [string], the actual format is [numeric]', 0, 11]))
    assert.deepEqual(verify(`$.fun.sum(1,2)`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], expects(['The expected format is [string], the actual format is [numeric]', 0, 9]))
    assert.deepEqual(verify(`$.fun.sum(1,$.fun.lower('1'))`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], expects(
      ['The expected format is [string], the actual format is [numeric]', 0, 9],
      ['The expected format is [numeric], the actual format is [string]', 12, 23],
    ))
    assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.fun.lower('1')))`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], expects(
      ['The expected format is [string], the actual format is [numeric]', 0, 9],
      ['The expected format is [numeric], the actual format is [string]', 22, 33],
    ))
    assert.deepEqual(verify(`$.fun.sum($.field.age,$.fun.sum($.fun.lower('1')))+$.field.age`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [string], the actual format is [numeric]', 0, 9],
      ['The expected format is [numeric], the actual format is [string]', 32, 43],
      ['The expected format is [string], the actual format is [numeric]', 51, 62],
    ))
    assert.deepEqual(verify(`$.field.age+$.fun.sum($.field.age,$.fun.sum($.fun.lower('1')))`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [string], the actual format is [numeric]', 0, 11],
      ['The expected format is [string], the actual format is [numeric]', 12, 21],
      ['The expected format is [numeric], the actual format is [string]', 44, 55],
    ))
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
    assert.deepEqual(verify(`$.fun.sum(1,'2')`, miniMaterials, VarKind.NUMBER)[0], expects(['The expected format is [numeric], the actual format is [string]', 12, 15]))
    assert.deepEqual(verify(`$.fun.lower('2','2')`, miniMaterials, VarKind.STRING)[0], expects(['The expected parameter length is [1], the actual length is [2]', 16, 19]))
    assert.deepEqual(verify(`$.fun.lower(2)`, miniMaterials, VarKind.STRING)[0], expects(['The expected format is [string], the actual format is [numeric]', 12, 13]))
    assert.deepEqual(verify(`$.fun.lower()`, miniMaterials, VarKind.STRING)[0], expects(['The expected parameter length is [1], the actual length is [0]', 11, 13]))
    assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2'))`, miniMaterials, VarKind.NUMBER)[0], expects(['The expected format is [numeric], the actual format is [string]', 34, 37]))
    assert.deepEqual(verify(`1+$.fun.sum(1,$.fun.sum($.field.age,'2'))`, miniMaterials, VarKind.NUMBER)[0], expects(['The expected format is [numeric], the actual format is [string]', 36, 39]))
    assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2'))+1`, miniMaterials, VarKind.NUMBER)[0], expects(['The expected format is [numeric], the actual format is [string]', 34, 37]))
    assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower(2)))+1`, miniMaterials, VarKind.NUMBER)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 34, 37],
      ['The expected format is [numeric], the actual format is [string]', 38, 49],
      ['The expected format is [string], the actual format is [numeric]', 50, 51],
    ))
    assert.deepEqual(verify(`$.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower($.fun.lower())))+1`, miniMaterials, VarKind.NUMBER)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 34, 37],
      ['The expected format is [numeric], the actual format is [string]', 38, 49],
      ['The expected parameter length is [1], the actual length is [0]', 61, 63],
    ))
    assert.deepEqual(verify(`$.fun.concat(1,'2')`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], [])
    assert.deepEqual(verify(`$.fun.concat($.fun.sum(12))`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], [])
    assert.deepEqual(verify(`$.fun.concat($.fun.sum(12))+'hi'`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], [])
    assert.deepEqual(verify(`'hi'+$.fun.concat($.fun.sum(12))`, [DEFAULT_FUN_LIB], VarKind.STRING)[0], [])
  })

  it('expression', () => {
    assert.deepEqual(verify(`$.fun.sum(1,2)>0?'':''`, miniMaterials, VarKind.NUMBER)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 17, 19],
      ['The expected format is [numeric], the actual format is [string]', 20, 22],
    ))
    assert.deepEqual(verify(`$.fun.sum($.fun.sum(1,2)>0?'':'',2)>0?'':''`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 27, 29],
      ['The expected format is [numeric], the actual format is [string]', 30, 32],
    ))
    assert.deepEqual(verify(`false?1:$.field.age>'3'?(1?'222':333):'22'`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [string], the actual format is [numeric]', 6, 7],
      ['The expected format is [boolean], the actual format is [numeric]', 25, 26],
      ['The expected format is [string], the actual format is [numeric]', 33, 36],
    ))
    assert.deepEqual(verify(`false?'1':$.field.age>3?($.fun.sum(1,'2')>0?'222':'333'):'22'`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 37, 40],
    ))
    assert.deepEqual(verify(`false?'1':$.field.age>3?($.fun.sum(1,2)?'222':'333'):'22'`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [boolean], the actual format is [numeric]', 25, 34],
    ))

    assert.deepEqual(verify(`'1'&&'2'`, miniMaterials, VarKind.NUMBER)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 0, 3],
      ['The expected format is [numeric], the actual format is [string]', 5, 8],
    ))

    assert.deepEqual(verify(`'1'&&'2'`, miniMaterials, VarKind.STRING)[0], [])
    assert.deepEqual(verify(`(1+0)>2?'222':'343'`, miniMaterials, VarKind.STRING)[0], [])
    assert.deepEqual(verify(`$.fun.sum(1,2)>0?'':''`, miniMaterials, VarKind.STRING)[0], [])
    assert.deepEqual(verify(`$.fun.sum($.fun.sum(1,2)>0?3:4,2)>0?'':''`, miniMaterials, VarKind.STRING)[0], [])
    // ConditionalExpression(BooleanLiteral,LogicOp,String,LogicOp,ConditionalExpression(BinaryExpression(MemberExpression(MemberExpression(VariableName,".",PropertyName),".",PropertyName),CompareOp,Number),LogicOp,ParenthesizedExpression("(",ConditionalExpression(Number,LogicOp,String,LogicOp,String),")"),LogicOp,String))
    assert.deepEqual(verify(`false?'1':$.field.age>3?($.fun.sum(1,2)>0?'222':'333'):'22'`, miniMaterials, VarKind.STRING)[0], [])
  })

  it('complex', () => {
    assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower($.fun.lower(2,2))))+1)>0?'':'',2)>0?'':''`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 45, 48],
      ['The expected format is [numeric], the actual format is [string]', 49, 60],
      ['The expected format is [string], the actual format is [numeric]', 73, 74],
      ['The expected format is [string], the actual format is [numeric]', 75, 76],
      ['The expected parameter length is [1], the actual length is [2]', 75, 76],
      ['The expected format is [numeric], the actual format is [string]', 86, 88],
      ['The expected format is [numeric], the actual format is [string]', 89, 91],
    ))
    assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,'2',$.fun.lower($.fun.lower('hi'))==='hi'?0:1))+1)>0?'':'',2)>0?'':(await $.fun.httpGet('xxx')).code`, miniMaterials, VarKind.STRING)[0], expects(
      ['The expected format is [numeric], the actual format is [string]', 45, 48],
      ['The expected format is [numeric], the actual format is [string]', 98, 100],
      ['The expected format is [numeric], the actual format is [string]', 101, 103],
    ))
    assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,2,$.fun.lower($.fun.lower('hi'))==='hi'?0:1))+1)>0?11:222,2)>0?'':(await $.fun.httpGet('xxx')).code`, miniMaterials, VarKind.STRING)[0], [])
  })

  it('used materials', () => {
    assert.deepEqual(verify(`$.fun.sum(($.fun.sum(1,$.fun.sum($.field.age,2,$.fun.lower($.fun.lower('hi'))==='hi'?0:1))+1)>0?11:222,2)>0?'':(await $.fun.httpGet('xxx')).code`, miniMaterials, VarKind.STRING)[1], [
      '$.field.age',
      '$.fun.lower',
      '$.fun.sum',
      '$.fun.httpGet',
    ])
  })
})
