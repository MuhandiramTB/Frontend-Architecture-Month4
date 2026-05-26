import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Role',
    options: [
      { value: 'admin',  label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'user',   label: 'User' },
    ],
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = { args: { placeholder: 'Pick a role…' } };

export const WithError: Story = { args: { error: 'Please pick a role.' } };

export const WithHint: Story = { args: { hint: 'Editors can publish content.' } };

export const Disabled: Story = { args: { disabled: true } };
