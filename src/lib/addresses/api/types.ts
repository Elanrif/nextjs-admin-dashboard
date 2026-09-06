import { PageResponse } from "@/lib/shared/types";

export interface Address {
  id: number;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  defaultAddress: boolean;
  userId: number;
}

export type AddressesResponse = PageResponse<Address>;

export type AddressFilters = {
  current?: number;
  limit?: number;
  isDefault?: boolean;
  userId?: number;
  country?: string;
  city?: string;
  search?: string;
  sort?: string;
};