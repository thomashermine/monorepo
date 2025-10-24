import 'dotenv/config'

import { createServer } from 'node:http'

import { HttpRouter, HttpServer, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { HostexServiceLive } from '@monorepo/helpers/hostex'
import {
    type LoyaltyCard,
    OdooService,
    OdooServiceLive,
    type SearchReadResponse,
} from '@monorepo/helpers/odoo'
import { OpenAIServiceLive } from '@monorepo/helpers/openai'
import { Console, Effect, Layer } from 'effect'

import { aiChatRoute } from './server/ai-chat'
import { bookingsNextRoute } from './server/bookings-next'
import { calendarCheckInOutIcsRoute } from './server/calendar-checkinout-ics'
import { calendarCheckInOutJsonRoute } from './server/calendar-checkinout-json'
import { calendarFullDayIcsRoute } from './server/calendar-full-day-ics'
import { calendarFullDayJsonRoute } from './server/calendar-full-day-json'
import { homeRoute } from './server/home'
import { syncLoyaltyCardsToVouchers } from './server/loyalty-voucher-sync'
import { messagesExportRoute } from './server/messages-export'
import { notFoundRoute } from './server/not-found'
import { cleanupVouchers } from './server/voucher-cleanup'
import { registerWebhooks } from './server/webhook-registration'

const port = process.env.PORT ?? 3000

// ============================================================================================================ Routes
const router = HttpRouter.empty.pipe(
    HttpRouter.concat(homeRoute),
    HttpRouter.concat(aiChatRoute),
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

    // Clean up vouchers that are not in the greenlist
    yield* cleanupVouchers.pipe(
        Effect.catchAll((error) =>
            Effect.gen(function* () {
                yield* Console.error('⚠️  Failed to cleanup vouchers:', error)
                yield* Console.log('   Continuing without voucher cleanup...')
            })
        )
    )

    // Sync Odoo loyalty cards to Hostex vouchers
    yield* syncLoyaltyCardsToVouchers().pipe(
        Effect.catchAll((error) =>
            Effect.gen(function* () {
                yield* Console.error(
                    '⚠️  Failed to sync loyalty cards to vouchers:',
                    error
                )
                yield* Console.log('   Continuing without loyalty sync...')
            })
        )
    )

    // Fetch and display the last loyalty card from Odoo
    yield* Effect.gen(function* () {
        const odooService = yield* OdooService
        const cardsResult: SearchReadResponse<LoyaltyCard> =
            yield* odooService.getLoyaltyCards([], undefined, {
                order: 'id desc',
            })

        yield* Console.log('\n🎴 Last loyalty card from Odoo:')
        for (const card of cardsResult.records) {
            const partnerName = Array.isArray(card.partner_id)
                ? card.partner_id[1]
                : 'N/A'
            const programName = Array.isArray(card.program_id)
                ? card.program_id[1]
                : 'N/A'
            yield* Console.log(
                `  - Card #${card.id}: ${card.code ?? 'N/A'} | Partner: ${partnerName ?? 'N/A'} | Program: ${programName ?? 'N/A'} | Points: ${card.points ?? 0}`
            )
        }
    }).pipe(
        Effect.catchAll((error) =>
            Effect.gen(function* () {
                yield* Console.error(
                    '⚠️  Failed to fetch loyalty cards:',
                    error
                )
                yield* Console.log(
                    '   Continuing without loyalty card listing...'
                )
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
