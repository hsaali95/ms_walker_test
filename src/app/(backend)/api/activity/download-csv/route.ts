import { errorResponse } from "@/utils/response.decorator";
import Account from "@/db/models/account";
import Activity from "@/db/models/activity";
import { helper } from "@/utils/helper";
import { Op } from "sequelize";
import moment from "moment";
import { Readable } from "stream";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request
async function* generateData(queryOptions: any) {
  let index = 0;
  let data: Activity[] = [];
  // Prepare the CSV data as a string
  const csvHeader = [
    "ID,Date, Start Time,End Time,Merch Rep Id,Account Name,City,Activity Log,Complete,Geo Location,Notes,Number Of Cases",
  ];
  const limit = 100;
  while (true) {
    const offset = index * limit;
    // Fetch survey data from your database, excluding unnecessary fields
    data = await Activity.findAll({
      where: queryOptions,
      attributes: [
        "id",
        "start_time",
        "end_time",
        "is_complete",
        "notes",
        "activity_log",
        "merch_rep_id",
        "date",
      ],
      include: [
        {
          model: Account,
          as: "activity_account",
          attributes: ["customerName", "city"],
        },
      ],
      limit: limit,
      offset: offset,
    });
    const csvRows = data?.map((row: any, ind) => {
      return [
        helper.wrapInQuotes(`${offset + (ind + 1)}`),
        helper.wrapInQuotes(helper.formatDate(row.date)),
        helper.wrapInQuotes(helper.formatTime(row.start_time)),
        helper.wrapInQuotes(helper.formatTime(row.end_time)),
        helper.wrapInQuotes(row.merch_rep_id),
        helper.wrapInQuotes(row?.activity_account?.customerName),
        helper.wrapInQuotes(row?.activity_account?.city),
        helper.wrapInQuotes(row?.activity_log),
        helper.wrapInQuotes(row?.is_complete),
        helper.wrapInQuotes(row?.location),
        helper.wrapInQuotes(row?.notes),
        helper.wrapInQuotes(row?.number_of_cases || 0),
      ].join(",");
    });
    const csvContent =
      index == 0
        ? csvHeader.concat(csvRows).join("\n")
        : "\n" + csvRows.join("\n");
    index++;
    if (data.length == 0) break;
    yield csvContent; // Send data in chunks
  }
}
export async function POST(request: Request) {
  try {
    const { ids, startDate, endDate, searchQuery } = await request.json();

    // Build the where clause if IDs are provided
    const queryOptions: any = [];
    if (ids && ids.length > 0) {
      queryOptions.push({
        id: {
          [Op.in]: ids,
        },
      });
    }
    if (startDate && endDate) {
      queryOptions.push({
        date: {
          [Op.between]: [
            moment(startDate, "DD/MM/YYYY").startOf("day").toISOString(),
            moment(endDate, "DD/MM/YYYY").endOf("day").toISOString(),
          ],
        },
      });
    } else if (startDate) {
      queryOptions.push({
        date: {
          [Op.between]: [
            moment(startDate, "DD/MM/YYYY").startOf("day").toISOString(),
            moment().endOf("day").toISOString(),
          ],
        },
      });
    }
    if (searchQuery) {
      const isNumeric = !isNaN(Number(searchQuery));

      queryOptions.push({
        [Op.or]: [
          ...(isNumeric
            ? [
                {
                  id: Number(searchQuery), // Exact match for integer ID
                },
              ]
            : []),
          {
            activity_log: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            notes: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            merch_rep_id: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$activity_account.CUSTOMER NAME$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$activity_account.CITY$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
        ],
      });
    }

    const stream = Readable.from(generateData(queryOptions)); // Convert generator to stream

    // Set response headers for streaming the PDF
    return new Response(stream as any, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'inline; filename="export.csv"',
      },
    });

    // stream.pipe(res); // Stream the response

    // // Generate a unique filename
    // const uniqueFileName = `activity_${uuidv4()}.csv`;

    // // Prepare the CSV data as a string
    // const csvHeader = [
    //   "ID,Date, Start Time,End Time,Merch Rep Id,Account Name,City,Activity Log,Complete,Geo Location,Notes,Number Of Cases",
    // ];
    // const csvRows = data?.map((row: any, index: number) => {
    //   return [
    //     helper.wrapInQuotes(`${index + 1}`),
    //     helper.wrapInQuotes(helper.formatDate(row.date)),
    //     helper.wrapInQuotes(helper.formatTime(row.start_time)),
    //     helper.wrapInQuotes(helper.formatTime(row.end_time)),
    //     helper.wrapInQuotes(row.merch_rep_id),
    //     helper.wrapInQuotes(row?.activity_account?.customerName),
    //     helper.wrapInQuotes(row?.activity_account?.city),
    //     helper.wrapInQuotes(row?.activity_log),
    //     helper.wrapInQuotes(row?.is_complete),
    //     helper.wrapInQuotes(row?.location),
    //     helper.wrapInQuotes(row?.notes),
    //     helper.wrapInQuotes(row?.number_of_cases || 0),
    //   ].join(",");
    // });
    // const csvContent = csvHeader.concat(csvRows).join("\n");

    // // Upload the CSV file to Supabase storage
    // const { error: uploadError } = await supabase.storage
    //   .from("mas-walker-file")
    //   .upload(uniqueFileName, csvContent, {
    //     contentType: "text/csv",
    //   });

    // if (uploadError) {
    //   console.error("Supabase upload error:", uploadError);
    //   throw new Error("Failed to upload file to Supabase");
    // }

    // // Return success response with the public URL
    // const { data: publicUrlData } = supabase.storage
    //   .from("mas-walker-file")
    //   .getPublicUrl(uniqueFileName);

    // return successResponse(
    //   {
    //     filePath: publicUrlData.publicUrl,
    //     data,
    //   },
    //   "CSV file has been created and uploaded"
    // );
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error && error.message) {
      console.log(error.message);
      return errorResponse(error.message, 500);
    } else {
      return errorResponse("Failed to process request", 500);
    }
  }
}
