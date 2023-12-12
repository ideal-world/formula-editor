import antfu from '@antfu/eslint-config'

export default antfu({
  overrides: {
    vue: {
      'vue/no-mutating-props': ['error', {
        shallowOnly: true,
      }],
    },
  },
})
