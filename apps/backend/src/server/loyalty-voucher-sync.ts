import { HostexService } from '@monorepo/helpers/hostex'
import { type LoyaltyCard, OdooService } from '@monorepo/helpers/odoo'
import { Console, Effect } from 'effect'

import {
    getAllPropertyIds,
    getPropertyLoyaltyToVoucherConfig,
    getPropertyThirdpartyAccountId,
    type LoyaltyToVoucherConfig,
} from '../config/property'

/**
 * Default configuration for loyalty card to voucher conversion
 */
const DEFAULT_LOYALTY_CONFIG: LoyaltyToVoucherConfig = {
    discountType: 'flat', // Treat points as flat currency discount
    minimumStay: 1,
    numberOfRedemptions: 1, // Single use per loyalty card
}

/**
 * Sync Odoo loyalty cards to Hostex vouchers
 * Creates a voucher for each active loyalty card
 */
export const syncLoyaltyCardsToVouchers = () =>
    Effect.gen(function* () {
        const odooService = yield* OdooService
        const hostexService = yield* HostexService

        yield* Console.log(
            '\n🎴 Syncing Odoo loyalty cards to Hostex vouchers...'
        )

        const propertyIds = getAllPropertyIds()

        if (propertyIds.length === 0) {
            yield* Console.log(
                '   ℹ️  No properties configured - skipping loyalty sync'
            )
            return
        }

        // Fetch all active loyalty cards from Odoo
        yield* Console.log('   📋 Fetching loyalty cards from Odoo...')
        const cardsResult = yield* odooService.getLoyaltyCards(
            [], // No domain filter - get all cards
            ['id', 'code', 'points', 'expiration_date', 'partner_id'], // Only fields we need
            { order: 'id desc' }
        )

        const cards = cardsResult.records

        if (cards.length === 0) {
            yield* Console.log('   ℹ️  No loyalty cards found in Odoo')
            return
        }

        yield* Console.log(
            `   ✅ Found ${cards.length} loyalty card(s) in Odoo`
        )

        let totalCreated = 0
        const totalSkipped = 0
        let totalErrors = 0

        // For each property, create vouchers
        for (const propertyId of propertyIds) {
            const thirdpartyAccountId =
                getPropertyThirdpartyAccountId(propertyId)

            if (!thirdpartyAccountId) {
                yield* Console.log(
                    `   ⚠️  Property ${propertyId}: No thirdparty_account_id - skipping`
                )
                continue
            }

            // Get property-specific configuration or use defaults
            const propertyConfig =
                getPropertyLoyaltyToVoucherConfig(propertyId) ??
                DEFAULT_LOYALTY_CONFIG

            yield* Console.log(
                `   🔄 Property ${propertyId}: Creating vouchers (Account: ${thirdpartyAccountId}, Type: ${propertyConfig.discountType})...`
            )

            // Create a voucher for each loyalty card
            for (const card of cards) {
                yield* createVoucherFromLoyaltyCard(
                    hostexService,
                    card,
                    thirdpartyAccountId,
                    propertyConfig
                ).pipe(
                    Effect.tap(() => Effect.succeed(totalCreated++)),
                    Effect.catchAll((error) =>
                        Effect.gen(function* () {
                            totalErrors++
                            yield* Console.error(
                                `      ❌ Failed to create voucher for card ${card.code ?? card.id}:`,
                                error
                            )
                        })
                    )
                )
            }
        }

        yield* Console.log(
            `   ✅ Loyalty sync complete: Created ${totalCreated}, Skipped ${totalSkipped}, Errors ${totalErrors}`
        )
    })

/**
 * Create a Hostex voucher from an Odoo loyalty card
 */
const createVoucherFromLoyaltyCard = (
    hostexService: typeof HostexService.Type,
    card: LoyaltyCard,
    thirdpartyAccountId: string,
    config: LoyaltyToVoucherConfig
) =>
    Effect.gen(function* () {
        // Validate card has required fields
        if (!card.code) {
            yield* Console.log(
                `      ⚠️  Skipping card ${card.id}: No code specified`
            )
            return
        }

        if (!card.points || card.points <= 0) {
            yield* Console.log(
                `      ⚠️  Skipping card ${card.code}: No points or invalid points (${card.points ?? 0})`
            )
            return
        }

        // Fetch current vouchers to check if it already exists
        const vouchersResponse = yield* hostexService.getVouchers({
            page: 1,
            page_size: 1000,
            thirdparty_account_id: thirdpartyAccountId,
        })

        const existingVoucher = vouchersResponse.data.find(
            (v) => v.code.toUpperCase() === card.code!.toUpperCase()
        )

        if (existingVoucher) {
            yield* Console.log(
                `      ℹ️  Voucher ${card.code} already exists (ID: ${existingVoucher.id}) - skipping`
            )
            return
        }

        // Create voucher from loyalty card
        const voucherInput = {
            code: card.code.toUpperCase(),
            discount: Math.round(card.points),
            discount_type: config.discountType,
            earliest_check_in: null,
            // Round to integer
            expired_at: card.expiration_date ?? null,

            latest_check_out: null,
            minimum_stay: config.minimumStay ?? 1,
            number_of_redemption: config.numberOfRedemptions ?? 1,
            stay_period: 1,
            thirdparty_account_id: thirdpartyAccountId,
        }

        yield* Console.log(
            `      ➕ Creating voucher: ${voucherInput.code} (${voucherInput.discount_type === 'percent' ? `${voucherInput.discount}%` : `€${voucherInput.discount}`})`
        )
        console.log(voucherInput)

        const result = yield* hostexService.createVoucher(voucherInput)

        yield* Console.log(`         ✅ Created voucher ID: ${result.data.id}`)
    })
