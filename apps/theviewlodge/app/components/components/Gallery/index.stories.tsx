import type { Meta, StoryObj } from '@storybook/react'
import { Gallery } from './index'

const meta: Meta<typeof Gallery> = {
    title: 'Components/Gallery',
    component: Gallery,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Gallery>

const sampleImages = [
    {
        src: '/images/theviewlodge-aerial-field-house.jpg',
        alt: 'Aerial view',
        aspectRatio: '3/4',
    },
    {
        src: '/images/theviewlodge-aerial-forest-canopy.jpg',
        alt: 'Forest canopy',
        aspectRatio: 'square',
    },
    {
        src: '/images/theviewlodge-aerial-front-facade.jpg',
        alt: 'Front facade',
        aspectRatio: '4/3',
    },
    {
        src: '/images/theviewlodge-bathroom-jacuzzi-jets.jpg',
        alt: 'Jacuzzi',
        aspectRatio: 'square',
    },
    {
        src: '/images/theviewlodge-sauna-mountain-view.jpg',
        alt: 'Sauna',
        aspectRatio: 'square',
    },
    {
        src: '/images/theviewlodge-hottub.jpg',
        alt: 'Hot tub',
        aspectRatio: 'square',
    },
]

export const Foldable: Story = {
    args: {
        images: sampleImages,
        foldable: true,
    },
}

export const AlwaysExpanded: Story = {
    args: {
        images: sampleImages.slice(0, 3),
        foldable: false,
    },
}
