import type { Meta, StoryObj } from '@storybook/react'

import { Gallery } from './index'

const meta: Meta<typeof Gallery> = {
    component: Gallery,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Components/Gallery',
}

export default meta
type Story = StoryObj<typeof Gallery>

const sampleImages = [
    {
        alt: 'Aerial view',
        aspectRatio: '3/4',
        src: '/images/theviewlodge-aerial-field-house.jpg',
    },
    {
        alt: 'Forest canopy',
        aspectRatio: 'square',
        src: '/images/theviewlodge-aerial-forest-canopy.jpg',
    },
    {
        alt: 'Front facade',
        aspectRatio: '4/3',
        src: '/images/theviewlodge-aerial-front-facade.jpg',
    },
    {
        alt: 'Jacuzzi',
        aspectRatio: 'square',
        src: '/images/theviewlodge-bathroom-jacuzzi-jets.jpg',
    },
    {
        alt: 'Sauna',
        aspectRatio: 'square',
        src: '/images/theviewlodge-sauna-mountain-view.jpg',
    },
    {
        alt: 'Hot tub',
        aspectRatio: 'square',
        src: '/images/theviewlodge-hottub.jpg',
    },
]

export const Foldable: Story = {
    args: {
        foldable: true,
        images: sampleImages,
    },
}

export const AlwaysExpanded: Story = {
    args: {
        foldable: false,
        images: sampleImages.slice(0, 3),
    },
}
