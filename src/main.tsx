import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/index.css';

async function bootstrap() {
  const { worker } = await import('./mocks/browser');
  await worker.start({
    // Silently let non-/api/* requests (favicons, HMR, fonts, etc.) go to the
    // network — MSW's passthrough is the source of the SW "Failed to fetch"
    // noise otherwise.
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      options: { scope: import.meta.env.BASE_URL },
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
}

// MSW's SW passthrough can surface a benign "TypeError: Failed to fetch"
// when a non-mocked request (favicon, HMR, extension probe) can't reach
// its origin. Suppress only those — never real /api/* failures.
window.addEventListener('unhandledrejection', (e) => {
  const stack = String(e.reason?.stack ?? '');
  const msg   = String(e.reason?.message ?? '');
  if (stack.includes('mockServiceWorker.js') && msg.includes('Failed to fetch')) {
    e.preventDefault();
  }
});

bootstrap();
