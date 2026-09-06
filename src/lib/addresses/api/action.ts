"use server";

import { revalidatePath } from "next/cache";

import {
  createUserAddress,
  deleteUserAddress,
  resetDefaultAddress,
  setDefaultAddress,
  updateAddress,
} from "./services/address.server";
import { Address } from "./types";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";
import { AddressCreateFormValues } from "../schemas/address";

export async function createUserAddressAction(
  payload: AddressCreateFormValues,
): Promise<Result<Address, ApiError>> {
  const result = await createUserAddress(payload);

  if (result.ok) {
    revalidatePath(`/dashboard/users/${payload.userId}`);
    revalidatePath(`/dashboard/users`);
  }

  return result;
}

export async function updateAddressAction(
  addressId: number,
  payload: Partial<AddressCreateFormValues>,
): Promise<Result<Address, ApiError>> {
  const result = await updateAddress(addressId, payload);

  if (result.ok) {
    revalidatePath(`/dashboard/users/${payload.userId}`);
    revalidatePath(`/dashboard/users`);
    // si tu affiches l'adresse dans une page user spécifique, ajoute aussi :
    // revalidatePath(`/dashboard/users/${userId}`) -> si tu passes userId
  }

  return result;
}

export async function setDefaultAddressAction(
  userId: number,
  addressId: number,
): Promise<Result<void, ApiError>> {
  const result = await setDefaultAddress(userId, addressId);

  if (result.ok) {
    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath(`/dashboard/users`);
  }

  return result;
}

export async function resetDefaultAddressAction(
  userId: number,
): Promise<Result<void, ApiError>> {
  const result = await resetDefaultAddress(userId);

  if (result.ok) {
    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath(`/dashboard/users`);
  }

  return result;
}

export async function deleteUserAddressAction(
  addressId: number,
): Promise<Result<void, ApiError>> {
  const result = await deleteUserAddress(addressId);

  if (result.ok) {
    revalidatePath(`/dashboard/users`);
  }

  return result;
}
