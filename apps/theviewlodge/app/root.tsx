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

import type { Route } from './+types/root'

export async function loader({ request, params }: Route.LoaderArgs) {
    // Get language from URL path (e.g., /fr or /)
    const url = new URL(request.url)
    const pathname = url.pathname
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]

    // Supported languages
    const supportedLngs = ['en', 'fr', 'es', 'nl', 'de']

    // Check if first segment is a supported language
    const locale =
        params.lang ||
        (firstSegment && supportedLngs.includes(firstSegment)
            ? firstSegment
            : 'en')

    return { locale }
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
