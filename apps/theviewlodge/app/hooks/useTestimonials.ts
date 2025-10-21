import { useTranslation } from 'react-i18next'

export function useTestimonials() {
    const { t } = useTranslation()

    return [
        {
            author: t('testimonials.reviews.florian.author'),
            quote: t('testimonials.reviews.florian.quote'),
        },
        {
            author: t('testimonials.reviews.eline.author'),
            quote: t('testimonials.reviews.eline.quote'),
        },
        {
            author: t('testimonials.reviews.ina.author'),
            quote: t('testimonials.reviews.ina.quote'),
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
        {
            author: t('testimonials.reviews.heidi.author'),
            quote: t('testimonials.reviews.heidi.quote'),
        },
        {
            author: t('testimonials.reviews.julie.author'),
            quote: t('testimonials.reviews.julie.quote'),
        },
    ]
}
