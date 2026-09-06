import { z } from "zod";

const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(2000, "Le commentaire doit contenir au maximum 2000 caractères"),
  postId: z.number().int().positive("Veuillez sélectionner un post"),
  authorId: z.number().int().positive("Veuillez sélectionner un auteur"),
});

export const commentCreateSchema = commentSchema;
export type CommentFormValues = z.infer<typeof commentCreateSchema>;
export const parseCommentCreate =
  commentCreateSchema.safeParse.bind(commentCreateSchema);

export const commentUpdateSchema = commentCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être mis à jour",
  });
export type CommentUpdateFormValues = z.infer<typeof commentUpdateSchema>;
export const parseCommentUpdate =
  commentUpdateSchema.safeParse.bind(commentUpdateSchema);
