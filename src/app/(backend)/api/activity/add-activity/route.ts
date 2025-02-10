import Activity from "@/db/models/activity";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for activity creation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      start_time,
      end_time,
      is_complete,
      account_id,
      activity_log,
      notes,
      merch_rep_id,
    } = body;

    // Basic validation
    if (
      !start_time ||
      !end_time ||
      is_complete === undefined ||
      !account_id ||
      !activity_log ||
      !notes ||
      !merch_rep_id
    ) {
      return errorResponse(
        "Missing required fields: start_time, end_time, is_complete, account_id, activity_log, or notes",
        400
      );
    }

    // Create a new activity
    const newActivity = await Activity.create({
      start_time,
      end_time,
      is_complete,
      account_id,
      activity_log,
      notes,
      merch_rep_id,
    });

    // Prepare response without sensitive or unnecessary fields
    const activityResponse = newActivity.get({ plain: true });

    return successResponse(
      {
        ...activityResponse,
      },
      "Activity created successfully"
    );
  } catch (error: any) {
    console.error("Error creating activity:", error);
    return errorResponse("Failed to create activity", 500);
  }
}
