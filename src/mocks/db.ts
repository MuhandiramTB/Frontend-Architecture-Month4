import type { NotificationItem, User } from '@/types';
import { SEED_NOTIFICATIONS, SEED_USERS } from './seed';

// In-memory store backing the mock API. Mutated by handlers across the
// session — persists until the page reloads.
export const db = {
  users: [...SEED_USERS] as User[],
  notifications: [...SEED_NOTIFICATIONS] as NotificationItem[],
};
