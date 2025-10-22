import React from 'react'
import { motion } from 'framer-motion'

import { Text } from '../../primitives/Text'
import { Card } from '../Card'

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
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{
                y: -4,
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.2)',
                transition: { duration: 0.2 },
            }}
        >
            <Card background="cream" padding="md">
                <motion.div
                    className="flex items-center mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    <div className="flex text-sage text-lg">
                        {'★'.repeat(rating)}
                    </div>
                </motion.div>
                <Text className="mb-4" italic size="sm">
                    {quote}
                </Text>
                <Text weight="medium" color="charcoal">
                    {author}
                </Text>
            </Card>
        </motion.div>
    )
}
