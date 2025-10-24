import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'

import { localizedPath, SUPPORTED_LANGUAGES } from '../utils/i18n'

interface LanguageSwitcherProps {
    className?: string
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const { t, i18n } = useTranslation()
    const location = useLocation()

    // Get current base path without language prefix
    const getBasePath = () => {
        const { pathname } = location
        // Remove language prefix if present
        const pathSegments = pathname.split('/').filter(Boolean)
        const firstSegment = pathSegments[0]

        if (
            firstSegment &&
            ['en', 'fr', 'es', 'nl', 'de'].includes(firstSegment)
        ) {
            return '/' + pathSegments.slice(1).join('/')
        }

        return pathname
    }

    const basePath = getBasePath()

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <label className="font-medium text-sm">{t('language')}:</label>
            {SUPPORTED_LANGUAGES.map(({ code, name }) => {
                const localizedUrl = localizedPath(basePath, code)
                return (
                    <Link
                        key={code}
                        to={localizedUrl}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                            i18n.language === code
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        aria-label={`Switch to ${name}`}
                        aria-current={
                            i18n.language === code ? 'page' : undefined
                        }
                    >
                        {name}
                    </Link>
                )
            })}
        </div>
    )
}
