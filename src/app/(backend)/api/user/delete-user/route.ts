import Users from "@/db/models/user";
import { errorResponse, successResponse } from "@/utils/response.decorator";

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return errorResponse("User ID is required", 400);
    }

    const user = await Users.findByPk(userId);

    if (!user) {
      return errorResponse("User not found", 404);
    }

    await user.destroy();

    return successResponse(user, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return errorResponse("Internal server error", 500);
  }
}
