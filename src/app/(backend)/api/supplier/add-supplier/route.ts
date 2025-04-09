import Supplier from "@/db/models/supplier";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const account = await Supplier.create(body);

    return NextResponse.json(
      { message: "Supplier created successfully", account },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Supplier:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
