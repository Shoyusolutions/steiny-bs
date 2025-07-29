import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Remove the auth cookie
  cookies().delete("subscription-auth");
  
  return NextResponse.json({ success: true });
}