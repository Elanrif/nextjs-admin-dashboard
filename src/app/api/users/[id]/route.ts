import { NextRequest } from "next/server";
import { getUserById } from "@/lib/users/api/services/user.server";
import { resultResponse } from "@/lib/shared/api-response";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;

  const userId = Number.parseInt(id, 10);
  const response = await getUserById(userId);
  return resultResponse(response);
}
