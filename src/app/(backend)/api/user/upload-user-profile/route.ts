import { Buffer } from "buffer";
import { createClient } from "@supabase/supabase-js";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Initialize Supabase client using environment variables for security
const supabase = createClient(
  "https://adteqwnkqoxbzkxyfzkq.supabase.co", // Should be in .env file
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdGVxd25rcW94YnpreHlmemtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODc2MTYsImV4cCI6MjA1Mjk2MzYxNn0.iipVN56Kilii7MKbDYo9KxQDTiB_HhbK2PfLgvA6cyM" // Should be in .env file
);

export const POST = async (req: Request) => {
  try {
    // Parse incoming JSON data
    const { base64, file_name } = await req.json();
    // Validate file type (allow only images)
    const allowedImageTypes = ["jpg", "jpeg", "png", "webp"];
    const fileExtensions = file_name.split(".").pop()?.toLowerCase();

    if (!fileExtensions || !allowedImageTypes.includes(fileExtensions)) {
      return errorResponse(
        "Only image files (JPG, PNG,  WEBP) are allowed",
        400
      );
    }
    // Decode the base64 string to binary data
    const fileBuffer = Buffer.from(base64, "base64");
    // const bucketName = process.env.SUPABASE_BUCKET_NAME!; // Replace with your actual Supabase bucket name from .env
    const bucketName = "mas-walker-file";

    // Create a unique file name using the original file name
    const filePath = `${Date.now()}-${file_name}`;

    // Dynamically determine content type based on file extension
    const fileExtension = file_name.split(".").pop()?.toLowerCase();
    const contentType = getContentType(fileExtension);

    // Upload the decoded file to Supabase storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: contentType, // Dynamic content type
      });

    if (error) {
      throw error;
    }

    // Generate a public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return successResponse(
      {
        filePath,
        publicUrlData: publicUrlData?.publicUrl,
      },
      "File uploaded successfully"
    );
  } catch (error: any) {
    console.error("Failed to uploaded:", error);
    return errorResponse(error.message || "Failed to uploaded", 500);
  }
};

// Helper function to determine content type based on file extension
const getContentType = (fileExtension: string | undefined): string => {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    pdf: "application/pdf",
    mp4: "video/mp4",
    mp3: "audio/mp3",
    txt: "text/plain",
    // Add more file types if needed
  };

  return mimeTypes[fileExtension ?? ""] || "application/octet-stream"; // Default to binary stream if type is unknown
};
