import type {
  ActivityItem,
  Metric,
  NotificationItem,
  Role,
  TrendPoint,
  User,
} from '@/types';

const FIRST = [
  'Ava', 'Noah', 'Mia', 'Liam', 'Zoe', 'Eli', 'Maya', 'Owen', 'Lily', 'Jude',
  'Iris', 'Ezra', 'Nora', 'Kai', 'Sage', 'Theo', 'Cleo', 'Finn', 'Wren', 'Hugo',
  'Ada', 'Beau', 'Cora', 'Dax', 'Esme', 'Felix', 'Gigi', 'Hank', 'Ivy', 'Jett',
];
const LAST = [
  'Patel', 'Nguyen', 'Garcia', 'Kim', 'Smith', 'Johnson', 'Lee', 'Brown',
  'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson',
  'White', 'Harris', 'Martin', 'Thompson', 'Lopez',
];

const ROLES: Role[] = ['admin', 'editor', 'user'];

function deterministicSeed(i: number) {
  // Simple, stable pseudorandom; avoids snapshot churn across reloads.
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const SEED_USERS: User[] = Array.from({ length: 87 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[Math.floor(deterministicSeed(i) * LAST.length)];
  const role = ROLES[Math.floor(deterministicSeed(i + 7) * ROLES.length)];
  const createdAt = new Date(2025, 0, 1 + Math.floor(deterministicSeed(i + 3) * 480))
    .toISOString();
  const lastLogin = deterministicSeed(i + 5) > 0.15
    ? new Date(2026, 4, 1 + Math.floor(deterministicSeed(i + 9) * 25)).toISOString()
    : null;
  return {
    id: `usr_${(1000 + i).toString(36)}`,
    name: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase() + `@adminflow.io`,
    role,
    isActive: deterministicSeed(i + 11) > 0.18,
    createdAt,
    lastLogin,
  };
});

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
  { id: 'a1', actor: 'Ava Patel',    action: 'invited',        target: 'noah@adminflow.io',    timestamp: '2026-05-26T09:12:00Z' },
  { id: 'a2', actor: 'System',       action: 'rotated key for',target: 'production API',       timestamp: '2026-05-26T08:51:00Z' },
  { id: 'a3', actor: 'Liam Nguyen',  action: 'updated role of',target: 'mia@adminflow.io',     timestamp: '2026-05-26T07:44:00Z' },
  { id: 'a4', actor: 'Zoe Garcia',   action: 'deleted',        target: 'broken-webhook',       timestamp: '2026-05-25T22:09:00Z' },
  { id: 'a5', actor: 'Eli Kim',      action: 'enabled SSO for',target: 'Workspace West',       timestamp: '2026-05-25T18:30:00Z' },
  { id: 'a6', actor: 'Maya Smith',   action: 'restored',       target: 'usr_1f7',              timestamp: '2026-05-25T14:02:00Z' },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Welcome to AdminFlow',    body: 'Your trial is active for 14 more days.',         level: 'info',    read: false, createdAt: '2026-05-26T08:00:00Z' },
  { id: 'n2', title: 'New sign-ups spike',      body: '+12% over the last 24h — nice work.',          level: 'success', read: false, createdAt: '2026-05-26T07:30:00Z' },
  { id: 'n3', title: 'Webhook delivery failing', body: 'orders.created → https://hooks.example/x',     level: 'warning', read: true,  createdAt: '2026-05-25T22:18:00Z' },
];
