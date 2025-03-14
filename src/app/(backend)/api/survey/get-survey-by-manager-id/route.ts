import TeamMembers from "@/db/models/team-members";
import Team from "@/db/models/teams";
import TeamManagers from "@/db/models/team-managers";
import Users from "@/db/models/user"; // Assuming this is the user model
import Survey from "@/db/models/survey"; // Assuming Survey is defined
import SurveyFile from "@/db/models/survey-file"; // Assuming SurveyFile is defined
import File from "@/db/models/file"; // Assuming File is defined
import Account from "@/db/models/account"; // Assuming Account is defined
import Display from "@/db/models/display"; // Assuming Display is defined
import Item from "@/db/models/item"; // Assuming Item is defined
import Supplier from "@/db/models/supplier"; // Assuming Supplier is defined
import SurveyStatus from "@/db/models/survey-status"; // Assuming SurveyStatus is defined
import { NextRequest } from "next/server";
import JWTService from "@/services/jwt/jwt-services";
import moment from "moment";
import { Op, Sequelize } from "sequelize";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Establish associations if not already set
TeamMembers.belongsTo(Team, { foreignKey: "team_id" });
TeamManagers.belongsTo(Team, { foreignKey: "team_id" });
TeamManagers.belongsTo(Users, { foreignKey: "user_id", as: "users" });

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  const { searchParams } = new URL(request.url);

  try {
    // Retrieve cookies from the request headers
    let token: string | null = null;

    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split("; ")?.map((cookie) => {
          const [key, value] = cookie.split("=");
          return [key, value];
        })
      );
      token = cookies["session_accessToken"];
    }
    let teamData;
    let userIds;
    // Verify the access token
    const userData: any = await JWTService.verifyAccessToken(token || "");

    const managerId =
      userData?.id && userData?.role_id === 3 ? userData?.id : undefined;
    if (managerId) {
      // Fetch all teams and members assigned to the provided manager_id
      teamData = await Team.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: TeamManagers,
            as: "team_managers",
            attributes: ["user_id"],
            where: { user_id: managerId ? managerId : null },
            required: true
          },
          {
            model: TeamMembers,
            as: "team_members",
            required: true,
            attributes: ["user_id"],
          },
        ],
      });
      userIds = teamData?.flatMap((team: any) =>
        team.team_members?.map((member: any) => member.user_id)
      );
    }

    // Retrieve query parameters
    const page = Number(searchParams.get("page")) || 1;
    const recordsPerPage = Number(searchParams.get("recordsPerPage")) || 10;
    const searchQuery = searchParams.get("searchQuery");
    const sortColumn = searchParams.get("sortColumn");
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const offset = (page - 1) * recordsPerPage;

    const queryOptions: any = [];

    // Add created_by condition dynamically
    if ((Array.isArray(userIds) && userIds?.length) || managerId) {
      queryOptions.push({
        created_by: {
          [Op.in]: [...(userIds || []), ...(managerId ? [managerId] : [])],
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

    const data = await Survey.findAndCountAll({
      limit: recordsPerPage,
      offset,
      where: queryOptions,
      order: sortColumn
        ? Sequelize.literal(`${addDoubleQuotes(sortColumn)} ${sortOrder}`)
        : [["created_at", "desc"]],
      attributes: {
        exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
      },
      include: [
        {
          model: SurveyFile,
          as: "survey_file",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
          },
          separate: true,
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
        {
          model: Account,
          as: "account",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
          },
        },
        {
          model: Display,
          as: "display",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
          },
        },
        {
          model: Item,
          as: "item",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
          },
        },
        {
          model: Supplier,
          as: "supplier",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
          },
        },
        {
          model: SurveyStatus,
          as: "survey_status",
          attributes: {
            exclude: ["created_at", "updated_at", "deleted_at", "deleted_by"],
          },
        },
      ],
    });

    return successResponse(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    console.error("Error fetching surveys:", error);
    return errorResponse("Failed to fetch surveys", 500);
  }
}

function addDoubleQuotes(input: string) {
  return input
    .split(".")
    ?.map((value) => `"${value}"`)
    .join(".");
}
