import {App, defineCustomElement} from 'vue'
import {IwEditor} from './components'

export default (app: App): void => {
    app.component('IwEditor', IwEditor)
}

export const IwEditorComp = defineCustomElement(IwEditor)

declare module 'vue' {
    export interface GlobalComponents {
        'IwEditor': typeof IwEditorComp,
    }
}

export * from './processes'
