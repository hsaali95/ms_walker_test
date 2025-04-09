// import Survey from "@/db/models/survey";
// import { errorResponse, successResponse } from "@/utils/response.decorator";

// export async function PATCH(request: Request) {
//   try {
//     const body = await request.json();

//     // Validate request body
//     const { id, survey_status_id } = body;

//     if (!id) {
//       return errorResponse("Survey ID is required", 400);
//     }

//     if (!survey_status_id) {
//       return errorResponse("survey_status_id is required", 400);
//     }

//     // Find the survey by ID
//     const survey = await Survey.findByPk(id);

//     if (!survey) {
//       return errorResponse(`Survey with ID ${id} not found`, 404);
//     }

//     // Update the survey_status_id
//     survey.survey_status_id = survey_status_id;
//     await survey.save();

//     return successResponse(
//       { survey: survey.get({ plain: true }) },
//       "Survey status updated successfully"
//     );
//   } catch (error: any) {
//     console.error("Error updating survey status:", error);
//     return errorResponse(
//       error.message || "Failed to update survey status",
//       500
//     );
//   }
// }

import Survey from "@/db/models/survey";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const { ids, survey_status_id } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse(
        "Survey IDs are required and should be an array",
        400
      );
    }

    if (!survey_status_id) {
      return errorResponse("survey_status_id is required", 400);
    }

    // Initialize an array to store updated surveys
    const updatedSurveys = [];

    // Loop through each ID and update the corresponding survey
    for (const id of ids) {
      if (!id) {
        return errorResponse("Each ID in 'ids' must be a valid number", 400);
      }

      // Find the survey by ID
      const survey = await Survey.findByPk(id);

      if (!survey) {
        return errorResponse(`Survey with ID ${id} not found`, 404);
      }

      // Update the survey_status_id
      survey.survey_status_id = survey_status_id;
      await survey.save();

      // Push the updated survey into the array
      updatedSurveys.push(survey.get({ plain: true }));
    }

    return successResponse(
      { surveys: updatedSurveys },
      "Survey status updated successfully"
    );
  } catch (error: any) {
    console.error("Error updating survey statuses:", error);
    return errorResponse(
      error.message || "Failed to update survey statuses",
      500
    );
  }
}
