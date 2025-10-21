import { PassThrough } from 'node:stream'

import type { AppLoadContext, EntryContext } from 'react-router'
import { createReadableStreamFromReadable } from '@react-router/node'
import { ServerRouter } from 'react-router'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import Backend from 'i18next-fs-backend'
import { resolve } from 'node:path'

import i18nextServer from './i18next.server'
import i18n from './i18n'

const ABORT_DELAY = 5_000

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    loadContext: AppLoadContext
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
            lng,
            ns,
            backend: {
                loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
            },
        })

    return new Promise((resolve, reject) => {
        let shellRendered = false
        const { pipe, abort } = renderToPipeableStream(
            <I18nextProvider i18n={instance}>
                <ServerRouter
                    context={routerContext}
                    url={request.url}
                    abortDelay={ABORT_DELAY}
                />
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
                onShellError(error: unknown) {
                    reject(error)
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
            }
        )

        setTimeout(abort, ABORT_DELAY)
    })
}
