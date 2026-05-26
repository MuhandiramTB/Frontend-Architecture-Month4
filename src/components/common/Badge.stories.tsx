import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['gray', 'blue', 'green', 'amber', 'red', 'violet'] },
  },
  args: { children: 'Active', tone: 'green' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gray:   Story = { args: { tone: 'gray',   children: 'User' } };
export const Blue:   Story = { args: { tone: 'blue',   children: 'Editor' } };
export const Green:  Story = { args: { tone: 'green',  children: 'Active' } };
export const Amber:  Story = { args: { tone: 'amber',  children: 'Warning' } };
export const Red:    Story = { args: { tone: 'red',    children: 'Inactive' } };
export const Violet: Story = { args: { tone: 'violet', children: 'Admin' } };

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="gray">gray</Badge>
      <Badge tone="blue">blue</Badge>
      <Badge tone="green">green</Badge>
      <Badge tone="amber">amber</Badge>
      <Badge tone="red">red</Badge>
      <Badge tone="violet">violet</Badge>
    </div>
  ),
};
