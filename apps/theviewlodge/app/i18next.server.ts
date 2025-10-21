import { resolve } from 'node:path'

import Backend from 'i18next-fs-backend'
import { RemixI18Next } from 'remix-i18next/server'

import i18n from './i18n'

const i18next = new RemixI18Next({
    detection: {
        fallbackLanguage: i18n.fallbackLng,
        supportedLanguages: i18n.supportedLngs,
    },
    // This is the configuration for i18next used
    // when translating messages server-side only
    i18next: {
        ...i18n,
        backend: {
            loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
        },
    },
    // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
    // E.g. The Backend plugin for loading translations from the file system
    // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
    plugins: [Backend],
})

export default i18next

// Helper function to detect language from URL path
export function getLanguageFromPath(pathname: string): string {
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]

    // Check if first segment is a supported language
    if (firstSegment && i18n.supportedLngs.includes(firstSegment)) {
        return firstSegment
    }

    // Default to English if no language prefix
    return i18n.fallbackLng
}
