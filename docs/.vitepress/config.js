const path = require('path')

module.exports = {
  title: 'Formula Editor',
  description: 'A relatively complete formula editor',
  themeConfig: {
    repo: 'https://github.com/idealworld/formula-editor',
    sidebar: [
      {
        text: 'Introduction',
        children: [
          { text: 'Getting Started', link: '/guide/' }
        ]
      },
      {
        text: 'Components',
        children: [
          { text: 'Editor', link: '/components/editor' },
        ]
      }
    ]
  },
  vite: {
    resolve: {
      alias: {
        'formula-editor': path.resolve(__dirname, '../../src')
      },
      dedupe: ['vue', /element-plus\/.+/]
    }
  }
}
