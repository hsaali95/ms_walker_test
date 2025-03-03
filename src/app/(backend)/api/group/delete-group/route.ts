import Group from "@/db/models/group";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for creating a group record
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    // Find the groups by IDs
    const group = await Group.findOne({
      where: {
        id: id,
      },
    });

    if (!group) {
      return errorResponse(`No group found with the provided ID`, 404);
    }

    await Group.destroy({
      where: {
        id: id,
      },
    });

    return successResponse(group, "Group deleted successfully");
  } catch (error: any) {
    console.error("Error creating group:", error);
    return errorResponse("Failed to create group", 500);
  }
}
