import Account from "@/db/models/account";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const account = await Account.create(body);

    return NextResponse.json(
      { message: "Account created successfully", account },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
