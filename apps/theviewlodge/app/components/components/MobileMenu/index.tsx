import React from 'react'
import { Logo } from '../../primitives/Logo'
import { Icon } from '../../primitives/Icon'
import type { NavigationItem } from '../NavigationBar'

export interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    items: NavigationItem[]
    languages?: Array<{ code: string; label: string; href: string }>
    currentLanguage?: string
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    items,
    languages = [],
    currentLanguage = 'EN',
}) => {
    return (
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
            <div className="mobile-menu-content">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <Logo href="/" size="sm" />
                        <button onClick={onClose} className="text-charcoal">
                            <Icon name="close" />
                        </button>
                    </div>

                    <nav className="space-y-6">
                        {items.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="block text-lg text-charcoal hover:text-sage transition-colors"
                                onClick={onClose}
                            >
                                {item.label}
                            </a>
                        ))}

                        {languages.length > 0 && (
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500 mb-4">
                                    Language
                                </p>
                                <div className="space-y-3">
                                    {languages.map((lang) => (
                                        <a
                                            key={lang.code}
                                            href={lang.href}
                                            className={`block text-base transition-colors ${
                                                lang.code === currentLanguage
                                                    ? 'text-charcoal font-medium'
                                                    : 'text-gray-600 hover:text-charcoal'
                                            }`}
                                            onClick={onClose}
                                        >
                                            {lang.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            </div>

            <style>{`
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 60;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .mobile-menu.open {
          opacity: 1;
          visibility: visible;
        }
        .mobile-menu-content {
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          height: 100vh;
          background: white;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
        }
        .mobile-menu.open .mobile-menu-content {
          transform: translateX(0);
        }
      `}</style>
        </div>
    )
}
