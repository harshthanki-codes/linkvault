import { z } from 'zod'

export const handleSchema = z
  .string()
  .min(3, 'Must be at least 3 characters')
  .max(24, 'Must be at most 24 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')

export const bookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title too long'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().max(280, 'Description too long').optional().or(z.literal('')),
  is_public: z.boolean().default(false),
})

export const profileSchema = z.object({
  handle: handleSchema,
  display_name: z.string().max(60, 'Name too long').optional().or(z.literal('')),
  bio: z.string().max(160, 'Bio too long').optional().or(z.literal('')),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = loginSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type BookmarkInput = z.infer<typeof bookmarkSchema>
export type ProfileInput = z.infer<typeof profileSchema>
