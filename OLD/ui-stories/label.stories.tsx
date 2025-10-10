import type { Meta, StoryObj } from '@storybook/react'

import { Label } from '../ui/label'

const meta: Meta<typeof Label> = {
	title: 'ui/Label',
	component: Label,
	tags: ['autodocs'],
	argTypes: {},
}
export default meta

type Story = StoryObj<typeof Label>

export const Base: Story = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render: (_args: any) => <Label htmlFor="email">Your email address</Label>,
	args: {},
}
