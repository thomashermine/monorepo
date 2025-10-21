import { useTranslation } from 'react-i18next'

/**
 * Custom hook for using translations in components
 * Provides access to the translation function and i18n instance
 */
export function useI18n() {
    return useTranslation()
}

/**
 * Available languages in the application
 */
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['code']
