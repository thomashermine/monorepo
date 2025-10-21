import React from 'react'
import { Card } from '../Card'
import { Heading } from '../../primitives/Heading'
import { Text } from '../../primitives/Text'

export interface FAQItemProps {
    question: string
    answer: string | React.ReactNode
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    return (
        <Card background="white" padding="lg" shadow="sm">
            <Heading level="h3" size="xs" weight="medium" className="mb-4">
                {question}
            </Heading>
            {typeof answer === 'string' ? (
                <Text>{answer}</Text>
            ) : (
                <div className="text-stone leading-relaxed">{answer}</div>
            )}
        </Card>
    )
}
