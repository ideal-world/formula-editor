export default {
  title: 'Formula Editor',
  description: 'A relatively complete formula editor',
  base: '/formula-editor/',
  themeConfig: {
    nav: [
      { text: 'Introduction', link: '/' },
      { text: 'Edit Demo', link: '/editor-demo' },
      { text: 'Execute Demo', link: '/executor-demo' },
      { text: 'API', link: '/api/exports' },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/ideal-world/formula-editor' }],
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['vue', 'vue-i18n', 'codemirror', 'octicons-css', 'eslint-linter-browserify', 'vue-codemirror6', /@codemirror\/.+/, /@lezer\/.+/],
        output: {
          exports: 'named',
          globals: {
            vue: 'Vue',
          },
        },
      },
      emptyOutDir: false,
    },
  },
}
