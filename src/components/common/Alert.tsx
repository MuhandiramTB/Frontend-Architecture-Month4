import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type AlertLevel = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  level?: AlertLevel;
  title?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const styles: Record<AlertLevel, { box: string; icon: string; iconPath: string; role: 'alert' | 'status' }> = {
  info: {
    box: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-100',
    icon: 'text-blue-500',
    iconPath:
      'M11 9h2v2h-2zm0 4h2v6h-2zm1-9C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4z',
    role: 'status',
  },
  success: {
    box: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-100',
    icon: 'text-emerald-500',
    iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    role: 'status',
  },
  warning: {
    box: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-100',
    icon: 'text-amber-500',
    iconPath: 'M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z',
    role: 'alert',
  },
  error: {
    box: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900 dark:text-red-100',
    icon: 'text-red-500',
    iconPath:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z',
    role: 'alert',
  },
};

export function Alert({ level = 'info', title, children, onDismiss, className }: AlertProps) {
  const s = styles[level];
  return (
    <div
      role={s.role}
      aria-live={s.role === 'alert' ? 'assertive' : 'polite'}
      className={cn('flex gap-3 rounded-lg border px-4 py-3 text-sm', s.box, className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn('mt-0.5 h-5 w-5 flex-shrink-0', s.icon)}
        fill="currentColor"
      >
        <path d={s.iconPath} />
      </svg>
      <div className="min-w-0 flex-1">
        {title && <div className="font-medium">{title}</div>}
        {children && <div className={cn(title && 'mt-0.5')}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 rounded p-1 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="currentColor">
            <path d="M6.225 4.811l-1.414 1.414L8.586 10l-3.775 3.775 1.414 1.414L10 11.414l3.775 3.775 1.414-1.414L11.414 10l3.775-3.775-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      )}
    </div>
  );
}
