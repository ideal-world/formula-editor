# Getting Started

## Setup

This setup assumes your client app is created with Vite and vue-ts template, and you use 'npm link' to link to `formula-editor` locally.

In your `package.json`, you shall have the dependencies compatible with the following:

```json
"dependencies": {
  "@element-plus/icons-vue": "^2.1.0",
  "element-plus": "^2.3.12",
  "vue": "^3.3.4"
}
```

In your `vite.config.ts`, you shall configure to dedupe `vue`:

```ts
export default defineConfig({
  resolve: {
    dedupe: ['vue'],
  },
});
```

In your `main.ts`, you shall import the libraries and CSS:

```ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'formula-editor/dist/style.css';
```

Import components from this library in your own component:

```html
<script setup lang="ts">
  import FormulaEditor from 'formula-editor';
</script>
```
