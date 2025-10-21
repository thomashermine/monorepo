import i18n from '~/i18n'

/**
 * Build a localized path for the given route
 * @param path - The path without language prefix (e.g., "/vouchers")
 * @param lang - The language code (e.g., "fr", "es")
 * @returns The localized path (e.g., "/fr/vouchers" or "/vouchers" for English)
 */
export function localizedPath(path: string, lang: string): string {
    // Remove trailing slash if present
    const cleanPath =
        path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path

    // For English (default language), don't add prefix
    if (lang === i18n.fallbackLng) {
        return cleanPath || '/'
    }

    // For other languages, add language prefix
    if (cleanPath === '/') {
        return `/${lang}`
    }

    return `/${lang}${cleanPath}`
}

/**
 * Get the current language from the i18n instance
 */
export function getCurrentLanguage(): string {
    return i18n.fallbackLng // This will be overridden by the client-side i18n
}

/**
 * Get language data for language switcher
 */
export function getLanguageSwitcherData(
    currentPath: string,
    currentLang: string
) {
    // Remove language prefix from current path to get the base path
    const basePath =
        currentLang !== i18n.fallbackLng
            ? currentPath.replace(`/${currentLang}`, '') || '/'
            : currentPath

    return [
        {
            code: 'EN',
            current: currentLang === 'en',
            href: localizedPath(basePath, 'en'),
            label: 'English',
        },
        {
            code: 'FR',
            current: currentLang === 'fr',
            href: localizedPath(basePath, 'fr'),
            label: 'Français',
        },
        {
            code: 'NL',
            current: currentLang === 'nl',
            href: localizedPath(basePath, 'nl'),
            label: 'Nederlands',
        },
        {
            code: 'DE',
            current: currentLang === 'de',
            href: localizedPath(basePath, 'de'),
            label: 'Deutsch',
        },
        {
            code: 'ES',
            current: currentLang === 'es',
            href: localizedPath(basePath, 'es'),
            label: 'Español',
        },
    ]
}
