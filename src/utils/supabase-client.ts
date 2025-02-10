import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default supabase;
export const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME;
export const getContentType = (fileExtension: string | undefined): string => {
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
