import AccessType from "@/db/models/access-type";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching all AccessTypes
export async function GET() {
  try {
    // Fetch all AccessType records
    const accessTypes = await AccessType.findAll();
    // Convert the results to plain objects
    const accessTypeList = accessTypes?.map((accessType) =>
      accessType.get({ plain: true })
    );
    return successResponse({ accessTypes: accessTypeList });
  } catch (error: any) {
    console.error("Error fetching AccessTypes:", error);
    return errorResponse("Failed to fetch AccessTypes", 500);
  }
}
