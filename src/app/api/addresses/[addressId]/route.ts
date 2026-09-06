import { NextRequest, NextResponse } from "next/server";
import { getUserAddress } from "@/lib/addresses/api/services/address.server";


export const dynamic = "force-dynamic";

type Params = Promise<{ addressId: string }>;

export async function GET(_request: NextRequest, {params}: {params: Params}) {
  const {addressId} = await params;
  const id = Number.parseInt(addressId, 10);

  const response = await getUserAddress(id);
 
  return NextResponse.json(response, { status: 200 });
}