import Users from "@/db/models/user";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { hashPassword } from "@/utils/helper";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST request for resetting user password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, newPassword } = body;

    // Basic validation
    if (!userId || !newPassword) {
      return errorResponse(
        "Missing required fields: userId or newPassword",
        400
      );
    }

    // Find the user by ID
    const user = await Users.findByPk(userId);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    await user.update({ password: hashedPassword, is_new: false });

    return successResponse(null, "Password reset successfully");
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return errorResponse("Failed to reset password", 500);
  }
}
