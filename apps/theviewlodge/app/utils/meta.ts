/**
 * Helper to generate consistent social media meta tags across routes
 */
export function generateSocialMetaTags(data: {
    title?: string
    description?: string
    ogTitle?: string
    image?: string
}) {
    const imageUrl = data.image || '/images/theviewlodge-social-cover.jpg'

    return [
        {
            title: data?.title,
        },
        {
            content: data?.description,
            name: 'description',
        },
        // Open Graph tags for social media
        {
            content: data?.ogTitle || data?.title,
            property: 'og:title',
        },
        {
            content: data?.description,
            property: 'og:description',
        },
        {
            content: imageUrl,
            property: 'og:image',
        },
        {
            content: '1200',
            property: 'og:image:width',
        },
        {
            content: '630',
            property: 'og:image:height',
        },
        {
            content: 'image/jpeg',
            property: 'og:image:type',
        },
        {
            content: 'website',
            property: 'og:type',
        },
        // Twitter Card tags
        {
            content: 'summary_large_image',
            name: 'twitter:card',
        },
        {
            content: data?.ogTitle || data?.title,
            name: 'twitter:title',
        },
        {
            content: data?.description,
            name: 'twitter:description',
        },
        {
            content: imageUrl,
            name: 'twitter:image',
        },
    ]
}
