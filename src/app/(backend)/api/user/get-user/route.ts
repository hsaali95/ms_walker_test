import Users from "@/db/models/user"; // Ensure the path to the user model is correct
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching all users (non-paginated)
export async function GET() {
  try {
    // Fetch all users
    const data = await Users.findAll({
      where: {
        role_id: 2, // agent is sale ref and BE id is 2
      },
      attributes: ["id", "email", "name", "fullNameWithEmail"],
    });

    return successResponse(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}
