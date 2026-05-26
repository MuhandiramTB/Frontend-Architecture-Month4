import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet';

const toneStyles: Record<BadgeTone, string> = {
  gray:   'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  blue:   'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  green:  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  amber:  'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  red:    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
};

export function Badge({
  tone = 'gray',
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
