import { z } from "zod";

const postFields = {
  title: z
    .string()
    .trim()
    .min(3, "Le titre ne peut pas être vide")
    .max(200, "Le titre doit contenir au maximum 200 caractères"),
  description: z
    .string()
    .trim()
    .min(3, "La description ne peut pas être vide")
    .max(2000, "La description doit contenir au maximum 2000 caractères"),
  imageUrl: z
    .string()
    .trim()
    .max(200, "L'image doit contenir au maximum 200 caractères")
    .optional()
    .or(z.literal("")),
  authorId: z.number().int().positive().optional(),
};

export const postCreateSchema = z.object(postFields);
export const postUpdateSchema = postCreateSchema.partial();

export type PostCreateFormValues = z.input<typeof postCreateSchema>;
export type PostUpdateFormValues = z.input<typeof postUpdateSchema>;
