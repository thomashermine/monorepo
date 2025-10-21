import { useTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGES } from '../utils/i18n'

interface LanguageSwitcherProps {
    className?: string
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const { t, i18n } = useTranslation()

    const changeLanguage = async (lng: string) => {
        console.log('Changing language to:', lng)
        console.log('Current language:', i18n.language)
        console.log('i18n instance:', i18n)

        try {
            await i18n.changeLanguage(lng)
            console.log('Language changed to:', i18n.language)

            // Update the HTML lang attribute to reflect the change
            if (typeof document !== 'undefined') {
                document.documentElement.lang = lng
            }
        } catch (error) {
            console.error('Error changing language:', error)
        }
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <label className="font-medium text-sm">{t('language')}:</label>
            {SUPPORTED_LANGUAGES.map(({ code, name }) => (
                <button
                    key={code}
                    type="button"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        changeLanguage(code)
                    }}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                        i18n.language === code
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-label={`Switch to ${name}`}
                    aria-current={i18n.language === code ? 'true' : 'false'}
                >
                    {name}
                </button>
            ))}
        </div>
    )
}
