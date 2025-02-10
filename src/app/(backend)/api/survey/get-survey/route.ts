import Account from "@/db/models/account";
import Display from "@/db/models/display";
import File from "@/db/models/file";
import Item from "@/db/models/item";
import Supplier from "@/db/models/supplier";
import Survey from "@/db/models/survey";
import SurveyFile from "@/db/models/survey-file";
import SurveyStatus from "@/db/models/survey-status";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import moment from "moment";
import { Op, Sequelize } from "sequelize";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching all supplier records
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const page = Number(searchParams.get("page"));
    const recordsPerPage = Number(searchParams.get("recordsPerPage"));
    const searchQuery = searchParams.get("searchQuery");
    const sortColumn = searchParams.get("sortColumn");
    const sortOrder = searchParams.get("sortOrder");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const offset = (page - 1) * recordsPerPage;
    const queryOptions: any = [];

    const addDoubleQuotes = (input: string) => {
      // Split the input by the dot (.) to get the table and column
      let doubleQuotedValue = "";
      const split = input.split(".");
      split?.map(
        (value, index) =>
          (doubleQuotedValue =
            doubleQuotedValue +
            `"${value}"${index + 1 !== split.length ? "." : ""}`)
      );
      return doubleQuotedValue;
      // Return the formatted string with double quotes
    };
    const notRequiredOption = [
      "created_at",
      "updated_at",
      "deleted_at",
      "deleted_by",
    ];

    // ***********************Select options*********************************
    if (startDate && endDate) {
      queryOptions.push({
        created_at: {
          [Op.between]: [
            moment(startDate).startOf("day").toISOString(),
            moment(endDate).endOf("day").toISOString(),
          ],
        },
      });
    }
    if (startDate) {
      queryOptions.push({
        created_at: {
          [Op.between]: [
            moment(startDate).startOf("day").toISOString(),
            moment().endOf("day").toISOString(),
          ],
        },
      });
    }
    // ***********************Search options*********************************
    if (searchQuery) {
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
            number_of_cases: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            display_coast: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            notes: {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$SurveyStatus.status$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$Account.account_name$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$Account.account_number$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$display.display_type$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$Item.item_name$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
          {
            "$Supplier.supplier_name$": {
              [Op.iLike]: `%${searchQuery}%`,
            },
          },
        ],
      });
    }

    const data = await Survey.findAndCountAll({
      limit: recordsPerPage,
      offset: offset,
      where: queryOptions,
      order: sortColumn
        ? Sequelize.literal(`${addDoubleQuotes(sortColumn || "")} ${sortOrder}`)
        : [["created_at", "desc"]],
      attributes: {
        exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
      },
      include: [
        {
          model: SurveyFile,
          attributes: { exclude: notRequiredOption },
          separate: true, //special case for has many relation ship
          include: [
            {
              model: File,
              attributes: { exclude: notRequiredOption },
            },
          ],
        },
        {
          model: Account,
          attributes: { exclude: notRequiredOption },
        },
        {
          model: Display,
          as: "display",
          attributes: { exclude: notRequiredOption },
        },
        { model: Item, attributes: { exclude: notRequiredOption } },
        { model: Supplier, attributes: { exclude: notRequiredOption } },
        { model: SurveyStatus, attributes: { exclude: notRequiredOption } },
      ],
    });
    return successResponse(data);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return errorResponse("Failed to fetch surveys", 500);
  }
}
