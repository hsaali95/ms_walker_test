import TeamManagers from "@/db/models/team-managers";
import TeamMembers from "@/db/models/team-members";
import Team from "@/db/models/teams";
import Users from "@/db/models/user";
import { ROLE } from "@/utils/enums";
import { errorResponse, successResponse } from "@/utils/response.decorator";
import { Op } from "sequelize";
export const dynamic = "force-dynamic"; // ✅ Forces API to fetch fresh data on every request

interface ITeamsWithMember extends Team {
  team_members: TeamMembers[];
  team_managers: TeamManagers[];
}
// Handle POST requests for creating a team record
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      manager_id,
      is_active,
      users_list,
    }: {
      id: number;
      name: string;
      manager_id: number;
      is_active: boolean;
      users_list: number[];
    } = body;

    if (!manager_id || typeof manager_id !== "number") {
      return errorResponse(
        "Missing or invalid required field: manager_id",
        400
      );
    }

    if (typeof is_active !== "boolean") {
      return errorResponse("Missing or invalid required field: is_active", 400);
    }

    // Basic validation
    if (!name || typeof name !== "string") {
      return errorResponse("Missing or invalid required field: name", 400);
    }

    // Find the teams by IDs
    const [team, existingTeamWithName, manager] = await Promise.all([
      Team.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: TeamMembers,
            as: "team_members",
            attributes: ["id", "user_id"],
          },
          {
            model: TeamManagers,
            as: "team_managers",
            attributes: ["id", "user_id"],
          },
        ],
      }) as unknown as ITeamsWithMember,
      Team.findOne({
        where: {
          [Op.and]: {
            name,
          },
          [Op.not]: {
            id,
          },
        },
      }),

      Users.findOne({
        where: {
          id: manager_id,
          role_id: ROLE.MANAGER,
        },
      }),
    ]);

    // Check if the team name already exists
    if (existingTeamWithName) {
      return errorResponse("A team with this name already exists", 409);
    }

    if (!team) {
      return errorResponse(`No team found with the provided ID`, 404);
    }

    if (!manager) {
      return errorResponse("No manager found with the provided ID", 404);
    }

    const deletedMembers: number[] = [];

    team.team_members.map((member) => {
      const index = users_list.indexOf(member.user_id);
      if (index == -1) {
        //push the members which have been removed from the team
        deletedMembers.push(member.id);
      } else {
        //remove the member which already exists
        users_list.splice(index, 1);
      }
    });

    const promises = [];

    if (deletedMembers.length) {
      //deleting removed members
      promises.push(() =>
        TeamMembers.destroy({
          where: {
            id: {
              [Op.in]: deletedMembers,
            },
          },
        })
      );
    }

    if (users_list.length) {
      //adding new members
      promises.push(() =>
        TeamMembers.bulkCreate(
          users_list.map((userId) => ({
            team_id: id,
            user_id: userId,
          }))
        )
      );
    }

    if (manager_id != team.team_managers[0]?.user_id) {
      //adding new manager
      promises.push(() =>
        TeamManagers.create({
          user_id: manager_id,
          team_id: team.id,
        })
      );
      //removing previous manager
      promises.push(() =>
        TeamManagers.destroy({
          where: {
            id: team.team_managers[0]?.id,
          },
        })
      );
    }
    promises.push(() => team.update({ name, manager_id, is_active }));
    
    //resolving all the pushed promises
    await Promise.all(promises.map((promiseFn) => promiseFn()));

    return successResponse({}, "team updated successfully");
  } catch (error: any) {
    console.error("Error creating team:", error);
    return errorResponse("Failed to update team", 500);
  }
}
