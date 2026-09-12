import { z } from "zod";
import { UserRole, UserStatus } from "../api/types";

// Doit rester identique à ProfileFields.phoneNumber() côté backend
const MOROCCAN_PHONE_REGEX =
  /^(?:(?:\+212|00212)\s?[5-7]\d{2}\s?\d{3}\s?\d{3}|0[5-7]\d{2}\s?\d{3}\s?\d{3})$/;

const coreFields = {
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(200, "First name must be at most 200 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(200, "Last name must be at most 200 characters"),
  phoneNumber: z
    .string()
    .trim()
    .regex(MOROCCAN_PHONE_REGEX, "Numéro de téléphone marocain invalide"),
  email: z
    .string()
    .trim()
    .min(1, "L'email est obligatoire")
    .email({ message: "Invalid email address" })
    .max(255, "Email must be at most 255 characters"),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
};

export const userBaseSchema = z.object(coreFields);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be at most 255 characters");

const optionalPasswordSchema = z
  .string()
  .optional()
  .transform((val) =>
    val === undefined || val.trim() === "" ? undefined : val,
  )
  .pipe(passwordSchema.optional());

function checkPasswordsMatch(
  data: { password?: string; confirmPassword?: string },
  ctx: z.RefinementCtx,
  requireBoth = true,
) {
  const hasPassword = !!data.password;
  const hasConfirm = !!data.confirmPassword;

  if (!hasPassword && !hasConfirm) return;

  if (requireBoth && hasPassword !== hasConfirm) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Both password fields are required",
    });
    return;
  }

  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
}

export const userCreateSchema = userBaseSchema
  .extend({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => checkPasswordsMatch(data, ctx, false));

export const userUpdateSchema = userBaseSchema
  .partial()
  .extend({
    avatarUrl: z
      .union([z.string().trim().url("URL d'avatar invalide"), z.literal("")])
      .nullable()
      .optional()
      .transform((val) => (val ? val : null)),
    password: optionalPasswordSchema,
    confirmPassword: optionalPasswordSchema,
  })
  .superRefine((data, ctx) => checkPasswordsMatch(data, ctx, true));

export type UserCreateFormValues = z.input<typeof userCreateSchema>;
export type UserUpdateFormValues = z.input<typeof userUpdateSchema>;
