import Display from "@/db/models/display";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests to fetch all display records
export async function GET() {
  try {
    // Fetch all displays from the database
    const displays = await Display.findAll();

    // Check if any displays are found
    if (displays.length === 0) {
      return errorResponse("No displays found", 404);
    }

    return successResponse(displays);
  } catch (error: any) {
    console.error("Error fetching displays:", error);
    return errorResponse("Failed to fetch displays", 500);
  }
}
