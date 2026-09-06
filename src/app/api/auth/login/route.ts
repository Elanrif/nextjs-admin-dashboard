import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/api/services/auth.server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email: string; password: string };
  const response = await signIn(body);

  return NextResponse.json(response, { status: 200 });
}
