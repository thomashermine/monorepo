import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Welcome } from './welcome'

// ================================================================================================================== //
// Storybook configuration
// ================================================================================================================== //

const meta = {
    args: {
        joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
    },
    component: Welcome,
    parameters: {
        docs: {
            description: {
                component:
                    'Welcome page component that displays the React Router logo, navigation links, and a random programming joke.',
            },
        },
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'App/Welcome',
} satisfies Meta<typeof Welcome>

export default meta
type Story = StoryObj<typeof meta>

// ================================================================================================================== //
// Stories
// ================================================================================================================== //

/**
 * Default welcome page with a joke
 */
export const Default: Story = {
    args: {
        joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
    },
}

/**
 * Welcome page in light mode with a specific joke
 */
export const LightMode: Story = {
    args: {
        joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
    },
    parameters: {
        backgrounds: { default: 'light' },
    },
}

/**
 * Welcome page in dark mode with a specific joke
 */
export const DarkMode: Story = {
    args: {
        joke: 'A SQL query walks into a bar, walks up to two tables and asks... "Can I join you?"',
    },
    decorators: [
        (Story: React.ComponentType) => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
    parameters: {
        backgrounds: { default: 'dark' },
        className: 'dark',
    },
}

/**
 * Welcome page with a long joke to test text wrapping
 */
export const LongJoke: Story = {
    args: {
        joke: "There are only 10 types of people in the world: those who understand binary, those who don't, and those who weren't expecting a base 3 joke. Also, those who know this joke has gone on way too long and should probably stop now.",
    },
}

/**
 * Welcome page with a short joke
 */
export const ShortJoke: Story = {
    args: {
        joke: 'It works on my machine! 🤷',
    },
}

/**
 * Welcome page with an empty joke (loading state)
 */
export const LoadingState: Story = {
    args: {
        joke: 'Loading joke...',
    },
}

/**
 * Welcome page with an error message
 */
export const ErrorState: Story = {
    args: {
        joke: 'Failed to load joke. Please try again later.',
    },
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
    args: {
        joke: "Why do Java developers wear glasses? Because they can't C#!",
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
    args: {
        joke: 'Why did the developer go broke? Because he used up all his cache!',
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
}
