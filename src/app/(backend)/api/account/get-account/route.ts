import Account from "@/db/models/account";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching all accounts
export async function GET() {
  try {
    // Fetch all accounts
    const accounts = await Account.findAll({
      attributes: ["id", "fullCustomerInfo"],
    });

    return successResponse(accounts);
  } catch (error: any) {
    console.error("Error fetching accounts:", error);
    return errorResponse("Failed to fetch accounts", 500);
  }
}
