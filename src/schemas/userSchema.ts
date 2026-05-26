import { z } from 'zod';

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name is too long.'),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  role: z.enum(['admin', 'editor', 'user'], {
    errorMap: () => ({ message: 'Pick a role.' }),
  }),
  isActive: z.boolean(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type LoginValues = z.infer<typeof loginSchema>;
