import { z } from "zod";
import { UserRole } from "../api/types";

/**
 * Base user schema — shared validation rules
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
export const userBaseSchema = z.object({
  avatarUrl: z.string().optional().default(""),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(200, "First name must be at most 200 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(200, "Last name must be at most 200 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(50, "Phone number must be at most 50 digits"),
  email: z
    .email({ message: "Invalid email address" })
    .max(255, "Email must be at most 255 characters"),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean().default(false),
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be at most 255 characters");

/**
 * Reset password schema with validation
 */
export const resetPasswordSchema = userBaseSchema
  .pick({
    email: true,
  })
  .extend({
    newPassword: passwordSchema,
    code: z.string().min(1, "Reset code is required"),
    resetToken: z.string().min(1, "Reset token is required"),
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export const parseResetPassword = resetPasswordSchema.safeParse;

/**
 * User creation schema with password confirmation validation
 */
export const userCreateSchema = userBaseSchema
  .extend({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type UserFormValues = z.infer<typeof userCreateSchema>;
export const parseUserApiCreate = userCreateSchema.safeParse;

/**
 * User update schema — all fields optional with password validation
 */
export const userUpdateSchema = userBaseSchema
  .partial()
  .extend({
    password: z.string().optional(), // ← Pas de passwordSchema
    confirmPassword: z.string().optional(), // ← Pas de passwordSchema
  })
  .refine(
    (data) => {
      // Si les deux champs sont vides ou undefined -> valide
      if (!data.password && !data.confirmPassword) {
        return true;
      }

      // Si un des deux est rempli mais pas l'autre -> invalide
      if (!data.password || !data.confirmPassword) {
        return false;
      }

      // Si les deux sont remplis, vérifier qu'ils correspondent
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords must match and be at least 8 characters",
      path: ["confirmPassword"],
    },
  );
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
export const parseUserApiUpdate = userUpdateSchema.safeParse;
