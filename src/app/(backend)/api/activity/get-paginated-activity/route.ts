import Activity from "@/db/models/activity";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { Op } from "sequelize";
import { NextRequest } from "next/server";
import Account from "@/db/models/account";
import moment from "moment";
import sequelize from "@/db/config/config";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching paginated activities
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  try {
    // Pagination parameters
    const page = Number(searchParams.get("page")) || 1;
    const recordsPerPage = Number(searchParams.get("recordsPerPage")) || 10;
    const offset = (page - 1) * recordsPerPage;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    // Sorting parameters
    const sortColumn = searchParams.get("sortColumn") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Search query
    const searchQuery = searchParams.get("searchQuery");

    // Query conditions
    const queryOptions: any = [];
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

    // Fetch activities with pagination
    const data = await Activity.findAndCountAll({
      limit: recordsPerPage,
      offset,
      where: queryOptions,
      order: sortColumn
        ? sequelize.literal(`${addDoubleQuotes(sortColumn)} ${sortOrder}`)
        : [["created_at", "desc"]],
      attributes: { exclude: ["deleted_at", "deleted_by"] },
      include: [
        {
          model: Account,
          as: "activity_account",
        },
      ],
    });

    return successResponse(data);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return errorResponse("Failed to fetch activities", 500);
  }
}

function addDoubleQuotes(input: string) {
  return input
    .split(".")
    ?.map((value) => `"${value}"`)
    .join(".");
}
