import { HostexService } from '@monorepo/helpers/hostex'
import { Console, Effect } from 'effect'

/**
 * Registers webhooks with Hostex if they don't already exist
 * Checks for existing webhooks with the same URL and only creates if needed
 */
export const registerWebhooks = (webhookUrl: string) =>
    Effect.gen(function* () {
        const hostex = yield* HostexService

        yield* Console.log('🔗 Registering webhook...')

        const events = [
            'reservation.created',
            'reservation.updated',
            'reservation.cancelled',
            'message.received',
            'review.created',
        ] as const

        const webhook = yield* hostex.registerWebhook(webhookUrl, events)
        return webhook
    })
