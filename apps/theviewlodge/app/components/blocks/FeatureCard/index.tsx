import { motion } from 'framer-motion'
import React from 'react'

export interface FeatureCardProps {
    image: string
    title: string
    subtitle?: string
    size?: 'small' | 'medium' | 'large'
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    image,
    title,
    subtitle,
}) => {
    return (
        <motion.div
            className={` bg-gradient-to-br from-sage/40 to-stone/50 rounded-2xl overflow-hidden relative `}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.3, once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
            }}
        >
            <motion.img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <motion.div
                className="absolute bottom-6 left-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <h3 className="text-3xl font-light font-baskerville mb-2">
                    {title}
                </h3>
                {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
            </motion.div>
        </motion.div>
    )
}
