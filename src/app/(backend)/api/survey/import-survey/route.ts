import { successResponse, errorResponse } from "@/utils/response.decorator";
import Survey from "@/db/models/survey";
import SurveyFile from "@/db/models/survey-file";
import File from "@/db/models/file";
import { createClient } from "@supabase/supabase-js";

import { getContentType } from "@/utils/supabase-client";
import { transformSurvey } from "@/utils/transformer";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Initialize Supabase client using environment variables for security
const supabase = createClient(
  "https://adteqwnkqoxbzkxyfzkq.supabase.co", // Should be in .env file
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdGVxd25rcW94YnpreHlmemtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODc2MTYsImV4cCI6MjA1Mjk2MzYxNn0.iipVN56Kilii7MKbDYo9KxQDTiB_HhbK2PfLgvA6cyM" // Should be in .env file
);
const fileUpload = async (fileUrl: string) => {
  // Fetch the file from the external URL
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  // const bucketName = process.env.SUPABASE_BUCKET_NAME!; // Replace with your actual Supabase bucket name from .env
  const bucketName = "mas-walker-file";
  const file_name = fileUrl.split("/").pop();
  // Create a unique file name using the original file name
  const filePath = `${Date.now()}-${file_name}`;

  // Dynamically determine content type based on file extension
  const fileExtension = file_name!.split(".").pop()?.toLowerCase();
  const contentType = getContentType(fileExtension);

  // Upload the decoded file to Supabase storage
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, blob, {
      cacheControl: "3600",
      upsert: false,
      contentType: contentType, // Dynamic content type
    });

  if (error) {
    throw error;
  }

  return { path: filePath, name: file_name };
};

export async function POST(request: Request) {
  try {
    let records = [];
    let insertedSurveyIds = [];
    try {
      records = await request.json();
    } catch (e) {
      return errorResponse("Records is required", 404);
    }

    if (!records || !records?.length) {
      return errorResponse("Records must be array of objects", 400);
    }

    const baseUrl =
      "https://mswalker.cettiworks.net/Home/GetFullImage?imageId=";

    for (let j = 0; j < records.length; j++) {
      const record = records[j];
      const images = record["Image:"].split(",");
      const filePromises = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const filePayload = await fileUpload(baseUrl + image);
        // Save the file information to the database
        filePromises.push(File.create(filePayload));
      }

      const [files, surveyData] = await Promise.all([
        Promise.all(filePromises),
        transformSurvey(record),
      ]);

      // save the file
      const survey = await Survey.create(
        {
          ...surveyData,
          survey_file: files.map((file) => ({
            file_id: file.id,
          })),
          created_by: 48, //add sales ref id here
        },
        { returning: true, include: [{ model: SurveyFile, as: "survey_file" }] }
      );
      insertedSurveyIds.push(survey.id);
    }
    return successResponse(insertedSurveyIds, "Records has been imported");
  } catch (error) {
    console.error("Error processing request:", error);
    return errorResponse("Failed to process request", 500);
  }
}
