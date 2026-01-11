import 'i18next'

import { resolve } from 'node:path'

import Backend from 'i18next-fs-backend'
import { initReactI18next } from 'react-i18next'
import { createCookie } from 'react-router'
import { createI18nextMiddleware } from 'remix-i18next/middleware'

import i18nConfig from '../i18n'

// This cookie will be used to store the user locale preference
export const localeCookie = createCookie('lng', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
})

export const [i18nextMiddleware, getLocale, getInstance] =
    createI18nextMiddleware({
        detection: {
            cookie: localeCookie, // The cookie to store the user preference
            fallbackLanguage: i18nConfig.fallbackLng,
            supportedLanguages: i18nConfig.supportedLngs,
        },
        i18next: {
            ...i18nConfig,
            backend: {
                loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
            },
        },
        plugins: [initReactI18next, Backend],
    })

// This adds type-safety to the `t` function
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common'
    }
}
