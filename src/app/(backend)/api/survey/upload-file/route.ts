import { errorResponse, successResponse } from "@/utils/response.decorator";
import client from "@/db/config/AWS";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET } from "@/utils/constant";
import File from "@/db/models/file";

export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export const POST = async (req: Request) => {
  try {
    // Parse incoming JSON data
    const { base64, file_name } = await req.json();

    // Validate file type (allow only images)
    const allowedImageTypes = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file_name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !allowedImageTypes.includes(fileExtension)) {
      return errorResponse(
        "Only image files (JPG, PNG,  WEBP) are allowed",
        400
      );
    }

    // Create a unique file name using the original file name
    const filePath = `${Date.now()}-${file_name}`;

    const buffer = Buffer.from(base64.split(",").pop(), "base64");

    await client.send(
      new PutObjectCommand({
        ACL: "public-read",
        Bucket: BUCKET,
        Key: "survey-images/" + filePath,
        Body: buffer,
      })
    );

    // Save the file information to the database
    const createdFile = await File.create({
      path: filePath,
      name: file_name,
    });

    return successResponse(
      {
        filePath: createdFile.path,
        id: createdFile.id,
      },
      "File uploaded successfully"
    );
  } catch (error: any) {
    console.error("Failed to upload:", error);
    return errorResponse(error.message || "Failed to upload", 500);
  }
};
