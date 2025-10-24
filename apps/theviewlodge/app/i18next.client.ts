import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { getInitialNamespaces } from 'remix-i18next/client'

import i18n from './i18n'

// Initialize i18next for the client
// Translations are loaded once after hydration to match SSR
const i18nextPromise = i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(LanguageDetector) // Setup a client-side language detector
    .use(Backend) // Load translations to match what was server-rendered
    .init({
        ...i18n,

        backend: {
            // Load translations from the public folder (once after hydration)
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        detection: {
            caches: [],
            // Only trust the server's language detection via htmlTag
            order: ['htmlTag'], // Don't cache on client-side
        },

        // Ensure interpolation is enabled
        interpolation: {
            escapeValue: false, // React already escapes values
        },

        // This function detects the namespaces your routes rendered while SSR use
        ns: getInitialNamespaces(),

        // Trigger re-render when language changes
        react: {
            bindI18n: 'languageChanged loaded',
            bindI18nStore: 'added removed',
            useSuspense: false,
        },
    })

export { i18nextPromise }
export default i18next
