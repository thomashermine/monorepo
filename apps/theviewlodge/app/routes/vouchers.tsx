import type { Route } from './+types/vouchers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationBar } from '~/components/components/NavigationBar'
import { MobileMenu } from '~/components/components/MobileMenu'
import { HeroSection } from '~/components/components/HeroSection'
import { Section } from '~/components/blocks/Section'
import { Heading } from '~/components/primitives/Heading'
import { Text } from '~/components/primitives/Text'
import { Button } from '~/components/primitives/Button'
import { Card } from '~/components/blocks/Card'
import { TestimonialCard } from '~/components/blocks/TestimonialCard'
import { Footer } from '~/components/components/Footer'
import { Icon } from '~/components/primitives/Icon'
import i18nextServer from '~/i18next.server'

export async function loader({ request }: Route.LoaderArgs) {
    const t = await i18nextServer.getFixedT(request)
    return {
        meta: {
            title: t('meta.vouchers.title'),
            description: t('meta.vouchers.description'),
        },
    }
}

export function meta({ data }: Route.MetaArgs) {
    return [
        {
            title: data?.meta.title,
        },
        {
            name: 'description',
            content: data?.meta.description,
        },
    ]
}

export default function Vouchers() {
    const { t, i18n } = useTranslation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigationItems = [
        { label: t('navigation.home'), href: '/' },
        { label: t('navigation.bookNow'), href: '/#book' },
        { label: t('navigation.giftVouchers'), href: '/vouchers' },
        { label: t('navigation.contact'), href: '/#contact' },
    ]

    const languages = [
        {
            code: 'EN',
            label: t('languages.english'),
            href: '/vouchers',
            current: i18n.language === 'en',
        },
        {
            code: 'FR',
            label: t('languages.french'),
            href: '/fr/vouchers',
            current: i18n.language === 'fr',
        },
        {
            code: 'NL',
            label: t('languages.dutch'),
            href: '/nl/vouchers',
            current: i18n.language === 'nl',
        },
        {
            code: 'DE',
            label: t('languages.german'),
            href: '/de/vouchers',
            current: i18n.language === 'de',
        },
        {
            code: 'ES',
            label: t('languages.spanish'),
            href: '/es/vouchers',
            current: i18n.language === 'es',
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
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-199eur-90',
            featured: false,
        },
        {
            amount: '299€',
            description: t('vouchers.selection.amounts.299.description'),
            details: t('vouchers.selection.amounts.299.details'),
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-299eur-91',
            featured: true,
        },
        {
            amount: '499€',
            description: t('vouchers.selection.amounts.499.description'),
            details: t('vouchers.selection.amounts.499.details'),
            url: 'https://craftedsignals-saas.odoo.com/shop/the-view-gift-voucher-499-92',
            large: true,
        },
    ]

    const features = [
        {
            icon: 'star',
            title: t('vouchers.howItWorks.features.instantDelivery.title'),
            description: t(
                'vouchers.howItWorks.features.instantDelivery.description'
            ),
        },
        {
            icon: 'wifi',
            title: t('vouchers.howItWorks.features.transferable.title'),
            description: t(
                'vouchers.howItWorks.features.transferable.description'
            ),
        },
        {
            icon: 'moon',
            title: t('vouchers.howItWorks.features.flexibleValue.title'),
            description: t(
                'vouchers.howItWorks.features.flexibleValue.description'
            ),
        },
        {
            icon: 'parking',
            title: t('vouchers.howItWorks.features.remainderKept.title'),
            description: t(
                'vouchers.howItWorks.features.remainderKept.description'
            ),
        },
        {
            icon: 'smart-home',
            title: t('vouchers.howItWorks.features.valid12Months.title'),
            description: t(
                'vouchers.howItWorks.features.valid12Months.description'
            ),
        },
        {
            icon: 'bottle',
            title: t('vouchers.howItWorks.features.nonRefundable.title'),
            description: t(
                'vouchers.howItWorks.features.nonRefundable.description'
            ),
        },
    ]

    const testimonials = [
        {
            quote: t('testimonials.reviews.thimo.quote'),
            author: t('testimonials.reviews.thimo.author'),
        },
        {
            quote: t('testimonials.reviews.heidi.quote'),
            author: t('testimonials.reviews.heidi.author'),
        },
        {
            quote: t('testimonials.reviews.julie.quote'),
            author: t('testimonials.reviews.julie.author'),
        },
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
                    <Text size="xl" className="mb-8">
                        {t('vouchers.intro.text')}
                    </Text>
                </div>
            </Section>

            {/* Vouchers */}
            <Section id="vouchers" background="cream" padding="lg">
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
            <Section background="cream" padding="sm">
                <div className="max-w-3xl mx-auto text-center">
                    <Heading level="h2" size="md" className="mb-6">
                        {t('vouchers.custom.heading')}
                    </Heading>
                    <Text size="lg" className="mb-6">
                        {t('vouchers.custom.text')}
                    </Text>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                                <Icon name="email" className="text-sage" />
                            </div>
                            <Heading
                                level="h3"
                                size="xs"
                                weight="medium"
                                className="mb-1"
                            >
                                {t('vouchers.custom.emailUs')}
                            </Heading>
                            <Text size="sm">{t('contact.email')}</Text>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                                <Icon name="phone" className="text-sage" />
                            </div>
                            <Heading
                                level="h3"
                                size="xs"
                                weight="medium"
                                className="mb-1"
                            >
                                {t('vouchers.custom.phoneText')}
                            </Heading>
                            <Text size="sm">{t('contact.phone')}</Text>
                        </div>
                    </div>
                    <Button
                        as="a"
                        href="mailto:hello@theviewlodge.be?subject=Custom Gift Voucher Request"
                        variant="charcoal"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
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
                                    name={feature.icon as any}
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
                    { label: t('navigation.home'), href: '/' },
                    { label: t('navigation.terms'), href: '/terms' },
                ]}
                languages={languages}
            />
        </>
    )
}
