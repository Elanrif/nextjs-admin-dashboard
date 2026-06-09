import { z } from "zod";

/**
 * Post form schema - only client-side form fields
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
export const postCreateSchema = z.object({
  title: z.string().min(1, "Le titre ne peut pas être vide"),
  imageUrl: z.string().url("L'URL de l'image est invalide"),
  description: z.string().min(1, "La description ne peut pas être vide"),
});

export type PostFormValues = z.infer<typeof postCreateSchema>;
export const parsePostCreate =
  postCreateSchema.safeParse.bind(postCreateSchema);

export const postUpdateSchema = postCreateSchema.partial();
export type PostUpdateFormValues = z.infer<typeof postUpdateSchema>;
export const parsePostUpdate = postUpdateSchema.safeParse;

/**
 * Post API schema - includes all required fields for API
 * Used for server-side validation
 */
export const postApiSchema = z.object({
  title: z.string().min(1, "Le titre ne peut pas être vide"),
  imageUrl: z.string().url("L'URL de l'image est invalide"),
  description: z.string().min(1, "La description ne peut pas être vide"),
  authorId: z.number().int().min(1, "L'auteur est requis"),
});

export type PostApiValues = z.infer<typeof postApiSchema>;
export const parsePostApiCreate = postApiSchema.safeParse.bind(postApiSchema);

export const postApiUpdateSchema = postApiSchema.partial();
export type PostApiUpdateValues = z.infer<typeof postApiUpdateSchema>;
export const parsePostApiUpdate =
  postApiUpdateSchema.safeParse.bind(postApiUpdateSchema);
