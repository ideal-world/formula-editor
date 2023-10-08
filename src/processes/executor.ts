import { FunInfo, Namespace, VarInfo } from './interface'
import i18n from '../i18n'
const { t } = i18n.global

/**
 * Formula execution engine
 * 
 * @param inputParams input parameters
 * @param formulaValue the formula to be executed
 * @param materials materials used in the formula. 
 *            You need to ensure that the variables or functions used in the formula are defined, 
 *            and the variables in materials have corresponding input params values.
 * @param entrance entrance variable of the formula
 * @returns formula execution results
 * 
 * @example
 * ```js
 * let inputParams = new Map<string,any>()
 * inputParams.set('$.field.age', 18)
 * let formulaValue = `$.fun.concat($.fun.sum(1,$.field.age))`
 * let entrance = '$'
 * let materials = [
 *  {
 *    name: 'field',
 *    label: '字段',
 *    isVar: true,
 *    items: [
 *      {
 *        name: 'applicant',
 *        label: '申请人'
 *      },
 *      {
 *        name: 'age',
 *        label: '年龄'
 *      }
 *    ]
 *  },
 *  {
 *    name: 'fun',
 *    label: '内置',
 *    isVar: false,
 *    items: [
 *      {
 *        name: 'sum',
 *        label: '求和',
 *        body: `return Array.from(arguments).reduce((a, b) => a + b)`
 *      },
 *      {
 *        name: 'concat',
 *        label: '合并文本',
 *        body: `return Array.from(arguments).join('')`
 *    ]
 *  }]
 * try{
 *   let result = await execute(inputParams, formulaValue, materials, entrance)
 * }catch(e){
 *   console.error(e)
 *   throw e
 * }
 * ```
 */
export async function execute(inputParams: Map<string, any>, formulaValue: string, materials: Namespace[], entrance: string): Promise<any> {
  let $ = packageEntrance(inputParams, materials, entrance)
  return await doExecute($, formulaValue)
}

/**
 * Convert to js object
 * 
 * @param inputParams input parameters
 * @param materials materials used in the formula
 * @param entrance entrance variable of the formula
 * @returns js object
 * 
 * @example
 * ```js
 * const $ = {
 *   fun: {
 *     concat: function () {
 *       return Array.from(arguments).join('')
 *     },
 *     sum: function () {
 *       return Array.from(arguments).reduce((a, b) => a + b)
 *     }
 *   },
 *   field: {
 *     age: 18
 *   }
 * }
 * ```
 */
function packageEntrance(inputParams: Map<string, any>, materials: Namespace[], entrance: string): any {
  let $: any = {}
  materials.forEach((ns) => {
    if (!$[ns.name]) {
      // Add namespace
      $[ns.name] = {}
    }
    if (ns.isVar) {
      (ns.items as VarInfo[]).forEach((varInfo) => {
        let paramName = entrance + '.' + ns.name + '.' + varInfo.name
        // The value of the variable comes from the input and cannot be taken from the default value
        let paramValue = inputParams.has(paramName) ? inputParams.get(paramName) : undefined
        if (paramValue === undefined) {
          throw new Error(t('executor.param_value_not_exist_error', { 'var': varInfo.label }))
        }
        // Add variable name and corresponding value
        $[ns.name][varInfo.name!] = paramValue
      })
    } else {
      (ns.items as FunInfo[]).forEach((funInfo) => {
        if (funInfo.isAsync) {
          const AsyncFunction = Object.getPrototypeOf(async function () {
          }).constructor
          // Add async function
          $[ns.name][funInfo.name] = new AsyncFunction(funInfo.body)
        } else {
          const syncFunction = Object.getPrototypeOf(function () {
          }).constructor
          // Add sync function
          $[ns.name][funInfo.name] = new syncFunction(funInfo.body)
        }
      })
    }
  })
  return $
}

/**
 * The real execution formula
 * @param $ The js object required by the formula to be called
 * @param formulaValue formula value
 * @returns execution results
 */
async function doExecute($: any, formulaValue: string): Promise<any> {
  const asyncFunction = Object.getPrototypeOf(async function () {
  }).constructor
  try {
    const asyncFn = new asyncFunction('$', `return ` + formulaValue)
    return await asyncFn($)
  } catch (e: any) {
    throw new Error(t('executor.execute_error') + e.message)
  }
}


