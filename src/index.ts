import { App, defineCustomElement } from 'vue'
import i18n from './i18n'
import { IwEditor } from './components'

export default (app: App): void => {
  app.use(i18n).component('IwEditor', IwEditor)
}

// @ts-ignore
export const IwEditorComp = defineCustomElement(IwEditor)

declare module 'vue' {
  export interface GlobalComponents {
    'IwEditor': typeof IwEditorComp,
  }
}

export * from './processes'
