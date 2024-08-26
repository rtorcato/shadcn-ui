import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Plus } from 'lucide-react'

import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'ui/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Base: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" className="w-10 rounded-full p-0">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
  args: {},
}
