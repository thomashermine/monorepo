import { HostexService } from '@monorepo/helpers/hostex'
import { Console, Effect } from 'effect'

/**
 * Registers webhooks with Hostex if they don't already exist
 * Checks for existing webhooks with the same URL and only creates if needed
 */
export const registerWebhooks = (webhookUrl: string) =>
    Effect.gen(function* () {
        const hostex = yield* HostexService

        yield* Console.log('🔗 Checking webhook registration...')

        // Get existing webhooks
        const webhooksResponse = yield* hostex.getWebhooks()

        // Check if webhook already exists for this URL
        const existingWebhook = webhooksResponse.data.find(
            (webhook) => webhook.url === webhookUrl && webhook.active
        )

        if (existingWebhook) {
            yield* Console.log(
                `✅ Webhook already registered for ${webhookUrl}`,
                `\n   Events: ${existingWebhook.events.join(', ')}`,
                `\n   Webhook ID: ${existingWebhook.id}`
            )
            return existingWebhook
        }

        // Register new webhook
        yield* Console.log(`📝 Registering new webhook for ${webhookUrl}...`)

        const events = [
            'reservation.created',
            'reservation.updated',
            'reservation.cancelled',
            'message.received',
            'review.created',
        ] as const

        const response = yield* hostex.createWebhook({
            url: webhookUrl,
            events: [...events],
        })

        yield* Console.log(
            `✅ Webhook registered successfully!`,
            `\n   Webhook ID: ${response.data.webhook.id}`,
            `\n   Events: ${response.data.webhook.events.join(', ')}`
        )

        return response.data.webhook
    })


