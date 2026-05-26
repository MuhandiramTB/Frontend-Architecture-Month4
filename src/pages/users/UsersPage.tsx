import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Card } from '@/components/common/Card';
import { Table, type Column } from '@/components/common/Table';
import { Pagination } from '@/components/common/Pagination';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Alert } from '@/components/common/Alert';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { api, ApiError } from '@/utils/api';
import { toast } from '@/stores/toastStore';
import { relativeTime } from '@/utils/format';
import { UserForm } from './UserForm';
import type { PaginatedResult, Role, User, UserInput } from '@/types';
import type { UserFormValues } from '@/schemas/userSchema';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch]     = useState('');
  const debouncedSearch         = useDebouncedValue(search, 300);
  const [role, setRole]         = useState<'' | Role>('');
  const [active, setActive]     = useState<'' | 'true' | 'false'>('');
  const [page, setPage]         = useState(1);
  const [sortBy, setSortBy]     = useState<keyof User>('createdAt');
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('desc');

  const [editing, setEditing]   = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | undefined>();

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (debouncedSearch) sp.set('search', debouncedSearch);
    if (role)            sp.set('role', role);
    if (active)          sp.set('isActive', active);
    sp.set('sortBy', String(sortBy));
    sp.set('sortDir', sortDir);
    sp.set('page', String(page));
    sp.set('pageSize', String(PAGE_SIZE));
    return sp.toString();
  }, [debouncedSearch, role, active, sortBy, sortDir, page]);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['users', queryString],
    queryFn: () => api<PaginatedResult<User>>(`/api/users?${queryString}`),
    placeholderData: keepPreviousData,
  });

  const createMut = useMutation({
    mutationFn: (input: UserInput) =>
      api<User>('/api/users', { method: 'POST', json: input }),
    onSuccess: (user) => {
      toast.success('User created', `${user.name} was added.`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setCreating(false);
      setFormError(undefined);
    },
    onError: (e) => setFormError(e instanceof ApiError ? e.message : 'Could not create user.'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<UserInput> }) =>
      api<User>(`/api/users/${id}`, { method: 'PATCH', json: input }),
    // Optimistic update on the current list view.
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const snapshots = queryClient.getQueriesData<PaginatedResult<User>>({ queryKey: ['users'] });
      snapshots.forEach(([key, prev]) => {
        if (!prev) return;
        queryClient.setQueryData<PaginatedResult<User>>(key, {
          ...prev,
          items: prev.items.map((u) => (u.id === id ? { ...u, ...input } : u)),
        });
      });
      return { snapshots };
    },
    onError: (e, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, prev]) => queryClient.setQueryData(key, prev));
      setFormError(e instanceof ApiError ? e.message : 'Could not save changes.');
    },
    onSuccess: (user) => {
      toast.success('User updated', `${user.name}'s profile was saved.`);
      setEditing(null);
      setFormError(undefined);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('User deactivated', 'Soft delete — record is still recoverable.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleting(null);
    },
    onError: () => toast.error('Could not deactivate user'),
  });

  function onSort(key: string) {
    const k = key as keyof User;
    if (sortBy === k) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortDir('asc');
    }
  }

  const columns: Column<User>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        sortable: true,
        cell: (u) => (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
            >
              {u.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900 dark:text-slate-100">{u.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        sortable: true,
        cell: (u) => (
          <Badge tone={u.role === 'admin' ? 'violet' : u.role === 'editor' ? 'blue' : 'gray'}>
            {u.role}
          </Badge>
        ),
      },
      {
        key: 'isActive',
        header: 'Status',
        sortable: true,
        cell: (u) => (
          <Badge tone={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
        ),
      },
      {
        key: 'createdAt',
        header: 'Joined',
        sortable: true,
        cell: (u) => (
          <time dateTime={u.createdAt}>{new Date(u.createdAt).toLocaleDateString()}</time>
        ),
      },
      {
        key: 'lastLogin',
        header: 'Last login',
        sortable: true,
        cell: (u) =>
          u.lastLogin ? (
            <time dateTime={u.lastLogin}>{relativeTime(u.lastLogin)}</time>
          ) : (
            <span className="text-slate-400">never</span>
          ),
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        className: 'text-right',
        cell: (u) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFormError(undefined);
                setEditing(u);
              }}
              aria-label={`Edit ${u.name}`}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => setDeleting(u)}
              aria-label={`Deactivate ${u.name}`}
              disabled={!u.isActive}
            >
              Deactivate
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const total = data?.total ?? 0;

  function handleCreate(values: UserFormValues) {
    createMut.mutate(values);
  }
  function handleEdit(values: UserFormValues) {
    if (!editing) return;
    updateMut.mutate({ id: editing.id, input: values });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage team members and their access levels.
          </p>
        </div>
        <Button
          onClick={() => {
            setFormError(undefined);
            setCreating(true);
          }}
        >
          + New user
        </Button>
      </header>

      <Card>
        <div className="grid grid-cols-1 gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Search"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leadingIcon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
              </svg>
            }
            aria-controls="users-table"
          />
          <Select
            label="Role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as Role | '');
              setPage(1);
            }}
            options={[
              { value: '',       label: 'All roles' },
              { value: 'admin',  label: 'Admin' },
              { value: 'editor', label: 'Editor' },
              { value: 'user',   label: 'User' },
            ]}
          />
          <Select
            label="Status"
            value={active}
            onChange={(e) => {
              setActive(e.target.value as 'true' | 'false' | '');
              setPage(1);
            }}
            options={[
              { value: '',      label: 'All statuses' },
              { value: 'true',  label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
          <div className="flex items-end">
            <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
              {isFetching ? 'Updating…' : `${total} user${total === 1 ? '' : 's'} match`}
            </p>
          </div>
        </div>

        {isError ? (
          <div className="p-4">
            <Alert level="error" title="Couldn't load users">Please try again.</Alert>
          </div>
        ) : (
          <div id="users-table">
            <Table<User>
              caption="List of users"
              columns={columns}
              rows={data?.items ?? []}
              getRowId={(u) => u.id}
              sortBy={String(sortBy)}
              sortDir={sortDir}
              onSortChange={onSort}
              loading={isLoading}
            />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      {/* Create */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create user"
        description="Add a new team member to your workspace."
      >
        <UserForm
          submitting={createMut.isPending}
          serverError={formError}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      {/* Edit */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit user"
        description={editing ? `Update ${editing.name}'s profile.` : undefined}
      >
        {editing && (
          <UserForm
            initial={editing}
            submitting={updateMut.isPending}
            serverError={formError}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Deactivate user?"
        description={deleting ? `${deleting.name} will lose access immediately. This is a soft delete.` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)} disabled={deleteMut.isPending}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteMut.isPending}
              onClick={() => deleting && deleteMut.mutate(deleting.id)}
            >
              Yes, deactivate
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          You can reactivate this user later by editing their profile.
        </p>
      </Modal>
    </div>
  );
}
