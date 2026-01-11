import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getInitialNamespaces } from 'remix-i18next/client'

import i18n from './i18n'

// Declare the global type for our i18n data
declare global {
    interface Window {
        __i18nData?: {
            locale: string
            resources: Record<string, Record<string, unknown>>
        }
    }
}

// Get i18n data from the server (injected in root.tsx)
const i18nData = typeof window !== 'undefined' ? window.__i18nData : null

// Initialize i18next for the client using server-provided resources
// This ensures no flash of untranslated content and proper hydration
i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .init({
        ...i18n,

        // Don't load resources on client-side, use server resources
        initImmediate: false,

        // Ensure interpolation is enabled
        interpolation: {
            escapeValue: false, // React already escapes values
        },

        // Use the locale detected by the server
        lng: i18nData?.locale || i18n.fallbackLng,

        // This function detects the namespaces your routes rendered while SSR use
        ns: getInitialNamespaces(),

        // Partition resources by namespace for better organization
        partialBundledLanguages: true,

        // Trigger re-render when language changes
        react: {
            bindI18n: 'languageChanged loaded',
            bindI18nStore: 'added removed',
            useSuspense: false,
        },

        // Use the resources loaded by the server
        resources: i18nData?.resources
            ? { [i18nData.locale]: i18nData.resources }
            : undefined,
    })

export default i18next
