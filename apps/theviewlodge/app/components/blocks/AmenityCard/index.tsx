import React from 'react'
import { motion } from 'framer-motion'

import { Heading } from '../../primitives/Heading'
import { Icon, type IconName } from '../../primitives/Icon'
import { Text } from '../../primitives/Text'

export interface AmenityCardProps {
    icon: IconName
    title: string
    description: string
}

export const AmenityCard: React.FC<AmenityCardProps> = ({
    icon,
    title,
    description,
}) => {
    return (
        <motion.div
            className="text-center flex-shrink-0 w-48"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{
                y: -5,
                transition: { duration: 0.2 },
            }}
        >
            <motion.div
                className="w-12 h-12 mx-auto mb-4 bg-sage/20 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4, ease: 'backOut' }}
                whileHover={{
                    scale: 1.1,
                    backgroundColor: 'rgba(140, 158, 138, 0.3)',
                    transition: { duration: 0.2 },
                }}
            >
                <Icon name={icon} className="text-sage" />
            </motion.div>
            <Heading
                level="h4"
                size="xs"
                weight="medium"
                className="mb-2"
                animate={false}
            >
                {title}
            </Heading>
            <Text size="sm">{description}</Text>
        </motion.div>
    )
}
