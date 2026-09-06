// ============================================================================
// CORE ENTITIES
// ============================================================================

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

// ============================================================================
// REQUEST & RESPONSE TYPES
// ============================================================================

export type AddressesResponse = PageResponse<Address>;

/*
 * These filters are used within a parent resource that has its own pagination.
 * Different parameter names prevent searchParams from conflicting or mixing.
 */
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