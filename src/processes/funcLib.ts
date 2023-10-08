import { VarKind } from './interface'
import i18n from '../i18n'
const { t } = i18n.global

/**
 * Default function library
 */
export const DEFAULT_FUN_LIB =
{
  name: 'fun',
  label: t('fun_lib.inner'),
  isVar: false,
  showLabel: false,
  color: '#d9ecff',
  items: [
    {
      name: 'sum',
      label: t('fun_lib.sum_label'),
      note: t('fun_lib.sum_note'),
      input: [
        {
          kind: VarKind.NUMBER,
        },
      ],
      isVarLen: true,
      isAsync: false,
      output: {
        kind: VarKind.NUMBER,
      },
      body: `return Array.from(arguments).reduce((a, b) => a + b)`,
      cates: [t('fun_lib.cate_common'), t('fun_lib.cate_calc')],
    },
    {
      name: 'now',
      label: t('fun_lib.now_label'),
      note: t('fun_lib.now_note'),
      input: [],
      isVarLen: false,
      isAsync: false,
      output: {
        kind: VarKind.NUMBER,
      },
      body: `return Date.now()`,
      cates: [t('fun_lib.cate_common'), t('fun_lib.cate_time')],
    },
    {
      name: 'concat',
      label: t('fun_lib.concat_label'),
      note: t('fun_lib.concat_note'),
      input: [
        {
          kind: VarKind.ANY,
        },
      ],
      isVarLen: true,
      isAsync: false,
      output: {
        kind: VarKind.STRING,
      },
      body: `return Array.from(arguments).join('')`,
      cates: [t('fun_lib.cate_common'), t('fun_lib.cate_txt')],
    },
    {
      name: 'lower',
      label: t('fun_lib.lower_label'),
      note: t('fun_lib.lower_note'),
      input: [
        {
          kind: VarKind.STRING,
        },
      ],
      isVarLen: false,
      isAsync: false,
      output: {
        kind: VarKind.STRING,
      },
      body: `return arguments[0].toLowerCase()`,
      cates: [t('fun_lib.cate_txt')],
    },
    {
      name: 'upper',
      label: t('fun_lib.upper_label'),
      note: t('fun_lib.upper_note'),
      input: [
        {
          kind: VarKind.STRING,
        },
      ],
      isVarLen: false,
      isAsync: false,
      output: {
        kind: VarKind.STRING,
      },
      body: `return arguments[0].toUpperCase()`,
      cates: [t('fun_lib.cate_txt')],
    },
    {
      name: 'httpGet',
      label: t('fun_lib.httpGet_label'),
      note: t('fun_lib.httpGet_note'),
      input: [
        {
          label: t('fun_lib.httpGet_input1'),
          kind: VarKind.STRING,
        },
      ],
      isVarLen: false,
      isAsync: true,
      output: {
        kind: VarKind.ANY,
      },
      body: `return await (await fetch(arguments[0])).json()`,
      cates: [t('fun_lib.cate_api')],
    },
  ],
}

