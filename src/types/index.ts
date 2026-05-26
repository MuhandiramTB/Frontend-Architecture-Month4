export type Role = 'admin' | 'editor' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export interface Session {
  token: string;
  user: AuthUser;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserListQuery {
  search?: string;
  role?: Role | '';
  isActive?: 'true' | 'false' | '';
  sortBy?: keyof User;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface UserInput {
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  delta: number;
  format: 'number' | 'currency' | 'percent';
}

export interface TrendPoint {
  date: string;
  users: number;
  revenue: number;
  orders: number;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  level: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  title: string;
  body?: string;
  level: 'info' | 'success' | 'warning' | 'error';
}
