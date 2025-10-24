import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { HydratedRouter } from 'react-router/dom'

import i18next, { i18nextPromise } from './i18next.client'

// Wait for i18next to be initialized before hydrating
async function hydrate() {
    // Ensure i18next is ready
    await i18nextPromise

    startTransition(() => {
        hydrateRoot(
            document,
            <I18nextProvider i18n={i18next}>
                <StrictMode>
                    <HydratedRouter />
                </StrictMode>
            </I18nextProvider>
        )
    })
}

hydrate()
