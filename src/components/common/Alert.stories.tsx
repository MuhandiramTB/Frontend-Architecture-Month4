import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
  args: {
    title: 'Heads up',
    children: 'Something noteworthy just happened.',
    level: 'info',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info:    Story = { args: { level: 'info'    } };
export const Success: Story = { args: { level: 'success', title: 'Saved',   children: 'Your changes were saved.' } };
export const Warning: Story = { args: { level: 'warning', title: 'Heads up', children: 'Webhook delivery is failing.' } };
export const Error:   Story = { args: { level: 'error',   title: 'Failed',  children: 'Could not load users. Please retry.' } };

export const Dismissible: Story = {
  args: {
    level: 'success',
    title: 'Welcome',
    children: 'Click the × to dismiss me.',
    onDismiss: () => {},
  },
};
