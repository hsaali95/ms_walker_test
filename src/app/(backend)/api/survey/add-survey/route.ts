import Survey from "@/db/models/survey";
import SurveyFile from "@/db/models/survey-file";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(request: Request) {
  try {
    // Retrieve cookies from the request headers
    const cookieHeader = request.headers.get("cookie");
    let user: any | null = null;

    if (cookieHeader) {
      // Parse cookies to get the token
      const cookies = Object.fromEntries(
        cookieHeader.split("; ")?.map((cookie) => {
          const [key, value] = cookie.split("=");
          return [key, value];
        })
      );
      user = JSON.parse(decodeURIComponent(cookies["user"]));
    }

    // const userId: any = await JWTService.verifyAccessToken(token || "");
    const body = await request.json();
    const { surveyData } = body;

    // Ensure the request body is an array of objects
    if (!Array.isArray(surveyData)) {
      return errorResponse("Request body must be an array of objects", 400);
    }

    // Required fields for validation
    const requiredFields = [
      // "other_supplier",
      // "other_item",
      // "number_of_cases",
      // "display_coast",
      // "notes",
      // "account_id",
      "display_id",
      // "supplier_id",
      // "item_id",
    ];

    // Validate each object in the array
    for (const record of surveyData) {
      for (const field of requiredFields) {
        if (!record[field]) {
          return errorResponse(`Missing required field: ${field}`, 400);
        }
      }
    }

    let newSurveys;
    for (let j = 0; j < surveyData.length; j++) {
      newSurveys = await Survey.create(
        {
          ...surveyData[j],

          created_by: user?.id, //add sales ref id here
        },
        { returning: true }
      );

      const SurveyFileArray: any = [];
      for (let k = 0; k < surveyData[j].file_id.length; k++) {
        SurveyFileArray.push({
          survey_id: newSurveys.id,
          file_id: surveyData[j].file_id[k],
        });
      }

      if (newSurveys && SurveyFileArray.length) {
        await SurveyFile.bulkCreate(SurveyFileArray);
      }
    }

    return successResponse(
      {
        surveys: newSurveys,
      },
      "Surveys created successfully"
    );
  } catch (error: any) {
    console.error("Error creating surveys:", error);
    return errorResponse(error.message || "Failed to create surveys", 500);
  }
}
