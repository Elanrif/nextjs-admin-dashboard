import { z } from "zod";

const commentBaseFields = {
  content: z
    .string()
    .trim()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(2000, "Le commentaire doit contenir au maximum 2000 caractères"),
};

export const commentCreateSchema = z.object({
  ...commentBaseFields,
  postId: z.number().int().positive("Veuillez sélectionner un post"),
  authorId: z.number().int().positive("Veuillez sélectionner un auteur"),
});

export const commentUpdateSchema = z.object(commentBaseFields).partial();

export type CommentFormValues = z.infer<typeof commentCreateSchema>;
export type CommentUpdateFormValues = z.infer<typeof commentUpdateSchema>;
