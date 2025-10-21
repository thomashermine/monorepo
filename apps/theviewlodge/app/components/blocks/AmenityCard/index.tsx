import React from 'react'
import { Icon, type IconName } from '../../primitives/Icon'
import { Heading } from '../../primitives/Heading'
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
        <div className="text-center flex-shrink-0 w-48">
            <div className="w-12 h-12 mx-auto mb-4 bg-sage/20 rounded-full flex items-center justify-center">
                <Icon name={icon} className="text-sage" />
            </div>
            <Heading level="h4" size="xs" weight="medium" className="mb-2">
                {title}
            </Heading>
            <Text size="sm">{description}</Text>
        </div>
    )
}
