import Users from "@/db/models/user"; // Ensure the path to the user model is correct
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request
// Handle GET requests for fetching all users with role_id = 3 (non-paginated)
export async function GET() {
  try {
    // Fetch all users with role_id = 3
    const data = await Users.findAll({
      attributes: ["id", "email","name"],
      where: {
        role_id: 3,
      },
    });

    return successResponse(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}
