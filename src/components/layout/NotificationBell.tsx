import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { relativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { NotificationItem } from '@/types';

export function NotificationBell() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api<NotificationItem[]>('/api/notifications'),
    refetchInterval: 30_000,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api(`/api/notifications/${id}/read`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAll = useMutation({
    mutationFn: () => api('/api/notifications/read-all', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = (data ?? []).filter((n) => !n.read).length;

  return (
    <Popover className="relative">
      <PopoverButton
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
        </svg>
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </PopoverButton>
      <PopoverPanel className="absolute right-0 z-30 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white shadow-lg focus:outline-none dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={unread === 0 || markAll.isPending}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50"
          >
            Mark all read
          </button>
        </div>
        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
          {isLoading && (
            <li className="p-4 text-center text-sm text-slate-500">
              <Spinner /> Loading…
            </li>
          )}
          {!isLoading && (data?.length ?? 0) === 0 && (
            <li className="p-6 text-center text-sm text-slate-500">You're all caught up.</li>
          )}
          {data?.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => !n.read && markRead.mutate(n.id)}
                className={cn(
                  'flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  !n.read && 'bg-brand-50/50 dark:bg-brand-900/10',
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{n.title}</span>
                  <Badge tone={toneFor(n.level)}>{n.level}</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{n.body}</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">{relativeTime(n.createdAt)}</p>
              </button>
            </li>
          ))}
        </ul>
      </PopoverPanel>
    </Popover>
  );
}

function toneFor(level: NotificationItem['level']) {
  switch (level) {
    case 'success': return 'green';
    case 'warning': return 'amber';
    case 'error':   return 'red';
    default:        return 'blue';
  }
}
