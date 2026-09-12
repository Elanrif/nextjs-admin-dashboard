import { z } from "zod";

const baseFields = {
  title: z
    .string()
    .trim()
    .min(1, "Le titre ne peut pas être vide")
    .max(200, "Le titre doit contenir au maximum 200 caractères"),
  description: z
    .string()
    .trim()
    .min(1, "La description ne peut pas être vide")
    .max(2000, "La description doit contenir au maximum 2000 caractères"),
  imageUrl: z
    .union([
      z
        .string()
        .trim()
        .url("URL de l'image invalide")
        .max(200, "L'URL doit contenir au maximum 200 caractères"),
      z.literal(""),
    ])
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
};

export const postCreateSchema = z.object({
  ...baseFields,
  authorId: z
    .number()
    .int()
    .positive({ message: "Un auteur doit être sélectionné" }),
});

export const postUpdateSchema = z.object(baseFields).partial();

export type PostCreateFormValues = z.input<typeof postCreateSchema>;
export type PostUpdateFormValues = z.input<typeof postUpdateSchema>;
