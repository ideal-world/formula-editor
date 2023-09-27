import {VarKind} from './interface'

export const DEFALUT_FUN_LIB =
    {
        name: 'fun',
        label: '内置',
        isVar: false,
        showLabel: false,
        color: '#d9ecff',
        items: [
            {
                name: 'sum',
                label: '求和',
                note: `获取一组数值的总和。<br/>
用法：<span style="color: #529b2e">SUM(数字1,数字2,...)</span>`,
                input: [
                    {
                        kind: VarKind.NUMBER
                    }
                ],
                isVarLen: true,
                isAsync: false,
                output: {
                    kind: VarKind.NUMBER
                },
                body: `return Array.from(arguments).reduce((a, b) => a + b)`,
                cates: ['常用', '计算']
            },
            {
                name: 'now',
                label: '当前时间',
                note: `返回当前时间戳`,
                input: [],
                isVarLen: false,
                isAsync: false,
                output: {
                    kind: VarKind.NUMBER
                },
                body: `return Date.now()`,
                cates: ['常用', '日期']
            },
            {
                name: 'concat',
                label: '合并文本',
                note: `将多个文本合并成一个文本。<br/>
用法：<span style="color: #529b2e">concat(文本1,文本2,...)</span>`,
                input: [
                    {
                        kind: VarKind.ANY
                    }
                ],
                isVarLen: true,
                isAsync: false,
                output: {
                    kind: VarKind.STRING
                },
                body: `return Array.from(arguments).join('')`,
                cates: ['常用', '文本']
            },
            {
                name: 'lower',
                label: '转成小写',
                note: `将一个文本中的所有大写字母转换为小写字母。<br/>
用法：<span style="color: #529b2e">lower(文本)</span>`,
                input: [
                    {
                        kind: VarKind.STRING
                    }
                ],
                isVarLen: false,
                isAsync: false,
                output: {
                    kind: VarKind.STRING
                },
                body: `return arguments[0].toLowerCase()`,
                cates: ['文本']
            },
            {
                name: 'httpGet',
                label: 'HTTP Get请求',
                note: `发起HTTP Get请求，返回Json格式。<br/>
用法：<span style="color: #529b2e">httpGet(https://httpbin.org/get)</span>`,
                input: [
                    {
                        label: '请求地址',
                        kind: VarKind.STRING
                    }
                ],
                isVarLen: false,
                isAsync: true,
                output: {
                    kind: VarKind.ANY
                },
                body: `return await (await fetch(arguments[0])).json()`,
                cates: ['API']
            }
        ]
    }

