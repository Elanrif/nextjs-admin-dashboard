import { NextRequest, NextResponse } from "next/server";
import { getUserAddresses } from "@/lib/addresses/api/services/address.server";
import { AddressFilters } from "@/lib/addresses/api/types";


export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {

    const sp =
    _request.nextUrl?.searchParams ?? new URL(_request.url).searchParams;
  const filters: AddressFilters = {
    current: sp.has("current") ? Number(sp.get("current")) : undefined,
    limit: sp.has("limit")
      ? Number(sp.get("limit"))
      : sp.has("perPage")
        ? Number(sp.get("perPage"))
        : undefined,
    userId: sp.has("userId") ? Number(sp.get("userId")) : undefined,
    country: sp.get("country") ?? undefined,
    city: sp.get("city") ?? undefined,
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  };

  const response = await getUserAddresses(filters);

  return NextResponse.json(response, { status: 200 });
}