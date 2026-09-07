import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/api/services/auth.server";
import { RegisterFormValues } from "@/lib/auth/schemas/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RegisterFormValues;
  const res = await signUp(body);

  return NextResponse.json(res, { status: 200 });
}
