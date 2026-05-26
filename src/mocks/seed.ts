import type {
  ActivityItem,
  Metric,
  NotificationItem,
  TrendPoint,
  User,
} from '@/types';

// Fixed team roster — replaces the generated foreign-name dataset.
export const SEED_USERS: User[] = [
  {
    id: 'usr_thilan',
    name: 'Thilan Buddhika',
    email: 'thilan@bistecglobal.com',
    role: 'admin',
    isActive: true,
    createdAt: '2025-01-15T08:30:00Z',
    lastLogin: '2026-05-26T09:12:00Z',
  },
  {
    id: 'usr_subhash',
    name: 'Subhash Perera',
    email: 'subhash@bistecglobal.com',
    role: 'admin',
    isActive: true,
    createdAt: '2025-02-03T10:15:00Z',
    lastLogin: '2026-05-26T08:42:00Z',
  },
  {
    id: 'usr_chandima',
    name: 'Chandima Silva',
    email: 'chandima@bistecglobal.com',
    role: 'editor',
    isActive: true,
    createdAt: '2025-02-22T13:05:00Z',
    lastLogin: '2026-05-25T17:48:00Z',
  },
  {
    id: 'usr_jayath',
    name: 'Jayath Fernando',
    email: 'jayath@bistecglobal.com',
    role: 'editor',
    isActive: true,
    createdAt: '2025-03-11T09:00:00Z',
    lastLogin: '2026-05-26T07:21:00Z',
  },
  {
    id: 'usr_buddhika',
    name: 'Buddhika Wickramasinghe',
    email: 'buddhika@bistecglobal.com',
    role: 'editor',
    isActive: true,
    createdAt: '2025-03-27T11:42:00Z',
    lastLogin: '2026-05-24T19:10:00Z',
  },
  {
    id: 'usr_gayashan',
    name: 'Gayashan Jayasinghe',
    email: 'gayashan@bistecglobal.com',
    role: 'user',
    isActive: true,
    createdAt: '2025-04-14T14:25:00Z',
    lastLogin: '2026-05-26T06:55:00Z',
  },
  {
    id: 'usr_eranga',
    name: 'Eranga Rathnayake',
    email: 'eranga@bistecglobal.com',
    role: 'user',
    isActive: true,
    createdAt: '2025-05-02T08:00:00Z',
    lastLogin: '2026-05-25T22:33:00Z',
  },
  {
    id: 'usr_aathma',
    name: 'Aathma Bandara',
    email: 'aathma@bistecglobal.com',
    role: 'user',
    isActive: true,
    createdAt: '2025-06-19T12:18:00Z',
    lastLogin: '2026-05-26T08:05:00Z',
  },
  {
    id: 'usr_ranali',
    name: 'Ranali Senanayake',
    email: 'ranali@bistecglobal.com',
    role: 'user',
    isActive: false,
    createdAt: '2025-07-08T15:50:00Z',
    lastLogin: '2026-04-12T11:20:00Z',
  },
  {
    id: 'usr_faarah',
    name: 'Faarah Gunawardena',
    email: 'faarah@bistecglobal.com',
    role: 'user',
    isActive: true,
    createdAt: '2025-08-21T09:35:00Z',
    lastLogin: null,
  },
];

function deterministicSeed(i: number) {
  // Stable pseudorandom — keeps charts identical across reloads.
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const SEED_METRICS: Metric[] = [
  { id: 'm_users',   label: 'Active users',   value: 18420, delta: 12.4,  format: 'number'   },
  { id: 'm_revenue', label: 'Monthly revenue', value: 248930, delta: 6.2,  format: 'currency' },
  { id: 'm_orders',  label: 'Orders today',   value: 1289,  delta: -2.1, format: 'number'   },
  { id: 'm_conv',    label: 'Conversion',     value: 4.8,   delta: 0.6,  format: 'percent'  },
];

export const SEED_TREND: TrendPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 3, 27 + i);
  return {
    date: d.toISOString().slice(0, 10),
    users:   Math.round(450 + deterministicSeed(i) * 200 + i * 6),
    revenue: Math.round(7000 + deterministicSeed(i + 17) * 3000 + i * 90),
    orders:  Math.round(120 + deterministicSeed(i + 29) * 60 + i * 1.5),
  };
});

export const SEED_ACTIVITY: ActivityItem[] = [
  { id: 'a1', actor: 'Thilan Buddhika',    action: 'invited',         target: 'faarah@bistecglobal.com',  timestamp: '2026-05-26T09:12:00Z' },
  { id: 'a2', actor: 'System',             action: 'rotated key for', target: 'production API',           timestamp: '2026-05-26T08:51:00Z' },
  { id: 'a3', actor: 'Subhash Perera',     action: 'updated role of', target: 'chandima@bistecglobal.com', timestamp: '2026-05-26T07:44:00Z' },
  { id: 'a4', actor: 'Chandima Silva',     action: 'deleted',         target: 'broken-webhook',           timestamp: '2026-05-25T22:09:00Z' },
  { id: 'a5', actor: 'Buddhika Wickramasinghe', action: 'enabled SSO for', target: 'Workspace Colombo', timestamp: '2026-05-25T18:30:00Z' },
  { id: 'a6', actor: 'Eranga Rathnayake',  action: 'restored',        target: 'usr_ranali',               timestamp: '2026-05-25T14:02:00Z' },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Welcome to AdminFlow',    body: 'Your trial is active for 14 more days.',     level: 'info',    read: false, createdAt: '2026-05-26T08:00:00Z' },
  { id: 'n2', title: 'New sign-ups spike',      body: '+12% over the last 24h — nice work.',        level: 'success', read: false, createdAt: '2026-05-26T07:30:00Z' },
  { id: 'n3', title: 'Webhook delivery failing', body: 'orders.created → https://hooks.example/x', level: 'warning', read: true,  createdAt: '2026-05-25T22:18:00Z' },
];
