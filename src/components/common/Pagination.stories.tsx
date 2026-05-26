import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, pageSize: 10, total: 0, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageSize={10} total={87} onPageChange={setPage} />;
  },
};

export const Empty: Story = {
  render: () => <Pagination page={1} pageSize={10} total={0} onPageChange={() => {}} />,
};
