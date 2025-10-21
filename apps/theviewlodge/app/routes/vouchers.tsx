import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '~/components/blocks/Card'
import { Section } from '~/components/blocks/Section'
import { TestimonialCard } from '~/components/blocks/TestimonialCard'
import { Footer } from '~/components/components/Footer'
import { HeroSection } from '~/components/components/HeroSection'
import { MobileMenu } from '~/components/components/MobileMenu'
import { NavigationBar } from '~/components/components/NavigationBar'
import { Button } from '~/components/primitives/Button'
import { Heading } from '~/components/primitives/Heading'
import { Icon, type IconName } from '~/components/primitives/Icon'
import { Text } from '~/components/primitives/Text'
import { useHashNavigation } from '~/hooks/helpers'
import { useTestimonials } from '~/hooks/useTestimonials'

import type { Route } from './+types/vouchers'

export async function loader({ request, params }: Route.LoaderArgs) {
    // Get language from URL path (e.g., /fr/vouchers or /vouchers)
    const url = new URL(request.url)
    const pathname = url.pathname
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]
    const supportedLngs = ['en', 'fr', 'es', 'nl', 'de']
    const locale =
        params.lang ||
        (firstSegment && supportedLngs.includes(firstSegment)
            ? firstSegment
            : 'en')

    // Import server module only in loader
    const i18nextServer = await import('~/i18next.server').then(
        (m) => m.default
    )
    const t = await i18nextServer.getFixedT(request, 'common', { lng: locale })
    return {
        locale,
        meta: {
            description: t('meta.vouchers.description'),
            title: t('meta.vouchers.title'),
        },
    }
}

export function meta({ data }: Route.MetaArgs) {
    return [
        {
            title: data?.meta.title,
        },
        {
            content: data?.meta.description,
            name: 'description',
        },
    ]
}

export default function Vouchers({ loaderData }: Route.ComponentProps) {
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
        { href: getLocalizedPath('/#contact'), label: t('navigation.contact') },
    ]

    const languages = [
        {
            code: 'EN',
            current: currentLocale === 'en',
            href: '/vouchers',
            label: t('languages.english'),
        },
        {
            code: 'FR',
            current: currentLocale === 'fr',
            href: '/fr/vouchers',
            label: t('languages.french'),
        },
        {
            code: 'NL',
            current: currentLocale === 'nl',
            href: '/nl/vouchers',
            label: t('languages.dutch'),
        },
        {
            code: 'DE',
            current: currentLocale === 'de',
            href: '/de/vouchers',
            label: t('languages.german'),
        },
        {
            code: 'ES',
            current: currentLocale === 'es',
            href: '/es/vouchers',
            label: t('languages.spanish'),
        },
    ]

    const vouchers = [
        {
            amount: '49€',
            description: t('vouchers.selection.amounts.49.description'),
            details: t('vouchers.selection.amounts.49.details'),
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-49eur-87',
        },
        {
            amount: '99€',
            description: t('vouchers.selection.amounts.99.description'),
            details: t('vouchers.selection.amounts.99.details'),
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-99eur-89',
        },
        {
            amount: '199€',
            description: t('vouchers.selection.amounts.199.description'),
            details: t('vouchers.selection.amounts.199.details'),
            featured: false,
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-199eur-90',
        },
        {
            amount: '299€',
            description: t('vouchers.selection.amounts.299.description'),
            details: t('vouchers.selection.amounts.299.details'),
            featured: true,
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-299eur-91',
        },
        {
            amount: '499€',
            description: t('vouchers.selection.amounts.499.description'),
            details: t('vouchers.selection.amounts.499.details'),
            large: true,
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-499-92',
        },
    ]

    const features = [
        {
            description: t(
                'vouchers.howItWorks.features.instantDelivery.description'
            ),
            icon: 'star',
            title: t('vouchers.howItWorks.features.instantDelivery.title'),
        },
        {
            description: t(
                'vouchers.howItWorks.features.transferable.description'
            ),
            icon: 'wifi',
            title: t('vouchers.howItWorks.features.transferable.title'),
        },
        {
            description: t(
                'vouchers.howItWorks.features.flexibleValue.description'
            ),
            icon: 'moon',
            title: t('vouchers.howItWorks.features.flexibleValue.title'),
        },
        {
            description: t(
                'vouchers.howItWorks.features.remainderKept.description'
            ),
            icon: 'parking',
            title: t('vouchers.howItWorks.features.remainderKept.title'),
        },
        {
            description: t(
                'vouchers.howItWorks.features.valid12Months.description'
            ),
            icon: 'smart-home',
            title: t('vouchers.howItWorks.features.valid12Months.title'),
        },
        {
            description: t(
                'vouchers.howItWorks.features.nonRefundable.description'
            ),
            icon: 'bottle',
            title: t('vouchers.howItWorks.features.nonRefundable.title'),
        },
    ]

    const testimonials = useTestimonials().slice(0, 3)

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
                        {t('vouchers.hero.title.main')}
                        <br />
                        <span className="font-normal">
                            {t('vouchers.hero.title.sub')}
                        </span>
                    </>
                }
                subtitle={t('vouchers.hero.subtitle')}
                ctaText={t('vouchers.hero.cta')}
                ctaHref="#vouchers"
                backgroundImage="/images/theviewlodge-main.jpg"
            />

            {/* Introduction */}
            <Section background="white" padding="lg">
                <div className="max-w-4xl mx-auto text-center">
                    <Heading level="h2" size="xl" className="mb-8">
                        {t('vouchers.intro.heading')}
                    </Heading>
                    <Text size="xl" className="mb-8 whitespace-pre-line">
                        {t('vouchers.intro.text')}
                    </Text>
                </div>
            </Section>

            {/* Why Choose The View */}
            <Section background="cream" padding="lg">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    <div>
                        <div className="aspect-[4/3] bg-gradient-to-br from-sage/30 to-stone/40 rounded-2xl overflow-hidden">
                            <img
                                src="/images/theviewlodge-sauna-mountain-view.jpg"
                                alt={t('gallery.images.saunaView')}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <Heading level="h2" size="xl" className="mb-8">
                            {t('vouchers.whyChoose.heading')}
                        </Heading>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage flex items-center justify-center mt-1">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <Text size="lg" className="text-charcoal">
                                    {t('vouchers.whyChoose.features.sauna')}
                                </Text>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage flex items-center justify-center mt-1">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <Text size="lg" className="text-charcoal">
                                    {t('vouchers.whyChoose.features.location')}
                                </Text>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage flex items-center justify-center mt-1">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <Text size="lg" className="text-charcoal">
                                    {t('vouchers.whyChoose.features.smartHome')}
                                </Text>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage flex items-center justify-center mt-1">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <Text size="lg" className="text-charcoal">
                                    {t('vouchers.whyChoose.features.views')}
                                </Text>
                            </div>
                        </div>
                        <Text
                            size="xl"
                            className="italic mb-6 text-charcoal font-serif"
                        >
                            {t('vouchers.whyChoose.tagline')}
                        </Text>
                        <Text size="lg" className="text-sage font-medium">
                            {t('vouchers.whyChoose.cta')}
                        </Text>
                    </div>
                </div>
            </Section>

            {/* Vouchers */}
            <Section id="vouchers" background="white" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('vouchers.selection.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto">
                        {t('vouchers.selection.subheading')}
                    </Text>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {vouchers.map((voucher, index) => {
                        const colSpan = voucher.large
                            ? 'md:col-span-2 lg:col-span-2'
                            : ''
                        return (
                            <Card
                                key={index}
                                hover={true}
                                className={`overflow-hidden relative ${colSpan}`}
                                background="white"
                                shadow="lg"
                            >
                                {voucher.featured && (
                                    <div className="absolute top-4 right-4 bg-charcoal text-white px-4 py-2 rounded-full text-sm font-medium">
                                        {t('vouchers.selection.mostPopular')}
                                    </div>
                                )}
                                <div
                                    className={`bg-gradient-to-br from-sage/20 to-stone/30 p-8 text-center`}
                                >
                                    <div className="text-6xl font-light font-baskerville text-charcoal mb-2">
                                        {voucher.amount}
                                    </div>
                                    <Text className="text-charcoal font-medium text-sm">
                                        {voucher.description}
                                    </Text>
                                </div>
                                <div className="p-8">
                                    <Text className="mb-6">
                                        {voucher.details}
                                    </Text>
                                    <Button
                                        as="a"
                                        href={voucher.url}
                                        target="_blank"
                                        variant={
                                            voucher.featured || voucher.large
                                                ? 'charcoal'
                                                : 'sage'
                                        }
                                        fullWidth={true}
                                    >
                                        {t(
                                            'vouchers.selection.purchaseButton',
                                            { amount: voucher.amount }
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </Section>

            {/* Custom Voucher */}
            <Section background="cream" padding="lg">
                <div className="max-w-4xl mx-auto text-center">
                    <Heading level="h2" size="xl" className="mb-6">
                        {t('vouchers.custom.heading')}
                    </Heading>
                    <Text size="lg" className="mb-8 max-w-2xl mx-auto">
                        {t('vouchers.custom.text')}
                    </Text>

                    <Card
                        background="white"
                        padding="lg"
                        shadow="lg"
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Icon
                                        name="email"
                                        className="text-sage"
                                        size="lg"
                                    />
                                </div>
                                <Heading
                                    level="h3"
                                    size="sm"
                                    weight="medium"
                                    className="mb-2"
                                >
                                    {t('vouchers.custom.emailUs')}
                                </Heading>
                                <Text size="base" className="text-charcoal">
                                    {t('contact.email')}
                                </Text>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Icon
                                        name="phone"
                                        className="text-sage"
                                        size="lg"
                                    />
                                </div>
                                <Heading
                                    level="h3"
                                    size="sm"
                                    weight="medium"
                                    className="mb-2"
                                >
                                    {t('vouchers.custom.phoneText')}
                                </Heading>
                                <Text size="base" className="text-charcoal">
                                    {t('contact.phone')}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    <Button
                        as="a"
                        href="mailto:hello@theviewlodge.be?subject=Custom Gift Voucher Request"
                        variant="charcoal"
                        size="lg"
                    >
                        {t('vouchers.custom.cta')}
                    </Button>
                </div>
            </Section>

            {/* Guest Reviews */}
            <Section background="white" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('vouchers.testimonials.heading')}
                    </Heading>
                    <Button as="a" href="/" variant="sage">
                        {t('vouchers.testimonials.cta')}
                    </Button>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 max-w-7xl mx-auto space-y-6">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="break-inside-avoid mb-6">
                            <TestimonialCard {...testimonial} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* How It Works */}
            <Section background="cream" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('vouchers.howItWorks.heading')}
                    </Heading>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            background="white"
                            padding="lg"
                            hover={true}
                        >
                            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <Icon
                                    name={feature.icon as IconName}
                                    size="lg"
                                    className="text-sage"
                                />
                            </div>
                            <Heading
                                level="h3"
                                size="xs"
                                weight="medium"
                                className="mb-4 text-center"
                            >
                                {feature.title}
                            </Heading>
                            <Text className="text-center">
                                {feature.description}
                            </Text>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <Section background="sage" padding="lg">
                <div className="text-center">
                    <Heading level="h2" size="xl" className="mb-6 text-white">
                        {t('vouchers.cta.heading')}
                    </Heading>
                    <Text
                        size="xl"
                        className="max-w-2xl mx-auto mb-8 text-white"
                    >
                        {t('vouchers.cta.text')}
                    </Text>
                    <Button as="a" href="#vouchers" variant="primary">
                        {t('vouchers.cta.button')}
                    </Button>
                </div>
            </Section>

            <Footer
                quickLinks={[
                    {
                        href: getLocalizedPath('/'),
                        label: t('navigation.home'),
                    },
                    {
                        href: getLocalizedPath('/terms'),
                        label: t('navigation.terms'),
                    },
                ]}
                languages={languages}
            />
        </>
    )
}
