import { http, HttpResponse, delay } from 'msw';
import { db } from './db';
import { SEED_ACTIVITY, SEED_METRICS, SEED_TREND } from './seed';
import type {
  AuthUser,
  Credentials,
  PaginatedResult,
  User,
  UserInput,
} from '@/types';

const NETWORK_DELAY = 250;

const DEMO_PASSWORD = 'admin1234';
const DEMO_USERS: Array<AuthUser & { password: string }> = [
  { id: 'auth_thilan',  name: 'Thilan Buddhika',  email: 'thilan@bistecglobal.com',  role: 'admin',  avatarColor: '#2563eb', password: DEMO_PASSWORD },
  { id: 'auth_subhash', name: 'Subhash Perera',   email: 'subhash@bistecglobal.com', role: 'editor', avatarColor: '#7c3aed', password: DEMO_PASSWORD },
];

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export const handlers = [
  // ---- Auth ------------------------------------------------------------
  http.post('/api/auth/login', async ({ request }) => {
    await delay(NETWORK_DELAY);
    const body = (await request.json()) as Credentials;
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === body.email?.toLowerCase() && u.password === body.password,
    );
    if (!found) {
      return HttpResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 },
      );
    }
    const { password: _pw, ...safe } = found;
    return HttpResponse.json({
      token: `tok_${found.id}_${Date.now()}`,
      user: safe,
    });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(100);
    return HttpResponse.json({ ok: true });
  }),

  // ---- Dashboard --------------------------------------------------------
  http.get('/api/dashboard/metrics', async () => {
    await delay(NETWORK_DELAY);
    return HttpResponse.json(SEED_METRICS);
  }),

  http.get('/api/dashboard/trend', async () => {
    await delay(NETWORK_DELAY);
    return HttpResponse.json(SEED_TREND);
  }),

  http.get('/api/dashboard/activity', async () => {
    await delay(NETWORK_DELAY);
    return HttpResponse.json(SEED_ACTIVITY);
  }),

  // ---- Users CRUD -------------------------------------------------------
  http.get('/api/users', async ({ request }) => {
    await delay(NETWORK_DELAY);
    const url = new URL(request.url);
    const search   = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const role     = url.searchParams.get('role') ?? '';
    const active   = url.searchParams.get('isActive') ?? '';
    const sortBy   = (url.searchParams.get('sortBy') ?? 'createdAt') as keyof User;
    const sortDir  = (url.searchParams.get('sortDir') ?? 'desc') as 'asc' | 'desc';
    const page     = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);

    let filtered = db.users.filter((u) => {
      if (search && !`${u.name} ${u.email}`.toLowerCase().includes(search)) return false;
      if (role && u.role !== role) return false;
      if (active === 'true'  && !u.isActive) return false;
      if (active === 'false' &&  u.isActive) return false;
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return HttpResponse.json(paginate(filtered, page, pageSize));
  }),

  http.get('/api/users/:id', async ({ params }) => {
    await delay(NETWORK_DELAY);
    const user = db.users.find((u) => u.id === params.id);
    if (!user) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(NETWORK_DELAY);
    const input = (await request.json()) as UserInput;
    if (db.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return HttpResponse.json({ message: 'Email already exists.' }, { status: 409 });
    }
    const created: User = {
      id: genId('usr'),
      ...input,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    db.users.unshift(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    await delay(NETWORK_DELAY);
    const idx = db.users.findIndex((u) => u.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const patch = (await request.json()) as Partial<UserInput>;
    if (
      patch.email &&
      db.users.some((u, i) => i !== idx && u.email.toLowerCase() === patch.email!.toLowerCase())
    ) {
      return HttpResponse.json({ message: 'Email already exists.' }, { status: 409 });
    }
    db.users[idx] = { ...db.users[idx], ...patch };
    return HttpResponse.json(db.users[idx]);
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(NETWORK_DELAY);
    const idx = db.users.findIndex((u) => u.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    // Soft delete = mark inactive instead of removing.
    db.users[idx] = { ...db.users[idx], isActive: false };
    return HttpResponse.json({ ok: true });
  }),

  // ---- Notifications ----------------------------------------------------
  http.get('/api/notifications', async () => {
    await delay(150);
    return HttpResponse.json(db.notifications);
  }),

  http.post('/api/notifications/:id/read', async ({ params }) => {
    await delay(80);
    const n = db.notifications.find((x) => x.id === params.id);
    if (n) n.read = true;
    return HttpResponse.json({ ok: true });
  }),

  http.post('/api/notifications/read-all', async () => {
    await delay(80);
    db.notifications.forEach((n) => (n.read = true));
    return HttpResponse.json({ ok: true });
  }),
];
