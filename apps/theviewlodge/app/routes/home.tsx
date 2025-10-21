import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useHashNavigation } from '~/hooks/helpers'
import { AmenityCard } from '~/components/blocks/AmenityCard'
import { FAQItem } from '~/components/blocks/FAQItem'
import { FeatureCard } from '~/components/blocks/FeatureCard'
import { Section } from '~/components/blocks/Section'
import { TestimonialCard } from '~/components/blocks/TestimonialCard'
import { BookingWidget } from '~/components/components/BookingWidget'
import { Footer } from '~/components/components/Footer'
import { Gallery } from '~/components/components/Gallery'
import { HeroSection } from '~/components/components/HeroSection'
import { MobileMenu } from '~/components/components/MobileMenu'
import { NavigationBar } from '~/components/components/NavigationBar'
import { Button } from '~/components/primitives/Button'
import { Heading } from '~/components/primitives/Heading'
import { Text } from '~/components/primitives/Text'

import type { Route } from './+types/_index'

export async function loader({ request, params }: Route.LoaderArgs) {
    // Get language from URL path (e.g., /fr or /)
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
            alt: t('gallery.images.aerialView'),
            aspectRatio: '3/4',
            src: '/images/theviewlodge-aerial-field-house.jpg',
        },
        {
            alt: t('gallery.images.forestCanopy'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-aerial-forest-canopy.jpg',
        },
        {
            alt: t('gallery.images.frontFacade'),
            aspectRatio: '4/3',
            src: '/images/theviewlodge-aerial-front-facade.jpg',
        },
        {
            alt: t('gallery.images.valleyView'),
            aspectRatio: '2/3',
            src: '/images/theviewlodge-aerial-valley-view.jpg',
        },
        {
            alt: t('gallery.images.bathroomJacuzzi'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-bathroom-jacuzzi-jets.jpg',
        },
        {
            alt: t('gallery.images.saunaView'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-sauna-mountain-view.jpg',
        },
        {
            alt: t('gallery.images.hotTub'),
            aspectRatio: 'square',
            src: '/images/theviewlodge-hottub.jpg',
        },
        {
            alt: t('gallery.images.kitchen'),
            aspectRatio: '3/5',
            src: '/images/theviewlodge-kitchen-coffee-counter.jpg',
        },
    ]

    const testimonials = [
        {
            author: t('testimonials.reviews.eline.author'),
            quote: t('testimonials.reviews.eline.quote'),
        },
        {
            author: t('testimonials.reviews.tim.author'),
            quote: t('testimonials.reviews.tim.quote'),
        },
        {
            author: t('testimonials.reviews.conny.author'),
            quote: t('testimonials.reviews.conny.quote'),
        },
        {
            author: t('testimonials.reviews.thimo.author'),
            quote: t('testimonials.reviews.thimo.quote'),
        },
    ]

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
            answer: t('faq.items.pets.answer'),
            question: t('faq.items.pets.question'),
        },
    ]

    const footerLinks = [
        { href: getLocalizedPath('/'), label: t('navigation.home') },
        { href: getLocalizedPath('/#book'), label: t('navigation.bookNow') },
        {
            href: getLocalizedPath('/vouchers'),
            label: t('navigation.giftVouchers'),
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
                        <Heading level="h2" size="xl" className="mb-8">
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

            {/* Amenities Gallery */}
            <Section background="cream" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('amenities.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto">
                        {t('amenities.subheading')}
                    </Text>
                </div>

                <div className="overflow-x-auto pb-6 scrollbar-hide">
                    <div className="flex gap-6 px-6 w-max">
                        <FeatureCard
                            image="/images/theviewlodge-sauna-mountain-view.jpg"
                            title={t('amenities.features.sauna.title')}
                            subtitle={t('amenities.features.sauna.subtitle')}
                            size="large"
                        />
                        <FeatureCard
                            image="/images/theviewlodge-hottub.jpg"
                            title={t('amenities.features.hotTub.title')}
                            subtitle={t('amenities.features.hotTub.subtitle')}
                            size="small"
                        />
                        <FeatureCard
                            image="/images/theviewlodge-bathroom-jacuzzi-jets.jpg"
                            title={t('amenities.features.whirlpool.title')}
                            subtitle={t(
                                'amenities.features.whirlpool.subtitle'
                            )}
                            size="small"
                        />
                    </div>
                </div>

                <div className="text-center my-12">
                    <Button as="a" href="#book" variant="stone">
                        {t('amenities.cta')}
                    </Button>
                </div>

                <div className="overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-8 px-6 w-max">
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
                            description={t(
                                'amenities.items.parking.description'
                            )}
                        />
                        <AmenityCard
                            icon="smart-home"
                            title={t('amenities.items.smartHome.title')}
                            description={t(
                                'amenities.items.smartHome.description'
                            )}
                        />
                        <AmenityCard
                            icon="moon"
                            title={t('amenities.items.peaceful.title')}
                            description={t(
                                'amenities.items.peaceful.description'
                            )}
                        />
                    </div>
                </div>
            </Section>

            {/* Gallery */}
            <Section background="white" padding="lg">
                <div className="text-center mb-16">
                    <Heading level="h2" size="xl" className="mb-4">
                        {t('gallery.heading')}
                    </Heading>
                    <Text size="xl" className="max-w-2xl mx-auto mb-8">
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

            {/* Testimonials */}
            <Section background="white" padding="lg">
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
                    <Text size="xl" className="max-w-2xl mx-auto">
                        {t('testimonials.subheading')}
                    </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </Section>

            {/* FAQ */}
            <Section background="cream" padding="lg">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <Heading level="h2" size="xl" className="mb-4">
                            {t('faq.heading')}
                        </Heading>
                        <Text size="xl" className="max-w-2xl mx-auto mb-8">
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

            <Footer quickLinks={footerLinks} languages={languages} />
        </>
    )
}
