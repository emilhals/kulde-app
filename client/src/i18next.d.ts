import common from '@/locales/no/common.json'
import simulator from '@/locales/no/simulator.json'
import translation from '@/locales/no/translation.json'

import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof translation
      simulator: typeof simulator
      common: typeof common
    }
  }
}
