import Display from "@/db/models/display";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for creating a display record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { display_type } = body;

    // Basic validation
    if (!display_type) {
      return errorResponse("Missing required field: display_type", 400);
    }

    // Create a new display record
    const newDisplay = await Display.create({
      display_type,
    });

    // Prepare response without sensitive or unnecessary fields
    const displayResponse = newDisplay.get({ plain: true });

    return successResponse(
      {
        ...displayResponse,
      },
      "Display created successfully"
    );
  } catch (error: any) {
    console.error("Error creating display:", error);
    return errorResponse("Failed to create display", 500);
  }
}
