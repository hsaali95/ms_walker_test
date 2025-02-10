import { errorResponse, successResponse } from "@/utils/response.decorator";
import { v4 as uuidv4 } from "uuid";
import Account from "@/db/models/account";
import supabase from "@/utils/supabase-client";
import Activity from "@/db/models/activity";
import { helper } from "@/utils/helper";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(request: Request) {
  try {
    const { ids } = await request.json(); // Parse the incoming JSON payload

    // Build the where clause if IDs are provided
    const whereClause = ids && ids.length > 0 ? { id: ids } : {};

    // Fetch survey data from your database, excluding unnecessary fields
    const data: any = await Activity.findAll({
      where: whereClause,
      attributes: [
        "id",
        "start_time",
        "end_time",
        "is_complete",
        "notes",
        "activity_log",
        "merch_rep_id",
        "created_at",
      ],
      include: [
        {
          model: Account,
          as: "activity_account",
          attributes: ["customerName", "city"],
        },
      ],
    });

    // Generate a unique filename
    const uniqueFileName = `activity_${uuidv4()}.csv`;

    // Prepare the CSV data as a string
    const csvHeader = [
      "ID,Date, Start Time,End Time,Merch Rep Id,Account Name,City,Activity Log,Complete,Geo Location,Notes,Number Of Cases",
    ];
    const csvRows = data?.map((row: any) => {
      return [
        row.id,
        helper.formatDate(row.created_at),
        helper.formatTime(row.start_time),
        helper.formatTime(row.end_time),
        row.merch_rep_id,
        row?.activity_account?.customerName,
        row?.activity_account?.city,
        row?.activity_log,
        row?.is_complete,
        row?.location,
        row?.notes,
        row?.number_of_cases || 0,
      ].join(",");
    });
    const csvContent = csvHeader.concat(csvRows).join("\n");

    // Upload the CSV file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("mas-walker-file")
      .upload(uniqueFileName, csvContent, {
        contentType: "text/csv",
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error("Failed to upload file to Supabase");
    }

    // Return success response with the public URL
    const { data: publicUrlData } = supabase.storage
      .from("mas-walker-file")
      .getPublicUrl(uniqueFileName);

    return successResponse(
      {
        filePath: publicUrlData.publicUrl,
        data,
      },
      "CSV file has been created and uploaded"
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return errorResponse("Failed to process request", 500);
  }
}
