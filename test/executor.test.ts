import {assert, describe, expect, it} from 'vitest'
import {execute} from "../src/processes/executor";
import {DEFALUT_FUN_LIB} from "../src/processes/funcLib";
import {Namespace, VarInfo} from "../src/processes/interface";

describe('executor execute()', async () => {
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
                } as VarInfo
            ]
        }]

    it('error by properties undefined', async () => {
        try {
            await execute(new Map(), "$.field.age", [], "$")
        } catch (e) {
            assert.equal(e.message, `公式执行错误: Cannot read properties of undefined (reading 'age')err`)
        }
    })

    it('error by input parameter undefined', async () => {
        try {
            await execute(new Map(), "$.field.age", testMaterialVars, "$")
        } catch (e) {
            assert.equal(e.message, `参数 [年龄] 值不存在`)
        }
    })

    it('mini var', async () => {
        let inputParams = new Map<string, any>()
        inputParams.set("$.field.age", 18)
        expect(await execute(inputParams, "$.field.age", testMaterialVars, "$")).eq(18)
    })

    it('mini fun', async () => {
        expect(await execute(new Map(), "$.fun.sum(1,2,3,4)", [DEFALUT_FUN_LIB], "$")).eq(10)
    })

    it('mini var and fun', async () => {
        let inputParams = new Map<string, any>()
        inputParams.set("$.field.age", 18)
        let materials = testMaterialVars
        materials.push(DEFALUT_FUN_LIB)
        expect(await execute(inputParams, "$.fun.sum(1,2,3,4,$.field.age)", materials, "$")).eq(28)
    })

    it('expression', async () => {
        let inputParams = new Map<string, any>()
        inputParams.set("$.field.age", 18)
        let materials = testMaterialVars
        materials.push(DEFALUT_FUN_LIB)
        expect(await execute(inputParams, "$.fun.sum(1,2,3,4,$.field.age)>100?'字段1':'字段2'", materials, "$")).eq('字段2')
    })

    it('async fun', async () => {
        expect(await execute(new Map(), "(await $.fun.httpGet('https://httpbin.org/get')).url", [DEFALUT_FUN_LIB], "$")).eq('https://httpbin.org/get')
    })

    it('async fun2', async () => {
        expect(await execute(new Map(), "$.fun.concat((await $.fun.httpGet('https://httpbin.org/get')).url)", [DEFALUT_FUN_LIB], "$")).eq('https://httpbin.org/get')
    })


    // $.fun.concat((await $.fun.httpGet('https://httpbin.org/get')))
    it('complex', async () => {
        let inputParams = new Map<string, any>()
        inputParams.set("$.field.age", 18)
        inputParams.set("$.model.addr", 'https://httpbin.org/get')
        let materials = testMaterialVars
        materials.push(
            {
                name: 'model',
                label: '模型',
                isVar: true,
                showLabel: true,
                items: [
                    {
                        name: 'addr',
                        label: '地址'
                    } as VarInfo
                ]
            })
        materials.push(DEFALUT_FUN_LIB)
        expect(await execute(inputParams, `$.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string',null,(await $.fun.httpGet($.model.addr)).url)`, materials, "$")).eq(`193true1,2stringhttps://httpbin.org/get`)
    })

})
