import AccessType from "@/db/models/access-type";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for creating a new AccessType
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    // Basic validation
    if (!name) {
      return errorResponse("Missing required field: name", 400);
    }

    // Check if the name already exists
    const existingAccessType = await AccessType.findOne({ where: { name } });
    if (existingAccessType) {
      return errorResponse("AccessType with this name already exists", 400);
    }

    // Create a new AccessType
    const newAccessType = await AccessType.create({ name });

    // Prepare the response
    const accessTypeResponse = newAccessType.get({ plain: true });

    return successResponse(
      { accessType: accessTypeResponse },
      "AccessType created successfully"
    );
  } catch (error: any) {
    console.error("Error creating AccessType:", error);
    return errorResponse("Failed to create AccessType", 500);
  }
}
