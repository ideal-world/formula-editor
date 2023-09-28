/**
 * Variable type enum
 * 
 * Used to specify the type of a variable, function parameter, or function return value
 */
export enum VarKind {
  STRING = '字符串',
  NUMBER = '数值',
  BOOLEAN = '布尔',
  NULL = '空',
  STRINGS = '字符串数组',
  NUMBERS = '数值数组',
  BOOLEANS = '布尔数组',
  ANY = '任意类型'
}

/**
 * Editor configuration properties
 * 
 */
export interface EditorProps {
  /**
   * Target variable
   * 
   * Used to specify the target object to which the current formula is applied. The editor will check whether the formula return type matches it.
   * 
   * @example
   * ```
   * {
   *   name: 'formName',
   *   label: '表单标题',
   *   kind: VarKind.STRING,
   *   note: '表单的显示名称',
   *   minLen: 2,
   *   maxLen: 20
   * }
   * ```
   */
  targetVar: VarInfo
  /**
   * Material list
   *
   * Used to specify the variables and functions available in the current editor
   * 
   * {@link Namespace}
   * 
   * @example
   * ```
   * [
   *   {
   *     name: 'field',
   *     label: '字段',
   *     isVar: true,
   *     showLabel: true,
   *     color: '#f8e3c5',
   *     items: [
   *       {
   *         name: 'applicant',
   *         label: '申请人',
   *         kind: VarKind.STRING,
   *         note: '表单申请人姓名',
   *         minLen: 2,
   *         maxLen: 20,
   *         cates: ['基础信息']
   *       },
   *       {
   *         name: 'age',
   *         label: '年龄',
   *         kind: VarKind.NUMBER,
   *         note: '年龄',
   *         minLen: 18,
   *         maxLen: 60,
   *         defaultValue:36,
   *         cates: ['基础信息']
   *       }
   *     ]
   *   },
   *   {
   *     name: 'fun',
   *     label: '函数',
   *     isVar: false,
   *     showLabel: false,
   *     color: '#d9ecff',
   *     items: [
   *       {
   *         name: 'now',
   *         label: '当前时间',
   *         note: `返回当前时间戳`,
   *         input: [],
   *         isVarLen: false,
   *         isAsync: false,
   *         output: {
   *             kind: VarKind.NUMBER
   *         },
   *         body: `return Date.now()`,
   *         cates: ['常用', '日期处理']
   *       }
   *     ]
   *   }
   * ]
   * ```
   */
  materials: Namespace[]
  /**
   * Formula value
   * 
   * @example
   * ```
   * $.fun.concat($.fun.sum(1,$.field.age),3, true, ['1','2'], 'string')
   * ```
   */
  formulaValue?: string
  /**
   * Entry variables for material items
   * 
   * Default is `$`
   */
  entrance?: string
  /**
   * Whether to add a default function library
   */
  addDefaultFunLib?: boolean
}

/**
 * Material namespace
 *
 * Used to distinguish different materials, such as fields, functions, etc.
 */
export interface Namespace {
  /**
   * Namespace name
   * 
   * This field will serve as a unique identifier for the namespace
   */
  name: string
  /**
   * Namespace display name
   */
  label: string
  /**
   * Used to distinguish different namespaces by color
   */
  color?: string
  /**
   * Whether all items under this namespace are variables
   * 
   * When it is true, it is a variable; when it is false, it is a function.
   */
  isVar: boolean
  /**
   * Whether to use display names in the formula editor
   * 
   * Use {@link Namespace#label} when true, use {@link Namespace#name} when false
   */
  showLabel: boolean
  /**
   * All items in the namespace
   */
  items: VarInfo[] | FunInfo[]
}

/**
 * Variable qualification
 */
export interface VarGuard {
  /**
   * Variable type
   */
  kind: VarKind
  /**
   * Minimum length (minimum value)
   */
  minLen?: number
  /**
   * Maximum length (maximum value)
   */
  maxLen?: number
  /**
   * Check regularity
   */
  checkReg?: string
  /**
   * Optional
   */
  options?: [{ value: any; label: string }]
}

/**
 * Variable information
 * 
 * 
 * @example
 * ```
 * {
 *   name: 'age',
 *   label: '年龄',
 *   kind: VarKind.NUMBER,
 *   note: '年龄',
 *   minLen: 18,
 *   maxLen: 60,
 *   defaultValue:36,
 *   cates: ['基础','隐私']
 * }
 * ```
 */
export interface VarInfo extends VarGuard {
  /**
   * Variable name
   */
  name?: string
  /**
   * Variable display name
   */
  label?: string
  /**
   * Variable description
   */
  note?: string
  /**
   * Variable category
   * 
   * One variable can correspond to multiple categories
   */
  cates?: string[]
  /**
   * Default value
   */
  defaultValue?: any
}

/**
 * Function information
 * 
 * @example
 * ```
 * {
 *   name: 'sum',
 *   label: '求和',
 *   note: `获取一组数值的总和。<br/>用法：<span style='color: #529b2e'>SUM(数字1,数字2,...)</span>`,
 *   input: [
 *     {
 *       kind: VarKind.NUMBER,
 *     },
 *   ],
 *   isVarLen: true,
 *   isAsync: false,
 *   output: {
 *     kind: VarKind.NUMBER,
 *   },
 *   body: `return Array.from(arguments).reduce((a, b) => a + b)`,
 *   cates: ['常用', '计算'],
 * }
 * ```
 */
export interface FunInfo {
  /**
   * Function name
   */
  name: string
  /**
   * Function display name
   */
  label: string
  /**
   * Function description
   * 
   * Support html tags
   */
  note?: string
  /**
   * Function input parameters
   */
  input: VarInfo[]
  /**
   * Whether the parameter is of variable length
   * 
   * The variable length type is the type of the last input
   */
  isVarLen: boolean
  /**
   * Whether it is an asynchronous function
   * 
   * Asynchronous functions will be called in the formula in the form of `(await <Full name of function>)`
   */
  isAsync: boolean
  /**
   * Function return qualification
   */
  output: VarGuard
  /**
   * Function body
   * 
   * The function body is a JavaScript structure, which can be a single expression or a block statement
   * When it is a block-level statement, you need to use the `return` keyword to return the value
   * Function parameters are called using `arguments`
   */
  body: string
  /**
   * Function category
   * 
   * One function can correspond to multiple categories
   */
  cates: string[]
}
