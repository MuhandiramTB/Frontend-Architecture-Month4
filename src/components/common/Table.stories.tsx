import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table, type Column } from './Table';
import { Pagination } from './Pagination';
import { Badge } from './Badge';

interface Row {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  status: 'active' | 'inactive';
}

const allRows: Row[] = [
  { id: '1',  name: 'Thilan Buddhika',         email: 'thilan@bistecglobal.com',   role: 'admin',  status: 'active'   },
  { id: '2',  name: 'Subhash Perera',          email: 'subhash@bistecglobal.com',  role: 'admin',  status: 'active'   },
  { id: '3',  name: 'Chandima Silva',          email: 'chandima@bistecglobal.com', role: 'editor', status: 'active'   },
  { id: '4',  name: 'Jayath Fernando',         email: 'jayath@bistecglobal.com',   role: 'editor', status: 'active'   },
  { id: '5',  name: 'Buddhika Wickramasinghe', email: 'buddhika@bistecglobal.com', role: 'editor', status: 'active'   },
  { id: '6',  name: 'Gayashan Jayasinghe',     email: 'gayashan@bistecglobal.com', role: 'user',   status: 'active'   },
  { id: '7',  name: 'Eranga Rathnayake',       email: 'eranga@bistecglobal.com',   role: 'user',   status: 'active'   },
  { id: '8',  name: 'Aathma Bandara',          email: 'aathma@bistecglobal.com',   role: 'user',   status: 'active'   },
  { id: '9',  name: 'Ranali Senanayake',       email: 'ranali@bistecglobal.com',   role: 'user',   status: 'inactive' },
  { id: '10', name: 'Faarah Gunawardena',      email: 'faarah@bistecglobal.com',   role: 'user',   status: 'active'   },
];

const columns: Column<Row>[] = [
  { key: 'name',   header: 'Name',   sortable: true, cell: (r) => r.name },
  { key: 'email',  header: 'Email',                  cell: (r) => r.email },
  { key: 'role',   header: 'Role',   sortable: true, cell: (r) => <Badge tone={r.role === 'admin' ? 'violet' : r.role === 'editor' ? 'blue' : 'gray'}>{r.role}</Badge> },
  { key: 'status', header: 'Status', sortable: true, cell: (r) => <Badge tone={r.status === 'active' ? 'green' : 'red'}>{r.status}</Badge> },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sortable: Story = {
  render: () => {
    const [sortBy,  setSortBy]  = useState<string>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const sorted = [...allRows].sort((a, b) => {
      const av = (a as any)[sortBy] ?? '';
      const bv = (b as any)[sortBy] ?? '';
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return (
      <div className="p-6">
        <Table<Row>
          caption="Demo user list"
          columns={columns}
          rows={sorted}
          getRowId={(r) => r.id}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortChange={(k) => {
            if (k === sortBy) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
            else { setSortBy(k); setSortDir('asc'); }
          }}
        />
      </div>
    );
  },
};

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const slice = allRows.slice((page - 1) * pageSize, page * pageSize);
    return (
      <div className="p-6">
        <Table<Row> columns={columns} rows={slice} getRowId={(r) => r.id} />
        <Pagination page={page} pageSize={pageSize} total={allRows.length} onPageChange={setPage} />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <div className="p-6">
      <Table<Row> columns={columns} rows={[]} getRowId={(r) => r.id} loading />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="p-6">
      <Table<Row> columns={columns} rows={[]} getRowId={(r) => r.id} emptyMessage="No users match your filters." />
    </div>
  ),
};
