import React from 'react'

import { Section } from '../../blocks/Section'
import { Heading } from '../../primitives/Heading'
import { Text } from '../../primitives/Text'

export interface BookingWidgetProps {
    title?: string
    description?: string
    widgetUrl?: string
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
    title = 'Book Your Stay',
    description = 'Reserve your perfect getaway at The View',
    widgetUrl = 'https://w.hostexbooking.site/widget/110484?site_type=1&host_id=102607&listing_id=110484&enabled=1&wmode=opaque',
}) => {
    return (
        <Section id="book" background="cream" padding="lg">
            <div className="text-center mb-12">
                <Heading level="h2" size="xl" className="mb-4">
                    {title}
                </Heading>
                <Text size="xl" className="max-w-2xl mx-auto">
                    {description}
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
                        title="Booking Widget"
                    />
                </div>
            </div>
        </Section>
    )
}
