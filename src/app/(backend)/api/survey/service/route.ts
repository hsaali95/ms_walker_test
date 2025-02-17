import { v4 as uuidv4 } from "uuid";
import { successResponse, errorResponse } from "@/utils/response.decorator";
import Account from "@/db/models/account";
import Display from "@/db/models/display";
import Item from "@/db/models/item";
import Supplier from "@/db/models/supplier";
import SurveyStatus from "@/db/models/survey-status";
import Survey from "@/db/models/survey";
import SurveyFile from "@/db/models/survey-file";
import File from "@/db/models/file";
import { SURVEY_IMAGE_BASE_URL } from "@/utils/constant";
import fs from "fs";
import path from "path";
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
            moment(startDate).startOf("day").toISOString(),
            moment(endDate).endOf("day").toISOString(),
          ],
        },
      });
    } else if (startDate) {
      queryOptions.push({
        created_at: {
          [Op.between]: [
            moment(startDate).startOf("day").toISOString(),
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
    const data = await Survey.findAll({
      where: queryOptions,
      attributes: {
        exclude: [
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
          attributes: { exclude: notRequiredOption },
          include: [
            {
              model: File,
              as: "file",
              attributes: { exclude: notRequiredOption },
            },
          ],
        },
      ],
    });

    // Generate a unique filename for the PDF
    const uniqueFileName = `surveys_${uuidv4()}.pdf`;
    const logoPath = path.resolve(
      process.cwd(),
      "public/assets/images/ms_walker_logo.png"
    );
    const MsWalkerLogoBase64 = fs.readFileSync(logoPath, "base64");

    // Upload the PDF to Supabase
    // Make a POST request to the external API after generating the HTML

    // const apiUrl = "http://localhost:3001/api/v1/survey/survey-pdf";
    const apiUrl =
      "https://mswalkerpdf-production.up.railway.app/api/v1/survey/survey-pdf";

    const payload = {
      startDate,
      endDate,
      uniqueFileName,
      SURVEY_IMAGE_BASE_URL,
      MsWalkerLogoBase64,
      data,
    };

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const apiResult = await apiResponse.json();

    if (!apiResponse.ok) {
      throw new Error(`API request failed: ${apiResult.message}`);
    }

    return successResponse(
      { filePath: apiResult?.publicUrlData?.publicUrl },
      "PDF file has been created and uploaded"
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return errorResponse("Failed to process request", 500);
  }
}
