import { z } from "zod";

export const addressFiels = {
  street: z
    .string()
    .min(3, "Street must be at least 3 characters")
    .max(255, "Street must be at most 255 characters"),

  postalCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters")
    .max(20, "Postal code must be at most 20 characters"),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be at most 100 characters"),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters"),

  userId: z.number().int().positive("User ID must be a positive integer"),

  defaultAddress: z.boolean().default(false),
};

export const addressCreateSchema = z.object(addressFiels);
export const addressUpdateSchema = addressCreateSchema.partial();
export type AddressCreateFormValues = z.input<typeof addressCreateSchema>;
export type AddressUpdateFormValues = z.input<typeof addressUpdateSchema>;
