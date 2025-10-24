import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ActivityCard } from '@/components/blocks/ActivityCard'
import { AmenityCard } from '@/components/blocks/AmenityCard'
import { FAQItem } from '@/components/blocks/FAQItem'
import { FeatureCard } from '@/components/blocks/FeatureCard'
import { Section } from '@/components/blocks/Section'
import { TestimonialCard } from '@/components/blocks/TestimonialCard'
import { BookingWidget } from '@/components/components/BookingWidget'
import { Footer } from '@/components/components/Footer'
import { Gallery } from '@/components/components/Gallery'
import { HeroSection } from '@/components/components/HeroSection'
import { Map } from '@/components/components/Map'
import { MobileMenu } from '@/components/components/MobileMenu'
import { NavigationBar } from '@/components/components/NavigationBar'
import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Text } from '@/components/primitives/Text'
import { useHashNavigation } from '@/hooks/helpers'
import { useTestimonials } from '@/hooks/useTestimonials'

import type { Route } from './+types/home'

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
            description: t('meta.home.description'),
            ogTitle: t('meta.home.ogTitle'),
            title: t('meta.home.title'),
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
        {
            content: data?.meta.ogTitle,
            property: 'og:title',
        },
        {
            content:
                'https://s3.fr-par.scw.cloud/theviewlodge.be/theview-cabin-boulder.jpg',
            property: 'og:image',
        },
    ]
}

export default function Home({ loaderData }: Route.ComponentProps) {
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
            href: '/',
            label: t('languages.english'),
        },
        {
            code: 'FR',
            current: currentLocale === 'fr',
            href: '/fr',
            label: t('languages.french'),
        },
        {
            code: 'NL',
            current: currentLocale === 'nl',
            href: '/nl',
            label: t('languages.dutch'),
        },
        {
            code: 'DE',
            current: currentLocale === 'de',
            href: '/de',
            label: t('languages.german'),
        },
        {
            code: 'ES',
            current: currentLocale === 'es',
            href: '/es',
            label: t('languages.spanish'),
        },
    ]

    const galleryImages = [
        {
            alt: t('gallery.images.dining'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-dining-window-view.jpg',
        },
        {
            alt: t('gallery.images.kitchen'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-kitchen-coffee-counter.jpg',
        },
        {
            alt: t('gallery.images.hottub'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-hottub.jpg',
        },
        {
            alt: t('gallery.images.kitchen'),
            aspectRatio: '3/4',
            src: '/images/theviewlodge-kitchen-dining-beams.jpg',
        },
        {
            alt: t('gallery.images.sauna'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-sauna-mountain-view.jpg',
        },
        {
            alt: t('gallery.images.outdoorDeck'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-deck-chair-landscape.jpg',
        },

        {
            alt: t('gallery.images.bathroom'),
            aspectRatio: '3/4',
            src: '/images/theviewlodge-bathroom-jacuzzi-jets.jpg',
        },
        {
            alt: t('gallery.images.panoramic'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-panoramic-valley-view.jpg',
        },
        {
            alt: t('gallery.images.kitchen'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-kitchen-sunset-light.jpg',
        },
        {
            alt: t('gallery.images.sauna'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-sauna-accessories.jpg',
        },
        {
            alt: t('gallery.images.exterior'),
            aspectRatio: '3/4',
            src: '/images/theviewlodge-exterior-corner-trees.jpg',
        },
        {
            alt: t('gallery.images.living'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-living-sofa-terrace.jpg',
        },
        {
            alt: t('gallery.images.bathroom'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-bathroom-sink-accessories.jpg',
        },
        {
            alt: t('gallery.images.terrace'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-terrace-seating.jpg',
        },
        {
            alt: t('gallery.images.bedroom'),
            aspectRatio: '3/4',
            src: '/images/theviewlodge-bedroom-window-natural.jpg',
        },
        {
            alt: t('gallery.images.hottub'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-hottub-sunset-view.jpg',
        },
        {
            alt: t('gallery.images.entrance'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-entrance-path-trees.jpg',
        },
        {
            alt: t('gallery.images.dining'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-dining-table-decor.jpg',
        },
        {
            alt: t('gallery.images.outdoor'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-outdoor-shower-deck.jpg',
        },
        {
            alt: t('gallery.images.bedroom'),
            aspectRatio: '3/4',
            src: '/images/theviewlodge-bedroom-mirror-skylight.jpg',
        },
        {
            alt: t('gallery.images.aerial'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-aerial-forest-canopy.jpg',
        },
    ]

    const testimonials = useTestimonials()

    const faqs = [
        {
            answer: t('faq.items.amenities.answer'),
            question: t('faq.items.amenities.question'),
        },
        {
            answer: t('faq.items.capacity.answer'),
            question: t('faq.items.capacity.question'),
        },
        {
            answer: t('faq.items.kids.answer'),
            question: t('faq.items.kids.question'),
        },
        {
            answer: t('faq.items.pets.answer'),
            question: t('faq.items.pets.question'),
        },
        {
            answer: t('faq.items.booking.answer'),
            question: t('faq.items.booking.question'),
        },
        {
            answer: t('faq.items.essentials.answer'),
            question: t('faq.items.essentials.question'),
        },
        {
            answer: t('faq.items.yearRound.answer'),
            question: t('faq.items.yearRound.question'),
        },
        {
            answer: t('faq.items.activities.answer'),
            question: t('faq.items.activities.question'),
        },
        {
            answer: t('faq.items.privacy.answer'),
            question: t('faq.items.privacy.question'),
        },
        {
            answer: t('faq.items.kitchen.answer'),
            question: t('faq.items.kitchen.question'),
        },
        {
            answer: t('faq.items.publicTransport.answer'),
            question: t('faq.items.publicTransport.question'),
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
                        {t('hero.title.main')}
                        <br />
                        <span className="font-normal">
                            {t('hero.title.sub')}
                        </span>
                    </>
                }
                subtitle={t('hero.subtitle')}
                ctaText={t('hero.cta')}
                ctaHref="#book"
                videos={[
                    '/videos/theview-terrace.mov',
                    '/videos/theview-outdoor.mp4',
                    '/videos/theview-terrace-hottub.mp4',
                ]}
            />

            {/* Intro Section */}
            <Section background="white" padding="lg">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <Heading
                            level="h2"
                            size="xl"
                            className="mb-8"
                            animate="immediate"
                        >
                            {t('intro.heading')}
                        </Heading>
                        <Button as="a" href="#book" variant="sage">
                            {t('intro.cta')}
                        </Button>
                    </div>
                    <div className="lg:order-last">
                        <div className="aspect-[3/4] bg-gradient-to-br from-sage/30 to-stone/40 rounded-2xl overflow-hidden">
                            <img
                                src="/images/theviewlodge-main.jpg"
                                alt={t('gallery.images.theView')}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Cabin Description */}
            <Section background="cream" padding="lg">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="aspect-[1/1] bg-gradient-to-br from-stone/30 to-sage/40 rounded-2xl overflow-hidden">
                            <img
                                src="/images/theviewlodge-dining-chair-garden.jpg"
                                alt={t('gallery.images.diningArea')}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <Heading level="h2" size="lg" className="mb-8">
                            {t('cabin.heading')}
                        </Heading>
                        <Button as="a" href="#book" variant="charcoal">
                            {t('cabin.cta')}
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Location Section */}
            <Section background="white" padding="lg">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <Text size="lg" className="mb-4 text-sage" animate>
                            {t('location.subtitle')}
                        </Text>
                        <Heading level="h2" size="lg" className="mb-6">
                            {t('location.heading')}
                        </Heading>
                        <Text size="lg" className="whitespace-pre-line" animate>
                            {t('location.description')}
                        </Text>
                    </div>
                    <div className="lg:order-last">
                        <div className="aspect-[4/3] bg-gradient-to-br from-sage/30 to-stone/40 rounded-2xl overflow-hidden">
                            <img
                                src="/images/theviewlodge-panoramic-valley-view.jpg"
                                alt={t('gallery.images.valleyView')}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Amenities Gallery */}
            <Section background="cream" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('amenities.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto" animate>
                        {t('amenities.subheading')}
                    </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    <FeatureCard
                        image="/images/theviewlodge-sauna-mountain-view.jpg"
                        title={t('amenities.features.sauna.title')}
                        subtitle={t('amenities.features.sauna.subtitle')}
                    />
                    <FeatureCard
                        image="/images/theviewlodge-hottub.jpg"
                        title={t('amenities.features.hotTub.title')}
                        subtitle={t('amenities.features.hotTub.subtitle')}
                    />
                    <FeatureCard
                        image="/images/theviewlodge-bathroom-jacuzzi-jets.jpg"
                        title={t('amenities.features.whirlpool.title')}
                        subtitle={t('amenities.features.whirlpool.subtitle')}
                    />
                    <FeatureCard
                        image="/images/theviewlodge-kitchen-coffee-counter.jpg"
                        title={t('amenities.features.kitchen.title')}
                        subtitle={t('amenities.features.kitchen.subtitle')}
                    />
                </div>

                <div className="text-center my-12">
                    <Button as="a" href="#book" variant="stone">
                        {t('amenities.cta')}
                    </Button>
                </div>

                <div className="flex gap-8 px-6 w-max mx-auto">
                    <AmenityCard
                        icon="wifi"
                        title={t('amenities.items.wifi.title')}
                        description={t('amenities.items.wifi.description')}
                    />
                    <AmenityCard
                        icon="star"
                        title={t('amenities.items.stargazing.title')}
                        description={t(
                            'amenities.items.stargazing.description'
                        )}
                    />
                    <AmenityCard
                        icon="parking"
                        title={t('amenities.items.parking.title')}
                        description={t('amenities.items.parking.description')}
                    />
                    <AmenityCard
                        icon="smart-home"
                        title={t('amenities.items.smartHome.title')}
                        description={t('amenities.items.smartHome.description')}
                    />
                    <AmenityCard
                        icon="moon"
                        title={t('amenities.items.peaceful.title')}
                        description={t('amenities.items.peaceful.description')}
                    />
                    <AmenityCard
                        icon="compass"
                        title={t('amenities.items.localExperiences.title')}
                        description={t(
                            'amenities.items.localExperiences.description'
                        )}
                    />
                </div>
            </Section>

            {/* Gallery */}
            <Section background="white" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('gallery.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto mb-8" animate>
                        {t('gallery.subheading')}
                    </Text>
                    <Button as="a" href="#book" variant="sage">
                        {t('gallery.cta')}
                    </Button>
                </div>
                <Gallery images={galleryImages} foldable={true} />
            </Section>

            {/* Booking Widget */}
            <BookingWidget />

            {/* Gift Voucher CTA */}
            <Section background="sage" padding="lg">
                <div className="text-center text-white">
                    <Heading
                        level="h2"
                        size="xl"
                        className="mb-6 text-charcoal"
                    >
                        {t('giftVoucherCTA.heading')}
                    </Heading>
                    <Text
                        size="xl"
                        className="max-w-2xl mx-auto mb-8 text-charcoal"
                    >
                        {t('giftVoucherCTA.description')}
                    </Text>
                    <Button
                        as="a"
                        href={getLocalizedPath('/vouchers')}
                        variant="primary"
                        size="lg"
                    >
                        {t('giftVoucherCTA.cta')}
                    </Button>
                </div>
            </Section>

            {/* Activities Around The View */}
            <Section background="cream" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('activities.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto mb-8" animate>
                        {t('activities.subheading')}
                    </Text>
                    <Button as="a" href="#book" variant="sage">
                        {t('activities.cta')}
                    </Button>
                </div>

                <div className="space-y-8 max-w-6xl mx-auto">
                    <ActivityCard
                        image="/images/activity-fagnes.jpg"
                        badge={t('activities.items.fagnes.badge')}
                        title={t('activities.items.fagnes.title')}
                        subtitle={t('activities.items.fagnes.subtitle')}
                        description={t('activities.items.fagnes.description')}
                        location={t('activities.items.fagnes.location')}
                        locationUrl={t('activities.items.fagnes.locationUrl')}
                    />

                    <ActivityCard
                        image="/images/activity-forest.jpg"
                        badge={t('activities.items.parcDesSources.badge')}
                        title={t('activities.items.parcDesSources.title')}
                        subtitle={t('activities.items.parcDesSources.subtitle')}
                        description={t(
                            'activities.items.parcDesSources.description'
                        )}
                        location={t('activities.items.parcDesSources.location')}
                        locationUrl={t(
                            'activities.items.parcDesSources.locationUrl'
                        )}
                    />

                    <ActivityCard
                        image="/images/activity-spa.jpg"
                        badge={t('activities.items.spa.badge')}
                        title={t('activities.items.spa.title')}
                        subtitle={t('activities.items.spa.subtitle')}
                        description={t('activities.items.spa.description')}
                        location={t('activities.items.spa.location')}
                        locationUrl={t('activities.items.spa.locationUrl')}
                    />

                    <ActivityCard
                        image="/images/activity-racing.jpg"
                        badge={t('activities.items.francorchamps.badge')}
                        title={t('activities.items.francorchamps.title')}
                        subtitle={t('activities.items.francorchamps.subtitle')}
                        description={t(
                            'activities.items.francorchamps.description'
                        )}
                        location={t('activities.items.francorchamps.location')}
                        locationUrl={t(
                            'activities.items.francorchamps.locationUrl'
                        )}
                    />

                    <ActivityCard
                        image="/images/activity-waterfall.jpg"
                        badge={t('activities.items.ninglinspo.badge')}
                        title={t('activities.items.ninglinspo.title')}
                        subtitle={t('activities.items.ninglinspo.subtitle')}
                        description={t(
                            'activities.items.ninglinspo.description'
                        )}
                        location={t('activities.items.ninglinspo.location')}
                        locationUrl={t(
                            'activities.items.ninglinspo.locationUrl'
                        )}
                    />
                </div>
            </Section>

            {/* Testimonials */}
            <Section background="white" padding="lg" id="testimonials">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-lg">
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {t('testimonials.badge')}
                    </div>
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('testimonials.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto" animate>
                        {t('testimonials.subheading')}
                    </Text>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 max-w-7xl mx-auto space-y-6">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="break-inside-avoid mb-6">
                            <TestimonialCard {...testimonial} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* FAQ */}
            <Section background="cream" padding="lg" id="faq">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <Heading level="h2" size="xl" className="mb-4">
                            {t('faq.heading')}
                        </Heading>
                        <Text
                            size="xl"
                            className="max-w-2xl mx-auto mb-8"
                            animate
                        >
                            {t('faq.subheading')}
                        </Text>
                        <Button as="a" href="#book" variant="sage">
                            {t('faq.cta')}
                        </Button>
                    </div>

                    <div className="space-y-8">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} {...faq} />
                        ))}
                    </div>
                </div>
            </Section>

            {/* Visit Us Section */}
            <Section background="white" padding="lg" id="contact">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <Heading level="h1" size="2xl" className="mb-8">
                            {t('visitUs.heading')}
                        </Heading>
                        <div className="mb-8">
                            <Text size="xl" className="text-stone-500">
                                {t('visitUs.address.line1')}
                            </Text>
                            <Text size="xl" className="text-stone-500">
                                {t('visitUs.address.line2')}
                            </Text>
                            <Text size="xl" className="text-stone-500">
                                {t('visitUs.address.line3')}
                            </Text>
                        </div>
                        <Button
                            as="a"
                            href="https://maps.app.goo.gl/8fcy1PAkcbocUkQs5"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="stone"
                        >
                            {t('visitUs.cta')}
                        </Button>
                    </div>
                    <div className="lg:order-last">
                        <div className="aspect-[4/3] bg-stone-100 rounded-2xl overflow-hidden">
                            <Map
                                longitude={5.7767}
                                latitude={50.4167}
                                zoom={13}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            <Footer quickLinks={footerLinks} languages={languages} />
        </>
    )
}
