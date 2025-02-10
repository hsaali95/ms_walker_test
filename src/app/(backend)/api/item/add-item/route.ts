import Item from "@/db/models/item";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const item = await Item.create(body);

    return NextResponse.json(
      { message: "item created successfully", item },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
