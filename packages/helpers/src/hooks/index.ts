import { useEffect } from 'react'

/**
 * Hook to handle hash navigation for anchor links
 * Scrolls to the element with the matching ID when the hash changes
 */
export function useHashNavigation() {
    useEffect(() => {
        // Handle initial hash on mount
        const scrollToHash = (hash: string) => {
            if (!hash) return

            // Remove the # from the hash
            const id = hash.replace('#', '')
            const element = document.getElementById(id)

            if (element) {
                // Small delay to ensure the page is fully rendered
                setTimeout(() => {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    })
                }, 100)
            }
        }

        // Scroll to hash if present in URL
        if (window.location.hash) {
            scrollToHash(window.location.hash)
        }

        // Handle hash link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const anchor = target.closest('a[href^="#"]')

            if (anchor) {
                const href = anchor.getAttribute('href')
                if (href && href.startsWith('#')) {
                    e.preventDefault()
                    const id = href.substring(1)
                    const element = document.getElementById(id)

                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        })

                        // Update URL without triggering navigation
                        window.history.pushState(null, '', href)
                    }
                }
            }
        }

        // Add click listener
        document.addEventListener('click', handleClick)

        // Cleanup
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])
}
