import { cn } from '@/utils/cn';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  function go(p: number) {
    const next = Math.min(totalPages, Math.max(1, p));
    if (next !== page) onPageChange(next);
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row"
    >
      <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
        Showing <span className="font-medium">{start}</span>–
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <PageBtn onClick={() => go(1)} disabled={page === 1} aria-label="First page">«</PageBtn>
        <PageBtn onClick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page">‹</PageBtn>
        <span className="px-2 text-xs text-slate-600 dark:text-slate-300" aria-current="page">
          Page {page} of {totalPages}
        </span>
        <PageBtn onClick={() => go(page + 1)} disabled={page >= totalPages} aria-label="Next page">›</PageBtn>
        <PageBtn onClick={() => go(totalPages)} disabled={page >= totalPages} aria-label="Last page">»</PageBtn>
      </div>
    </nav>
  );
}

function PageBtn({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-sm text-slate-600',
        'hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
        className,
      )}
      {...rest}
    />
  );
}
