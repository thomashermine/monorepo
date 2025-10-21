import React from 'react'
import { Card } from '../Card'
import { Text } from '../../primitives/Text'

export interface TestimonialCardProps {
    quote: string
    author: string
    rating?: number
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
    quote,
    author,
    rating = 5,
}) => {
    return (
        <Card background="cream" padding="md">
            <div className="flex items-center mb-4">
                <div className="flex text-sage text-lg">
                    {'★'.repeat(rating)}
                </div>
            </div>
            <Text className="mb-4" italic size="sm">
                {quote}
            </Text>
            <Text weight="medium" color="charcoal">
                {author}
            </Text>
        </Card>
    )
}
