import 'dotenv/config'

import { createServer } from 'node:http'

import { HttpRouter, HttpServer, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { HostexServiceLive } from '@monorepo/helpers/hostex'
import { OdooService, OdooServiceLive } from '@monorepo/helpers/odoo'
import { OpenAIServiceLive } from '@monorepo/helpers/openai'
import { Console, Effect, Layer } from 'effect'

import { bookingsNextRoute } from './server/bookings-next'
import { calendarCheckInOutIcsRoute } from './server/calendar-checkinout-ics'
import { calendarCheckInOutJsonRoute } from './server/calendar-checkinout-json'
import { calendarFullDayIcsRoute } from './server/calendar-full-day-ics'
import { calendarFullDayJsonRoute } from './server/calendar-full-day-json'
import { homeRoute } from './server/home'
import { messagesExportRoute } from './server/messages-export'
import { notFoundRoute } from './server/not-found'
import { registerWebhooks } from './server/webhook-registration'

const port = process.env.PORT ?? 3000

// ============================================================================================================ Routes
const router = HttpRouter.empty.pipe(
    HttpRouter.concat(homeRoute),
    HttpRouter.concat(bookingsNextRoute),
    HttpRouter.concat(calendarFullDayIcsRoute),
    HttpRouter.concat(calendarCheckInOutIcsRoute),
    HttpRouter.concat(calendarFullDayJsonRoute),
    HttpRouter.concat(calendarCheckInOutJsonRoute),
    HttpRouter.concat(messagesExportRoute),
    HttpRouter.concat(notFoundRoute)
)

// ============================================================================================================ Error Handling
const routerWithErrorHandling = router.pipe(
    Effect.catchAll((error) =>
        Effect.gen(function* () {
            yield* Console.error('Request error:', error)
            yield* Console.error('Error type:', typeof error)
            yield* Console.error(
                'Error keys:',
                error && typeof error === 'object' ? Object.keys(error) : 'N/A'
            )

            let errorMessage = 'Unknown error'

            if (error && typeof error === 'object') {
                if ('message' in error) {
                    errorMessage = String(
                        (error as { message: unknown }).message
                    )
                } else {
                    errorMessage = JSON.stringify(error)
                }
            } else if (typeof error === 'string') {
                errorMessage = error
            }

            return yield* HttpServerResponse.json(
                {
                    error: 'Internal server error',
                    message: errorMessage,
                },
                { status: 500 }
            )
        })
    )
)

// ============================================================================================================ Server Setup
const ServerLive = routerWithErrorHandling.pipe(
    HttpServer.serve(),
    HttpServer.withLogAddress,
    Layer.provide(NodeHttpServer.layer(createServer, { port: Number(port) })),
    Layer.provide(HostexServiceLive),
    Layer.provide(OpenAIServiceLive),
    Layer.provide(OdooServiceLive)
)

// ================================================================================================================ Program
const program = Effect.gen(function* () {
    yield* Console.log(
        `🚀 Server starting on http://localhost:${port}...`,
        `Some env var: ${process.env.SOME_ENV_VAR}`
    )

    // Register webhooks if WEBHOOK_URL is configured
    const webhookUrl = process.env.WEBHOOK_URL
    if (webhookUrl) {
        yield* Console.log(`ℹ️  Webhook URL configured: ${webhookUrl}`)
        yield* registerWebhooks(webhookUrl).pipe(
            Effect.tap(() =>
                Console.log(
                    `ℹ️  Webhook registration completed successfully`,
                    `   All events are now forwarded to: ${webhookUrl}`
                )
            ),
            Effect.catchAll((error) =>
                Effect.gen(function* () {
                    yield* Console.error(
                        '⚠️  Failed to register webhooks:',
                        error
                    )
                    yield* Console.log(
                        '   Continuing without webhook registration...'
                    )
                })
            )
        )
    } else {
        yield* Console.log(
            '⚠️  WEBHOOK_URL not configured - skipping webhook registration'
        )
    }

    // Fetch and display the last 3 invoices from Odoo
    yield* Effect.gen(function* () {
        const odooService = yield* OdooService
        const invoicesResult = yield* odooService.getProducts([], undefined, {
            limit: 3,
            order: 'id desc',
        })

        yield* Console.log('\n📄 Last 3 invoices from Odoo:')
        for (const invoice of invoicesResult.records) {
            const partnerName = Array.isArray(invoice.partner_id)
                ? invoice.partner_id[1]
                : 'N/A'
            yield* Console.log(
                `  - Invoice #${invoice.id}: ${invoice.name ?? 'N/A'} | Partner: ${partnerName ?? 'N/A'} | Amount: ${invoice.amount_total ?? 0}`
            )
        }
    }).pipe(
        Effect.catchAll((error) =>
            Effect.gen(function* () {
                yield* Console.error('⚠️  Failed to fetch invoices:', error)
                yield* Console.log('   Continuing without invoice listing...')
            })
        )
    )

    yield* Console.log(`✅ Server ready on http://localhost:${port}`)

    yield* Layer.launch(ServerLive)
}).pipe(
    Effect.provide(HostexServiceLive),
    Effect.provide(OpenAIServiceLive),
    Effect.provide(OdooServiceLive)
)

// ===================================================================================================================== Run
NodeRuntime.runMain(program)
