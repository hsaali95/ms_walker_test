import { v4 as uuidv4 } from "uuid";
import { errorResponse } from "@/utils/response.decorator";
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
import axios from "axios";

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
    if (!data.length) {
      return errorResponse("Data not found", 500);
    }

    // Generate a unique filename for the PDF
    const uniqueFileName = `surveys_${uuidv4()}.pdf`;
    const logoPath = path.resolve(
      process.cwd(),
      "public/assets/images/ms_walker_logo.png"
    );
    const MsWalkerLogoBase64 = fs.readFileSync(logoPath, "base64");

    // Upload the PDF to Supabase
    // Make a POST request to the external API after generating the HTML

    const apiUrl =
      process.env.NODE_ENV === "production"
        ? "https://arabdrill.rigpro.app/pdf/api/v1/survey/survey-pdf"
        : "http://localhost:3001/api/v1/survey/survey-pdf";


    const payload = {
      startDate,
      endDate,
      uniqueFileName,
      SURVEY_IMAGE_BASE_URL,
      MsWalkerLogoBase64,
      data,
    };

    try {
      const data = await axios.post(apiUrl, payload, {
        timeout: 1500000000,
        responseType: "stream",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Convert Axios stream to a Web ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          data.data.on("data", (chunk: Buffer) => controller.enqueue(chunk));
          data.data.on("end", () => controller.close());
          data.data.on("error", (err: Error) => controller.error(err));
        },
      });
      // Set response headers for streaming the PDF
      return new Response(stream, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="streamed-document.pdf"',
        },
      });
    } catch (error) {
      console.log(error);
      return errorResponse("Something went wrong", 500);
    }


  } catch (error) {
    console.error("Error processing request:", error);
    return errorResponse("Failed to process request", 500);
  }
}
