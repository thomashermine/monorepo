import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { getInitialNamespaces } from 'remix-i18next/client'

import i18n from './i18n'

// Initialize i18next for the client
const i18nextPromise = i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(LanguageDetector) // Setup a client-side language detector
    .use(Backend) // Setup backend to load translation files
    .init({
        ...i18n,
        
        backend: {
            // Load translations from the public folder
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        
// Enable this to see debug output in console
debug: true,
        

detection: {
            
            
            
            // Cache the language in localStorage for persistence
caches: ['localStorage'],
            
            


// Don't look at URL paths for language detection
lookupFromPathIndex: 0,
            
            // Here only enable htmlTag detection, we'll detect the language only
// server-side with remix-i18next, by using the `<html lang>` attribute
// we can communicate to the client the language detected server-side
order: ['htmlTag', 'localStorage'],
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
