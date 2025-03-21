import Users from "@/db/models/user"; // Ensure the path to the user model is correct
import Role from "@/db/models/role";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { Op } from "sequelize";
import { NextRequest } from "next/server";
import sequelize from "@/db/config/config";
import TeamMembers from "@/db/models/team-members";
import Team from "@/db/models/teams";
import TeamManagers from "@/db/models/team-managers";
import GroupMembers from "@/db/models/group-members";
import Group from "@/db/models/group";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle GET requests for fetching paginated users
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  try {
    // Pagination parameters
    const page = Number(searchParams.get("page")) || 1;
    const recordsPerPage = Number(searchParams.get("recordsPerPage")) || 10;
    const offset = (page - 1) * recordsPerPage;

    // Sorting parameters
    const sortColumn = searchParams.get("sortColumn");
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Search query
    const searchQuery = searchParams.get("searchQuery");

    // Query conditions
    const whereConditions: any = {};

    if (searchQuery) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${searchQuery}%` } },
        { email: { [Op.iLike]: `%${searchQuery}%` } },
      ];
    }

    // Fetch users with pagination
    const data = await Users.findAndCountAll({
      limit: recordsPerPage,
      offset,
      where: whereConditions,
      order: sortColumn
        ? sequelize.literal(`${addDoubleQuotes(sortColumn)} ${sortOrder}`)
        : [["created_at", "desc"]],
      attributes: { exclude: ["password", "deleted_at", "deleted_by"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"], // Include only necessary fields
        },
        {
          model: TeamMembers,
          as: "users_teams",
          attributes: ["team_id"],
          separate: true,
          include: [
            {
              model: Team,
              as: "team_memebrs_with_team",
              attributes: ["name"],
            },
          ],
        },
        {
          model: TeamManagers,
          as: "users_team_manager",
          attributes: ["team_id"],
          separate: true,
          include: [
            {
              model: Team,
              as: "team_manager_with_team",
              attributes: ["name"],
            },
          ],
        },
        {
          model: GroupMembers,
          as: "users_groups",
          attributes: ["group_id"],
          separate: true,
          include: [
            {
              model: Group,
              as: "group_memebrs_with_group",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    return successResponse(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}
function addDoubleQuotes(input: string) {
  return input
    .split(".")
    ?.map((value) => `"${value}"`)
    .join(".");
}
