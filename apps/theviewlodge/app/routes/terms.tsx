import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/blocks/Card'
import { Section } from '@/components/blocks/Section'
import { Footer } from '@/components/components/Footer'
import { MobileMenu } from '@/components/components/MobileMenu'
import { NavigationBar } from '@/components/components/NavigationBar'
import { Heading } from '@/components/primitives/Heading'
import { Text } from '@/components/primitives/Text'
import { generateSocialMetaTags } from '@/utils/meta'

import type { Route } from './+types/terms'

export async function loader({ request, params }: Route.LoaderArgs) {
    // Import server module only in loader
    const i18nextServer = await import('@/i18next.server').then(
        (m) => m.default
    )
    const locale = await i18nextServer.getLocale(request)

    // If there's a lang param in the URL, use that
    const langFromParams = params?.lang
    const finalLocale =
        langFromParams &&
        ['en', 'fr', 'es', 'nl', 'de'].includes(langFromParams)
            ? langFromParams
            : locale
    const t = await i18nextServer.getFixedT(finalLocale)

    return {
        locale: finalLocale,
        meta: {
            description: t('meta.terms.description'),
            title: t('meta.terms.title'),
        },
    }
}

export function meta({ data }: Route.MetaArgs) {
    return generateSocialMetaTags({
        title: data?.meta.title,
        description: data?.meta.description,
    })
}

export default function Terms({ loaderData }: Route.ComponentProps) {
    const { t, i18n } = useTranslation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Get locale from loader data or fallback to i18n.language
    const currentLocale = loaderData?.locale || i18n.language

    // Build navigation items with language-aware paths
    const getLocalizedPath = (path: string) => {
        if (currentLocale === 'en') return path
        return `/${currentLocale}${path}`
    }

    const navigationItems = [
        { href: getLocalizedPath('/'), label: t('navigation.home') },
        { href: getLocalizedPath('/#book'), label: t('navigation.bookNow') },
        { href: getLocalizedPath('/#contact'), label: t('navigation.contact') },
        { href: getLocalizedPath('/terms'), label: t('navigation.terms') },
    ]

    return (
        <>
            <NavigationBar
                items={navigationItems}
                currentLanguage={i18n.language.toUpperCase()}
                onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
            />

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                items={navigationItems}
                currentLanguage={i18n.language.toUpperCase()}
            />

            {/* Header */}
            <Section background="white" padding="lg" className="pt-32">
                <div className="max-w-4xl mx-auto text-center">
                    <Heading
                        level="h1"
                        size="2xl"
                        className="mb-8"
                        animate="immediate"
                    >
                        {t('terms.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto">
                        {t('terms.subheading')}
                    </Text>
                </div>
            </Section>

            {/* Content */}
            <Section background="cream" padding="lg">
                <div className="max-w-4xl mx-auto">
                    <Card padding="lg" className="space-y-12">
                        {/* Operator Information */}
                        <div>
                            <Heading
                                level="h2"
                                size="md"
                                weight="medium"
                                className="mb-6"
                            >
                                {t('terms.operator.heading')}
                            </Heading>
                            <div className="space-y-4">
                                <Text>{t('terms.operator.intro')}</Text>
                                <div className="bg-cream/50 p-6 rounded-lg">
                                    <Text weight="medium" color="charcoal">
                                        {t('terms.operator.name')}
                                    </Text>
                                    <Text>{t('terms.operator.address')}</Text>
                                    <Text>{t('terms.operator.city')}</Text>
                                    <Text>{t('terms.operator.vat')}</Text>
                                </div>
                            </div>
                        </div>

                        {/* Booking Terms */}
                        <div>
                            <Heading
                                level="h2"
                                size="md"
                                weight="medium"
                                className="mb-6"
                            >
                                {t('terms.booking.heading')}
                            </Heading>
                            <div className="space-y-4">
                                <Text>{t('terms.booking.intro')}</Text>

                                <Heading
                                    level="h3"
                                    size="xs"
                                    weight="medium"
                                    className="mt-6 mb-3"
                                >
                                    {t(
                                        'terms.booking.reservationProcess.heading'
                                    )}
                                </Heading>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <Text as="li">
                                        {t(
                                            'terms.booking.reservationProcess.item1'
                                        )}
                                    </Text>
                                    <Text as="li">
                                        {t(
                                            'terms.booking.reservationProcess.item2'
                                        )}
                                    </Text>
                                    <Text as="li">
                                        {t(
                                            'terms.booking.reservationProcess.item3'
                                        )}
                                    </Text>
                                </ul>

                                <Heading
                                    level="h3"
                                    size="xs"
                                    weight="medium"
                                    className="mt-6 mb-3"
                                >
                                    {t('terms.booking.guestCapacity.heading')}
                                </Heading>
                                <Text>
                                    {t('terms.booking.guestCapacity.text')}
                                </Text>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div>
                            <Heading
                                level="h2"
                                size="md"
                                weight="medium"
                                className="mb-6"
                            >
                                {t('terms.cancellation.heading')}
                            </Heading>
                            <div className="space-y-4">
                                <div className="bg-sage/10 p-6 rounded-lg border-l-4 border-sage">
                                    <Heading
                                        level="h3"
                                        size="xs"
                                        weight="medium"
                                        className="mb-3"
                                    >
                                        {t(
                                            'terms.cancellation.refundPolicy.heading'
                                        )}
                                    </Heading>
                                    <ul className="space-y-2">
                                        <Text as="li">
                                            <strong>
                                                {t(
                                                    'terms.cancellation.refundPolicy.moreThan14Days.label'
                                                )}
                                            </strong>{' '}
                                            {t(
                                                'terms.cancellation.refundPolicy.moreThan14Days.text'
                                            )}
                                        </Text>
                                        <Text as="li">
                                            <strong>
                                                {t(
                                                    'terms.cancellation.refundPolicy.lessThan14Days.label'
                                                )}
                                            </strong>{' '}
                                            {t(
                                                'terms.cancellation.refundPolicy.lessThan14Days.text'
                                            )}
                                        </Text>
                                    </ul>
                                </div>

                                <Text>{t('terms.cancellation.notice')}</Text>
                            </div>
                        </div>

                        {/* Check-in and Check-out */}
                        <div>
                            <Heading
                                level="h2"
                                size="md"
                                weight="medium"
                                className="mb-6"
                            >
                                {t('terms.checkInOut.heading')}
                            </Heading>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-cream/50 p-6 rounded-lg">
                                    <Heading
                                        level="h3"
                                        size="xs"
                                        weight="medium"
                                        className="mb-3"
                                    >
                                        {t('terms.checkInOut.checkIn.heading')}
                                    </Heading>
                                    <Text>
                                        {t('terms.checkInOut.checkIn.time')}
                                    </Text>
                                    <Text size="sm" className="mt-2">
                                        {t('terms.checkInOut.checkIn.note')}
                                    </Text>
                                </div>
                                <div className="bg-cream/50 p-6 rounded-lg">
                                    <Heading
                                        level="h3"
                                        size="xs"
                                        weight="medium"
                                        className="mb-3"
                                    >
                                        {t('terms.checkInOut.checkOut.heading')}
                                    </Heading>
                                    <Text>
                                        {t('terms.checkInOut.checkOut.time')}
                                    </Text>
                                    <Text size="sm" className="mt-2">
                                        {t('terms.checkInOut.checkOut.note')}
                                    </Text>
                                </div>
                            </div>
                        </div>

                        {/* House Rules */}
                        <div>
                            <Heading
                                level="h2"
                                size="md"
                                weight="medium"
                                className="mb-6"
                            >
                                {t('terms.houseRules.heading')}
                            </Heading>
                            <div className="space-y-4">
                                <Heading
                                    level="h3"
                                    size="xs"
                                    weight="medium"
                                    className="mb-3"
                                >
                                    {t('terms.houseRules.permitted.heading')}
                                </Heading>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <Text as="li">
                                        {t('terms.houseRules.permitted.item1')}
                                    </Text>
                                    <Text as="li">
                                        {t('terms.houseRules.permitted.item2')}
                                    </Text>
                                    <Text as="li">
                                        {t('terms.houseRules.permitted.item3')}
                                    </Text>
                                    <Text as="li">
                                        {t('terms.houseRules.permitted.item4')}
                                    </Text>
                                </ul>

                                <Heading
                                    level="h3"
                                    size="xs"
                                    weight="medium"
                                    className="mt-6 mb-3"
                                >
                                    {t('terms.houseRules.notPermitted.heading')}
                                </Heading>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <Text as="li">
                                        {t(
                                            'terms.houseRules.notPermitted.item1'
                                        )}
                                    </Text>
                                    <Text as="li">
                                        {t(
                                            'terms.houseRules.notPermitted.item2'
                                        )}
                                    </Text>
                                    <Text as="li">
                                        {t(
                                            'terms.houseRules.notPermitted.item3'
                                        )}
                                    </Text>
                                    <Text as="li">
                                        {t(
                                            'terms.houseRules.notPermitted.item4'
                                        )}
                                    </Text>
                                </ul>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <Heading
                                level="h2"
                                size="md"
                                weight="medium"
                                className="mb-6"
                            >
                                {t('terms.contact.heading')}
                            </Heading>
                            <div className="bg-cream/50 p-6 rounded-lg">
                                <Text weight="bold">The View</Text>
                                <Text>{t('terms.contact.operated')}</Text>
                                <Text>
                                    {t('terms.contact.email')}{' '}
                                    <a
                                        href="mailto:hello@theviewlodge.be"
                                        className="text-sage hover:text-charcoal transition-colors"
                                    >
                                        {t('contact.email')}
                                    </a>
                                </Text>
                                <Text>
                                    {t('terms.contact.website')}{' '}
                                    <a
                                        href="https://theviewlodge.be"
                                        className="text-sage hover:text-charcoal transition-colors"
                                    >
                                        {t('contact.website')}
                                    </a>
                                </Text>
                            </div>
                        </div>

                        {/* Effective Date */}
                        <div className="border-t border-gray-200 pt-8">
                            <Text size="sm">
                                <strong>
                                    {t('terms.effectiveDate.lastUpdated')}
                                </strong>{' '}
                                {t('terms.effectiveDate.date')}
                                <br />
                                {t('terms.effectiveDate.notice')}
                            </Text>
                        </div>
                    </Card>
                </div>
            </Section>

            <Footer
                quickLinks={[
                    {
                        href: getLocalizedPath('/'),
                        label: t('navigation.home'),
                    },
                    {
                        href: getLocalizedPath('/#book'),
                        label: t('navigation.bookNow'),
                    },
                    {
                        href: getLocalizedPath('/#contact'),
                        label: t('navigation.contact'),
                    },
                    {
                        href: getLocalizedPath('/terms'),
                        label: t('navigation.termsAndConditions'),
                    },
                ]}
            />
        </>
    )
}
