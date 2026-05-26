import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'WAI-ARIA APG-compliant tabs. Arrow Left / Right move focus + selection, Home / End jump to the first / last tab.',
      },
    },
  },
  args: { items: [], value: '', onChange: () => {} },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { id: 'profile',  label: 'Profile',  panel: <p className="text-sm">Profile details for Thilan Buddhika.</p> },
  { id: 'security', label: 'Security', panel: <p className="text-sm">Multi-factor authentication is enabled.</p> },
  { id: 'billing',  label: 'Billing',  panel: <p className="text-sm">Pro plan · renews 2026-06-15.</p> },
];

export const Controlled: Story = {
  render: () => {
    const [tab, setTab] = useState('profile');
    return (
      <div className="w-[480px]">
        <Tabs items={items} value={tab} onChange={setTab} />
      </div>
    );
  },
};
