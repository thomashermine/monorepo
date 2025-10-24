import React, { useState } from 'react'

import { Icon } from '../../primitives/Icon'
import { Logo } from '../../primitives/Logo'

export interface NavigationItem {
    label: string
    href: string
}

export interface NavigationBarProps {
    items: NavigationItem[]
    currentLanguage?: string
    languages?: Array<{ code: string; label: string; href: string }>
    onMobileMenuToggle?: () => void
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
    items,
    currentLanguage = 'EN',
    languages = [],
    onMobileMenuToggle,
}) => {
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-6">
                <div className="flex justify-between items-center">
                    <Logo href="/" />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {items.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-gray-600 hover:text-sage transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Language Selector */}
                        {languages.length > 0 && (
                            <div className="relative group">
                                <button
                                    className="text-gray-600 hover:text-sage transition-colors flex items-center gap-1"
                                    onMouseEnter={() =>
                                        setIsLangDropdownOpen(true)
                                    }
                                    onMouseLeave={() =>
                                        setIsLangDropdownOpen(false)
                                    }
                                >
                                    {currentLanguage}
                                    <Icon name="chevron-down" size="sm" />
                                </button>
                                <div
                                    className={`absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg transition-all duration-200 ${
                                        isLangDropdownOpen
                                            ? 'opacity-100 visible'
                                            : 'opacity-0 invisible'
                                    }`}
                                    onMouseEnter={() =>
                                        setIsLangDropdownOpen(true)
                                    }
                                    onMouseLeave={() =>
                                        setIsLangDropdownOpen(false)
                                    }
                                >
                                    {languages.map((lang, index) => (
                                        <a
                                            key={lang.code}
                                            href={lang.href}
                                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                                index === 0
                                                    ? 'rounded-t-lg'
                                                    : ''
                                            } ${index === languages.length - 1 ? 'rounded-b-lg' : ''} ${
                                                lang.code === currentLanguage
                                                    ? 'font-medium'
                                                    : ''
                                            }`}
                                        >
                                            {lang.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-charcoal"
                        onClick={onMobileMenuToggle}
                    >
                        <Icon name="menu" />
                    </button>
                </div>
            </div>
        </nav>
    )
}
