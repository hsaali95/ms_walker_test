import AccessType from "@/db/models/access-type";
import Group from "@/db/models/group";
import GroupMembers from "@/db/models/group-members";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching paginated groups
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    // Pagination parameters
    const page = Number(searchParams.get("page")) || 1;
    const recordsPerPage = Number(searchParams.get("recordsPerPage")) || 10;
    const offset = (page - 1) * recordsPerPage;

    // Fetch groups with pagination
    const data = await Group.findAndCountAll({
      limit: recordsPerPage,
      offset,
      include: [
        {
          model: AccessType,
          as: "access_type",
        },
        {
          model: GroupMembers,
          as: "group_members",
          attributes: ["id", "group_id", "user_id"],
          separate: true,
        },
      ],
      order: [["id", "desc"]],
    });

    return successResponse(data);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return errorResponse("Failed to fetch groups", 500);
  }
}
