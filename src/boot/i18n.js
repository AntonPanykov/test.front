import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import { Quasar } from 'quasar'

Vue.use(VueI18n)
const i18nInstance = new VueI18n({
  locale: 'ru',
  fallbackLocale: 'ru',
  messages
})

export default ({ app }) => {
  app.i18n = i18nInstance
}

export { i18nInstance }

export const setLocale = (locale) => {
  import(`quasar/lang/${locale}`).then(lang => {
    Quasar.lang.set(lang.default)
  })
}
