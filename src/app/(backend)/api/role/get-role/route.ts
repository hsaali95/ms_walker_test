import Role from "@/db/models/role";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function GET() {
  try {
    // Fetch all roles from the database
    const roles = await Role.findAll({
      attributes: ["id", "name"], // Adjust attributes as necessary
    });

    // Format roles data
    const formattedRoles = roles?.map((role) => role.get({ plain: true }));

    return successResponse({
      roles: formattedRoles,
    });
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    return errorResponse(error.message || "Failed to fetch roles", 500);
  }
}
