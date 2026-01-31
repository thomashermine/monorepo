import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Text } from '@/components/primitives/Text'
import { generateSocialMetaTags } from '@/utils/meta'

import type { Route } from './+types/guide'

export async function loader({ request, params }: Route.LoaderArgs) {
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
            description: t('guide.meta.description'),
            ogTitle: t('guide.meta.ogTitle'),
            title: t('guide.meta.title'),
        },
    }
}

export function meta({ data }: Route.MetaArgs) {
    return generateSocialMetaTags({
        title: data?.meta.title || 'Guest Guide - The View',
        description:
            data?.meta.description || 'Complete guest guide for The View',
    })
}

interface NavItem {
    href: string
    icon: string
    label: string
}

export default function GuestGuide() {
    const { t, i18n } = useTranslation()
    const [searchParams] = useSearchParams()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('welcome')
    const [guestName, setGuestName] = useState<string | null>(null)
    // Get guest name from URL params
    useEffect(() => {
        const name = searchParams.get('guest') || searchParams.get('name')
        if (name) {
            setGuestName(name)
        }
    }, [searchParams])

    // Build query string to preserve guest parameter
    const queryString = searchParams.toString()
    const queryParam = queryString ? `?${queryString}` : ''

    // Navigation items
    const navItems: NavItem[] = [
        { href: '#welcome', icon: 'sun', label: t('guide.nav.welcome') },
        { href: '#parking', icon: 'car', label: t('guide.nav.parking') },
        { href: '#checkin', icon: 'key', label: t('guide.nav.checkin') },
        { href: '#wellness', icon: 'heart', label: t('guide.nav.wellness') },
        { href: '#kitchen', icon: 'utensils', label: t('guide.nav.kitchen') },
        { href: '#sofabed', icon: 'bed', label: t('guide.nav.sofabed') },
        { href: '#smarthome', icon: 'wifi', label: t('guide.nav.smarthome') },
        { href: '#trashes', icon: 'trash', label: t('guide.nav.trashes') },
        {
            href: '#activities',
            icon: 'map-pin',
            label: t('guide.nav.activities'),
        },
        {
            href: '#restaurants',
            icon: 'shopping-cart',
            label: t('guide.nav.restaurants'),
        },
        { href: '#checkout', icon: 'log-out', label: t('guide.nav.checkout') },
        { href: '#emergency', icon: 'alert', label: t('guide.nav.emergency') },
    ]

    // Language options with query params preserved
    const languages = [
        {
            code: 'en',
            flag: '🇬🇧',
            href: `/guide${queryParam}`,
            label: 'English',
        },
        {
            code: 'fr',
            flag: '🇫🇷',
            href: `/fr/guide${queryParam}`,
            label: 'Français',
        },
        {
            code: 'nl',
            flag: '🇳🇱',
            href: `/nl/guide${queryParam}`,
            label: 'Nederlands',
        },
        {
            code: 'de',
            flag: '🇩🇪',
            href: `/de/guide${queryParam}`,
            label: 'Deutsch',
        },
        {
            code: 'es',
            flag: '🇪🇸',
            href: `/es/guide${queryParam}`,
            label: 'Español',
        },
    ]

    // Handle scroll-based active section highlighting
    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map((item) =>
                document.querySelector(item.href)
            )
            const scrollPosition = window.scrollY + 100

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i]
                if (section) {
                    const sectionTop = (section as HTMLElement).offsetTop
                    if (scrollPosition >= sectionTop) {
                        setActiveSection(navItems[i]?.href?.substring(1) ?? '')
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial call

        return () => window.removeEventListener('scroll', handleScroll)
    }, [navItems])

    // Determine current season for highlighting
    const getCurrentSeason = () => {
        const month = new Date().getMonth() + 1
        if (month >= 3 && month <= 5) return 'spring'
        if (month >= 6 && month <= 8) return 'summer'
        if (month >= 9 && month <= 10) return 'autumn'
        return 'winter'
    }

    const currentSeason = getCurrentSeason()

    return (
        <div className="bg-cream text-charcoal min-h-screen">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-sage text-white p-3 rounded-lg shadow-lg"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isSidebarOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Language Dropdown */}
            <LanguageDropdown
                languages={languages}
                currentLanguage={i18n.language}
            />

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 overflow-y-auto ${
                    isSidebarOpen ? 'block' : 'hidden'
                } lg:block`}
            >
                <div className="p-6">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold font-baskerville text-charcoal">
                                    The View
                                </h1>
                                <p className="text-sm text-stone">
                                    {t('guide.title')}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-stone italic">
                            {t('guide.subtitle')}
                        </p>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        {navItems.map((item: NavItem) => {
                            const isEmergency = item.href === '#emergency'
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${
                                        isEmergency
                                            ? activeSection ===
                                              item.href.substring(1)
                                                ? 'bg-red-500 text-white font-semibold border-2 border-red-600 shadow-lg'
                                                : 'bg-red-50 text-red-700 font-semibold border-2 border-red-200 hover:bg-red-100 hover:border-red-300'
                                            : activeSection ===
                                                item.href.substring(1)
                                              ? 'bg-sage/20 text-sage'
                                              : 'text-charcoal hover:bg-sage/10'
                                    }`}
                                >
                                    {isEmergency ? (
                                        <span className="text-xl">⚠️</span>
                                    ) : (
                                        <span className="text-sage">•</span>
                                    )}
                                    {item.label}
                                </a>
                            )
                        })}
                    </nav>

                    {/* Contact Info */}
                    <div className="mt-8 p-4 bg-sage/10 rounded-lg">
                        <h3 className="font-medium font-baskerville text-charcoal mb-3">
                            {t('guide.contact.title')}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span>📱</span>
                                <span className="text-charcoal">
                                    Thomas: +32 491 50 54 42
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>📱</span>
                                <span className="text-charcoal">
                                    Caroline: +32 474 06 30 40
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64">
                <div className="max-w-4xl mx-auto p-6 lg:p-8">
                    <WelcomeSection guestName={guestName} />
                    <ParkingSection />
                    <CheckInSection />
                    <WellnessSection />
                    <KitchenSection />
                    <SofaBedSection />
                    <SmartHomeSection />
                    <WasteSection />
                    <ActivitiesSection currentSeason={currentSeason} />
                    <CheckoutSection />
                    <EmergencySection />
                </div>
            </main>
        </div>
    )
}

// Language Dropdown Component
function LanguageDropdown({
    languages,
    currentLanguage,
}: {
    currentLanguage: string
    languages: Array<{
        code: string
        flag: string
        href: string
        label: string
    }>
}) {
    const [isOpen, setIsOpen] = useState(false)
    const currentLang = languages.find((l) => l.code === currentLanguage)

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white text-charcoal p-3 rounded-lg shadow-lg hover:bg-sage/10 border border-sage/20 flex items-center gap-2"
                >
                    <span className="text-lg">{currentLang?.flag}</span>
                    <span className="hidden sm:inline text-sm font-medium">
                        {currentLang?.code.toUpperCase()}
                    </span>
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-sage/20 py-2">
                        {languages.map((lang) => (
                            <a
                                key={lang.code}
                                href={lang.href}
                                className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-sage/10 ${
                                    lang.code === currentLanguage
                                        ? 'bg-sage/20 font-medium'
                                        : ''
                                }`}
                            >
                                <span>{lang.flag}</span> {lang.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Section Components
function WelcomeSection({ guestName }: { guestName: string | null }) {
    const { t } = useTranslation()

    return (
        <section id="welcome" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="text-center mb-8">
                    <Heading level="h1" size="2xl" className="mb-4">
                        {t('guide.welcome.title')}{' '}
                        <span className="text-sage">The View</span>
                        {guestName && `, ${guestName}`}
                    </Heading>
                    <Text
                        size="xl"
                        className="italic font-baskerville text-stone"
                    >
                        {t('guide.welcome.subtitle')}
                    </Text>
                </div>

                <div className="prose prose-lg max-w-none">
                    <Text size="lg" className="mb-6">
                        {guestName
                            ? `${t('guide.welcome.greeting')} ${guestName},`
                            : t('guide.welcome.greetingDefault')}
                    </Text>
                    <Text size="lg" className="mb-6">
                        {t('guide.welcome.intro')}
                    </Text>
                    <Text size="lg" className="mb-6">
                        {t('guide.welcome.message')}
                    </Text>
                    <div className="text-center mt-8">
                        <div className="inline-block p-4 bg-sage/10 rounded-lg">
                            <Text className="text-sage font-medium italic">
                                {t('guide.welcome.quote')}
                            </Text>
                            <Text className="text-stone mt-2">
                                {t('guide.welcome.authors')}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ParkingSection() {
    const { t } = useTranslation()

    return (
        <section id="parking" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🚗</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.parking.title')}
                    </Heading>
                </div>

                <div className="space-y-6">
                    <div className="bg-cream/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white">✓</span>
                            </div>
                            <div>
                                <Heading level="h3" size="md" className="mb-3">
                                    {t('guide.parking.instructionsTitle')}
                                </Heading>
                                <Text size="lg">
                                    {t('guide.parking.instructions')}
                                </Text>
                            </div>
                        </div>
                    </div>

                    <div className="aspect-square rounded-xl overflow-hidden">
                        <img
                            src="/guide/images/parking.png"
                            alt="Parking area at The View"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

function CheckInSection() {
    const { t } = useTranslation()

    return (
        <section id="checkin" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🔑</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.checkin.title')}
                    </Heading>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Entering */}
                    <div className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            {t('guide.checkin.entering.title')}
                        </Heading>
                        <ul className="space-y-3">
                            {[1, 2, 3, 4].map((step) => (
                                <li
                                    key={step}
                                    className="flex items-start gap-3"
                                >
                                    <span className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                        {step}
                                    </span>
                                    <Text>
                                        {t(
                                            `guide.checkin.entering.step${step}`
                                        )}
                                    </Text>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 aspect-square rounded-xl overflow-hidden">
                            <img
                                src="/guide/images/entering.png"
                                alt="Entering The View"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Exiting */}
                    <div className="bg-cream/30 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            {t('guide.checkin.exiting.title')}
                        </Heading>
                        <ul className="space-y-3">
                            {[1, 2, 3].map((step) => (
                                <li
                                    key={step}
                                    className="flex items-start gap-3"
                                >
                                    <span className="w-6 h-6 bg-charcoal text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                        {step}
                                    </span>
                                    <Text>
                                        {t(`guide.checkin.exiting.step${step}`)}
                                    </Text>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 aspect-square rounded-xl overflow-hidden">
                            <img
                                src="/guide/images/exiting.png"
                                alt="Exiting The View"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function WellnessSection() {
    const { t } = useTranslation()

    return (
        <section id="wellness" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💚</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.wellness.title')}
                    </Heading>
                </div>

                <div className="space-y-8">
                    {/* Sauna */}
                    <div className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🔥 {t('guide.wellness.sauna.title')}
                        </Heading>

                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-medium text-charcoal mb-2">
                                    {t('guide.wellness.sauna.gettingStarted')}
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span>⏱️</span>
                                        <Text>
                                            {t(
                                                'guide.wellness.sauna.preheating'
                                            )}
                                        </Text>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>📱</span>
                                        <Text>
                                            {t('guide.wellness.sauna.control')}
                                        </Text>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-medium text-charcoal mb-2">
                                    {t('guide.wellness.sauna.readyTitle')}
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Text>
                                            {t('guide.wellness.sauna.ready')}
                                        </Text>
                                    </li>
                                    <li>
                                        <Text>
                                            {t('guide.wellness.sauna.monitor')}
                                        </Text>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-cream/30 rounded-lg p-4">
                                <h4 className="font-medium text-charcoal mb-2">
                                    {t('guide.wellness.sauna.safetyTitle')}
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Text>
                                            {t('guide.wellness.sauna.sessions')}
                                        </Text>
                                    </li>
                                    <li>
                                        <Text>
                                            {t('guide.wellness.sauna.hydrate')}
                                        </Text>
                                    </li>
                                    <li>
                                        <Text>
                                            {t('guide.wellness.sauna.turnOff')}
                                        </Text>
                                    </li>
                                    <li>
                                        <Text>
                                            {t('guide.wellness.sauna.avoid')}
                                        </Text>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 aspect-square rounded-xl overflow-hidden">
                            <img
                                src="/guide/images/sauna.png"
                                alt="Private sauna"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Whirlpool Bath */}
                    <div className="bg-cream/30 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🛁 {t('guide.wellness.whirlpool.title')}
                        </Heading>

                        <div className="bg-white rounded-lg p-4">
                            <Text className="mb-4">
                                {t('guide.wellness.whirlpool.intro')}
                            </Text>
                            <ul className="space-y-2">
                                {[1, 2, 3].map((step) => (
                                    <li
                                        key={step}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                            {step}
                                        </span>
                                        <Text>
                                            {t(
                                                `guide.wellness.whirlpool.step${step}`
                                            )}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 aspect-square rounded-xl overflow-hidden">
                            <img
                                src="/guide/images/bathtub.png"
                                alt="Whirlpool bath"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Hot Tub */}
                    <div className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🌙 {t('guide.wellness.hottub.title')}
                        </Heading>

                        <div className="bg-white rounded-lg p-4">
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                                <Text className="text-blue-800 font-medium text-sm">
                                    💡 {t('guide.wellness.hottub.coverAccess')}
                                </Text>
                            </div>
                            <Text className="mb-4">
                                {t('guide.wellness.hottub.intro')}
                            </Text>
                            <ul className="space-y-2">
                                {[1, 2, 3, 4, 5, 6].map((step) => (
                                    <li
                                        key={step}
                                        className="flex items-start gap-3"
                                    >
                                        <span
                                            className={`w-6 h-6 ${step === 6 ? 'bg-charcoal' : 'bg-sage'} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5`}
                                        >
                                            {step === 6 ? '💕' : step}
                                        </span>
                                        <Text>
                                            {t(
                                                `guide.wellness.hottub.step${step}`
                                            )}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function KitchenSection() {
    const { t } = useTranslation()

    return (
        <section id="kitchen" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.kitchen.title')}
                    </Heading>
                </div>

                <div className="space-y-6">
                    <div className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            {t('guide.kitchen.fullyEquipped')}
                        </Heading>
                        <Text size="lg" className="mb-4">
                            {t('guide.kitchen.intro')}
                        </Text>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                'microwave',
                                'oven',
                                'induction',
                                'dishwasher',
                                'fridge',
                                'coffee',
                                'raclette',
                                'cookware',
                                'dining',
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-sage">✓</span>
                                    <Text>
                                        {t(`guide.kitchen.items.${item}`)}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">
                                    ℹ️
                                </span>
                                <div>
                                    <Text className="text-amber-800 font-medium">
                                        {t('guide.kitchen.drawerTitle')}
                                    </Text>
                                    <Text className="text-amber-700 text-sm mt-1">
                                        {t('guide.kitchen.drawerInfo')}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breakfast Options */}
                    <div className="bg-cream/30 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            {t('guide.kitchen.breakfast.title')}
                        </Heading>
                        <div className="bg-white rounded-lg p-4 mb-4">
                            <Text className="font-medium mb-2">
                                📞 {t('guide.kitchen.breakfast.order')}
                            </Text>
                            <Text>{t('guide.kitchen.breakfast.delivery')}</Text>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {['small', 'medium', 'brunch'].map((option) => (
                                <div
                                    key={option}
                                    className="bg-white rounded-lg p-4"
                                >
                                    <h4 className="font-medium text-charcoal mb-2">
                                        {t(
                                            `guide.kitchen.breakfast.${option}.title`
                                        )}
                                    </h4>
                                    <ul className="text-sm space-y-1">
                                        {option !== 'small' && (
                                            <Text size="sm" className="mb-2">
                                                {t(
                                                    `guide.kitchen.breakfast.${option}.includes`
                                                )}
                                            </Text>
                                        )}
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <li key={i}>
                                                <Text size="sm">
                                                    {t(
                                                        `guide.kitchen.breakfast.${option}.item${i + 1}`
                                                    )}
                                                </Text>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function SofaBedSection() {
    const { t } = useTranslation()

    return (
        <section id="sofabed" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🛋️</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.sofabed.title')}
                    </Heading>
                </div>

                <div className="bg-sage/10 rounded-xl p-6">
                    <div className="bg-white rounded-lg p-4">
                        <Text className="mb-4">{t('guide.sofabed.intro')}</Text>
                        <ul className="space-y-2">
                            {[1, 2, 3].map((step) => (
                                <li
                                    key={step}
                                    className="flex items-start gap-3"
                                >
                                    <span className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                        {step}
                                    </span>
                                    <Text>
                                        {t(`guide.sofabed.step${step}`)}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

function SmartHomeSection() {
    const { t } = useTranslation()

    return (
        <section id="smarthome" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📶</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.smarthome.title')}
                    </Heading>
                </div>

                <div className="space-y-6">
                    {/* WiFi */}
                    <div className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            📶 {t('guide.smarthome.wifi.title')}
                        </Heading>
                        <div className="bg-white rounded-lg p-4">
                            <Text className="mb-4">
                                {t('guide.smarthome.wifi.instructions')}
                            </Text>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-24 h-24 rounded-lg overflow-hidden">
                                    <img
                                        src="/guide/images/wifi.png"
                                        alt="WiFi QR code"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <Text className="font-medium">
                                        {t('guide.smarthome.wifi.scan')}
                                    </Text>
                                    <div className="bg-charcoal text-white p-2 rounded font-mono text-sm mt-2">
                                        theview
                                        <br />
                                        maxed-ignited-tailed-matthews
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Smart Home Controls */}
                    <div className="bg-cream/30 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🏠 {t('guide.smarthome.controls.title')}
                        </Heading>

                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-medium mb-2">
                                    🔥 {t('guide.smarthome.controls.heating')}
                                </h4>
                                <Text>
                                    {t('guide.smarthome.controls.heatingInfo')}
                                </Text>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-medium mb-2">
                                    💡 {t('guide.smarthome.controls.lights')}
                                </h4>
                                <Text className="mb-3">
                                    {t('guide.smarthome.controls.lightsInfo')}
                                </Text>
                                <ul className="space-y-1">
                                    <li>
                                        <Text>
                                            •{' '}
                                            {t(
                                                'guide.smarthome.controls.adjust'
                                            )}
                                        </Text>
                                    </li>
                                    <li>
                                        <Text>
                                            •{' '}
                                            {t(
                                                'guide.smarthome.controls.ambiance'
                                            )}
                                        </Text>
                                    </li>
                                    <li>
                                        <Text>
                                            •{' '}
                                            {t(
                                                'guide.smarthome.controls.romance'
                                            )}
                                        </Text>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-medium mb-2">
                                    🎵 {t('guide.smarthome.controls.music')}
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Text>
                                            •{' '}
                                            {t(
                                                'guide.smarthome.controls.tablet'
                                            )}
                                        </Text>
                                    </li>
                                    <li>
                                        <Text>
                                            •{' '}
                                            {t('guide.smarthome.controls.cast')}
                                        </Text>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function WasteSection() {
    const { t } = useTranslation()

    return (
        <section id="trashes" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">♻️</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.waste.title')}
                    </Heading>
                </div>

                <div className="bg-sage/10 rounded-xl p-6">
                    <Text size="lg" className="mb-4">
                        {t('guide.waste.intro')}
                    </Text>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {['glass', 'pmc', 'cardboard', 'residual'].map(
                            (type, index) => {
                                const colors = [
                                    'green-600',
                                    'blue-500',
                                    'yellow-500',
                                    'gray-500',
                                ]
                                return (
                                    <div
                                        key={type}
                                        className="bg-white rounded-lg p-4 text-center"
                                    >
                                        <div
                                            className={`w-12 h-12 bg-${colors[index]} rounded-full flex items-center justify-center mx-auto mb-3`}
                                        >
                                            <span className="text-white text-2xl">
                                                ♻️
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-charcoal mb-2">
                                            {t(`guide.waste.${type}.title`)}
                                        </h4>
                                        <Text size="sm" className="text-stone">
                                            {t(`guide.waste.${type}.items`)}
                                        </Text>
                                    </div>
                                )
                            }
                        )}
                    </div>

                    <div className="mt-6 bg-white rounded-lg p-4">
                        <Text className="font-medium mb-2">
                            📍 {t('guide.waste.location')}
                        </Text>
                        <Text>{t('guide.waste.thanks')}</Text>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ActivitiesSection({ currentSeason }: { currentSeason: string }) {
    const { t } = useTranslation()

    return (
        <section id="activities" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🗺️</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.activities.title')}
                    </Heading>
                </div>

                <div className="space-y-8">
                    {/* Walking from the Lodge */}
                    <div className="bg-cream/30 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🚶‍♀️ {t('guide.activities.walking.title')}
                        </Heading>

                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-medium text-charcoal mb-2">
                                    {t(
                                        'guide.activities.walking.panorama.title'
                                    )}
                                </h4>
                                <Text className="mb-2">
                                    {t(
                                        'guide.activities.walking.panorama.description'
                                    )}
                                </Text>
                                <Text size="sm">
                                    {t('guide.activities.walking.panorama.tip')}
                                </Text>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">
                                        {t(
                                            'guide.activities.walking.alltrails.title'
                                        )}
                                    </h4>
                                    <div className="flex gap-2">
                                        <Button
                                            as="a"
                                            href="https://apps.apple.com/app/alltrails/id405075943"
                                            target="_blank"
                                            size="sm"
                                            variant="charcoal"
                                        >
                                            📱 iOS
                                        </Button>
                                        <Button
                                            as="a"
                                            href="https://play.google.com/store/apps/details?id=com.alltrails.alltrails"
                                            target="_blank"
                                            size="sm"
                                            variant="sage"
                                        >
                                            🤖 Android
                                        </Button>
                                    </div>
                                </div>
                                <Text>
                                    {t(
                                        'guide.activities.walking.alltrails.description'
                                    )}
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Nearby Activities */}
                    <div className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            {t('guide.activities.nearby.title')}
                        </Heading>

                        <div className="space-y-4">
                            {['ninglinspo', 'vecquee', 'coo'].map((place) => (
                                <div
                                    key={place}
                                    className="bg-white rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">
                                            {t(
                                                `guide.activities.nearby.${place}.title`
                                            )}
                                        </h4>
                                        <Button
                                            as="a"
                                            href={t(
                                                `guide.activities.nearby.${place}.url`
                                            )}
                                            target="_blank"
                                            size="sm"
                                            variant="stone"
                                        >
                                            📍 Maps
                                        </Button>
                                    </div>
                                    <Text>
                                        {t(
                                            `guide.activities.nearby.${place}.description`
                                        )}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seasonal Activities */}
                    <div className="bg-cream/30 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🗓️ {t('guide.activities.seasonal.title')}
                        </Heading>

                        <div className="space-y-4">
                            {['spring', 'summer', 'autumn', 'winter'].map(
                                (season) => (
                                    <div
                                        key={season}
                                        className={`bg-white rounded-lg p-4 ${
                                            season === currentSeason
                                                ? 'ring-2 ring-sage/20'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                                                    {t(
                                                        `guide.activities.seasonal.${season}.title`
                                                    )}
                                                    {season ===
                                                        currentSeason && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                            {t(
                                                                'guide.activities.seasonal.rightNow'
                                                            )}
                                                        </span>
                                                    )}
                                                </h4>
                                                <Text className="mb-2">
                                                    {t(
                                                        `guide.activities.seasonal.${season}.description`
                                                    )}
                                                </Text>
                                                <Text size="sm">
                                                    {t(
                                                        `guide.activities.seasonal.${season}.details`
                                                    )}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Restaurants */}
                    <div id="restaurants" className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🍽️ {t('guide.restaurants.title')}
                        </Heading>

                        <div className="grid md:grid-cols-2 gap-4">
                            {['linea', 'douxragots', 'bpost', 'artegusto'].map(
                                (restaurant) => (
                                    <div
                                        key={restaurant}
                                        className="bg-white rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">
                                                {t(
                                                    `guide.restaurants.${restaurant}.name`
                                                )}
                                            </h4>
                                            <Button
                                                as="a"
                                                href={t(
                                                    `guide.restaurants.${restaurant}.url`
                                                )}
                                                target="_blank"
                                                size="sm"
                                                variant="stone"
                                            >
                                                {restaurant === 'artegusto'
                                                    ? '📘'
                                                    : '📍'}
                                            </Button>
                                        </div>
                                        <Text className="mb-1">
                                            {t(
                                                `guide.restaurants.${restaurant}.description`
                                            )}
                                        </Text>
                                        <Text size="sm" className="text-stone">
                                            {t(
                                                `guide.restaurants.${restaurant}.type`
                                            )}
                                        </Text>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function CheckoutSection() {
    const { t } = useTranslation()

    return (
        <section id="checkout" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👋</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.checkout.title')}
                    </Heading>
                </div>

                <div className="space-y-6">
                    <div className="bg-sage/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            {t('guide.checkout.leaving.title')}
                        </Heading>

                        <div className="bg-white rounded-lg p-4 mb-4">
                            <ul className="space-y-3">
                                {[1, 2, 3].map((step) => (
                                    <li
                                        key={step}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                            {step}
                                        </span>
                                        <Text>
                                            {t(
                                                `guide.checkout.leaving.step${step}`
                                            )}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-cream/30 rounded-lg p-4">
                            <h4 className="font-medium text-charcoal mb-2">
                                ✨ {t('guide.checkout.thatsIt')}
                            </h4>
                            <Text className="mb-4">
                                {t('guide.checkout.message')}
                            </Text>
                            <Text>
                                {t('guide.checkout.feedback')}{' '}
                                <a
                                    href="https://www.google.com/maps/place/The+View+Lodge/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sage hover:text-charcoal font-medium"
                                >
                                    <strong>Google Maps</strong>
                                </a>{' '}
                                {t('guide.checkout.and')}{' '}
                                <strong>Airbnb</strong>{' '}
                                {t('guide.checkout.helps')} 🙏
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function EmergencySection() {
    const { t } = useTranslation()

    return (
        <section id="emergency" className="mb-16 scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <Heading level="h2" size="lg">
                        {t('guide.emergency.title')}
                    </Heading>
                </div>

                <div className="space-y-6">
                    {/* Primary Contact */}
                    <div className="bg-red-50 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            📞 {t('guide.emergency.needHelp')}
                        </Heading>
                        <Text className="mb-4">
                            {t('guide.emergency.contact')}
                        </Text>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            {[
                                { name: 'Thomas', phone: '+32 491 50 54 42' },
                                { name: 'Caroline', phone: '+32 474 06 30 40' },
                            ].map((person) => (
                                <div
                                    key={person.name}
                                    className="bg-white rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
                                            <span className="text-white">
                                                📱
                                            </span>
                                        </div>
                                        <div>
                                            <Text className="font-medium">
                                                {person.name}
                                            </Text>
                                            <Text className="font-mono">
                                                {person.phone}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg p-4">
                            <Text className="font-medium">
                                🔔 {t('guide.emergency.urgent')}
                            </Text>
                            <Text>{t('guide.emergency.callTwice')}</Text>
                        </div>
                    </div>

                    {/* Emergency Services */}
                    <div className="bg-red-500/10 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            🚨 {t('guide.emergency.services')}
                        </Heading>
                        <div className="bg-red-500 text-white rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-3xl">📞</span>
                                <span className="text-3xl font-bold">112</span>
                            </div>
                            <Text size="xl" className="font-medium">
                                {t('guide.emergency.medical')}
                            </Text>
                            <Text size="lg" className="opacity-90">
                                {t('guide.emergency.european')}
                            </Text>
                        </div>
                    </div>

                    {/* Additional Emergency Info */}
                    <div className="bg-cream/30 rounded-xl p-6">
                        <Heading level="h3" size="md" className="mb-4">
                            📍 {t('guide.emergency.propertyInfo')}
                        </Heading>
                        <div className="bg-white rounded-lg p-4">
                            <Text>
                                <strong>{t('guide.emergency.address')}:</strong>{' '}
                                Targnon 29, 4987 Stoumont, Belgium
                            </Text>
                            <Text className="mt-2">
                                <strong>
                                    {t('guide.emergency.hospitals')}:
                                </strong>
                            </Text>
                            <ul className="ml-4 space-y-1 mt-2">
                                <li>
                                    <Text>
                                        • {t('guide.emergency.malmedy')}{' '}
                                        <Button
                                            as="a"
                                            href="https://www.google.com/maps/place/Centre+Hospitalier+de+Malmedy"
                                            target="_blank"
                                            size="sm"
                                            variant="stone"
                                            className="ml-2"
                                        >
                                            📍 Maps
                                        </Button>
                                    </Text>
                                </li>
                                <li>
                                    <Text>
                                        • {t('guide.emergency.liege')}{' '}
                                        <Button
                                            as="a"
                                            href="https://www.google.com/maps/place/CHR+Citadelle+Liege"
                                            target="_blank"
                                            size="sm"
                                            variant="stone"
                                            className="ml-2"
                                        >
                                            📍 Maps
                                        </Button>
                                    </Text>
                                </li>
                            </ul>
                            <Text className="mt-2">
                                <strong>
                                    {t('guide.emergency.pharmacy')}:
                                </strong>{' '}
                                {t('guide.emergency.pharmacyInfo')}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
