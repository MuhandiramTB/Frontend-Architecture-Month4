import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { label: 'Loading' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InlineWithText: Story = {
  render: () => (
    <span className="inline-flex items-center gap-2 text-sm">
      <Spinner /> Loading users…
    </span>
  ),
};
