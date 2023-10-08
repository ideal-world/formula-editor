import { createI18n } from 'vue-i18n'
import zh from './assets/i18n/zh-cn'
import en from './assets/i18n/en'

const i18n = createI18n({
  legacy: false,
  locale: (typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : undefined) || (typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : undefined),
  fallbackLocale: 'en',
  messages: {
    zh, en
  },
})

export default i18n