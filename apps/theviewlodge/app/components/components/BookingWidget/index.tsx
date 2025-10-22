import React from 'react'
import { useTranslation } from 'react-i18next'

import { Section } from '../../blocks/Section'
import { Heading } from '../../primitives/Heading'
import { Text } from '../../primitives/Text'

export interface BookingWidgetProps {
    title?: string
    description?: string
    widgetUrl?: string
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
    title,
    description,
    widgetUrl = 'https://w.hostexbooking.site/widget/110484?site_type=1&host_id=102607&listing_id=110484&enabled=1&wmode=opaque',
}) => {
    const { t } = useTranslation()

    return (
        <Section id="book" background="cream" padding="lg">
            <div className="text-center mb-12">
                <Heading level="h2" size="xl" className="mb-4">
                    {title || t('bookingWidget.title')}
                </Heading>
                <Text size="xl" className="max-w-2xl mx-auto">
                    {description || t('bookingWidget.description')}
                </Text>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <iframe
                        src={widgetUrl}
                        width="100%"
                        height="600"
                        style={{ border: 0 }}
                        className="w-full"
                        title={t('bookingWidget.iframeTitle')}
                    />
                </div>
            </div>
        </Section>
    )
}
