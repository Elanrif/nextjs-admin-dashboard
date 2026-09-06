import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/api/services/auth.server";
import { UserCreateFormValues } from "@/lib/users/schemas/user";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as UserCreateFormValues;
  const res = await signUp(body);

  return NextResponse.json(res, { status: 200 });
}
