import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    placeholder: 'you@company.com',
    type: 'email',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = { args: { label: 'Full name', type: 'text', placeholder: 'Thilan Buddhika' } };
export const Email: Story = {};
export const Password: Story = { args: { label: 'Password', type: 'password', placeholder: '••••••••' } };

export const WithHint: Story = {
  args: { hint: "We'll never share your email." },
};

export const WithError: Story = {
  args: { error: 'Enter a valid email address.' },
};

export const Required: Story = { args: { required: true } };

export const Disabled: Story = { args: { disabled: true, value: 'thilan@bistecglobal.com' } };

export const WithLeadingIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search users…',
    leadingIcon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
      </svg>
    ),
  },
};
