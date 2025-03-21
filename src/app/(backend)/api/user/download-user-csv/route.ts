import { errorResponse, successResponse } from "@/utils/response.decorator";
import { v4 as uuidv4 } from "uuid";
import Users from "@/db/models/user";
import Role from "@/db/models/role";
import { Op } from "sequelize";
import supabase from "@/utils/supabase-client";
import GroupMembers from "@/db/models/group-members";
import Group from "@/db/models/group";
import Team from "@/db/models/teams";
import TeamMembers from "@/db/models/team-members";
import TeamManagers from "@/db/models/team-managers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    const queryOptions = ids && ids.length > 0 ? { id: { [Op.in]: ids } } : {};

    const data = await Users.findAll({
      where: queryOptions,
      attributes: ["id", "name", "last_name", "email"],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["name"],
        },
        {
          model: GroupMembers,
          as: "users_groups",
          attributes: ["group_id"],
          include: [
            {
              model: Group,
              as: "group_memebrs_with_group",
              attributes: ["name"],
            },
          ],
        },
        {
          model: TeamMembers,
          as: "users_teams",
          attributes: ["team_id"],
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
          include: [
            {
              model: Team,
              as: "team_manager_with_team",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!data.length) {
      return errorResponse("Data not found", 404);
    }

    const uniqueFileName = `activity_${uuidv4()}.csv`;
    const csvHeader = "FirstName,LastName,Email,Group,Team,Role";
    const csvRows = data.map((row: any) => {
      const groupNames = row.users_groups
        .map((group: any) => group.group_memebrs_with_group?.name)
        .filter(Boolean) // Remove any null/undefined values
        .join("|"); // Separate multiple group names with '|'

      // Extract and merge team names from both memberships and manager roles
      const teamNames = [
        ...row.users_teams.map(
          (team: any) => team.team_memebrs_with_team?.name
        ),
        ...row.users_team_manager.map(
          (team: any) => team.team_manager_with_team?.name
        ),
      ]
        .filter(Boolean) // Remove null/undefined values
        .filter((value, index, self) => self.indexOf(value) === index) // Deduplicate
        .join("|");

      return `${row.name},${row.last_name},${row.email},${groupNames},${teamNames},${row.role?.name || ""}`;
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");

    const { error: uploadError } = await supabase.storage
      .from("mas-walker-file")
      .upload(uniqueFileName, csvContent, {
        contentType: "text/csv",
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return errorResponse("Failed to upload file to Supabase", 500);
    }

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
