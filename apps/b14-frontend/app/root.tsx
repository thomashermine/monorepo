import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    type LinksFunction,
} from "react-router";
import "./app.css";

export const links: LinksFunction = () => [
    {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
    },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DIN+Alternate:wght@400;700&display=swap",
    },
];

export default function App() {
    return (
        <html lang="fr">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="theme-color" content="#BE6A38" />
                <title>B14 — Le Loft</title>
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
