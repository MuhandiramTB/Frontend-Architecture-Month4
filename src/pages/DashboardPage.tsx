import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { Badge } from '@/components/common/Badge';
import { api } from '@/utils/api';
import { formatMetric, relativeTime } from '@/utils/format';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import type { ActivityItem, Metric, TrendPoint } from '@/types';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const metricsQ = useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => api<Metric[]>('/api/dashboard/metrics'),
  });
  const trendQ = useQuery({
    queryKey: ['dashboard', 'trend'],
    queryFn: () => api<TrendPoint[]>('/api/dashboard/trend'),
  });
  const activityQ = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => api<ActivityItem[]>('/api/dashboard/activity'),
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening across your workspace today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => toast.info('Export started', 'Your CSV will be ready in a moment.')}>
            Export CSV
          </Button>
          <Button onClick={() => toast.success('Invite sent', 'New team member invited.')}>
            + Invite user
          </Button>
        </div>
      </header>

      {/* Metrics */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Key metrics</h2>
        {metricsQ.isError && <Alert level="error" title="Couldn't load metrics" />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricsQ.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
            : metricsQ.data?.map((m) => <MetricCard key={m.id} metric={m} />)}
        </div>
      </section>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="30-day trend" description="Daily users, revenue, and orders" />
          <CardBody>
            {trendQ.isLoading && (
              <div className="grid h-72 place-items-center"><Spinner label="Loading chart" /></div>
            )}
            {trendQ.isError && <Alert level="error" title="Couldn't load trend" />}
            {trendQ.data && (
              <div className="h-72" role="img" aria-label="30-day trend chart of users, revenue, and orders">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendQ.data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-500" />
                    <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-500" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgb(15 23 42)',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="users"   stroke="#2563eb" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="orders"  stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent activity" description="What's happening in your workspace" />
          <CardBody className="p-0">
            {activityQ.isLoading && (
              <div className="grid h-40 place-items-center"><Spinner /></div>
            )}
            {activityQ.data && (
              <ol className="divide-y divide-slate-200 dark:divide-slate-800">
                {activityQ.data.map((a) => (
                  <li key={a.id} className="px-5 py-3 text-sm">
                    <p className="text-slate-700 dark:text-slate-200">
                      <span className="font-medium">{a.actor}</span>{' '}
                      <span className="text-slate-500 dark:text-slate-400">{a.action}</span>{' '}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <time dateTime={a.timestamp}>{relativeTime(a.timestamp)}</time>
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

const MetricCard = memo(function MetricCard({ metric }: { metric: Metric }) {
  const positive = metric.delta >= 0;
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {metric.label}
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {formatMetric(metric.value, metric.format)}
        </p>
        <div className="mt-2">
          <Badge tone={positive ? 'green' : 'red'}>
            {positive ? '▲' : '▼'} {Math.abs(metric.delta).toFixed(1)}%
          </Badge>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">vs. last period</span>
        </div>
      </CardBody>
    </Card>
  );
});

function MetricSkeleton() {
  return (
    <Card>
      <CardBody>
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-7 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </CardBody>
    </Card>
  );
}
