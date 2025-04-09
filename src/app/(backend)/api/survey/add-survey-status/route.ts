import SurveyStatus from "@/db/models/survey-status";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ensure the request body contains the required "status" field
    if (!body.status) {
      return errorResponse("Missing required field: status", 400);
    }

    // Create a new survey status record
    const newStatus = await SurveyStatus.create(body);

    // Format the response to exclude sensitive or unnecessary fields
    const statusResponse = newStatus.get({ plain: true });

    return successResponse(
      {
        surveyStatus: statusResponse,
      },
      "Survey status created successfully"
    );
  } catch (error: any) {
    console.error("Error creating survey status:", error);
    return errorResponse(
      error.message || "Failed to create survey status",
      500
    );
  }
}
