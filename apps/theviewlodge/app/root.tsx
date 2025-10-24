import './app.css'

import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from 'react-router'
import { useChangeLanguage } from 'remix-i18next/react'

import type { Route } from './+types/root'

export async function loader({ request, params }: Route.LoaderArgs) {
    const i18nextServer = await import('./i18next.server').then(
        (m) => m.default
    )
    // Pass params to getLocale so it can extract language from :lang parameter
    const locale = await i18nextServer.getLocale(request)

    // If there's a lang param in the URL, use that
    const langFromParams = params?.lang
    const finalLocale =
        langFromParams &&
        ['en', 'fr', 'es', 'nl', 'de'].includes(langFromParams)
            ? langFromParams
            : locale

    return { locale: finalLocale }
}

export const links: Route.LinksFunction = () => [
    { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
    {
        crossOrigin: 'anonymous',
        href: 'https://fonts.gstatic.com',
        rel: 'preconnect',
    },
    {
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
        rel: 'stylesheet',
    },
]

export function HydrateFallback() {
    return <p>Loading...</p>
}

export function Layout({ children }: { children: React.ReactNode }) {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <html lang={loaderData?.locale ?? 'en'} dir="ltr">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function App() {
    const { locale } = useLoaderData<typeof loader>()

    // Sync server-detected language with client
    useChangeLanguage(locale)

    return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Oops!'
    let details = 'An unexpected error occurred.'
    let stack: string | undefined

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error'
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message
        stack = error.stack
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    )
}
