import { z } from 'zod';

// Artwork schemas
export const CreateArtworkSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  medium: z.string().min(3),
  yearCreated: z.number().int().min(1900).max(new Date().getFullYear()),
  coverImage: z.string().url(),
  featuredPriority: z.number().int().min(0).max(3).default(0),
  tagIds: z.array(z.string()).optional().default([]),
});

export const UpdateArtworkSchema = CreateArtworkSchema.partial();

export const ArtworkEntrySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  displayOrder: z.number().int().min(1),
});

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type exports
export type CreateArtworkInput = z.infer<typeof CreateArtworkSchema>;
export type UpdateArtworkInput = z.infer<typeof UpdateArtworkSchema>;
export type ArtworkEntryInput = z.infer<typeof ArtworkEntrySchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
