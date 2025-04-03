import { errorResponse, successResponse } from "@/utils/response.decorator";
import { v4 as uuidv4 } from "uuid";
import Account from "@/db/models/account";
import Display from "@/db/models/display";
import Item from "@/db/models/item";
import Supplier from "@/db/models/supplier";
import SurveyStatus from "@/db/models/survey-status";
import Survey from "@/db/models/survey";
import supabase from "@/utils/supabase-client";
import { SURVEY_IMAGE_BASE_URL } from "@/utils/constant";
import SurveyFile from "@/db/models/survey-file";
import File from "@/db/models/file";
import { formatImageLinks, helper } from "@/utils/helper";
import { Op } from "sequelize";
import moment from "moment";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

export async function POST(request: Request) {
  try {
    const { ids, startDate, endDate, searchQuery } = await request.json();

    const notRequiredOption = [
      "created_at",
      "updated_at",
      "deleted_at",
      "deleted_by",
    ];

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
        created_at: {
          [Op.between]: [
            moment(startDate, "DD/MM/YYYY").startOf("day").toISOString(),
            moment(endDate, "DD/MM/YYYY").endOf("day").toISOString(),
          ],
        },
      });
    } else if (startDate) {
      queryOptions.push({
        created_at: {
          [Op.between]: [
            moment(startDate, "DD/MM/YYYY").startOf("day").toISOString(),
            moment().endOf("day").toISOString(),
          ],
        },
      });
    }
    if (searchQuery) {
      const numericSearch = parseInt(searchQuery, 10);

      queryOptions.push({
        [Op.or]: [
          {
            other_supplier: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            other_item: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            notes: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$survey_status.status$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$account.CUSTOMER NAME$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$account.CITY$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$display.display_type$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$item.ItemFullInfo$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$supplier.vendorFullInfo$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          ...(isNaN(numericSearch)
            ? []
            : [
                {
                  number_of_cases: {
                    [Op.eq]: numericSearch, // Exact match for integer values
                  },
                },
                {
                  display_coast: {
                    [Op.eq]: numericSearch,
                  },
                },
                {
                  "$account.CUST NO$": {
                    [Op.eq]: numericSearch,
                  },
                },
              ]),
        ],
      });
    }

    // Fetch survey data from your database, excluding unnecessary fields
    const data = await Survey.findAll({
      where: queryOptions,
      attributes: {
        exclude: [
          "created_at",
          "updated_at",
          "deleted_at",
          "deleted_by",
          "account_id",
          "display_id",
          "supplier_id",
          "item_id",
          "survey_status_id",
        ],
      },
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["fullCustomerInfo", "custNumber", "city"],
        },
        {
          model: Display,
          as: "display",
          attributes: { exclude: notRequiredOption },
        },
        {
          model: Item,
          as: "item",
          attributes: ["ItemFullInfo"],
        },
        {
          model: Supplier,
          as: "supplier",
          attributes: ["Vendor Name"],
        },
        {
          model: SurveyStatus,
          as: "survey_status",
          attributes: { exclude: notRequiredOption },
        },
        {
          model: SurveyFile,
          as: "survey_file",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
          },
          include: [
            {
              model: File,
              as: "file",
              attributes: {
                exclude: [
                  "created_at",
                  "updated_at",
                  "deleted_at",
                  "deleted_by",
                ],
              },
            },
          ],
        },
      ],
    });
    if (!data.length) {
      return errorResponse("Data not found", 500);
    }
    // Generate a unique filename
    const uniqueFileName = `surveys_${uuidv4()}.csv`;

    // Prepare the CSV data as a string
    const csvHeader = [
      "ID,Number of cases,Display Cost,Notes,Account Name,Account Number,City,Display Type,Item Name,Supplier Name,Status,Image",
    ];
    // const csvHeader = [
    //   "ID,Other Supplier,Other Item,Number of cases,Display Cost,Notes,Account Name,Account Number,City,Display Type,Item Name,Supplier Name,Status,Image",
    // ];
    const csvRows = data.map((row: any) => {
      return [
        helper.wrapInQuotes(row.id),
        // helper.wrapInQuotes(row.other_supplier),
        // helper.wrapInQuotes(row.other_item),
        helper.wrapInQuotes(row.number_of_cases),
        helper.wrapInQuotes(row.display_coast),
        helper.wrapInQuotes(row.notes),
        helper.wrapInQuotes(row?.account?.fullCustomerInfo),
        helper.wrapInQuotes(row?.account?.custNumber),
        helper.wrapInQuotes(row?.account?.city),
        helper.wrapInQuotes(row?.display?.display_type),
        helper.wrapInQuotes(row?.item?.ItemFullInfo),
        helper.wrapInQuotes(row?.supplier?.["Vendor Name"]),
        helper.wrapInQuotes(row?.survey_status?.status),
        formatImageLinks(row?.survey_file, SURVEY_IMAGE_BASE_URL),
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
      },
      "CSV file has been created and uploaded"
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return errorResponse("Failed to process request", 500);
  }
}
