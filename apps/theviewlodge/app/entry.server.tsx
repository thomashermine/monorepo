import { resolve } from 'node:path'
import { PassThrough } from 'node:stream'

import { createReadableStreamFromReadable } from '@react-router/node'
import { createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'

import i18n from './i18n'
import i18nextServer from './i18next.server'

const ABORT_DELAY = 5_000

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext
) {
    const callbackName = isbot(request.headers.get('user-agent'))
        ? 'onAllReady'
        : 'onShellReady'

    // Create a new i18next instance for this request
    const instance = createInstance()
    const lng = await i18nextServer.getLocale(request)
    const ns = i18nextServer.getRouteNamespaces(routerContext)

    await instance
        .use(initReactI18next)
        .use(Backend)
        .init({
            ...i18n,
            backend: {
                loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
            },
            lng,
            ns,
        })

    return new Promise((resolve, reject) => {
        let shellRendered = false
        const { pipe, abort } = renderToPipeableStream(
            <I18nextProvider i18n={instance}>
                <ServerRouter context={routerContext} url={request.url} />
            </I18nextProvider>,
            {
                [callbackName]: () => {
                    shellRendered = true
                    const body = new PassThrough()
                    const stream = createReadableStreamFromReadable(body)

                    responseHeaders.set('Content-Type', 'text/html')

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    )

                    pipe(body)
                },
                onError(error: unknown) {
                    responseStatusCode = 500
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error)
                    }
                },
                onShellError(error: unknown) {
                    reject(error)
                },
            }
        )

        setTimeout(abort, ABORT_DELAY)
    })
}
