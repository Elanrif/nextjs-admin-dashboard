import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/users/api/services/user.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;

  const userId = Number.parseInt(id, 10);
  const response = await getUserById(userId);
  return NextResponse.json(response, { status: 200 });
}
