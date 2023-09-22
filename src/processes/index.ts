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

export interface Namespace {
  name: string
  label: string
  color?: string
  isVar: boolean
  items: VarInfo[] | FunInfo[]
}

export interface VarGuard {
  kind: VarKind
  minLen?: number
  maxLen?: number
  checkReg?: string
  options?: [{ value: any; label: string }]
}

export interface VarInfo extends VarGuard {
  name?: string
  label?: string
  note?: string
  cates?: string[]
  defaultValue?: any
}

export interface FunInfo {
  name: string
  label: string
  note?: string
  input: VarInfo[]
  // Variable length, the variable length type is the type of the last input
  isVarLen: boolean
  output: VarGuard
  cates: string[]
}
