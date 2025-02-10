import Supplier from "@/db/models/supplier";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching all supplier records
export async function GET() {
  try {
    const suppliers = await Supplier.findAll();

    if (!suppliers || suppliers.length === 0) {
      return errorResponse("No suppliers found", 404);
    }

    return successResponse(suppliers);
  } catch (error: any) {
    console.error("Error fetching suppliers:", error);
    return errorResponse("Failed to fetch suppliers", 500);
  }
}
