import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-5xl font-bold text-slate-300 dark:text-slate-700">404</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
          Page not found
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <Button className="mt-4">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
