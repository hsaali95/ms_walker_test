import Item from "@/db/models/item";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching item records by supplier_id
export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    const supplierId = url.searchParams.get("supplier_id");

    if (!supplierId) {
      return errorResponse("Supplier ID is required", 400);
    }

    const items = await Item.findAll({
      where: {
        supplier_id: supplierId,
      },
    });

    if (!items || items.length === 0) {
      return errorResponse("No items found for the given supplier", 404);
    }

    return successResponse(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    return errorResponse("Failed to fetch items", 500);
  }
}
