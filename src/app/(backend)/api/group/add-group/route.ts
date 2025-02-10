import Group from "@/db/models/group";
import GroupMembers from "@/db/models/group-members";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for creating a group record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, access_type_id, is_active, users_list } = body;

    // Basic validation
    if (!name || typeof name !== "string") {
      return errorResponse("Missing or invalid required field: name", 400);
    }

    if (!access_type_id || typeof access_type_id !== "number") {
      return errorResponse(
        "Missing or invalid required field: access_type_id",
        400
      );
    }

    if (typeof is_active !== "boolean") {
      return errorResponse("Missing or invalid required field: is_active", 400);
    }

    // Check if the group name already exists
    const existingGroup = await Group.findOne({ where: { name } });
    if (existingGroup) {
      return errorResponse("A group with this name already exists", 409);
    }

    // Create a new group record
    const newGroup = await Group.create({
      name,
      access_type_id,
      is_active,
    });

    // Add group members against group ID
    if (newGroup) {
      for (let i = 0; i < users_list.length; i++) {
        const userIds = +users_list[i]?.id;
        await GroupMembers.create({
          group_id: +newGroup?.id,
          user_id: +userIds,
        });
      }
    }

    // Prepare response without sensitive or unnecessary fields
    const groupResponse = newGroup.get({ plain: true });

    return successResponse(
      {
        ...groupResponse,
      },
      "Group created successfully"
    );
  } catch (error: any) {
    console.error("Error creating group:", error);
    return errorResponse("Failed to create group", 500);
  }
}
