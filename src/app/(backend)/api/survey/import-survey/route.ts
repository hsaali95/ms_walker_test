import { successResponse, errorResponse } from "@/utils/response.decorator";
import Survey from "@/db/models/survey";
import SurveyFile from "@/db/models/survey-file";
import File from "@/db/models/file";
// import supabase, { getContentType } from "@/utils/supabase-client";
import { transformSurvey } from "@/utils/transformer";
import { promises as fs } from "fs";
import Users from "@/db/models/user";
import { env } from "process";
import SurveyStatus from "@/db/models/survey-status";
import { uploadFile } from "@/utils/helper";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Initialize Supabase client using environment variables for security
const fileUpload = async (fileUrl: string) => {
  // Fetch the file from the external URL
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isImage = blob.type.startsWith("image/");
  if (isImage) {
    // const bucketName = process.env.SUPABASE_BUCKET_NAME!; // Replace with your actual Supabase bucket name from .env
    // const bucketName = "mas-walker-file";
    const file_name = fileUrl.split("/").pop();
    // Create a unique file name using the original file name
    const filePath = `${Date.now()}-${file_name}`;
    await uploadFile(filePath, buffer);
    // Dynamically determine content type based on file extension
    // const fileExtension = file_name!.split(".").pop()?.toLowerCase();
    // const contentType = getContentType(fileExtension);

    // Upload the decoded file to Supabase storage
    // const { error } = await supabase.storage
    //   .from(bucketName)
    //   .upload(filePath, blob, {
    //     cacheControl: "3600",
    //     upsert: false,
    //     contentType: contentType, // Dynamic content type
    //   });

    // if (error) {
    //   throw error;
    // }
    return { path: filePath, name: file_name };
  } else {
    return null;
  }
};

const createUser = async (email: string) => {
  const newUserData = {
    email: email,
    password: env.DEFAULT_PASSWORD,
    name: email.split("@")[0],
    image:
      "./files/survey-images/f083b530-f531-4e6b-8e5c-d6558874fb4a_Vector (11).png",
    role_id: 7,
    identifier: "",
    is_new: true,
  };

  const user = await Users.create(newUserData, { returning: true });
  return user;
};

export async function POST() {
  const insertedSurveyIds = [];
  try {
    let records = [];
    try {
      const file = await fs.readFile(
        process.cwd() + "/public/upload-json/ppc-portal-meta.json",
        "utf8"
      );
      records = JSON.parse(file);
    } catch {
      return errorResponse("Records is required", 404);
    }

    if (!records || !records?.length) {
      return errorResponse("Records must be array of objects", 400);
    }

    const baseUrl =
      "https://mswalker.cettiworks.net/Home/GetFullImage?imageId=";

    const [users, surveyStatus] = await Promise.all([
      Users.findAll({
        attributes: ["id", "email"],
      }),
      SurveyStatus.findAll({}),
    ]);

    for (let j = 0; j < records.length; j++) {
      const record = records[j];
      const images = record["Image:"].split(",");
      const filePromises = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let filePayload = null;
        if (record.id > 26295) {
          filePayload = await fileUpload(baseUrl + image);
        }
        // Save the file information to the database
        if (filePayload) {
          filePromises.push(File.create(filePayload));
        } else {
          filePromises.push({
            id: 434,
          });
        }
      }
      const userEmail = record.Username.toLowerCase();
      const user = users.find((user) => user.email.toLowerCase() === userEmail);

      const [files, surveyData, surveyUser] = await Promise.all([
        Promise.all(filePromises),
        transformSurvey(record, surveyStatus),
        user ? user : createUser(userEmail),
      ]);
      if (!user) {
        users.push(JSON.parse(JSON.stringify(surveyUser)));
      }
      // save the file
      const survey = await Survey.create(
        {
          ...surveyData,
          survey_file: files.map((file) => ({
            file_id: file.id,
          })),
          created_by: surveyUser.id, //add sales ref id here
        },
        { returning: true, include: [{ model: SurveyFile, as: "survey_file" }] }
      );

      insertedSurveyIds.push({
        surveyId: survey.id,
        recordId: record.id,
      });
      console.log("last Inserted id: ", record.id);
    }
    return successResponse(insertedSurveyIds, "Records has been imported");
  } catch (error) {
    console.log("============================================================");
    console.log(insertedSurveyIds);
    console.log("============================================================");
    console.error("Error processing request:", error);
    return errorResponse("Failed to process request", 500);
  }
}
