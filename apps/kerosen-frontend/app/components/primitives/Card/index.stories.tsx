import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card, CardBody, CardHeader } from './index'

const meta: Meta<typeof Card> = {
    argTypes: {
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
        },
    },
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Primitives/Card',
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
    args: {
        children: (
            <p className="text-slate-dark text-sm">
                Flight density data for the selected region.
            </p>
        ),
    },
    decorators: [
        (Story) => (
            <div style={{ width: 400 }}>
                <Story />
            </div>
        ),
    ],
}

export const WithHeaderAndBody: Story = {
    args: {
        padding: 'none',
        children: (
            <>
                <CardHeader>
                    <h3 className="text-base font-semibold text-slate-dark">
                        Flight Density
                    </h3>
                </CardHeader>
                <CardBody>
                    <p className="text-sm text-slate-mid">
                        Showing flight counts by day and time period.
                    </p>
                </CardBody>
            </>
        ),
    },
    decorators: [
        (Story) => (
            <div style={{ width: 400 }}>
                <Story />
            </div>
        ),
    ],
}

export const SmallPadding: Story = {
    args: {
        children: (
            <p className="text-slate-dark text-sm">Compact card content.</p>
        ),
        padding: 'sm',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 400 }}>
                <Story />
            </div>
        ),
    ],
}

export const LargePadding: Story = {
    args: {
        children: (
            <p className="text-slate-dark text-sm">
                Spacious card for prominent content.
            </p>
        ),
        padding: 'lg',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 400 }}>
                <Story />
            </div>
        ),
    ],
}
