import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { useAuthStore } from '@/stores/authStore';
import { loginSchema, type LoginValues } from '@/schemas/userSchema';
import { toast } from '@/stores/toastStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const isLoading = useAuthStore((s) => s.isLoading);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  async function onSubmit(values: LoginValues) {
    try {
      await login(values);
      toast.success('Signed in', `Welcome back, ${values.email}`);
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch {
      // Error already in store; toast surfaces below.
    }
  }

  function fillDemo() {
    setValue('email', 'thilan@bistecglobal.com');
    setValue('password', 'admin1234');
    clearError();
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AdminFlow</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to your admin dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {error && (
            <Alert level="error" title="Sign-in failed" onDismiss={clearError}>
              {error}
            </Alert>
          )}

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" loading={isLoading} fullWidth>
            Sign in
          </Button>

          <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <p className="mb-2 font-semibold">Demo credentials</p>
            <p>Email: <code>thilan@bistecglobal.com</code></p>
            <p>Password: <code>admin1234</code></p>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-2 text-brand-600 hover:underline dark:text-brand-300"
            >
              Fill demo credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
