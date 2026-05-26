import { useToastStore } from '@/stores/toastStore';
import { Alert } from './Alert';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto animate-slide-in-right">
          <Alert level={t.level} title={t.title} onDismiss={() => dismiss(t.id)}>
            {t.body}
          </Alert>
        </div>
      ))}
    </div>
  );
}
