import Account from "@/db/models/account";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching account by ID
export async function GET(request: Request) {
  try {
    // Extract the account ID from the URL parameters
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Assuming the ID is in the URL path

    if (!id) {
      return errorResponse("Account ID is required", 400);
    }

    // Fetch the account by ID
    const account = await Account.findOne({
      where: { id },
      attributes: ["id", "custNumber", "city"],
    });

    if (!account) {
      return errorResponse("Account not found", 404);
    }

    // Return the account data
    const accountResponse = account.get({ plain: true });

    return successResponse(accountResponse);
  } catch (error: any) {
    console.error("Error fetching account:", error);
    return errorResponse("Failed to fetch account", 500);
  }
}
