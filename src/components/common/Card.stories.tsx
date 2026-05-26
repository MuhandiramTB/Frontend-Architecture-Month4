import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardBody, CardFooter, CardHeader } from './Card';
import { Button } from './Button';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardBody>This is a plain card with body content only.</CardBody>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader title="Active session" description="Last activity 2 minutes ago" />
      <CardBody>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Signed in as <strong>Thilan Buddhika</strong> from Colombo, Sri Lanka.
        </p>
      </CardBody>
      <CardFooter>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="danger" size="sm">Sign out</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader
        title="Recent activity"
        description="What's happening in your workspace"
        action={<Button size="sm" variant="ghost">View all</Button>}
      />
      <CardBody>Nothing yet.</CardBody>
    </Card>
  ),
};
