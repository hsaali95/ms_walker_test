import Teams from "@/db/models/teams";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for creating a group record
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    // Find the groups by IDs
    const teams = await Teams.findOne({
      where: {
        id: id,
      },
    });

    if (!teams) {
      return errorResponse(`No Team found with the provided ID`, 404);
    }

    await Teams.destroy({
      where: {
        id: id,
      },
    });

    return successResponse(teams, "Team deleted successfully");
  } catch (error: any) {
    console.error("Error creating team:", error);
    return errorResponse("Failed to create team", 500);
  }
}
