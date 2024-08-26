import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Progress } from '../ui/progress'

const meta: Meta<typeof Progress> = {
  title: 'ui/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Progress>

export const Base: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (args) => <Progress value={33} />,
  args: {},
}
