// import Survey from "@/db/models/survey";
// import { errorResponse, successResponse } from "@/utils/response.decorator";

// export async function DELETE(request: Request) {
//   try {
//     const body = await request.json();

//     // Validate request body
//     const { id } = body;

//     if (!id) {
//       return errorResponse("Survey ID is required", 400);
//     }

//     // Find the survey by ID
//     const survey = await Survey.findByPk(id);

//     if (!survey) {
//       return errorResponse(`Survey with ID ${id} not found`, 404);
//     }

//     // Delete the survey
//     await survey.destroy();

//     return successResponse({}, "Survey deleted successfully");
//   } catch (error: any) {
//     console.error("Error deleting survey:", error);
//     return errorResponse(error.message || "Failed to delete survey", 500);
//   }
// }


import Survey from "@/db/models/survey";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const { id } = body;

    if (!id || !Array.isArray(id)) {
      return errorResponse("An array of Survey IDs is required", 400);
    }

    // Find the surveys by IDs
    const surveys = await Survey.findAll({
      where: {
        id: id,
      },
    });

    if (surveys.length === 0) {
      return errorResponse(`No surveys found with the provided IDs`, 404);
    }

    // Delete the surveys
    await Survey.destroy({
      where: {
        id: id,
      },
    });

    return successResponse({}, "Surveys deleted successfully");
  } catch (error: any) {
    console.error("Error deleting surveys:", error);
    return errorResponse(error.message || "Failed to delete surveys", 500);
  }
}

