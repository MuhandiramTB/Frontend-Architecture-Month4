import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { userFormSchema, type UserFormValues } from '@/schemas/userSchema';
import type { User } from '@/types';

export interface UserFormProps {
  initial?: Partial<User>;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
}

export function UserForm({ initial, submitting, serverError, onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
      role: (initial?.role as UserFormValues['role']) ?? 'user',
      isActive: initial?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        name: initial.name ?? '',
        email: initial.email ?? '',
        role: (initial.role as UserFormValues['role']) ?? 'user',
        isActive: initial.isActive ?? true,
      });
    }
  }, [initial, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
    >
      {serverError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {serverError}
        </div>
      )}
      <Input
        label="Full name"
        autoComplete="name"
        required
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register('email')}
      />
      <Select
        label="Role"
        required
        options={[
          { value: 'admin',  label: 'Admin'  },
          { value: 'editor', label: 'Editor' },
          { value: 'user',   label: 'User'   },
        ]}
        error={errors.role?.message}
        {...register('role')}
      />
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          {...register('isActive')}
        />
        Active account
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} disabled={!isDirty && !!initial}>
          {initial?.id ? 'Save changes' : 'Create user'}
        </Button>
      </div>
    </form>
  );
}
