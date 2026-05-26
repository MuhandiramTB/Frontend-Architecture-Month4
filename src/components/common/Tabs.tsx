import { useId, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: ReactNode;
  panel: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  const base = useId();
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(items[(idx + 1) % items.length].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(items[(idx - 1 + items.length) % items.length].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(items[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(items[items.length - 1].id);
    }
  }
  return (
    <div className={className}>
      <div role="tablist" aria-orientation="horizontal" className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {items.map((item, idx) => {
          const selected = item.id === value;
          const tabId = `${base}-tab-${item.id}`;
          const panelId = `${base}-panel-${item.id}`;
          return (
            <button
              key={item.id}
              role="tab"
              id={tabId}
              type="button"
              aria-controls={panelId}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              onKeyDown={(e) => onKeyDown(e, idx)}
              className={cn(
                '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                selected
                  ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => {
        const selected = item.id === value;
        const tabId = `${base}-tab-${item.id}`;
        const panelId = `${base}-panel-${item.id}`;
        return (
          <div
            key={item.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!selected}
            tabIndex={0}
            className="pt-4 focus:outline-none"
          >
            {selected && item.panel}
          </div>
        );
      })}
    </div>
  );
}
