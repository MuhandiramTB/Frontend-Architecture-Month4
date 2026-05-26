import { create } from 'zustand';
import type { Toast } from '@/types';

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    set({ toasts: [...get().toasts, { ...t, id }] });
    window.setTimeout(() => get().dismiss(id), 4500);
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
}));

export const toast = {
  info:    (title: string, body?: string) => useToastStore.getState().push({ level: 'info',    title, body }),
  success: (title: string, body?: string) => useToastStore.getState().push({ level: 'success', title, body }),
  warning: (title: string, body?: string) => useToastStore.getState().push({ level: 'warning', title, body }),
  error:   (title: string, body?: string) => useToastStore.getState().push({ level: 'error',   title, body }),
};
