import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Section } from '@/components/blocks/Section'
import { BookingWidget } from '@/components/components/BookingWidget'
import { Footer } from '@/components/components/Footer'
import { HeroSection } from '@/components/components/HeroSection'
import { MobileMenu } from '@/components/components/MobileMenu'
import { NavigationBar } from '@/components/components/NavigationBar'
import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Text } from '@/components/primitives/Text'
import { useHashNavigation } from '@/hooks/helpers'
import { generateSocialMetaTags } from '@/utils/meta'

import type { Route } from './+types/prices'

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
            description: t('meta.prices.description'),
            title: t('meta.prices.title'),
        },
    }
}

export function meta({ data }: Route.MetaArgs) {
    return generateSocialMetaTags({
        title: data?.meta.title,
        description: data?.meta.description,
    })
}

export default function Prices({ loaderData }: Route.ComponentProps) {
    const { t, i18n } = useTranslation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Handle hash navigation for anchor links
    useHashNavigation()

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
        {
            href: getLocalizedPath('/vouchers'),
            label: t('navigation.giftVouchers'),
        },
        {
            href: getLocalizedPath('/prices'),
            label: t('navigation.prices'),
        },
        { href: getLocalizedPath('/#contact'), label: t('navigation.contact') },
    ]

    const languages = [
        {
            code: 'EN',
            current: currentLocale === 'en',
            href: '/prices',
            label: t('languages.english'),
        },
        {
            code: 'FR',
            current: currentLocale === 'fr',
            href: '/fr/prices',
            label: t('languages.french'),
        },
        {
            code: 'NL',
            current: currentLocale === 'nl',
            href: '/nl/prices',
            label: t('languages.dutch'),
        },
        {
            code: 'DE',
            current: currentLocale === 'de',
            href: '/de/prices',
            label: t('languages.german'),
        },
        {
            code: 'ES',
            current: currentLocale === 'es',
            href: '/es/prices',
            label: t('languages.spanish'),
        },
    ]

    const footerLinks = [
        { href: getLocalizedPath('/'), label: t('navigation.home') },
        { href: getLocalizedPath('/#book'), label: t('navigation.bookNow') },
        {
            href: getLocalizedPath('/vouchers'),
            label: t('navigation.giftVouchers'),
        },
        {
            href: getLocalizedPath('/prices'),
            label: t('navigation.prices'),
        },
        { href: getLocalizedPath('/#contact'), label: t('navigation.contact') },
        {
            external: true,
            href: 'https://www.instagram.com/theviewlodge.be',
            label: t('footer.instagram'),
        },
        { href: getLocalizedPath('/terms'), label: t('navigation.terms') },
    ]

    return (
        <>
            <NavigationBar
                items={navigationItems}
                languages={languages}
                currentLanguage={i18n.language.toUpperCase()}
                onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
            />

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                items={navigationItems}
                languages={languages}
                currentLanguage={i18n.language.toUpperCase()}
            />

            <HeroSection
                title={
                    <>
                        {t('prices.hero.title.main')}
                        <br />
                        <span className="font-normal">
                            {t('prices.hero.title.sub')}
                        </span>
                    </>
                }
                subtitle={t('prices.hero.subtitle')}
                ctaText={t('prices.hero.cta')}
                ctaHref="#book"
                backgroundImage="/images/theviewlodge-entrance-path-trees.jpg"
            />

            {/* Dynamic Pricing Explanation */}
            <Section background="white" padding="lg">
                <div className="max-w-4xl mx-auto text-center">
                    <Heading level="h2" size="xl" className="mb-8">
                        {t('prices.dynamicPricing.heading')}
                    </Heading>
                    <Text size="xl" className="mb-8 whitespace-pre-line">
                        {t('prices.dynamicPricing.text')}
                    </Text>
                </div>
            </Section>

            {/* Pricing Factors */}
            <Section background="cream" padding="lg">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <Heading level="h2" size="xl" className="mb-4">
                            {t('prices.factors.heading')}
                        </Heading>
                        <Text size="lg" className="max-w-2xl mx-auto">
                            {t('prices.factors.subheading')}
                        </Text>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg
                                    className="w-8 h-8 text-sage"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <Heading
                                level="h3"
                                size="sm"
                                weight="medium"
                                className="mb-4 text-center"
                            >
                                {t('prices.factors.items.season.title')}
                            </Heading>
                            <Text className="text-center">
                                {t('prices.factors.items.season.description')}
                            </Text>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg
                                    className="w-8 h-8 text-sage"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <Heading
                                level="h3"
                                size="sm"
                                weight="medium"
                                className="mb-4 text-center"
                            >
                                {t('prices.factors.items.dayOfWeek.title')}
                            </Heading>
                            <Text className="text-center">
                                {t(
                                    'prices.factors.items.dayOfWeek.description'
                                )}
                            </Text>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg
                                    className="w-8 h-8 text-sage"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <Heading
                                level="h3"
                                size="sm"
                                weight="medium"
                                className="mb-4 text-center"
                            >
                                {t('prices.factors.items.demand.title')}
                            </Heading>
                            <Text className="text-center">
                                {t('prices.factors.items.demand.description')}
                            </Text>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg
                                    className="w-8 h-8 text-sage"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                    />
                                </svg>
                            </div>
                            <Heading
                                level="h3"
                                size="sm"
                                weight="medium"
                                className="mb-4 text-center"
                            >
                                {t('prices.factors.items.advance.title')}
                            </Heading>
                            <Text className="text-center">
                                {t('prices.factors.items.advance.description')}
                            </Text>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg
                                    className="w-8 h-8 text-sage"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                    />
                                </svg>
                            </div>
                            <Heading
                                level="h3"
                                size="sm"
                                weight="medium"
                                className="mb-4 text-center"
                            >
                                {t('prices.factors.items.special.title')}
                            </Heading>
                            <Text className="text-center">
                                {t('prices.factors.items.special.description')}
                            </Text>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg
                                    className="w-8 h-8 text-sage"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <Heading
                                level="h3"
                                size="sm"
                                weight="medium"
                                className="mb-4 text-center"
                            >
                                {t('prices.factors.items.lastMinute.title')}
                            </Heading>
                            <Text className="text-center">
                                {t(
                                    'prices.factors.items.lastMinute.description'
                                )}
                            </Text>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Button as="a" href="#book" variant="sage" size="lg">
                            {t('prices.factors.cta')}
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Booking Widget */}
            <BookingWidget
                title={t('prices.booking.title')}
                description={t('prices.booking.description')}
            />

            {/* Gift Voucher CTA */}
            <Section background="sage" padding="lg">
                <div className="text-center text-white">
                    <Heading
                        level="h2"
                        size="xl"
                        className="mb-6 text-charcoal"
                    >
                        {t('prices.vouchers.heading')}
                    </Heading>
                    <Text
                        size="xl"
                        className="max-w-2xl mx-auto mb-8 text-charcoal"
                    >
                        {t('prices.vouchers.text')}
                    </Text>
                    <Button
                        as="a"
                        href={getLocalizedPath('/vouchers')}
                        variant="primary"
                        size="lg"
                    >
                        {t('prices.vouchers.cta')}
                    </Button>
                </div>
            </Section>

            <Footer quickLinks={footerLinks} languages={languages} />
        </>
    )
}
