import { HostexService } from '@monorepo/helpers/hostex'
import { Console, Effect } from 'effect'

import {
    getAllPropertyIds,
    getPropertyThirdpartyAccountId,
    getPropertyVoucherGreenlist,
} from '../config/property'

/**
 * Clean up vouchers on app startup
 * Lists all vouchers from Hostex and deletes any that are not in the greenlist
 */
export const cleanupVouchers = Effect.gen(function* () {
    const hostexService = yield* HostexService

    yield* Console.log('\n🎫 Checking vouchers for cleanup...')

    const propertyIds = getAllPropertyIds()

    if (propertyIds.length === 0) {
        yield* Console.log(
            '   ℹ️  No properties configured - skipping voucher cleanup'
        )
        return
    }

    let totalVouchersChecked = 0
    let totalVouchersDeleted = 0

    for (const propertyId of propertyIds) {
        const thirdpartyAccountId = getPropertyThirdpartyAccountId(propertyId)
        const greenlist = getPropertyVoucherGreenlist(propertyId)

        if (!thirdpartyAccountId) {
            yield* Console.log(
                `   ⚠️  Property ${propertyId}: No thirdparty_account_id configured - skipping`
            )
            continue
        }

        yield* Console.log(
            `   🔍 Property ${propertyId}: Checking vouchers (Account: ${thirdpartyAccountId})`
        )

        // Fetch all vouchers for this property
        const vouchersResponse = yield* hostexService.getVouchers({
            thirdparty_account_id: thirdpartyAccountId,
            page: 1,
            page_size: 1000,
        })

        const vouchers = vouchersResponse.data
        totalVouchersChecked += vouchers.length

        yield* Console.log(
            `      📋 Found ${vouchers.length} voucher(s), greenlist has ${greenlist.length} code(s)`
        )

        if (greenlist.length === 0) {
            yield* Console.log(
                `      ⚠️  No greenlist configured - all ${vouchers.length} voucher(s) will be deleted!`
            )
        }

        // Delete vouchers that are not in the greenlist
        const greenlistSet = new Set(
            greenlist.map((code) => code.toUpperCase())
        )

        for (const voucher of vouchers) {
            if (!greenlistSet.has(voucher.code.toUpperCase())) {
                yield* Console.log(
                    `      🗑️  Deleting voucher: ${voucher.code} (ID: ${voucher.id})`
                )

                yield* hostexService
                    .deleteVoucher({
                        thirdparty_account_id: thirdpartyAccountId,
                        id: voucher.id,
                    })
                    .pipe(
                        Effect.tap(() =>
                            Effect.succeed(totalVouchersDeleted++)
                        ),
                        Effect.catchAll((error) =>
                            Effect.gen(function* () {
                                yield* Console.error(
                                    `         ❌ Failed to delete voucher ${voucher.code}:`,
                                    error
                                )
                            })
                        )
                    )
            } else {
                yield* Console.log(
                    `      ✅ Keeping voucher: ${voucher.code} (ID: ${voucher.id}) - in greenlist`
                )
            }
        }
    }

    yield* Console.log(
        `   ✅ Voucher cleanup complete: Checked ${totalVouchersChecked}, deleted ${totalVouchersDeleted}`
    )
})
