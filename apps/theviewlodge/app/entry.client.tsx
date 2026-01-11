import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { HydratedRouter } from 'react-router/dom'

import i18next from './i18next.client'

// Hydrate immediately since translations are now available from the server
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
