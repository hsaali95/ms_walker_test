import TeamManagers from "@/db/models/team-managers";
import TeamMembers from "@/db/models/team-members";
import Team from "@/db/models/teams";
import { errorResponse, successResponse } from "@/utils/response.decorator";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

// Handle POST requests for creating a team record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, is_active, users_list, manager_id } = body;

    // Basic validation
    if (!name || typeof name !== "string") {
      return errorResponse("Missing or invalid required field: name", 400);
    }

    if (typeof is_active !== "boolean") {
      return errorResponse("Missing or invalid required field: is_active", 400);
    }

    // Check if the team name already exists
    const existingTeam = await Team.findOne({ where: { name } });
    if (existingTeam) {
      return errorResponse("A team with this name already exists", 409);
    }

    // Create a new team record
    const newTeam = await Team.create({
      name,
      is_active,
    });

    // Create manager against team ID
    if (newTeam) {
      await TeamManagers.create({
        team_id: newTeam?.id,
        user_id: manager_id,
      });
    }

    // Add team members against team ID
    if (newTeam) {
      for (let i = 0; i < users_list.length; i++) {
        const userIds = +users_list[i]?.id;
        await TeamMembers.create({
          team_id: +newTeam?.id,
          user_id: +userIds,
        });
      }
    }

    // Prepare response without sensitive or unnecessary fields
    const teamResponse = newTeam.get({ plain: true });

    return successResponse(
      {
        ...teamResponse,
      },
      "Team created successfully"
    );
  } catch (error: any) {
    console.error("Error creating team:", error);
    return errorResponse("Failed to create team", 500);
  }
}

