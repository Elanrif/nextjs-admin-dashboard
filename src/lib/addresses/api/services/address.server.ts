"use server";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import { Address, AddressesResponse, AddressFilters } from "../types";
import {
  addressCreateSchema,
  AddressFormValues,
  AddressUpdateFormValues,
  addressUpdateSchema,
} from "../../schemas/address";
import { Result } from "@/lib/shared/types";
import { ApiError, fromZodError } from "@/lib/shared/api-error";
import { checkValidId } from "@/utils";

const logger = getLogger("server");

const {
  api: {
    rest: {
      endpoints: { addresses: addressesUrl },
    },
  },
} = environment;

export async function getUserAddresses(
  filters: AddressFilters = {},
): Promise<Result<AddressesResponse, ApiError>> {
  try {
    const response = await apiClient(true).get<AddressesResponse>(addressesUrl, {
      params: filters,
    });

    logger.debug({ count: response.data.total }, "User addresses fetched");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "getUserAddresses"),
    };
  }
}

export async function getDefaultUserAddress(
  userId: number,
): Promise<Result<Address, ApiError>> {
  const idCheck = checkValidId(userId);
  if (idCheck) return idCheck;

  try {
    const response = await apiClient(true).get<Address>(
      `${addressesUrl}/user/${userId}/default`,
    );

    logger.info(
      { userId, addressId: response.data.id },
      "Default address fetched",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "getDefaultUserAddress"),
    };
  }
}

export async function getUserAddress(
  addressId: number,
): Promise<Result<Address, ApiError>> {
  const idCheck = checkValidId(addressId);
  if (idCheck) return idCheck;

  try {
    const response = await apiClient(true).get<Address>(
      `${addressesUrl}/${addressId}`,
    );

    logger.info({ addressId: response.data.id }, "Address fetched");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "getUserAddress"),
    };
  }
}

export async function createUserAddress(
  payload: AddressFormValues,
): Promise<Result<Address, ApiError>> {
  const parse = addressCreateSchema.safeParse(payload);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "Address creation"),
    };
  }

  try {
    const response = await apiClient(true).post<Address>(addressesUrl, parse.data);

    logger.info(
      { addressId: response.data.id },
      "Address created successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "createUserAddress"),
    };
  }
}

export async function updateAddress(
  addressId: number,
  payload: AddressUpdateFormValues,
): Promise<Result<Address, ApiError>> {
  const idCheck = checkValidId(addressId);
  if (idCheck) return idCheck;

  const parse = addressUpdateSchema.safeParse(payload);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "Address update"),
    };
  }

  try {
    const response = await apiClient(true).patch<Address>(
      `${addressesUrl}/${addressId}`,
      parse.data,
    );

    logger.info(
      { addressId: response.data.id },
      "Address updated successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "updateAddress"),
    };
  }
}

export async function deleteUserAddress(
  addressId: number,
): Promise<Result<void, ApiError>> {
  const idCheck = checkValidId(addressId);
  if (idCheck) return idCheck;

  try {
    await apiClient(true).delete(`${addressesUrl}/${addressId}`);
    logger.debug({ addressId }, "Address deleted");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "deleteUserAddress"),
    };
  }
}

export async function setDefaultAddress(
  userId: number,
  addressId: number,
): Promise<Result<void, ApiError>> {
  const userError = checkValidId(userId);
  if (userError) return userError;

  const addressError = checkValidId(addressId);
  if (addressError) return addressError;

  try {
    await apiClient(true).post(
      `${addressesUrl}/user/${userId}/default/${addressId}`,
    );

    logger.debug({ userId, addressId }, "Default address updated");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "setDefaultAddress"),
    };
  }
}

export async function resetDefaultAddress(
  userId: number,
): Promise<Result<void, ApiError>> {
  const idCheck = checkValidId(userId);
  if (idCheck) return idCheck;

  try {
    await apiClient(true).post(`${addressesUrl}/user/${userId}/default`);

    logger.debug({ userId }, "Default address reset");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "resetDefaultAddress"),
    };
  }
}
