import type { App } from 'vue'
import { defineCustomElement } from 'vue'
import './assets/main.css'
import locales from './locales'
import { IwEditor } from './components'

export default (app: App): void => {
  app.use(locales).component('IwEditor', IwEditor)
}

export const IwEditorComp = defineCustomElement(IwEditor)

declare module 'vue' {
  export interface GlobalComponents {
    'IwEditor': typeof IwEditorComp
  }
}

export * from './processes'
