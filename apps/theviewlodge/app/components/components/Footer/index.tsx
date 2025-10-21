import React from 'react'

import { Heading } from '../../primitives/Heading'
import { Icon } from '../../primitives/Icon'
import { Text } from '../../primitives/Text'

export interface FooterLink {
    label: string
    href: string
    external?: boolean
}

export interface FooterProps {
    description?: string
    email?: string
    phone?: string
    quickLinks?: FooterLink[]
    languages?: Array<{
        code: string
        label: string
        href: string
        current?: boolean
    }>
}

export const Footer: React.FC<FooterProps> = ({
    description = 'Premium accommodation in the heart of the Belgian Ardennes, offering stunning views and endless relaxation.',
    email = 'hello@theviewlodge.be',
    phone = '+32 495 64 99 99',
    quickLinks = [],
    languages = [],
}) => {
    return (
        <footer id="contact" className="bg-charcoal text-white py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Column 1 - About */}
                    <div>
                        <Heading
                            level="h3"
                            size="sm"
                            weight="bold"
                            className="mb-4 text-white"
                        >
                            The View
                        </Heading>
                        <Text className="text-gray-400 mb-6">
                            {description}
                        </Text>
                        <div className="space-y-2">
                            {phone && (
                                <p>
                                    <a
                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                        className="text-sage hover:text-white transition-colors font-medium flex items-center gap-2"
                                    >
                                        <Icon name="phone" size="sm" />
                                        {phone}
                                    </a>
                                </p>
                            )}
                            {email && (
                                <p>
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-sage hover:text-white transition-colors font-medium flex items-center gap-2"
                                    >
                                        <Icon name="email" size="sm" />
                                        {email}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    {quickLinks.length > 0 && (
                        <div>
                            <Heading
                                level="h4"
                                size="xs"
                                weight="medium"
                                className="mb-4 text-white"
                            >
                                Quick Links
                            </Heading>
                            <ul className="space-y-2">
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            target={
                                                link.external
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                link.external
                                                    ? 'noopener noreferrer'
                                                    : undefined
                                            }
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Column 3 - Info */}
                    <div>
                        <Heading
                            level="h4"
                            size="xs"
                            weight="medium"
                            className="mb-4 text-white"
                        >
                            The View
                        </Heading>
                        <div className="space-y-2 text-gray-400">
                            <Text className="text-gray-400">
                                Established circa 1950.
                                <br />
                                Renovated with love in 2025 by
                                <br />
                                Caroline Beauvois & Thomas Hermine
                            </Text>

                            <div className="mt-8">
                                <Text className="text-gray-400 mb-2">
                                    The View is operated by:
                                </Text>
                                <div className="bg-black text-white p-4 rounded inline-block">
                                    <p className="font-['Helvetica'] text-lg font-bold tracking-tight">
                                        Crafted Signals
                                        <sup className="text-xs ml-2">©</sup>
                                    </p>
                                    <p className="font-['Helvetica'] text-sm">
                                        Building Futures.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Selector */}
                {languages.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <div className="flex justify-center">
                            <div className="flex space-x-4">
                                {languages.map((lang) => (
                                    <a
                                        key={lang.code}
                                        href={lang.href}
                                        className={`transition-colors ${
                                            lang.current
                                                ? 'text-white font-medium'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {lang.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                    <Text className="mb-4 text-gray-400">
                        The View is operated by Crafted Signals.
                    </Text>
                    <Text className="text-gray-400">
                        &copy; 2025 Crafted Signals
                        <br />
                        Rue d&apos;Andenne 81
                        <br />
                        1060 Saint-Gilles, Belgium.
                        <br />
                        BE0798582489
                    </Text>
                </div>
            </div>
        </footer>
    )
}
