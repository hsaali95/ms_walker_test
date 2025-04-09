import { Buffer } from "buffer";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import File from "@/db/models/file";
import supabase, { getContentType } from "@/utils/supabase-client";

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

    // Decode the base64 string to binary data
    const fileBuffer = Buffer.from(base64, "base64");
    const bucketName = "mas-walker-file";

    // Create a unique file name using the original file name
    const filePath = `${Date.now()}-${file_name}`;

    // Get content type dynamically
    const contentType = getContentType(fileExtension);

    // Upload the decoded file to Supabase storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: contentType,
      });

    if (error) {
      throw error;
    }

    // Generate a public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // Save the file information to the database
    const createdFile = await File.create({
      path: filePath,
      name: file_name,
    });

    return successResponse(
      {
        filePath: createdFile.path,
        id: createdFile.id,
        publicUrlData: publicUrlData?.publicUrl,
      },
      "File uploaded successfully"
    );
  } catch (error: any) {
    console.error("Failed to upload:", error);
    return errorResponse(error.message || "Failed to upload", 500);
  }
};
